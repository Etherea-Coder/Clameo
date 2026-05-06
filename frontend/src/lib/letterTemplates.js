import { getCase } from "./letterCases";

const formatDate = (d) => {
  if (!d) return "";
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d;
  }
};

const today = () => new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const sender = (d) =>
  [d.userFullName, d.userAddress, d.userPostalCity, d.userEmail, d.userPhone]
    .filter(Boolean)
    .join("\n");

const recipient = (d) => [d.recipientName, d.recipientAddress].filter(Boolean).join("\n");

const closing = (d) =>
  `Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n${d.userFullName || ""}`;

const bodies = {
  remboursement: (d) => `Madame, Monsieur,

Le ${formatDate(d.purchaseDate) || "[date d'achat]"}, j'ai effectué un achat auprès de votre établissement ${d.merchantName ? `« ${d.merchantName} »` : ""} ${d.orderRef ? `(référence : ${d.orderRef})` : ""} pour un montant de ${d.amount ? `${d.amount} €` : "[montant]"}.

${d.reason ? `Or, je suis contraint(e) de vous adresser la présente en raison du motif suivant : ${d.reason.toLowerCase()}.` : ""} ${d.details ? d.details : ""}

Conformément aux dispositions du Code de la consommation, je sollicite par la présente le remboursement intégral de la somme de ${d.amount ? `${d.amount} €` : "[montant]"} dans un délai de quatorze (14) jours à compter de la réception de ce courrier.

À défaut, je me réserve le droit de saisir les autorités compétentes ainsi que les juridictions adéquates afin de faire valoir mes droits.`,

  logement: (d) => `Madame, Monsieur,

Locataire du logement situé ${d.propertyAddress ? `au ${d.propertyAddress}` : "[adresse du logement]"} ${d.leaseStart ? `depuis le ${formatDate(d.leaseStart)}` : ""}, je vous adresse la présente concernant ${d.issueType ? `le motif suivant : ${d.issueType.toLowerCase()}` : "un litige relatif à mon logement"}.

${d.details || ""}

${d.amount ? `Le montant concerné par ce litige s'élève à ${d.amount} €.` : ""}

Je vous demande de bien vouloir régulariser cette situation dans un délai de quinze (15) jours à compter de la réception de ce courrier. À défaut de réponse satisfaisante, je me verrai dans l'obligation de saisir la commission départementale de conciliation, voire le tribunal compétent.`,

  "non-livre": (d) => `Madame, Monsieur,

Le ${formatDate(d.purchaseDate) || "[date]"}, j'ai passé commande auprès de ${d.merchantName ? `« ${d.merchantName} »` : "votre service"} ${d.orderRef ? `(commande n° ${d.orderRef})` : ""} pour un montant de ${d.amount ? `${d.amount} €` : "[montant]"}.

${d.expectedDate ? `La livraison était prévue pour le ${formatDate(d.expectedDate)}.` : ""} ${d.issueType ? `À ce jour, je constate : ${d.issueType.toLowerCase()}.` : ""} ${d.details || ""}

En application de l'article L216-2 du Code de la consommation, je vous mets en demeure de procéder à la livraison ou, à défaut, au remboursement intégral de la somme versée, dans un délai de sept (7) jours à compter de la réception du présent courrier.

Passé ce délai, je résilierai purement et simplement le contrat conformément aux dispositions légales en vigueur.`,

  "mise-en-demeure": (d) => `Madame, Monsieur,

Par la présente, et faisant suite ${d.previousContact ? `à mon précédent rappel du ${formatDate(d.previousContact)}` : "à nos précédents échanges"}, je vous mets en demeure d'exécuter l'obligation suivante :

${d.obligation || "[obligation à exécuter]"}.

${d.details || ""}

Vous disposez d'un délai de ${d.deadlineDays || "[X]"} jours à compter de la réception de la présente pour y donner suite.

À défaut, je me réserve la faculté d'engager toute action judiciaire utile à la défense de mes intérêts, et ce, à vos frais exclusifs.`,

  employeur: (d) => `Madame, Monsieur,

Salarié(e) de l'entreprise ${d.employerName ? `« ${d.employerName} »` : ""} ${d.jobTitle ? `en qualité de ${d.jobTitle}` : ""} ${d.contractStart ? `depuis le ${formatDate(d.contractStart)}` : ""}, je me permets de vous adresser la présente concernant ${d.issueType ? `le motif suivant : ${d.issueType.toLowerCase()}` : "un litige professionnel"}.

${d.details || ""}

${d.amount ? `Le montant en jeu s'élève à ${d.amount} €.` : ""}

Je vous prie de bien vouloir prendre en compte ma demande et d'y apporter une réponse dans un délai de quinze (15) jours. À défaut de solution amiable, je me réserve le droit de saisir l'inspection du travail ou le Conseil de prud'hommes.`,

  rgpd: (d) => `Madame, Monsieur,

Conformément au Règlement Général sur la Protection des Données (Règlement UE 2016/679) et à la loi française « Informatique et Libertés » modifiée, je vous adresse la présente afin d'exercer mon droit suivant :

${d.requestType || "[type de demande]"}.

${d.accountInfo ? `Identifiant concerné : ${d.accountInfo}.` : ""} ${d.details || ""}

Je vous remercie de bien vouloir donner suite à cette demande dans le délai d'un (1) mois prévu à l'article 12 du RGPD. À défaut, je serai contraint(e) de saisir la Commission Nationale de l'Informatique et des Libertés (CNIL).`,

  consommation: (d) => `Madame, Monsieur,

Le ${formatDate(d.purchaseDate) || "[date]"}, j'ai acquis auprès de ${d.merchantName ? `« ${d.merchantName} »` : "votre établissement"} le produit/service suivant : ${d.productName || "[produit ou service]"}${d.amount ? ` pour un montant de ${d.amount} €` : ""}.

${d.issueType ? `Or, je suis confronté(e) au problème suivant : ${d.issueType.toLowerCase()}.` : ""} ${d.details || ""}

En application des articles L217-3 et suivants du Code de la consommation, je sollicite ${d.expectation ? d.expectation.toLowerCase() : "une solution conforme à mes droits"} dans un délai de quinze (15) jours à compter de la réception de la présente.

À défaut de réponse satisfaisante, je me réserve le droit de saisir le médiateur de la consommation compétent ainsi que toute juridiction utile à la défense de mes intérêts.`,

  voisinage: (d) => `Madame, Monsieur,

Je me permets de vous adresser la présente concernant des troubles anormaux de voisinage que je subis du fait de votre comportement${d.neighborAddress ? `, en provenance du logement situé ${d.neighborAddress}` : ""}.

${d.issueType ? `Nature du trouble : ${d.issueType.toLowerCase()}.` : ""} ${d.frequency ? `Fréquence constatée : ${d.frequency}.` : ""} ${d.firstIncident ? `Premier incident relevé le ${formatDate(d.firstIncident)}.` : ""}

${d.details || ""}

Conformément à la jurisprudence constante en matière de troubles anormaux de voisinage et aux dispositions de l'article R1336-5 du Code de la santé publique, je vous demande de cesser ces nuisances dans un délai de huit (8) jours.

À défaut, je me verrai contraint(e) de saisir les services de police ou de gendarmerie, voire le tribunal judiciaire compétent, afin d'obtenir réparation du préjudice subi.`,

  banque: (d) => `Madame, Monsieur,

Client(e) de votre établissement ${d.bankName ? `« ${d.bankName} »` : ""} ${d.accountRef ? `(référence : ${d.accountRef})` : ""}, je vous adresse la présente afin de contester ${d.issueType ? `: ${d.issueType.toLowerCase()}` : "un point de la gestion de mon compte"}.

${d.operationDate ? `Opération concernée : ${formatDate(d.operationDate)}.` : ""} ${d.amount ? `Montant en jeu : ${d.amount} €.` : ""} ${d.details || ""}

Conformément aux dispositions du Code monétaire et financier (notamment les articles L133-18 et suivants pour les opérations non autorisées) et aux engagements de votre convention de compte, je vous demande de procéder à la régularisation de cette situation dans un délai de quinze (15) jours.

À défaut de réponse satisfaisante, je saisirai le médiateur bancaire désigné par votre établissement, puis l'Autorité de Contrôle Prudentiel et de Résolution (ACPR) si nécessaire.`,
};

export function buildLetter(caseId, data) {
  const c = getCase(caseId);
  if (!c) return "";
  const body = bodies[caseId] ? bodies[caseId](data) : "";
  const objet = c.objet;
  const city = data.city || "";
  return `${sender(data)}

${recipient(data)}

${city ? `${city}, le ${today()}` : `Le ${today()}`}

Objet : ${objet}${data.orderRef ? `\nRéf. : ${data.orderRef}` : ""}

${body}

${closing(data)}`;
}
