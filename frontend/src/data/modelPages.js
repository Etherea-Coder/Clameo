export const MODEL_PAGES = {
    "lettre-demande-remboursement": {
        caseType: "remboursement",
        title: "Modèle de lettre de demande de remboursement",
        description:
            "Préparez une lettre claire pour demander le remboursement d’un achat, d’un service non rendu ou d’une commande problématique.",
        intro:
            "Vous avez payé un produit ou un service et souhaitez demander un remboursement ? Clameo vous aide à préparer une lettre structurée, accompagnée des documents utiles à joindre.",
        useCases: [
            "Produit défectueux ou non conforme",
            "Service payé mais non rendu",
            "Annulation dans le délai légal",
            "Remboursement promis mais non effectué",
            "Commande ou facture contestée",
        ],
        documents: [
            "Facture ou preuve d’achat",
            "Confirmation de commande",
            "Justificatif de paiement",
            "Échanges avec le vendeur",
            "Photos ou captures d’écran utiles",
        ],
        mistakes: [
            "Envoyer une demande trop vague",
            "Oublier la référence de commande ou de facture",
            "Ne pas joindre de justificatif",
            "Employer un ton trop agressif dès le premier courrier",
        ],
        officialHelp:
            "En cas d’absence de réponse, vous pouvez vous orienter vers les services publics compétents ou une association de consommateurs.",
        faq: [
            {
                question: "Cette lettre est-elle gratuite ?",
                answer:
                    "Oui. Vous pouvez générer votre lettre et préparer votre dossier gratuitement avec Clameo.",
            },
            {
                question: "Clameo envoie-t-il la lettre à ma place ?",
                answer:
                    "Non. Clameo prépare votre lettre et votre dossier. Vous restez responsable de l’envoi.",
            },
            {
                question: "Puis-je joindre des documents ?",
                answer:
                    "Oui. Vous pouvez ajouter des fichiers afin de créer un dossier complet à télécharger.",
            },
        ],
    },

    "lettre-produit-non-livre": {
        caseType: "non-livre",
        title: "Modèle de lettre pour produit non livré",
        description:
            "Préparez une lettre pour demander la livraison ou le remboursement d’une commande non reçue.",
        intro:
            "Votre commande n’a pas été livrée, ou la livraison est très en retard ? Clameo vous aide à préparer un courrier clair pour demander une solution.",
        useCases: [
            "Commande jamais reçue",
            "Retard de livraison injustifié",
            "Livraison partielle",
            "Vendeur qui ne répond plus",
            "Demande de remboursement après absence de livraison",
        ],
        documents: [
            "Confirmation de commande",
            "Facture",
            "Preuve de paiement",
            "Suivi de livraison",
            "Échanges avec le vendeur ou le transporteur",
        ],
        mistakes: [
            "Ne pas indiquer le numéro de commande",
            "Oublier la date de commande",
            "Ne pas préciser la solution attendue",
            "Ne pas conserver les preuves d’échange",
        ],
        officialHelp:
            "Pour un litige de consommation, vous pouvez aussi consulter les ressources publiques comme SignalConso ou les informations de la DGCCRF.",
        faq: [
            {
                question: "Puis-je demander un remboursement si le produit n’est pas livré ?",
                answer:
                    "Oui, selon la situation et les délais applicables, vous pouvez demander la livraison ou le remboursement.",
            },
            {
                question: "Dois-je envoyer la lettre en recommandé ?",
                answer:
                    "Ce n’est pas toujours obligatoire, mais l’envoi en LRAR peut être utile pour conserver une preuve.",
            },
            {
                question: "Clameo remplace-t-il un avocat ?",
                answer:
                    "Non. Clameo est un outil d’aide à la préparation de courrier, pas un cabinet d’avocat.",
            },
        ],
    },

    "lettre-litige-logement": {
        caseType: "logement",
        title: "Modèle de lettre pour litige avec un propriétaire",
        description:
            "Préparez une lettre pour un problème de dépôt de garantie, charges, réparations ou litige locatif.",
        intro:
            "Un litige avec un propriétaire ou une agence peut vite devenir stressant. Clameo vous aide à formaliser une demande claire et à réunir les pièces utiles.",
        useCases: [
            "Dépôt de garantie non restitué",
            "Charges contestées",
            "Réparations non effectuées",
            "Problème avec l’agence ou le propriétaire",
            "Demande écrite avant une démarche plus formelle",
        ],
        documents: [
            "Contrat de location",
            "État des lieux",
            "Quittances ou justificatifs",
            "Photos",
            "Échanges avec le propriétaire ou l’agence",
        ],
        mistakes: [
            "Ne pas décrire précisément le logement concerné",
            "Oublier les dates importantes",
            "Ne pas joindre les preuves disponibles",
            "Mélanger plusieurs demandes sans structure",
        ],
        officialHelp:
            "En cas de blocage, vous pouvez notamment vous renseigner auprès de l’ADIL ou de la commission départementale de conciliation.",
        faq: [
            {
                question: "Cette lettre peut-elle servir pour un dépôt de garantie ?",
                answer:
                    "Oui, elle peut être utilisée pour formaliser une demande liée au dépôt de garantie ou à d’autres litiges locatifs.",
            },
            {
                question: "Puis-je joindre l’état des lieux ?",
                answer:
                    "Oui, c’est souvent un document utile pour constituer votre dossier.",
            },
            {
                question: "Clameo donne-t-il un conseil juridique personnalisé ?",
                answer:
                    "Non. Clameo vous aide à préparer un courrier clair, mais ne remplace pas un professionnel du droit.",
            },
        ],
    },
};

export function getModelPage(slug) {
    return MODEL_PAGES[slug] || null;
}

export const MODEL_PAGE_SLUGS = Object.keys(MODEL_PAGES);