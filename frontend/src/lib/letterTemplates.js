import { getCase, CASE_STEPS, RECIPIENT_STEP, ATTACHMENTS_STEP, USER_STEP } from "./letterCases";

const formatDate = (value) => {
  if (!value) return "";

  try {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

const today = () =>
  new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const clean = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const lowerFirst = (value) => {
  const text = clean(value);
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
};

const euro = (value) => {
  const text = clean(value);
  if (!text) return "";
  return `${text} €`;
};

const compact = (text) =>
  text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const senderAddress = (d) =>
  [d.userFullName, d.userAddress, d.userPostalCity]
    .map(clean)
    .filter(Boolean)
    .join("\n");

const senderContact = (d) =>
  [d.userEmail, d.userPhone].map(clean).filter(Boolean).join(" — ");

const recipientAddress = (d) => {
  const street = d.recipientStreet || d.recipientAddress;
  const postalCity = d.recipientPostalCity || "";
  
  const addressLines = [d.recipientName, street, postalCity]
    .map(clean)
    .filter(Boolean);
    
  return addressLines.join("\n");
};

const attachmentsLine = (d) => {
  const attachmentsList = d.attachmentsList || [];
  const otherText = d.attachmentsOther ? clean(d.attachmentsOther) : "";
  const uploadedAttachmentNames = (d.uploadedAttachments || []).map(a => a.file_name);
  
  const documentLabels = {
    facture: "Facture",
    confirmation: "Confirmation de commande", 
    capture: "Capture d'écran",
    email: "Email de confirmation",
    photo: "Photo",
    contrat: "Contrat",
    paiement: "Justificatif de paiement",
    autre: "Autre document"
  };
  
  const selectedDocs = attachmentsList
    .map(value => documentLabels[value] || value)
    .filter(Boolean);
    
  const legacyNames = d.uploadedAttachmentNames || [];
  const allDocs = [...selectedDocs, otherText, ...uploadedAttachmentNames, ...legacyNames].filter(Boolean);
  
  if (allDocs.length === 0) return "";
  
  return compact(`Pièces jointes :
${allDocs.join("\n- ")}`);
};

const signatureBlock = (d) => {
  const parts = [
    `Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.`,
    clean(d.userFullName),
    (() => {
      const contact = senderContact(d);
      return contact ? `Contact : ${contact}` : null;
    })(),
    (() => {
      const attachments = attachmentsLine(d);
      return attachments || null;
    })(),
  ].filter(Boolean);

  return parts.join("\n\n");
};

const fallbackName = (...values) => {
  const found = values.map(clean).find(Boolean);
  return found || "";
};

const bodies = {
  remboursement: (d) => {
    const merchant = fallbackName(d.merchantName, d.recipientName, "votre établissement");
    const amount = euro(d.amount) || "la somme concernée";
    const purchaseDate = formatDate(d.purchaseDate) || "la date indiquée";
    const orderRef = clean(d.orderRef);
    const reason = clean(d.reason);
    const details = clean(d.details);

    return compact(`Madame, Monsieur,

Je vous adresse la présente au sujet de l'achat effectué le ${purchaseDate} auprès de ${merchant}${orderRef ? `, sous la référence ${orderRef}` : ""}, pour un montant de ${amount}.

${reason ? `Cette demande est liée au motif suivant : ${lowerFirst(reason)}.` : "Malgré mes démarches, la situation n'a pas été régularisée à ce jour."}
${details ? `\n${details}` : ""}

En conséquence, je vous demande de bien vouloir procéder au remboursement de ${amount}, ou de me transmettre une réponse écrite et motivée, dans un délai de quatorze (14) jours à compter de la réception du présent courrier.

À défaut de réponse satisfaisante dans ce délai, je me réserve la possibilité d'engager les démarches utiles auprès des services compétents ou de toute instance appropriée.`);
  },

  logement: (d) => {
    const landlord = fallbackName(d.landlordName, d.recipientName, "votre propriétaire");
    const address = clean(d.propertyAddress) || "l'adresse du logement concerné";
    const issueType = clean(d.issueType);
    const details = clean(d.details);
    const amount = euro(d.amount);
    const leaseStart = formatDate(d.leaseStart);

    return compact(`Madame, Monsieur,

Locataire du logement situé ${address}${leaseStart ? ` depuis le ${leaseStart}` : ""}, je vous adresse la présente concernant ${landlord} concernant ${issueType ? lowerFirst(issueType) : "un litige relatif au logement"}.

${details || "La situation signalée nécessite une régularisation ou une intervention de votre part."}
${amount ? `\nLe montant concerné par ce litige est de ${amount}.` : ""}

Je vous demande de bien vouloir prendre les mesures nécessaires afin de régulariser cette situation dans un délai de quinze (15) jours à compter de la réception du présent courrier.

À défaut de réponse ou de solution satisfaisante, je me réserve la possibilité de saisir les organismes compétents, notamment la commission départementale de conciliation ou la juridiction compétente.`);
  },

  "non-livre": (d) => {
    const merchant = fallbackName(d.merchantName, d.recipientName, "votre service");
    const orderRef = clean(d.orderRef);
    const amount = euro(d.amount) || "la somme versée";
    const purchaseDate = formatDate(d.purchaseDate) || "la date indiquée";
    const expectedDate = formatDate(d.expectedDate);
    const issueType = clean(d.issueType);
    const details = clean(d.details);

    return compact(`Madame, Monsieur,

Le ${purchaseDate}, j'ai passé commande auprès de ${merchant}${orderRef ? ` sous le numéro ${orderRef}` : ""}, pour un montant de ${amount}.

${expectedDate ? `La livraison était prévue le ${expectedDate}.` : "À ce jour, la commande ne m'a pas été livrée dans des conditions satisfaisantes."}
${issueType ? `La situation constatée est la suivante : ${lowerFirst(issueType)}.` : ""}
${details ? `\n${details}` : ""}

Conformément aux règles du Code de la consommation relatives à la livraison des biens et services, notamment les articles L.216-1 et suivants, je vous demande de procéder à la livraison de ma commande dans les meilleurs délais ou, à défaut, de me rembourser l'intégralité des sommes versées.

Sans réponse ou solution satisfaisante dans un délai de sept (7) jours à compter de la réception du présent courrier, je me réserve la possibilité de résoudre la commande et d'engager les démarches nécessaires afin d'obtenir le remboursement des sommes dues.`);
  },

  "mise-en-demeure": (d) => {
    const recipientType = clean(d.recipientType);
    const obligation = clean(d.obligation) || "l'obligation concernée";
    const previousContact = formatDate(d.previousContact);
    const deadlineDays = clean(d.deadlineDays) || "15";
    const details = clean(d.details);

    return compact(`Madame, Monsieur,

${previousContact ? `Faisant suite à mon précédent rappel du ${previousContact},` : "Malgré mes précédentes démarches,"} je constate que la situation suivante n'a toujours pas été régularisée${recipientType ? ` par le destinataire concerné (${lowerFirst(recipientType)})` : ""} :

${obligation}.

${details ? `${details}\n` : ""}Par la présente, je vous demande formellement d'exécuter cette obligation dans un délai de ${deadlineDays} jours à compter de la réception du présent courrier.

À défaut de régularisation dans ce délai, je me réserve la possibilité d'engager toute démarche amiable, administrative ou judiciaire utile à la défense de mes intérêts.`);
  },

  employeur: (d) => {
    const employer = fallbackName(d.employerName, d.recipientName, "votre entreprise");
    const jobTitle = clean(d.jobTitle);
    const contractStart = formatDate(d.contractStart);
    const issueType = clean(d.issueType);
    const details = clean(d.details);
    const amount = euro(d.amount);

    return compact(`Madame, Monsieur,

Dans le cadre de mon contrat de travail avec ${employer}${jobTitle ? `, pour le poste de ${jobTitle}` : ""}${contractStart ? `, débuté le ${contractStart}` : ""}, je vous adresse la présente concernant ${issueType ? lowerFirst(issueType) : "un litige relatif à ma situation professionnelle"}.

${details || "Je souhaite attirer votre attention sur cette situation afin qu'une solution puisse être trouvée dans les meilleurs délais."}
${amount ? `\nLe montant concerné par ma demande est de ${amount}.` : ""}

Je vous demande de bien vouloir examiner ma demande et de m'apporter une réponse écrite dans un délai de quinze (15) jours à compter de la réception de ce courrier.

À défaut de réponse ou de solution satisfaisante, je me réserve la possibilité de solliciter les services compétents, notamment l'inspection du travail, ou de saisir la juridiction prud'homale compétente.`);
  },

  rgpd: (d) => {
    const org = fallbackName(d.orgName, d.recipientName, "votre organisme");
    const requestType = clean(d.requestType) || "ma demande relative à mes données personnelles";
    const accountInfo = clean(d.accountInfo);
    const details = clean(d.details);

    return compact(`Madame, Monsieur,

Je vous adresse la présente afin d'exercer auprès de ${org} mon droit relatif à mes données personnelles, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.

Ma demande porte sur : ${requestType}.

${accountInfo ? `L'identifiant ou le compte concerné est le suivant : ${accountInfo}.` : ""}
${details ? `\n${details}` : ""}

Je vous remercie de bien vouloir traiter ma demande dans le délai d'un (1) mois prévu par l'article 12 du RGPD, ou de m'informer dans ce délai si des éléments complémentaires sont nécessaires.

À défaut de réponse dans les délais applicables, je me réserve la possibilité de saisir la Commission Nationale de l'Informatique et des Libertés (CNIL).`);
  },

  consommation: (d) => {
    const merchant = fallbackName(d.merchantName, d.recipientName, "votre établissement");
    const product = clean(d.productName) || "le produit ou service concerné";
    const purchaseDate = formatDate(d.purchaseDate) || "la date indiquée";
    const amount = euro(d.amount);
    const issueType = clean(d.issueType);
    const details = clean(d.details);
    const expectation = clean(d.expectation);

    return compact(`Madame, Monsieur,

Le ${purchaseDate}, j'ai acquis auprès de ${merchant} le produit ou service suivant : ${product}${amount ? `, pour un montant de ${amount}` : ""}.

${issueType ? `Le problème rencontré est le suivant : ${lowerFirst(issueType)}.` : "Ce produit ou service ne donne pas satisfaction au regard des conditions prévues lors de l'achat."}
${details ? `\n${details}` : ""}

En conséquence, je vous demande de bien vouloir ${expectation ? lowerFirst(expectation) : "me proposer une solution adaptée"} dans un délai de quinze (15) jours à compter de la réception du présent courrier.

Lorsque le litige concerne la conformité d'un bien, cette demande s'inscrit notamment dans le cadre de la garantie légale de conformité prévue par le Code de la consommation. Lorsque le litige concerne une prestation de service, je vous demande de procéder à la régularisation de la prestation ou de me proposer une solution équivalente.

À défaut de réponse satisfaisante, je me réserve la possibilité de saisir le médiateur de la consommation compétent ou toute autorité appropriée.`);
  },

  voisinage: (d) => {
    const neighborName = clean(d.neighborName);
    const neighborAddress = clean(d.neighborAddress);
    const issueType = clean(d.issueType);
    const frequency = clean(d.frequency);
    const firstIncident = formatDate(d.firstIncident);
    const details = clean(d.details);

    const isNoise =
      issueType.toLowerCase().includes("bruit") ||
      issueType.toLowerCase().includes("tapage");

    return compact(`Madame, Monsieur,

Je vous adresse la présente concernant les troubles de voisinage que je subis${neighborName ? ` de la part de ${neighborName}` : ""}${neighborAddress ? `, en provenance du logement situé ${neighborAddress}` : ""}.

${issueType ? `Nature du trouble : ${lowerFirst(issueType)}.` : ""}
${frequency ? `Fréquence ou horaires constatés : ${frequency}.` : ""}
${firstIncident ? `Premier incident relevé le ${firstIncident}.` : ""}
${details ? `\n${details}` : "Ces nuisances perturbent l'usage normal et paisible de mon logement."}

${isNoise ? "Ces faits sont susceptibles de relever des règles applicables aux nuisances sonores, notamment lorsque leur durée, leur répétition ou leur intensité portent atteinte à la tranquillité du voisinage." : "Ces faits sont susceptibles de constituer un trouble anormal de voisinage lorsqu'ils excèdent les inconvénients normaux liés à la vie en collectivité."}

Je vous demande de bien vouloir prendre les mesures nécessaires afin de faire cesser ces nuisances dans un délai de huit (8) jours à compter de la réception du présent courrier.

À défaut d'amélioration, je me réserve la possibilité de faire constater la situation par les services compétents et d'engager les démarches nécessaires afin de préserver mes droits.`);
  },

  banque: (d) => {
    const bank = fallbackName(d.bankName, d.recipientName, "votre établissement");
    const accountRef = clean(d.accountRef);
    const issueType = clean(d.issueType);
    const operationDate = formatDate(d.operationDate);
    const amount = euro(d.amount);
    const details = clean(d.details);

    return compact(`Madame, Monsieur,

Je suis titulaire d'un compte auprès de ${bank}${accountRef ? `, sous la référence ${accountRef}` : ""}, et je vous adresse la présente afin de contester ${issueType ? lowerFirst(issueType) : "une opération ou une situation relative à mon compte"}.

${operationDate ? `Date de l'opération ou de l'événement concerné : ${operationDate}.` : ""}
${amount ? `Montant concerné : ${amount}.` : ""}
${details ? `\n${details}` : ""}

Je vous demande de bien vouloir procéder à l'examen de ma réclamation et de me transmettre une réponse écrite et motivée dans les meilleurs délais.

Si la situation concerne une opération non autorisée ou une erreur de traitement, je vous remercie de procéder à la régularisation nécessaire conformément aux règles applicables aux services de paiement et à la relation bancaire.

À défaut de réponse satisfaisante, je me réserve la possibilité de saisir le service réclamations de votre établissement, le médiateur bancaire compétent ou toute autorité appropriée.`);
  },
};

const requiredFieldsForCase = (caseId) => {
  const caseSteps = CASE_STEPS[caseId] || [];
  const allSteps = [...caseSteps, RECIPIENT_STEP, ATTACHMENTS_STEP, USER_STEP];

  return allSteps.flatMap((step) =>
    (step.fields || [])
      .filter((field) => field.required)
      .map((field) => field.name),
  );
};

export function validateLetterData(caseId, data = {}) {
  const selectedCase = getCase(caseId);

  if (!selectedCase) {
    return [`unknown-case:${caseId}`];
  }

  const requiredFields = requiredFieldsForCase(caseId);

  return requiredFields.filter((fieldName) => !clean(data[fieldName]));
}

export function buildLetter(caseId, data = {}) {
  const selectedCase = getCase(caseId);

  if (!selectedCase) {
    throw new Error(`Unknown case: ${caseId}`);
  }

  const bodyBuilder = bodies[caseId];

  if (!bodyBuilder) {
    throw new Error(`No template available for case: ${caseId}`);
  }

  // Work on a copy, never mutate the input
  const safeData = { ...data };

  const missingFields = validateLetterData(caseId, safeData);

  // Fill missing fields with visible placeholders instead of throwing
  if (missingFields.length > 0) {
    console.warn(`Missing fields: ${missingFields.join(", ")}`);
    missingFields.forEach(fieldName => {
      if (!clean(safeData[fieldName])) {
        safeData[fieldName] = `[${fieldName}]`;
      }
    });
  }

  const city = clean(safeData.city);
  const object = clean(selectedCase.objet) || "Demande";
  const orderRef = clean(safeData.orderRef);

  return compact(`${senderAddress(safeData)}

${recipientAddress(safeData)}

${city ? `${city}, le ${today()}` : `Le ${today()}`}

Objet : ${object}${orderRef ? `\nRéf. : ${orderRef}` : ""}

${bodyBuilder(safeData)}

${signatureBlock(safeData)}`);
}