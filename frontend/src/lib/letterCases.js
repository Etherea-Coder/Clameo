// Letter cases with case-specific question schemas + templates
import {
  Banknote,
  Home,
  PackageX,
  AlertTriangle,
  Briefcase,
  ShieldCheck,
  ShoppingBag,
  Volume2,
  Landmark,
} from "lucide-react";

export const CASES = [
  {
    id: "remboursement",
    title: "Demande de remboursement",
    short: "Récupérez l'argent qui vous est dû.",
    category: "Argent",
    Icon: Banknote,
    objet: "Demande de remboursement",
  },
  {
    id: "logement",
    title: "Litige avec un propriétaire",
    short: "Charges, réparations, dépôt de garantie…",
    category: "Logement",
    Icon: Home,
    objet: "Litige locatif",
  },
  {
    id: "non-livre",
    title: "Produit non livré",
    short: "Commande absente, retard injustifié…",
    category: "Commande",
    Icon: PackageX,
    objet: "Produit non livré — Demande de remboursement",
  },
  {
    id: "mise-en-demeure",
    title: "Mise en demeure",
    short: "Obtenez une réponse ou une action.",
    category: "Formalisation",
    Icon: AlertTriangle,
    objet: "Mise en demeure",
  },
  {
    id: "employeur",
    title: "Litige employeur",
    short: "Salaire, contrat, heures supplémentaires…",
    category: "Travail",
    Icon: Briefcase,
    objet: "Réclamation auprès de l'employeur",
  },
  {
    id: "rgpd",
    title: "Demande RGPD",
    short: "Accès, rectification ou suppression de données.",
    category: "Données",
    Icon: ShieldCheck,
    objet: "Demande relative au RGPD",
  },
  {
    id: "consommation",
    title: "Litige consommation",
    short: "Garantie, vice caché, service défaillant…",
    category: "Commande",
    Icon: ShoppingBag,
    objet: "Litige de consommation",
  },
  {
    id: "voisinage",
    title: "Trouble de voisinage",
    short: "Bruit, nuisances, comportements anormaux…",
    category: "Logement",
    Icon: Volume2,
    objet: "Trouble anormal de voisinage",
  },
  {
    id: "banque",
    title: "Litige bancaire",
    short: "Frais abusifs, fraude, opérations contestées…",
    category: "Argent",
    Icon: Landmark,
    objet: "Réclamation bancaire",
  },
];

export const getCase = (id) => CASES.find((c) => c.id === id);

// Question schema per case. Each step is a group of fields.
export const CASE_STEPS = {
  remboursement: [
    {
      title: "Votre commande / achat",
      fields: [
        { name: "merchantName", label: "Nom du commerçant ou de l'entreprise", placeholder: "Ex : Société Exemple", required: true },
        { name: "orderRef", label: "Référence de commande / facture", placeholder: "Ex : CMD-123456" },
        { name: "purchaseDate", label: "Date d'achat", type: "date" },
        { name: "amount", label: "Montant à rembourser (€)", type: "number", placeholder: "Ex : 89.90", required: true },
      ],
    },
    {
      title: "Le motif",
      fields: [
        {
          name: "reason",
          label: "Raison de la demande",
          type: "select",
          options: [
            { value: "produit-defectueux", label: "Produit défectueux" },
            { value: "produit-non-conforme", label: "Produit non conforme" },
            { value: "service-non-rendu", label: "Service non rendu" },
            { value: "annulation-delai-legal", label: "Annulation dans le délai légal (14 jours)" },
            { value: "autre", label: "Autre" },
          ],
          required: true,
        },
        { name: "details", label: "Détails complémentaires", type: "textarea", placeholder: "Décrivez brièvement la situation…" },
      ],
    },
  ],
  logement: [
    {
      title: "Le logement",
      fields: [
        { name: "landlordName", label: "Nom du propriétaire ou de l'agence", required: true },
        { name: "propertyAddress", label: "Adresse du logement", required: true },
        { name: "leaseStart", label: "Date de début de bail", type: "date" },
      ],
    },
    {
      title: "Le litige",
      fields: [
        {
          name: "issueType",
          label: "Nature du litige",
          type: "select",
          options: [
            { value: "depot-garantie", label: "Restitution du dépôt de garantie" },
            { value: "charges-abusives", label: "Charges abusives" },
            { value: "travaux-non-effectues", label: "Travaux ou réparations non effectués" },
            { value: "augmentation-loyer", label: "Augmentation de loyer contestée" },
            { value: "autre", label: "Autre" },
          ],
          required: true,
        },
        { name: "amount", label: "Montant concerné, le cas échéant (€)", type: "number" },
        { name: "details", label: "Détails du problème", type: "textarea", placeholder: "Décrivez précisément les faits…", required: true },
      ],
    },
  ],
  "non-livre": [
    {
      title: "La commande",
      fields: [
        { name: "merchantName", label: "Vendeur ou plateforme", required: true },
        { name: "orderRef", label: "Numéro de commande", required: true },
        { name: "purchaseDate", label: "Date de commande", type: "date" },
        { name: "amount", label: "Montant payé (€)", type: "number", required: true },
      ],
    },
    {
      title: "La livraison",
      fields: [
        { name: "expectedDate", label: "Date de livraison prévue", type: "date" },
        {
          name: "issueType",
          label: "Situation",
          type: "select",
          options: [
            { value: "aucune-livraison", label: "Aucune livraison reçue" },
            { value: "livraison-partielle", label: "Livraison partielle" },
            { value: "retard-injustifie", label: "Retard injustifié" },
          ],
          required: true,
        },
        { name: "details", label: "Précisions", type: "textarea" },
      ],
    },
  ],
  "mise-en-demeure": [
    {
      title: "Le destinataire",
      fields: [
        { name: "recipientType", label: "Type de destinataire", type: "select", options: [
          { value: "entreprise", label: "Entreprise" },
          { value: "particulier", label: "Particulier" },
          { value: "administration", label: "Administration" },
        ], required: true },
        { name: "obligation", label: "Obligation à exécuter", type: "textarea", placeholder: "Ex : payer une facture impayée de 1 200 €", required: true },
      ],
    },
    {
      title: "Le délai",
      fields: [
        { name: "previousContact", label: "Date du dernier rappel ou échange", type: "date" },
        { name: "deadlineDays", label: "Délai accordé (en jours)", type: "number", placeholder: "Ex : 8", required: true },
        { name: "details", label: "Précisions complémentaires", type: "textarea" },
      ],
    },
  ],
  employeur: [
    {
      title: "Votre poste",
      fields: [
        { name: "employerName", label: "Nom de l'employeur", required: true },
        { name: "jobTitle", label: "Votre poste / fonction", required: true },
        { name: "contractStart", label: "Date d'embauche", type: "date" },
      ],
    },
    {
      title: "Le litige",
      fields: [
        {
          name: "issueType",
          label: "Nature du litige",
          type: "select",
          options: [
            { value: "salaire-impaye", label: "Salaire impayé" },
            { value: "heures-supp", label: "Heures supplémentaires non rémunérées" },
            { value: "modification-contrat", label: "Modification unilatérale du contrat" },
            { value: "conditions-travail", label: "Conditions de travail" },
            { value: "autre", label: "Autre" },
          ],
          required: true,
        },
        { name: "amount", label: "Montant concerné (€)", type: "number" },
        { name: "details", label: "Détails", type: "textarea", required: true },
      ],
    },
  ],
  rgpd: [
    {
      title: "L'organisme",
      fields: [
        { name: "orgName", label: "Nom de l'organisme / entreprise", required: true },
        { name: "accountInfo", label: "Identifiant client / email associé", placeholder: "Ex : monemail@exemple.fr" },
      ],
    },
    {
      title: "Votre demande",
      fields: [
        {
          name: "requestType",
          label: "Type de demande",
          type: "select",
          options: [
            { value: "rgpd-acces", label: "Accès à mes données (Article 15)" },
            { value: "rgpd-rectification", label: "Rectification (Article 16)" },
            { value: "rgpd-effacement", label: "Effacement / droit à l'oubli (Article 17)" },
            { value: "rgpd-limitation", label: "Limitation du traitement (Article 18)" },
            { value: "rgpd-portabilite", label: "Portabilité (Article 20)" },
            { value: "rgpd-opposition", label: "Opposition (Article 21)" },
          ],
          required: true,
        },
        { name: "details", label: "Précisions", type: "textarea", placeholder: "Détaillez votre demande…" },
      ],
    },
  ],
  consommation: [
    {
      title: "Le produit ou service",
      fields: [
        { name: "merchantName", label: "Nom du vendeur ou prestataire", required: true },
        { name: "productName", label: "Produit ou service concerné", placeholder: "Ex : Lave-linge Modèle X", required: true },
        { name: "purchaseDate", label: "Date d'achat", type: "date" },
        { name: "amount", label: "Montant payé (€)", type: "number" },
      ],
    },
    {
      title: "Le litige",
      fields: [
        {
          name: "issueType",
          label: "Nature du problème",
          type: "select",
          options: [
            { value: "garantie-legale", label: "Mise en jeu de la garantie légale de conformité" },
            { value: "vice-cache", label: "Vice caché" },
            { value: "service-defaillant", label: "Service défaillant ou incomplet" },
            { value: "publicite-trompeuse", label: "Publicité trompeuse" },
            { value: "autre", label: "Autre" },
          ],
          required: true,
        },
        { name: "details", label: "Description précise du problème", type: "textarea", required: true },
        {
          name: "expectation",
          label: "Solution attendue",
          type: "select",
          options: [
            { value: "reparation", label: "Réparation du produit" },
            { value: "remplacement", label: "Remplacement à l'identique" },
            { value: "remboursement", label: "Remboursement intégral" },
          ],
          required: true,
        },
      ],
    },
  ],
  voisinage: [
    {
      title: "Le voisin concerné",
      fields: [
        { name: "neighborName", label: "Nom du voisin (si connu)" },
        { name: "neighborAddress", label: "Adresse du voisin", required: true },
      ],
    },
    {
      title: "Le trouble",
      fields: [
        {
          name: "issueType",
          label: "Nature du trouble",
          type: "select",
          options: [
            { value: "bruit-jour", label: "Bruit en journée (musique, travaux…)" },
            { value: "tapage-nocturne", label: "Tapage nocturne" },
            { value: "odeurs", label: "Odeurs ou fumées" },
            { value: "animaux", label: "Animaux non maîtrisés" },
            { value: "comportement", label: "Comportement agressif ou intrusif" },
            { value: "autre", label: "Autre" },
          ],
          required: true,
        },
        { name: "frequency", label: "Fréquence et horaires (ex : tous les soirs après 22h)", placeholder: "Ex : tous les week-ends, à partir de 23h" },
        { name: "firstIncident", label: "Date du premier incident", type: "date" },
        { name: "details", label: "Description des faits", type: "textarea", required: true },
      ],
    },
  ],
  banque: [
    {
      title: "Votre banque",
      fields: [
        { name: "bankName", label: "Nom de votre banque", required: true },
        { name: "accountRef", label: "Numéro de compte ou référence client", placeholder: "Ex : FR76 …" },
      ],
    },
    {
      title: "L'opération contestée",
      fields: [
        {
          name: "issueType",
          label: "Nature du litige",
          type: "select",
          options: [
            { value: "frais-abusifs", label: "Frais bancaires abusifs" },
            { value: "operation-non-autorisee", label: "Opération non autorisée / fraude" },
            { value: "rejet-prelevement", label: "Rejet de prélèvement injustifié" },
            { value: "refus-credit", label: "Refus de crédit non motivé" },
            { value: "cloture-compte", label: "Clôture de compte abusive" },
            { value: "autre", label: "Autre" },
          ],
          required: true,
        },
        { name: "operationDate", label: "Date de l'opération concernée", type: "date" },
        { name: "amount", label: "Montant en jeu (€)", type: "number" },
        { name: "details", label: "Description détaillée", type: "textarea", required: true },
      ],
    },
  ],
};

// Attachments step is shared
export const ATTACHMENTS_STEP = {
  title: "Documents à joindre",
  fields: [
    {
      name: "attachmentsList",
      label: "Documents à joindre",
      type: "checkboxGroup",
      options: [
        { label: "Facture", value: "facture" },
        { label: "Confirmation de commande", value: "confirmation" },
        { label: "Capture d'écran", value: "capture" },
        { label: "Email ou échange écrit", value: "email" },
        { label: "Photo", value: "photo" },
        { label: "Contrat", value: "contrat" },
        { label: "Justificatif de paiement", value: "paiement" },
        { label: "Autre document", value: "autre" },
      ],
    },
    {
      name: "attachmentsOther",
      label: "Autre document (optionnel)",
      type: "textarea",
      placeholder: "Décrivez le document à joindre...",
    },
    {
      name: "uploadedAttachments",
      label: "Fichiers à joindre",
      type: "fileUpload",
      helper: "PDF, PNG, JPG, DOC ou DOCX — 10 Mo maximum par fichier.",
    },
  ],
};

// Final user info step is shared
export const USER_STEP = {
  title: "Vos informations",
  fields: [
    { name: "userFullName", label: "Nom et prénom", required: true },
    { name: "userAddress", label: "Adresse postale", required: true },
    { name: "userPostalCity", label: "Code postal et ville", placeholder: "Ex : 75011 Paris", required: true },
    { name: "userEmail", label: "Email facultatif", type: "email" },
    { name: "userPhone", label: "Téléphone facultatif", type: "tel" },
  ],
};

export const RECIPIENT_STEP = {
  title: "Coordonnées du destinataire",
  fields: [
    {
      name: "recipientName",
      label: "Nom du destinataire / société",
      placeholder: "Ex : Service client Exemple",
      required: true,
    },
    {
      name: "recipientStreet",
      label: "Adresse du destinataire",
      placeholder: "Ex : 12 rue de la Paix",
      required: true,
    },
    {
      name: "recipientPostalCity",
      label: "Code postal et ville du destinataire",
      placeholder: "Ex : 75008 Paris",
      required: true,
    },
    {
      name: "city",
      label: "Fait à",
      placeholder: "Ex : Paris",
      helper: "Cette ville apparaîtra avant la date dans votre lettre.",
      required: true,
    },
  ],
};
