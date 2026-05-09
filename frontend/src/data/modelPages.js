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

    "lettre-mise-en-demeure": {
        caseType: "mise-en-demeure",
        title: "Modèle de lettre de mise en demeure",
        description:
            "Préparez une mise en demeure claire pour demander l'exécution d'une obligation, le paiement d'une somme ou la régularisation d'une situation.",
        intro:
            "La mise en demeure permet de formaliser une demande avant d'envisager d'autres démarches. Clameo vous aide à préparer un courrier structuré, avec un ton ferme mais mesuré.",
        useCases: [
            "Demander le paiement d'une somme due",
            "Exiger l'exécution d'une obligation",
            "Formaliser un dernier rappel écrit",
            "Demander une régularisation dans un délai précis",
            "Conserver une trace claire de votre démarche",
        ],
        documents: [
            "Contrat ou devis",
            "Facture ou justificatif de paiement",
            "Échanges écrits précédents",
            "Relances déjà envoyées",
            "Tout document prouvant l'obligation concernée",
        ],
        mistakes: [
            "Employer un ton excessivement menaçant",
            "Ne pas préciser clairement l'obligation demandée",
            "Oublier le délai accordé au destinataire",
            "Ne pas garder de preuve d'envoi",
        ],
        officialHelp:
            "Selon la situation, vous pouvez vous renseigner auprès d'un professionnel du droit, d'une association compétente ou d'un service public adapté.",
        faq: [
            {
                question: "Une mise en demeure doit-elle être envoyée en recommandé ?",
                answer:
                    "Ce n'est pas toujours obligatoire, mais l'envoi en LRAR peut être utile pour conserver une preuve de dépôt et de réception.",
            },
            {
                question: "Clameo peut-il envoyer la mise en demeure à ma place ?",
                answer:
                    "Non. Clameo prépare votre courrier et votre dossier. Vous restez responsable de l'envoi.",
            },
            {
                question: "Est-ce un conseil juridique personnalisé ?",
                answer:
                    "Non. Clameo est un outil d'aide à la rédaction administrative et ne remplace pas un avocat.",
            },
        ],
    },

    "lettre-demande-rgpd": {
        caseType: "rgpd",
        title: "Modèle de lettre de demande RGPD",
        description:
            "Préparez une demande RGPD pour exercer vos droits d'accès, de rectification, d'effacement, de limitation, de portabilité ou d'opposition.",
        intro:
            "Vous souhaitez exercer vos droits sur vos données personnelles ? Clameo vous aide à préparer une demande RGPD claire à envoyer à une entreprise ou un organisme.",
        useCases: [
            "Demander l'accès à vos données personnelles",
            "Demander la suppression de données",
            "Corriger des informations inexactes",
            "Vous opposer à certains traitements",
            "Demander la portabilité de vos données",
        ],
        documents: [
            "Identifiant client ou email associé",
            "Capture d'écran du compte concerné",
            "Échanges précédents avec l'organisme",
            "Justificatif d'identité si demandé par l'organisme",
            "Toute précision permettant d'identifier les données concernées",
        ],
        mistakes: [
            "Ne pas identifier clairement le compte concerné",
            "Envoyer une demande trop générale",
            "Oublier de préciser le droit exercé",
            "Partager plus de données personnelles que nécessaire",
        ],
        officialHelp:
            "En cas d'absence de réponse ou de réponse insuffisante, vous pouvez consulter les ressources de la CNIL.",
        faq: [
            {
                question: "Quel est le délai de réponse à une demande RGPD ?",
                answer:
                    "En général, l'organisme doit répondre dans un délai d'un mois, avec certaines possibilités de prolongation selon la complexité.",
            },
            {
                question: "Clameo fait-il la démarche RGPD à ma place ?",
                answer:
                    "Non. Clameo prépare votre courrier. Vous gardez le contrôle et envoyez vous-même votre demande.",
            },
            {
                question: "Puis-je utiliser cette lettre pour supprimer mes données ?",
                answer:
                    "Oui, si vous choisissez une demande d'effacement ou de suppression lorsque cela correspond à votre situation.",
            },
        ],
    },

    "lettre-litige-employeur": {
        caseType: "employeur",
        title: "Modèle de lettre pour litige avec un employeur",
        description:
            "Préparez une lettre de réclamation à votre employeur concernant un salaire, un contrat, des heures supplémentaires ou une situation de travail.",
        intro:
            "Un désaccord avec un employeur doit souvent être formulé par écrit. Clameo vous aide à préparer une lettre claire, factuelle et exploitable.",
        useCases: [
            "Salaire ou prime non versé",
            "Heures supplémentaires non rémunérées",
            "Modification du contrat contestée",
            "Problème de conditions de travail",
            "Demande de régularisation écrite",
        ],
        documents: [
            "Contrat de travail",
            "Bulletins de salaire",
            "Planning ou relevé d'heures",
            "Échanges avec l'employeur",
            "Tout justificatif lié à la demande",
        ],
        mistakes: [
            "Rédiger un courrier trop émotionnel",
            "Ne pas dater précisément les faits",
            "Oublier les montants ou périodes concernées",
            "Ne pas conserver de copie du courrier envoyé",
        ],
        officialHelp:
            "En cas de blocage, vous pouvez vous renseigner auprès de l'inspection du travail, d'un syndicat, d'un défenseur syndical ou d'un professionnel compétent.",
        faq: [
            {
                question: "Cette lettre peut-elle servir pour un salaire impayé ?",
                answer:
                    "Oui. Elle peut aider à formaliser une demande de paiement ou de régularisation.",
            },
            {
                question: "Dois-je rester factuel dans la lettre ?",
                answer:
                    "Oui. Un courrier clair, daté et factuel est généralement plus efficace qu'un texte trop agressif.",
            },
            {
                question: "Clameo remplace-t-il un conseil en droit du travail ?",
                answer:
                    "Non. Clameo aide à préparer un courrier, mais ne fournit pas de conseil juridique personnalisé.",
            },
        ],
    },

    "lettre-reclamation-banque": {
        caseType: "banque",
        title: "Modèle de lettre de réclamation bancaire",
        description:
            "Préparez une lettre pour contester des frais bancaires, une opération non autorisée, une fraude ou une décision de votre banque.",
        intro:
            "Un litige bancaire doit être présenté clairement, avec les références utiles. Clameo vous aide à préparer une réclamation structurée à adresser à votre banque.",
        useCases: [
            "Frais bancaires contestés",
            "Opération non autorisée",
            "Fraude ou paiement suspect",
            "Rejet de prélèvement contesté",
            "Clôture de compte ou décision bancaire contestée",
        ],
        documents: [
            "Relevé bancaire",
            "Référence de compte ou client",
            "Capture de l'opération contestée",
            "Échanges avec la banque",
            "Plainte ou déclaration si applicable",
        ],
        mistakes: [
            "Ne pas identifier l'opération concernée",
            "Oublier le montant ou la date",
            "Envoyer une réclamation sans justificatif",
            "Ne pas demander une réponse écrite",
        ],
        officialHelp:
            "Si la réponse de la banque ne vous satisfait pas, vous pouvez vous orienter vers le service réclamations puis le médiateur bancaire compétent.",
        faq: [
            {
                question: "Puis-je contester une opération non autorisée ?",
                answer:
                    "Oui, selon la situation. La lettre permet de formaliser votre contestation auprès de la banque.",
            },
            {
                question: "Quels éléments indiquer dans la lettre ?",
                answer:
                    "Indiquez la date, le montant, la référence de compte et décrivez clairement l'opération ou la situation contestée.",
            },
            {
                question: "Clameo contacte-t-il la banque ?",
                answer:
                    "Non. Clameo prépare votre dossier. Vous envoyez ensuite la lettre vous-même.",
            },
        ],
    },

    "lettre-trouble-voisinage": {
        caseType: "voisinage",
        title: "Modèle de lettre pour trouble de voisinage",
        description:
            "Préparez une lettre pour signaler des nuisances sonores, odeurs, comportements gênants ou troubles anormaux de voisinage.",
        intro:
            "Avant d'engager une démarche plus formelle, il est souvent utile de signaler un trouble de voisinage par écrit. Clameo vous aide à préparer un courrier calme, précis et documenté.",
        useCases: [
            "Bruits répétés ou tapage nocturne",
            "Odeurs ou fumées gênantes",
            "Animaux non maîtrisés",
            "Comportements intrusifs ou agressifs",
            "Demande amiable avant escalade",
        ],
        documents: [
            "Photos ou vidéos si pertinentes",
            "Dates et horaires des nuisances",
            "Témoignages éventuels",
            "Échanges précédents",
            "Constat ou signalement si disponible",
        ],
        mistakes: [
            "Employer un ton insultant ou accusatoire",
            "Ne pas dater les faits",
            "Rester trop vague sur la nature du trouble",
            "Menacer sans proposer d'abord une régularisation",
        ],
        officialHelp:
            "En cas de persistance, vous pouvez vous renseigner auprès de votre mairie, de votre bailleur, d'un conciliateur de justice ou des services compétents.",
        faq: [
            {
                question: "Cette lettre est-elle adaptée au bruit ?",
                answer:
                    "Oui. Elle peut être utilisée pour des nuisances sonores répétées, en journée ou la nuit.",
            },
            {
                question: "Faut-il joindre des preuves ?",
                answer:
                    "C'est recommandé si vous en avez : dates, photos, témoignages ou échanges peuvent renforcer votre dossier.",
            },
            {
                question: "Clameo garantit-il l'arrêt des nuisances ?",
                answer:
                    "Non. Clameo vous aide à formaliser votre demande, mais ne garantit pas le résultat.",
            },
        ],
    },

    "lettre-litige-consommation": {
        caseType: "consommation",
        title: "Modèle de lettre pour litige de consommation",
        description:
            "Préparez une lettre pour un problème de garantie, vice caché, service défaillant, publicité trompeuse ou produit non conforme.",
        intro:
            "Un litige de consommation peut concerner un produit, un service ou une garantie. Clameo vous aide à préparer une lettre claire pour demander une réparation, un remplacement ou un remboursement.",
        useCases: [
            "Garantie légale de conformité",
            "Vice caché",
            "Service incomplet ou mal exécuté",
            "Publicité trompeuse",
            "Produit ou prestation non conforme",
        ],
        documents: [
            "Facture ou preuve d'achat",
            "Contrat ou conditions de vente",
            "Photos du produit",
            "Échanges avec le vendeur",
            "Rapport ou diagnostic si disponible",
        ],
        mistakes: [
            "Ne pas préciser la solution souhaitée",
            "Confondre garantie commerciale et garantie légale",
            "Oublier les dates importantes",
            "Envoyer une demande sans preuve d'achat",
        ],
        officialHelp:
            "En cas d'échec, vous pouvez consulter les ressources publiques comme SignalConso, la DGCCRF ou le médiateur de la consommation compétent.",
        faq: [
            {
                question: "Puis-je demander une réparation ou un remplacement ?",
                answer:
                    "Oui, selon la situation. Le générateur vous permet d'indiquer la solution attendue.",
            },
            {
                question: "Cette lettre fonctionne-t-elle pour un service défaillant ?",
                answer:
                    "Oui. Elle peut aussi être utilisée pour demander la régularisation d'une prestation de service.",
            },
            {
                question: "Clameo décide-t-il si mon dossier est juridiquement valable ?",
                answer:
                    "Non. Clameo vous aide à préparer une lettre claire, mais ne remplace pas une analyse juridique personnalisée.",
            },
        ],
    },
    "lettre-reclamation-caf": {
    caseType: "caf-reclamation",
    title: "Modèle de lettre de réclamation CAF",
    description:
      "Préparez une lettre de réclamation CAF pour un dossier bloqué, un paiement suspendu, une absence de réponse ou une demande d’explication.",
    intro:
      "Votre dossier CAF est bloqué, un paiement est suspendu ou vous souhaitez obtenir une explication ? Clameo vous aide à préparer une lettre claire, respectueuse et structurée, avec les documents utiles à joindre.",
    useCases: [
      "Dossier CAF bloqué ou sans réponse",
      "Paiement suspendu ou non reçu",
      "Document indiqué comme manquant",
      "Demande d’explication sur une situation CAF",
      "Erreur ou information à corriger dans votre dossier",
    ],
    notFor: [
      "Contester officiellement une décision CAF avec un délai de recours",
      "Saisir la Commission de recours amiable",
      "Demander une remise de dette ou un échéancier",
      "Répondre à une procédure urgente sans vérifier les délais indiqués par la CAF",
    ],
    documents: [
      "Numéro allocataire CAF",
      "Courrier ou notification CAF",
      "Capture d’écran de votre espace CAF",
      "Justificatif lié à la prestation concernée",
      "Échanges précédents avec la CAF",
    ],
    mistakes: [
      "Employer un ton trop agressif",
      "Ne pas indiquer la prestation concernée",
      "Oublier le numéro allocataire",
      "Ne pas préciser les dates importantes",
      "Envoyer une demande sans expliquer clairement le problème",
    ],
    officialHelp:
      "Cette lettre sert à formuler une réclamation ou une demande d’explication. Clameo n’est pas affilié à la CAF et ne remplace pas un conseiller social ou un organisme public.",
    faq: [
      {
        question: "Cette lettre est-elle adaptée à un dossier CAF bloqué ?",
        answer:
          "Oui. Elle permet de demander une explication écrite et d’indiquer les éléments importants de votre situation.",
      },
      {
        question: "Puis-je l’utiliser pour un paiement CAF suspendu ?",
        answer:
          "Oui, si vous souhaitez demander pourquoi le paiement est suspendu ou non reçu, et quels documents sont éventuellement nécessaires.",
      },
      {
        question: "Est-ce une contestation officielle d’une décision CAF ?",
        answer:
          "Non. Cette première version est pensée pour une réclamation simple ou une demande d’explication. Une contestation formelle ou un recours peut nécessiter un courrier différent.",
      },
      {
        question: "Clameo est-il affilié à la CAF ?",
        answer:
          "Non. Clameo est un outil indépendant qui aide à préparer un courrier et un dossier. Il ne remplace pas la CAF, un conseiller social ou un professionnel du droit.",
      },
    ],
  },
};

export function getModelPage(slug) {
    return MODEL_PAGES[slug] || null;
}

export const MODEL_PAGE_SLUGS = Object.keys(MODEL_PAGES);