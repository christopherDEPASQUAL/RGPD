# Partie A.1 — Registre des activités de traitement de WellWork

- **Version :** 1.0 — 30 septembre 2026
- **Référence technique auditée :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`
- **Statut :** registre initial construit à partir du code fourni ; informations organisationnelles et contractuelles à faire valider par WellWork
- **Périmètre :** plateforme B2B WellWork, API, interface web, stockage JSON, journaux et flux décrits dans le support pédagogique

## 1. Méthode et cadre

L'article 30 du RGPD impose au responsable de traitement un registre écrit mentionnant notamment les finalités, les catégories de personnes et de données, les destinataires, les éventuels transferts hors UE, les délais d'effacement et, dans la mesure du possible, une description générale des mesures de sécurité. La CNIL recommande une fiche par activité et précise que les traitements doivent être identifiés **par finalité et non par logiciel**.

Le présent registre décrit donc sept activités distinctes observées dans WellWork. Il reflète l'état du code, y compris ses lacunes : une destination ou une durée inconnue est indiquée « à confirmer » au lieu d'être inventée. La qualification de WellWork, des entreprises clientes et de l'assureur comme responsable, sous-traitant ou responsables conjoints sera traitée dans la partie A.2 ; elle n'est pas présumée ici.

Les réponses portant sur le poids, la taille, le sommeil, le stress, les antécédents et les traitements sont classées comme données concernant la santé. La CNIL retient une définition large incluant les antécédents, les traitements et les mesures permettant de déduire l'état de santé.

## 2. En-tête du registre

| Information générale exigée | État du dossier |
|---|---|
| Organisme | WellWork — nom commercial déduit de `README.md` et `src/config.js`; raison sociale à confirmer |
| Adresse et coordonnées | À fournir par WellWork |
| Représentant légal | À fournir par WellWork |
| Responsable(s) de traitement / responsables conjoints | À qualifier en partie A.2 à partir des contrats avec les entreprises clientes et l'assureur |
| Représentant dans l'Union européenne | Situation d'établissement inconnue; à confirmer |
| Délégué à la protection des données | Désignation et coordonnées non fournies; à confirmer |
| Responsable de la tenue du registre | À désigner; mise à jour recommandée par le DPO ou le référent protection des données |
| Sous-traitants techniques | Aucun contrat, hébergeur ou prestataire effectivement utilisé n'est documenté dans le support |
| Dernière revue | 30 septembre 2026 |
| Prochaine revue | À chaque évolution de finalité, donnée, destinataire, durée, transfert ou mesure de sécurité; échéance périodique interne à fixer |

## 3. Vue d'ensemble

| ID | Activité de traitement | Finalité principale | Personnes concernées | Sensibilité particulière | Preuve principale |
|---|---|---|---|---|---|
| RT-01 | Gestion des comptes et de l'authentification | Créer, administrer, authentifier et fermer les comptes | Salariés, RH, coachs, administrateurs | Authentifiants et jetons de session | `src/routes/accounts.js`, `src/auth.js` |
| RT-02 | Questionnaires de santé et de bien-être | Recueillir et restituer les informations nécessaires au suivi de bien-être | Salariés utilisateurs | Données concernant la santé | `src/routes/data.js:10-27`, `db/seed.js:52-67` |
| RT-03 | Messagerie coach–salarié | Permettre les échanges liés à l'accompagnement | Salariés et coachs; autres rôles techniquement possibles | Contenu libre susceptible de révéler la santé | `src/routes/data.js:37-45` |
| RT-04 | Annuaire et consultation des profils | Rechercher et consulter les utilisateurs pour le suivi opérationnel | Salariés, RH, coachs, administrateurs | Profil, date de naissance; santé via la fiche détaillée | `src/routes/data.js:22-35` |
| RT-05 | Export destiné à l'assureur | Produire un export des comptes et questionnaires | Tous les utilisateurs présents en base | Santé, identité, authentifiants dérivés | `src/routes/data.js:47-55` |
| RT-06 | Préférences marketing et partage à des tiers | Enregistrer les choix relatifs au marketing et aux tiers | Utilisateurs inscrits | Préférences et preuve de choix | `src/routes/accounts.js:20-32` |
| RT-07 | Journalisation technique et support | Tracer les inscriptions, connexions, changements de profil et exports | Utilisateurs et opérateurs | Authentifiants en clair dans l'état actuel | `src/logger.js`, appels à `log()` |

La collection `sessionsSport` existe dans le schéma (`src/db.js:13`) mais aucune route ni donnée correspondante n'est implémentée. Le suivi sportif n'est donc pas enregistré comme activité active. Une fiche devra être créée avant son activation.

## 4. Fiches détaillées

### RT-01 — Gestion des comptes et de l'authentification

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Inscription; connexion; émission et contrôle des sessions; consultation et modification du profil; demande de suppression du compte; gestion des rôles techniques |
| Personnes concernées | Salariés des entreprises clientes, RH, coachs et administrateurs WellWork |
| Données traitées | Identifiant interne; adresse électronique; prénom; nom; entreprise; date de naissance; rôle; date de création; indicateur et date de suppression; préférence marketing; hash du mot de passe; jeton et date de session |
| Sources | Saisie directe à l'inscription et à la connexion; rôle attribué par défaut ou présent dans le seed; modifications envoyées par l'utilisateur |
| Opérations | Collecte, enregistrement, hachage, consultation, modification, authentification, émission de jeton, marquage comme supprimé |
| Destinataires prévus | Utilisateur concerné; personnels WellWork habilités à administrer la plateforme — habilitations précises à confirmer |
| Destinataires techniquement constatés | Tout utilisateur authentifié peut obtenir des profils via RT-04; administrateurs et RH peuvent recevoir tous les comptes via RT-05; le navigateur de l'utilisateur conserve le jeton dans `localStorage` (`public/index.html:41,51-52`) |
| Transferts hors UE | Aucun transfert ni pays tiers démontré par le code. Hébergement, localisation des utilisateurs et accès de support à confirmer |
| Conservation actuelle | Aucune durée ni purge. `DELETE /api/me` marque seulement `deleted: true`; la ligne, les sessions et les données liées restent présentes, et la reconnexion demeure possible |
| Délai d'effacement à inscrire | À déterminer et faire valider pour chaque catégorie : compte actif, compte fermé, sessions et éventuel archivage contentieux. Aucun délai ne peut être déduit du support |
| Mesures observées | Mot de passe transformé en SHA-256; middleware d'authentification; jeton Bearer; contrôle de rôle sur l'export |
| Insuffisances documentées | SHA-256 sans sel; jeton prédictible et sans expiration; session admin préchargée; rôle modifiable par `PATCH /me`; `passwordHash` sérialisé; suppression et révocation absentes |
| Preuves | `src/routes/accounts.js:11-64`; `src/auth.js:7-38`; `src/db.js:25-28`; `db/seed.js:71-72`; constats `SEC-02`, `SEC-03`, `PRIV-05`, `PRIV-06`, `SEC-05` |
| Propriétaire métier à désigner | Direction produit / responsable des opérations de la plateforme, avec validation DPO et RSSI |

### RT-02 — Questionnaires de santé et de bien-être

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Recueillir des réponses de santé et de bien-être; permettre leur restitution dans le profil; alimenter l'export prévu pour l'assureur. La finalité exacte de coaching, prévention ou assurance doit être confirmée séparément |
| Personnes concernées | Salariés utilisateurs des entreprises clientes |
| Données traitées | Identifiant utilisateur; poids; taille; durée de sommeil; niveau de stress; antécédents; traitement médical; tabagisme; autres réponses libres acceptées par l'API; date du questionnaire |
| Catégorie particulière | Oui — données concernant la santé, notamment antécédents, traitements et mesures croisées permettant d'inférer l'état de santé |
| Sources | Saisie par le salarié; données fictives générées par `db/seed.js` pour la démonstration |
| Opérations | Collecte, enregistrement, conservation, consultation avec le profil, extraction et export |
| Destinataires prévus | Salarié concerné; coachs ou professionnels autorisés à confirmer; assureur selon la finalité annoncée; personnels techniques strictement habilités |
| Destinataires techniquement constatés | Tout compte authentifié peut lire les questionnaires d'un autre utilisateur via `/api/users/:id`; les RH et administrateurs peuvent exporter tous les questionnaires; un salarié peut obtenir l'export après élévation de rôle |
| Transferts hors UE | Aucun transfert réel démontré. Pays d'établissement de l'assureur, hébergement et éventuels prestataires à confirmer avant de conclure |
| Conservation actuelle | Illimitée en pratique : aucune purge, aucune durée configurée et données conservées après `DELETE /api/me`; `retentionDays` vaut `null` dans un fichier de configuration inutilisé |
| Délai d'effacement à inscrire | À établir selon la finalité validée, les obligations sectorielles applicables et la durée réellement nécessaire; aucune valeur arbitraire n'est proposée |
| Mesures observées | Authentification obligatoire pour créer ou consulter; stockage local dans un fichier JSON |
| Insuffisances documentées | Pas de contrôle de propriété, de rôle ou de tenant à la lecture; export global; aucune séparation logique par entreprise; aucune politique de conservation; pas de chiffrement applicatif démontré |
| Preuves | `src/routes/data.js:10-27,47-55`; `db/seed.js:52-67`; constats `PRIV-01`, `PRIV-03`, `PRIV-04`, `PRIV-05` |
| Propriétaire métier à désigner | Responsable du service de bien-être / direction médicale si elle existe, avec DPO et RSSI |

### RT-03 — Messagerie coach–salarié

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Permettre des échanges entre un utilisateur et un coach dans le cadre de l'accompagnement WellWork |
| Personnes concernées | Salariés, coachs et, techniquement, tout compte authentifié |
| Données traitées | Identifiants de l'expéditeur et du destinataire; contenu libre du message; date et heure |
| Sensibilité | Le contenu libre peut révéler des informations de santé, professionnelles ou personnelles; cette possibilité doit être couverte par la gouvernance et l'information des personnes |
| Sources | Message saisi par l'expéditeur |
| Opérations | Collecte, transmission interne, enregistrement, conservation et consultation |
| Destinataires prévus | Expéditeur, destinataire et personnels de support exceptionnellement habilités |
| Destinataires techniquement constatés | Lecture limitée aux messages dont l'utilisateur est expéditeur ou destinataire; l'envoi n'impose toutefois ni rôle coach ni contrôle du destinataire |
| Transferts hors UE | Aucun mécanisme de messagerie externe démontré; hébergement et accès support à confirmer |
| Conservation actuelle | Aucune durée ni suppression implémentée; messages conservés dans la base JSON |
| Délai d'effacement à inscrire | À déterminer selon la durée utile de l'accompagnement et les besoins contentieux documentés |
| Mesures observées | Authentification; filtre de lecture sur `from` ou `to` |
| Insuffisances documentées | Pas de validation des rôles ou de l'appartenance à une relation de coaching; pas de mécanisme d'effacement; confidentialité du stockage non démontrée |
| Preuves | `src/routes/data.js:37-45`; stockage déclaré dans `src/db.js:13` |
| Propriétaire métier à désigner | Responsable coaching / opérations, avec DPO et RSSI |

### RT-04 — Annuaire et consultation des profils

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Permettre aux coachs et aux RH de rechercher des utilisateurs et de consulter les profils nécessaires à leurs missions — finalité déduite du commentaire de code et du README |
| Personnes concernées | Tous les titulaires d'un compte; salariés des différentes entreprises clientes |
| Données traitées | Toutes les propriétés des comptes : identité, email, entreprise, date de naissance, rôle, statut, hash de mot de passe; la fiche détaillée ajoute les questionnaires de santé |
| Sources | RT-01 et RT-02 |
| Opérations | Recherche, filtrage, consultation, rapprochement avec les questionnaires |
| Destinataires prévus | RH limités à leur entreprise; coachs limités aux personnes qu'ils accompagnent — périmètres métier à confirmer |
| Destinataires techniquement constatés | Tout compte authentifié, sans restriction de rôle ni d'entreprise; le filtre est du JavaScript exécuté côté serveur |
| Transferts hors UE | Aucun démontré; dépend de la localisation des utilisateurs et de l'hébergement, à confirmer |
| Conservation actuelle | Identique aux comptes et questionnaires sources : aucune durée définie |
| Délai d'effacement à inscrire | Hérité de RT-01 et RT-02; les vues et caches éventuels restent à recenser |
| Mesures observées | Authentification avant les deux routes |
| Insuffisances documentées | Annuaire complet accessible aux salariés; accès horizontal; absence d'isolation tenant; exposition de `passwordHash`; évaluation d'un filtre utilisateur par `new Function` |
| Preuves | `src/routes/data.js:22-35`; `src/db.js:30-37`; constats `SEC-01`, `PRIV-01`, `PRIV-02`, `PRIV-03`, `PRIV-06` |
| Propriétaire métier à désigner | Responsable des opérations B2B / relation clients, avec DPO et RSSI |

### RT-05 — Export destiné à l'assureur

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Produire, à la demande, un jeu de données destiné à un assureur partenaire. L'objectif précis de l'assureur et la nécessité de chaque donnée ne sont pas documentés |
| Personnes concernées | Tous les utilisateurs de toutes les entreprises présents en base |
| Données traitées | Copie complète de chaque compte, y compris `passwordHash`, identité, entreprise, date de naissance, rôle et statut; tous les questionnaires de santé; métadonnées de l'export : auteur, date, volume |
| Sources | RT-01 et RT-02 |
| Opérations | Extraction, rapprochement, constitution d'une réponse JSON, remise au demandeur et journalisation de l'export |
| Destinataires prévus | Assureur partenaire non identifié; personnels WellWork autorisés à déclencher ou contrôler l'export |
| Destinataires techniquement constatés | Administrateurs et RH selon `requireAdmin`; tout salarié ayant exploité RT-01/`SEC-02`; le code ne contient aucun client réseau envoyant les données à l'assureur |
| Transferts hors UE | Indéterminés. Aucun transfert externe n'est prouvé par la réponse HTTP. Identité, pays, rôle, contrat et canal de l'assureur à fournir avant de renseigner un éventuel transfert |
| Conservation actuelle | Données sources sans limite; historique `exports` sans durée; la réponse peut être conservée par le destinataire pour une durée inconnue |
| Délai d'effacement à inscrire | À fixer séparément pour les données exportées et les traces d'export, en cohérence avec la finalité et le contrat assureur |
| Mesures observées | Authentification; middleware de rôle acceptant `admin` et `rh`; trace de la date, de l'auteur et du nombre de lignes |
| Insuffisances documentées | Export global multi-entreprises; données non minimisées; hash inclus; santé incluse; absence de contrôle tenant; destinataire et canal non documentés |
| Preuves | `src/auth.js:31-38`; `src/routes/data.js:47-55`; constats `SEC-02`, `PRIV-04`, `PRIV-06` |
| Propriétaire métier à désigner | Responsable partenariats/assurance, avec validation juridique, DPO et RSSI |

### RT-06 — Préférences marketing et partage à des tiers

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Enregistrer une préférence marketing et une préférence de communication à des tiers. Aucune campagne ou transmission effective n'est implémentée dans le code fourni |
| Personnes concernées | Utilisateurs qui créent un compte |
| Données traitées | Identifiant utilisateur; indicateurs `marketingOptIn`, `marketing` et `thirdParty`; horodatage |
| Sources | Valeurs imposées par le serveur lors de l'inscription, sans champ de choix reçu du client |
| Opérations | Création et conservation d'un enregistrement de consentement; aucune modification ou révocation prévue |
| Destinataires prévus | Équipe marketing WellWork; tiers non identifiés — à confirmer |
| Destinataires techniquement constatés | Base interne; les enregistrements ne sont exposés par aucune route dédiée dans le code fourni |
| Transferts hors UE | Aucun démontré; dépendrait des futurs outils marketing et tiers, à recenser avant usage |
| Conservation actuelle | Aucune durée et aucun mécanisme de retrait ou d'historisation des changements |
| Délai d'effacement à inscrire | À fixer après définition des finalités; la preuve des choix et retraits doit avoir une durée justifiée distincte de l'usage marketing |
| Mesures observées | Horodatage et rattachement à l'identifiant utilisateur |
| Insuffisances documentées | Valeurs forcées à `true`; absence de choix, de granularité opérationnelle, de retrait et d'identité des tiers |
| Preuves | `src/routes/accounts.js:20-32`; `db/seed.js:27-32`; constat `PRIV-07` |
| Propriétaire métier à désigner | Responsable marketing/partenariats, avec DPO |

### RT-07 — Journalisation technique et support

| Rubrique | Contenu constaté |
|---|---|
| Finalités | Diagnostic technique et support; traçabilité des tentatives d'inscription et de connexion, des modifications de profil et des exports |
| Personnes concernées | Utilisateurs, administrateurs et RH déclenchant les événements journalisés |
| Données traitées | Date et heure; niveau et type d'événement; email; mot de passe en clair; entreprise; identifiant utilisateur; noms des champs modifiés; auteur et volume des exports |
| Sources | Requêtes d'inscription et de connexion; événements applicatifs |
| Opérations | Collecte, écriture dans un fichier, sortie standard éventuelle et consultation par les opérateurs |
| Destinataires prévus | Équipe technique et support strictement habilitée; prestataire d'hébergement ou de centralisation des logs s'il existe, à déclarer |
| Destinataires techniquement constatés | Toute personne ou tout processus ayant accès au fichier `logs/app.log` ou à stdout; aucune gestion d'habilitation applicative n'est démontrée |
| Transferts hors UE | Aucun service de logs distant démontré; environnement d'hébergement et outils de supervision à confirmer |
| Conservation actuelle | Mode ajout continu (`flags: 'a'`), sans rotation, purge ni délai |
| Délai d'effacement à inscrire | À déterminer selon les besoins de sécurité/support et les risques; prévoir rotation, purge et éventuel archivage sécurisé |
| Mesures observées | Chemin configurable par `LOG_FILE`; possibilité de désactiver stdout avec `LOG_STDOUT=0` |
| Insuffisances documentées | Mots de passe journalisés en clair; conservation indéfinie; contrôle d'accès et chiffrement non démontrés |
| Preuves | `src/logger.js:6-14`; `src/routes/accounts.js:15,39`; `src/routes/data.js:53-54`; constat `SEC-04` |
| Propriétaire métier à désigner | Responsable exploitation / RSSI |

## 5. Synthèse des destinataires et flux

| Catégorie de destinataire | Traitements concernés | Situation constatée | Validation requise |
|---|---|---|---|
| Utilisateur concerné | RT-01, RT-02, RT-03 | Profil, questionnaire soumis et messages | Champs réellement nécessaires et droits d'accès |
| Salariés authentifiés | RT-04, indirectement RT-02 et RT-05 | Accès actuel excessif à l'annuaire, aux profils et, après élévation, à l'export | Supprimer les accès non prévus |
| Coachs | RT-03, RT-04; RT-02 à confirmer | Messagerie et accès technique au même titre que tout compte | Définir portefeuille de personnes et accès santé |
| RH des entreprises clientes | RT-04, RT-05 | Annuaire et export global multi-tenant | Limiter à l'entreprise et aux données justifiées |
| Administrateurs WellWork | RT-01 à RT-07 | Accès potentiellement large | Habilitations, séparation des tâches et journalisation |
| Équipe technique/support | RT-07 et accès au stockage | Accès possible aux fichiers de base et de logs | Liste nominative, confidentialité et moindre privilège |
| Assureur partenaire | RT-05 | Destinataire annoncé, mais aucun transfert réseau démontré | Identité, rôle, finalité, contrat, pays, canal et durée |
| Tiers marketing | RT-06 | Mentionnés seulement par un indicateur | Identifier ou supprimer la finalité non utilisée |
| Hébergeur et prestataires | Tous | Non documentés | Inventaire contractuel, localisation, accès et sous-traitants ultérieurs |

## 6. Transferts internationaux

Aucun transfert vers un pays tiers ou une organisation internationale n'est démontré dans le code. Cette conclusion signifie seulement « absence de preuve dans le support », pas « absence certaine de transfert ». Les éléments suivants doivent être obtenus :

1. pays d'hébergement de l'application, de la base, des sauvegardes et des logs ;
2. identité et pays des prestataires techniques ;
3. identité, pays et canal réel de l'assureur ;
4. outils de messagerie, marketing, supervision et support effectivement utilisés ;
5. accès à distance depuis des pays hors Espace économique européen ;
6. mécanisme juridique et garanties applicables pour chaque transfert identifié.

La configuration SMTP neutralisée n'est importée par aucun fichier et ne prouve donc ni l'utilisation du prestataire indiqué dans l'original ni un transfert.

## 7. Durées de conservation

L'état actuel est une absence générale de durée et de purge. Il serait trompeur d'inventer immédiatement des durées chiffrées : la CNIL indique qu'en l'absence de règle spécifique, la durée doit être déterminée selon la finalité, les obligations légales et les éventuels besoins contentieux.

| Catégorie | Durée actuelle observée | Décision attendue |
|---|---|---|
| Comptes actifs | Indéfinie | Durée de la relation de service et règles d'inactivité |
| Comptes « supprimés » | Indéfinie; simple marqueur | Délai d'effacement/anonymisation et éventuel archivage séparé |
| Sessions | Indéfinie | Durée de validité courte, rotation et révocation |
| Questionnaires de santé | Indéfinie | Durée strictement nécessaire par finalité et éventuelle obligation sectorielle |
| Messages | Indéfinie | Durée de l'accompagnement et archivage contentieux justifié |
| Préférences/consentements | Indéfinie | Durée d'usage et durée distincte de preuve des choix/retraits |
| Exports et historique d'export | Indéfinie | Durée côté WellWork et côté destinataire, à contractualiser |
| Journaux | Indéfinie, ajout continu | Rotation, durée sécurité/support et purge automatisée |

## 8. Mesures de sécurité transversales observées

Mesures présentes, sans préjuger de leur conformité :

- authentification Bearer sur les routes non publiques ;
- transformation SHA-256 des mots de passe ;
- middleware de rôle pour l'export ;
- filtre expéditeur/destinataire pour la lecture des messages ;
- trace de certaines actions ;
- chemins de base et de logs configurables par variables d'environnement.

L'audit démontre toutefois que ces mesures sont insuffisantes : contrôle d'accès horizontal et tenant absent, élévation de privilèges, session sans expiration, hash non adapté aux mots de passe, données sensibles et hash exposés, mot de passe journalisé, export non minimisé et absence de politique d'effacement. Le détail reste dans `docs/audit/02-matrice-des-constats.md`.

## 9. Informations à obtenir pour valider le registre

- raison sociale, coordonnées, représentant et DPO de WellWork ;
- contrats avec chaque entreprise cliente et répartition des décisions sur les finalités et moyens ;
- identité, rôle, pays, contrat et finalité de l'assureur ;
- liste des hébergeurs et autres sous-traitants avec leurs localisations ;
- liste réelle des équipes et rôles ayant accès à chaque catégorie de données ;
- finalités précises du questionnaire, du coaching, de l'export et du marketing ;
- durées validées et règles d'archivage/effacement pour chaque catégorie ;
- existence de sauvegardes, réplications, outils de logs et canaux externes non visibles dans le code ;
- mesures organisationnelles : habilitations, confidentialité, revue des droits, gestion des incidents et exercice des droits ;
- décision sur la fonctionnalité de séances sportives avant toute activation.

## 10. Sources juridiques et méthodologiques

- [RGPD, article 30 — registre des activités de traitement (CNIL)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4#Article30)
- [CNIL — Le registre des activités de traitement](https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement)
- [CNIL — Les durées de conservation des données](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees)
- [CNIL — Qu'est-ce qu'une donnée de santé ?](https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante)

Ces sources justifient la structure du registre et la qualification des données de santé. Elles ne remplacent pas l'analyse des bases légales et des rôles demandée en partie A.2.
