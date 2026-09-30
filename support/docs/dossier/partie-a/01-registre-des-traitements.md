# Partie A.1 — Cartographie initiale des traitements WellWork

- **Version :** 1.3 — 1er octobre 2026
- **Référence technique :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`
- **Périmètre :** application WellWork, données et flux décrits dans l'énoncé et observables dans le support fourni

> Cette cartographie est structurée selon l'article 30 du RGPD. Elle recense les finalités, personnes, données, destinataires, transferts, durées et protections connus, mais ne constitue pas encore le registre organisationnel définitif. [A.2](02-bases-legales-et-acteurs.md) analyse les rôles sous hypothèses explicites, faute de contrats. Les activités réalisées comme responsable de traitement et celles réalisées comme sous-traitant devront être distinguées dans les registres appropriés après validation de ces rôles.

La CNIL recommande d'identifier les traitements par finalité et non par logiciel. Les affirmations ci-dessous distinguent donc les activités annoncées dans l'énoncé, les faits observés dans le code et les informations restant à confirmer.

## Informations générales disponibles et manquantes

| Élément | État |
|---|---|
| Organisme | « WellWork » est le nom utilisé par le support; raison sociale, adresse et coordonnées à fournir |
| Responsable, responsables conjoints ou clients responsables | Hypothèses en A.2, à valider à partir des décisions réelles et des contrats |
| Représentant dans l'UE et DPO | Existence et coordonnées non documentées |
| Sous-traitants techniques et hébergeur | Non documentés |
| Responsable de la tenue du registre | À désigner |

Les antécédents et traitements médicaux sont des données de santé par nature. Le stress, le poids, la taille, le sommeil ou le tabagisme peuvent aussi révéler la santé par leur croisement, leur contexte ou l'usage qui en est fait; une mesure isolée ne doit toutefois pas être automatiquement qualifiée comme telle.

## Fiches de traitement

### RT-01 — Comptes et authentification

- **Finalités :** créer et administrer les comptes, authentifier les utilisateurs, gérer les sessions, le profil et la demande de suppression.
- **Personnes et données :** salariés, RH, coachs et administrateurs; identité, email, entreprise, date de naissance, rôle, statut du compte, dates de création/suppression, mot de passe saisi puis empreinte conservée, jeton et date de session, `marketingOptIn`.
- **Destinataires :** utilisateur concerné et administrateurs habilités — périmètre à confirmer. En pratique, RT-04 expose des profils à tout compte authentifié et RT-05 les expose aux RH et administrateurs.
- **Transferts et conservation :** aucun transfert hors UE démontré. Aucune durée ni purge applicative observée; procédures externes non documentées. `DELETE /api/me` conserve le compte et ses données liées. Les durées cibles doivent distinguer compte actif, compte fermé, session et éventuel archivage justifié.
- **Protections observées :** authentification Bearer et empreinte SHA-256. Le navigateur stocke le jeton dans `localStorage`; il s'agit d'une modalité de stockage, pas d'un destinataire. Limites détaillées dans `SEC-02`, `SEC-03`, `SEC-05`, `PRIV-05` et `PRIV-06`.
- **Références :** `src/routes/accounts.js:11-64`, `src/auth.js:7-38`, `public/index.html:41-57`.

### RT-02 — Questionnaires de santé et de bien-être

- **Finalités :** recueillir les réponses nécessaires au service de bien-être et les restituer avec le profil; l'usage exact pour le coaching, la prévention ou l'assurance reste à confirmer.
- **Personnes et données :** salariés; identifiant, date, poids, taille, sommeil, stress, antécédents, traitement médical, tabagisme et réponses libres acceptées par l'API. Les antécédents et traitements sont des données de santé; les autres mesures peuvent le devenir selon leur croisement et leur contexte.
- **Destinataires :** salarié concerné; coachs ou professionnels dont l'habilitation reste à définir; assureur annoncé pour RT-05. Le code permet actuellement à tout compte authentifié de consulter les questionnaires d'un tiers et aux RH/administrateurs de tous les exporter.
- **Transferts et conservation :** aucun transfert externe démontré. Aucune durée ni purge applicative observée; les questionnaires subsistent après `DELETE /api/me`. La politique cible doit être définie selon chaque finalité validée, les éventuelles obligations sectorielles et les besoins d'archivage justifiés.
- **Protections observées :** authentification préalable, mais pas de contrôle de propriété, de rôle ou d'entreprise. Voir `PRIV-01`, `PRIV-03`, `PRIV-04` et `PRIV-05`.
- **Références :** `src/routes/data.js:10-27,47-55`, `db/seed.js:52-67`.

### RT-03 — Messagerie coach–salarié

- **Finalités :** permettre les échanges liés à l'accompagnement.
- **Personnes et données :** salariés et coachs; identifiants de l'expéditeur et du destinataire, contenu libre, date. Le texte peut contenir des informations personnelles ou de santé selon ce que l'utilisateur écrit.
- **Destinataires :** expéditeur et destinataire; éventuels accès support à confirmer. La lecture est filtrée sur `from`/`to`, mais tout compte authentifié peut envoyer un message sans contrôle d'une relation de coaching.
- **Transferts et conservation :** aucune messagerie externe démontrée. Aucune durée, purge ou procédure externe documentée. La durée cible doit tenir compte de la période d'accompagnement et d'un éventuel archivage contentieux justifié.
- **Protections observées :** authentification et filtrage des messages à la lecture; limites d'habilitation non couvertes par un constat dédié.
- **Références :** `src/routes/data.js:37-45`, `src/db.js:13`.

### RT-04 — Tableau de bord RH annoncé, annuaire et consultation des profils

- **Finalités :** fournir aux coachs et aux RH un annuaire et les profils utiles à leurs missions. L'énoncé annonce aussi un « tableau de bord RH ».
- **Correspondance énoncé/code :** dans le code observé, les seules fonctions susceptibles d'alimenter ce tableau de bord sont la liste des utilisateurs et la consultation des profils. Aucune vue dédiée, statistique, agrégation ou indicateur RH n'est implémenté. RT-04 recense donc l'activité annoncée sans lui attribuer de données ni d'usages supplémentaires; toute future fonction de pilotage devra être ajoutée au registre selon son contenu réel.
- **Personnes et données :** titulaires de comptes; identité, email, entreprise, date de naissance, rôle, statut et empreinte du mot de passe; la fiche détaillée joint les questionnaires.
- **Destinataires :** destinataires métier annoncés : coachs et RH. Leurs habilitations par entreprise ou portefeuille sont des hypothèses à valider. Accès observé : tout compte authentifié, sans restriction de rôle ni de tenant.
- **Transferts et conservation :** aucun transfert démontré. La conservation suit celle des données sources RT-01 et RT-02; aucune purge applicative n'est observée.
- **Protections observées :** authentification seulement. Les accès excessifs et le filtre JavaScript sont documentés dans `SEC-01`, `PRIV-01`, `PRIV-02`, `PRIV-03` et `PRIV-06`.
- **Références :** `src/routes/data.js:22-35`, `src/db.js:30-37`.

### RT-05 — Export annoncé pour l'assureur

- **Finalités :** constituer un export annoncé comme destiné à un assureur; l'objectif métier précis et la nécessité des données restent inconnus.
- **Personnes et données :** tous les utilisateurs présents en base. Les **données sources** sont les comptes et questionnaires. La **réponse HTTP** contient leurs propriétés complètes, dont `passwordHash`, et les questionnaires. La collection `exports` ne conserve pas une copie de l'export : elle enregistre seulement `id`, auteur, date et nombre de lignes. Le journal conserve également des métadonnées.
- **Destinataires :** assureur annoncé mais non identifié; administrateurs et RH peuvent obtenir la réponse. Après `SEC-02`, un salarié peut aussi y accéder. Le code ne prouve aucun envoi effectif à l'assureur.
- **Transferts et conservation :** pays et canal du destinataire inconnus; aucun transfert hors UE ne peut être conclu. Aucune purge applicative des données sources ou des traces `exports` n'est observée. La conservation éventuelle de la réponse chez le destinataire est inconnue.
- **Protections observées :** authentification et contrôle de rôle acceptant `admin` et `rh`; limites dans `SEC-02`, `PRIV-04` et `PRIV-06`.
- **Références :** `src/auth.js:31-38`, `src/routes/data.js:47-55`.

### RT-06 — Préférences marketing et partage à des tiers

- **Finalités :** enregistrer des indicateurs marketing et de partage à des tiers; aucune campagne ni transmission n'est observable dans le support.
- **Personnes et données :** utilisateurs inscrits; `marketingOptIn` dans le profil, et enregistrements séparés `consents` contenant identifiant, `marketing`, `thirdParty` et date.
- **Destinataires :** équipe marketing et tiers éventuels, non identifiés. `marketingOptIn` apparaît dans les réponses de profil; les enregistrements `consents` n'ont pas de route dédiée.
- **Fonctionnement constaté :** à l'inscription, les trois indicateurs sont imposés à `true`; ils ne prouvent donc pas un choix exprimé. `PATCH /api/me` peut modifier `marketingOptIn`, mais ne synchronise pas la collection `consents`. Il n'existe pas de procédure cohérente de retrait ou d'historisation.
- **Transferts et conservation :** aucun transfert démontré. Aucune durée ni purge applicative observée; procédures externes non documentées. Les durées cibles devront distinguer usage des préférences et conservation justifiée d'une preuve de choix ou de retrait.
- **Protections et preuves :** horodatage des `consents`, mais cohérence non garantie. Voir `PRIV-07`; `src/routes/accounts.js:20-32,48-58`, `db/seed.js:27-32`.

### RT-07 — Journalisation technique et support

- **Finalités :** diagnostic, support et traçabilité des inscriptions, connexions, modifications de profil et exports.
- **Personnes et données :** utilisateurs et opérateurs, mais aussi personnes tentant une inscription ou une connexion sans disposer d'un compte; date, événement, email, entreprise, mot de passe saisi en clair, identifiant, champs modifiés, auteur et volume d'export.
- **Destinataires :** personnes ou processus ayant accès au fichier de log ou à stdout; équipes techniques/support et prestataires éventuels à identifier.
- **Transferts et conservation :** aucun service externe de logs démontré. Écriture en ajout continu, sans durée, rotation ou purge applicative observée; procédures externes non documentées.
- **Protections observées :** stdout peut être désactivé. Le stockage en fichier et son chemin configurable ne constituent pas à eux seuls des protections; habilitations et chiffrement ne sont pas documentés. Voir `SEC-04`.
- **Références :** `src/logger.js:6-14`, `src/routes/accounts.js:15,39`, `src/routes/data.js:53-54`.

### RT-08 — Suivi des séances sportives

- **État :** activité décrite dans l'énoncé, non observable dans le support technique; une collection vide `sessionsSport` existe, sans route ni donnée associée.
- **Personnes concernées :** salariés, selon l'énoncé.
- **À confirmer :** finalité précise, données, destinataires, transferts, durées, stockage et protections. Aucun de ces éléments ne peut être déduit de manière fiable du code fourni.
- **Références :** énoncé, page 1; `src/db.js:13`.

## Notes communes et validations nécessaires

L'hébergement, les sauvegardes, les prestataires, leurs pays, les accès de support et les contrats ne sont pas documentés. L'absence de flux sortant dans le code ne prouve donc pas l'absence de transfert international. Il faut identifier ces acteurs, puis documenter pays, garanties et sous-traitants ultérieurs.

Pour les activités observables dans le code, la preuve technique est la même : **aucune durée ni purge applicative observée; procédures externes non documentées**. La politique cible devra distinguer base active, éventuel archivage intermédiaire et suppression. Les critères à examiner sont la finalité, la fin de la relation, les obligations sectorielles applicables, les délais de recours et la nécessité de chaque donnée. Aucune durée légale n'est déduite ou inventée ici.

Restent à valider : identité et coordonnées des acteurs et du DPO; qualification juridique en A.2; finalités métier exactes; habilitations prévues; hébergement et transferts; sous-traitants; durées et modalités d'effacement; mesures organisationnelles; réalité et modalités des activités assureur, marketing et sport.

## Références officielles

- [RGPD, article 30 — registre des activités de traitement](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4#Article30)
- [CNIL — Le registre des activités de traitement](https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement)
- [CNIL — Les durées de conservation des données](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees)
- [CNIL — Qu'est-ce qu'une donnée de santé ?](https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante)
