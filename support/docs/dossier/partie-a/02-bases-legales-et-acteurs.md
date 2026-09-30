# Partie A.2 — Bases légales et qualification des acteurs

- **Version :** 1.2 — 1er octobre 2026
- **Référence technique :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`
- **Périmètre :** traitements RT-01 à RT-08 définis en A.1

## 1. Hypothèse de travail

Faute de contrats et d'information aux salariés dans le support, l'hypothèse principale est conditionnelle : les clients déterminent les objectifs de leur programme et WellWork fournit la plateforme. Le client serait responsable des traitements du programme, WellWork sous-traitant quand elle agit sur instruction. Une finalité autonome décidée par WellWork avec ses moyens essentiels, ou une codétermination avec le client, modifierait ce rôle. Choisir les outils ou les détails techniques de sécurité ne suffit pas à devenir responsable de traitement.

Le rôle réel prévaut sur l'étiquette contractuelle : le responsable décide des finalités et moyens essentiels; le sous-traitant agit pour son compte sur instruction. Des décisions communes ou complémentaires et indissociables peuvent conduire à la responsabilité conjointe ([CNIL](https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role), [CEPD, lignes directrices 07/2020](https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en)).

Chaque traitement exige une base de l'article 6. Le contrat suppose que la personne soit partie et le traitement objectivement nécessaire : le contrat B2B avec l'employeur ne suffit pas pour le salarié ([CNIL — contrat](https://www.cnil.fr/fr/les-bases-legales/contrat)). L'intérêt légitime exige un intérêt réel, la nécessité et une mise en balance documentée avec les droits et attentes raisonnables ([CNIL — intérêt légitime](https://www.cnil.fr/fr/les-bases-legales/interet-legitime)). Les données de santé exigent aussi une exception de l'article 9; ni contrat ni intérêt légitime ne lèvent seuls l'interdiction ([RGPD, articles 6 et 9](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2)).

## 2. Analyse par traitement

### RT-01 — Comptes et authentification

**Finalité.** Créer et administrer les comptes, authentifier les utilisateurs et gérer leurs sessions.

**Hypothèse d'acteur.** L'entreprise cliente serait responsable si elle décide quels comptes professionnels ouvrir et quels accès fournir, WellWork exécutant alors cette partie comme sous-traitant. WellWork serait responsable séparé des traitements de session ou de sécurité dont elle fixe elle-même la finalité.

**Base privilégiée.** L'article 6(1)(f), intérêt légitime à fournir et sécuriser l'accès, est envisageable pour les seules données nécessaires. Il faut documenter l'intérêt, l'absence de moyen moins intrusif et la mise en balance. L'article 6(1)(b) serait applicable si un contrat de service lie directement le salarié à WellWork et rend le compte objectivement nécessaire; il n'existe pas de préférence automatique entre ces bases.

**Conclusion.** Le cœur compte/authentification est justifiable sous conditions, mais le support ne démontre ni contrat direct ni mise en balance. La nécessité de la date de naissance n'est pas établie. Aucune base ne justifie l'exposition de `passwordHash`, l'élévation de rôle ou les sessions sans expiration.

### RT-02 — Questionnaires de santé et de bien-être

**Finalité.** Recueillir et utiliser les réponses nécessaires au service de bien-être; les usages de coaching, prévention ou assurance restent à définir.

**Hypothèse d'acteur.** L'entreprise cliente serait responsable si elle fixe l'objectif du questionnaire et les destinataires, WellWork étant sous-traitant. Si WellWork définit avec elle les questions, usages ou exports, une responsabilité conjointe doit être examinée.

**Base privilégiée.** Pour un service réellement facultatif, l'hypothèse la plus cohérente est le consentement au titre de l'article 6(1)(a), accompagné du consentement **explicite** de l'article 9(2)(a). Il doit être spécifique par finalité, éclairé, prouvable, retirable et libre : refus sans conséquence professionnelle ou perte d'un service essentiel. Dans la relation de travail, le déséquilibre exige une vigilance renforcée, sans rendre le consentement toujours impossible ([CNIL](https://www.cnil.fr/fr/les-bases-legales/consentement), [CEPD 05/2020](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en)).

**Conclusion.** La licéité n'est pas établie dans le support : aucun consentement santé n'y est recueilli et les indicateurs imposés ne constituent pas un choix. L'article 9(2)(h) exige une finalité admissible (notamment médecine préventive ou du travail, soins), le fondement qu'il prévoit et les garanties de secret de l'article 9(3); un coach bien-être n'est pas automatiquement un professionnel de santé.

### RT-03 — Messagerie coach–salarié

**Finalité.** Permettre les échanges liés à l'accompagnement.

**Hypothèse d'acteur.** L'entreprise cliente serait responsable de l'accompagnement qu'elle organise; WellWork serait sous-traitant si la messagerie répond à ses instructions. WellWork pourrait être responsable si elle organise elle-même le coaching.

**Base privilégiée.** L'article 6(1)(f) peut couvrir une messagerie limitée et attendue, après test de nécessité et mise en balance. L'article 6(1)(b) ne s'applique que si la personne a un contrat direct rendant la messagerie nécessaire. Dès que des données de santé y sont traitées, y compris par leur stockage dans un message libre, une exception de l'article 9 est également requise; elle n'est pas démontrée. L'absence d'exploitation médicale ne dispense pas de cette analyse.

**Conclusion.** La messagerie ordinaire est justifiable sous conditions. Le contenu de santé et l'envoi à tout identifiant exigent un cadrage supplémentaire.

### RT-04 — Tableau de bord RH annoncé, annuaire et consultation des profils

**Finalité.** Fournir l'annuaire et les profils nécessaires aux missions autorisées des coachs et RH. L'énoncé annonce un tableau de bord RH, mais le code ne démontre que la liste et la consultation de profils : aucune statistique ou agrégation ne peut être présumée.

**Hypothèse d'acteur.** L'entreprise cliente serait responsable de son annuaire RH; ses RH sont normalement des personnes habilitées sous son autorité, non un responsable distinct. WellWork serait sous-traitant si elle exécute ce périmètre.

**Base privilégiée.** L'article 6(1)(f) peut être envisagé pour un annuaire professionnel minimal, limité à l'entreprise et aux personnes dont les missions exigent l'accès. La nécessité, les champs et les attentes des salariés doivent être documentés. Cette analyse ne couvre pas automatiquement un futur tableau de bord : ses indicateurs, niveau d'agrégation, destinataires et nécessité devront être évalués; s'ils révèlent la santé, une exception de l'article 9 sera aussi requise.

**Conclusion.** Un annuaire restreint peut être justifié, mais pas l'implémentation actuelle : accès de tout compte, données multi-entreprises, hash et questionnaires. La licéité du tableau de bord annoncé reste indéterminée tant que son fonctionnement n'est pas décrit; l'intérêt légitime ne couvre ni ces excès ni les données de santé sans exception de l'article 9.

### RT-05 — Export annoncé pour l'assureur

**Finalité.** Constituer un export annoncé comme destiné à l'assureur; son objectif métier précis n'est pas documenté.

**Hypothèse d'acteur.** L'acteur qui décide l'objectif et le contenu de l'export est responsable. Si l'assureur reçoit les données pour ses propres décisions, il est vraisemblablement responsable autonome, pas sous-traitant du seul fait qu'il est destinataire. Une décision commune client–WellWork–assureur pourrait modifier cette qualification.

**Base envisageable.** Aucun fondement n'est démontré. Un consentement explicite articles 6(1)(a) et 9(2)(a) serait théoriquement possible, mais seulement avec finalité précise, choix séparé, absence de conséquence et retrait effectif. Aucune obligation légale d'export ne peut être supposée. Le contrat B2B et l'intérêt légitime ne suffisent pas pour les données de santé.

**Conclusion.** La licéité de RT-05 n'est pas établie. Suspendre cet export dans la cible tant que sa finalité, les données nécessaires, le cadre article 9, les éventuelles restrictions sectorielles et le canal réel ne sont pas validés. Le code produit une réponse HTTP, sans prouver un envoi à l'assureur annoncé dans l'énoncé.

### RT-06 — Préférences marketing et partage à des tiers

**Finalité.** Gérer les préférences et leur preuve, puis, si elles sont mises en œuvre, les campagnes marketing ou communications à des tiers.

**Hypothèse d'acteur.** WellWork est responsable de son propre marketing; chaque client ou tiers est responsable de ses finalités, ou conjoint si les décisions sont réellement communes.

**Base privilégiée.** Le consentement article 6(1)(a) est l'hypothèse de travail pour des campagnes ou transmissions à des tiers nécessitant un accord. Il doit être libre, spécifique par finalité, éclairé, univoque et aussi simple à retirer qu'à donner. Distinguer cette utilisation de la preuve du consentement et de la gestion d'un retrait ou d'une opposition : leur conservation minimale répond aux obligations des articles 7(1), 7(3) et 21(3), sur le fondement de l'article 6(1)(c), selon le cas. Elle n'autorise aucune nouvelle prospection. Les campagnes non observées devront être analysées selon leur canal et leurs destinataires ([articles 7 et 6](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2), [article 21](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)).

**Conclusion.** Les valeurs forcées à `true`, l'absence de choix et la désynchronisation entre `marketingOptIn` et `consents` ne démontrent aucun consentement valide. La licéité d'un usage marketing ou tiers n'est donc pas établie.

### RT-07 — Journalisation technique et support

**Finalité.** Assurer la sécurité, le diagnostic, le support et une traçabilité proportionnée du service.

**Hypothèse d'acteur.** WellWork reste sous-traitante pour les journaux nécessaires au service fourni sur instruction, même si elle choisit les mesures techniques de sécurité. Elle serait responsable d'une journalisation poursuivant une finalité autonome dont elle détermine les moyens essentiels. Cette distinction doit être documentée, sans qualifier automatiquement tout support technique de traitement autonome.

**Base privilégiée.** L'article 6(1)(f) est envisageable pour des journaux nécessaires à la sécurité, au diagnostic et à la défense du service, après définition des événements utiles, durée, accès et mise en balance. Aucune obligation légale spécifique n'est fournie.

**Conclusion.** Une journalisation minimisée est justifiable sous conditions; l'enregistrement des mots de passe en clair n'est ni nécessaire ni proportionné et ne peut être couvert par cette base (`SEC-04`).

### RT-08 — Suivi sportif annoncé

**Finalité.** Permettre le suivi des séances sportives des salariés, selon l'énoncé; les objectifs précis restent inconnus.

**Hypothèse d'acteur.** Si l'entreprise cliente fixe l'objectif du suivi, elle serait responsable et WellWork sous-traitant; si WellWork en détermine les usages, son rôle autonome ou conjoint doit être examiné.

**Base envisageable.** L'article 6(1)(b) pourrait convenir à un service nécessaire souscrit directement par le salarié; l'intérêt légitime ou le consentement dépendraient d'un autre modèle. Si les données révèlent la santé, une exception de l'article 9 serait aussi nécessaire.

**Conclusion.** Le code ne démontre ni fonctionnement ni données. Base légale, exception et responsabilités restent indéterminées sans description du service et des décisions.

## 3. Qualification transversale des acteurs

| Acteur | Qualification principale sous hypothèse | Ce qui peut la modifier | Documents nécessaires |
|---|---|---|---|
| Entreprise cliente | Responsable des finalités du programme salarié, de l'annuaire et des habilitations | Responsabilité conjointe si WellWork co-détermine les finalités/moyens essentiels | Contrat B2B, politiques RH, information des salariés, matrice d'habilitation |
| WellWork | Sous-traitant des traitements exécutés sur instruction; responsable de ses finalités autonomes, par exemple son propre marketing | Responsable conjoint ou autonome selon les décisions de finalité et de moyens essentiels; pas pour le seul choix d'outils techniques | Contrat article 28, conditions du service, documentation des décisions et instructions |
| RH | Personnes habilitées sous l'autorité du client, sauf organisme distinct | Autonomie réelle sur les finalités et moyens | Fiches de rôle, délégations et procédures d'accès |
| Coach | Personne autorisée s'il est interne; sous-traitant externe s'il agit sur instruction, éventuellement sous-traitant ultérieur de WellWork | Responsable autonome s'il détermine ses propres finalités professionnelles | Statut, contrat, instructions, confidentialité; qualification professionnelle éventuelle |
| Assureur | Destinataire et probablement responsable autonome s'il poursuit ses propres finalités | Sous-traitant seulement s'il agit exclusivement sur instructions; responsabilité conjointe si décisions communes | Convention d'échange, finalités, catégories de données, pays, durées et information |
| Hébergeur/prestataire | Sous-traitant technique s'il est effectivement utilisé | Responsable pour une réutilisation propre non couverte par les instructions | Identité, localisation, contrat article 28 et chaîne de sous-traitance |

En cas de responsabilité conjointe, un accord transparent doit répartir les obligations de l'article 26. Un sous-traitant doit être encadré par l'article 28. Les RH, salariés de WellWork ou coachs internes agissant sous autorité doivent respecter les instructions conformément à l'article 29 ([RGPD, articles 26 à 29](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4)).

## 4. Mise en balance préliminaire des intérêts légitimes

Cette analyse porte sur la cible minimisée, pas sur une régularisation des accès actuels. Elle doit être validée par le responsable réel avec les salariés concernés.

| Traitement | Intérêt et nécessité envisagés | Mise en balance et conclusion |
|---|---|---|
| RT-01 | Accès individuel au service; identifiant et authentifiant nécessaires à la séparation des comptes | Attente raisonnable de sécurité; pas de date de naissance sans justification, ni réutilisation marketing. Favorable sous ces garanties, défavorable aux excès actuels |
| RT-03 hors santé | Joindre le coach attribué; échange direct moins exposant qu'un espace collectif | Participation facultative, confidentialité, destinataires contrôlés, opposition examinée. Favorable sous conditions; article 9 à traiter séparément |
| RT-04 | Administrer les seuls comptes utiles aux missions du client | Annuaire réduit plutôt que profils complets; accès salarié général et santé exclus. Favorable pour les habilités du même client, défavorable à l'annuaire actuel |
| RT-07 | Détecter des incidents et diagnostiquer les erreurs avec événements et identifiants limités | Logs sans mots de passe ni réponses santé, accès restreint et durée motivée; alternative moins intrusive aux contenus complets. Favorable uniquement sous ces garanties |

## 5. Conclusion opérationnelle

- **Justifiables sous conditions :** RT-01 pour les données strictement nécessaires, RT-03 hors santé, RT-04 sous forme d'annuaire minimal et cloisonné, RT-07 sans secrets. Il faut choisir et documenter la base, la nécessité et, pour l'intérêt légitime, la mise en balance.
- **Licéité non établie dans le support :** RT-02, RT-05 et les usages marketing/tiers de RT-06; RT-08 reste indéterminé. Les conditions de consentement et de l'article 9 ne sont pas démontrées.
- **Validation prioritaire :** obtenir contrats et informations salariés, cartographier les décisions réelles, identifier l'assureur/coachs/hébergeur, documenter les tests d'intérêt légitime et concevoir des consentements réellement libres lorsque cette base est retenue.

Quelle que soit la base légale, elle ne justifie jamais les accès excessifs, l'absence de minimisation ou les données inutiles constatés dans le code.
