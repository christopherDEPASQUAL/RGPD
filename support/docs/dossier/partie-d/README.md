# Partie D — Pilotage agile de la remédiation

Version 1.0 — 1er octobre 2026. Référence de départ : `1a80376bf249dabdbc8782388fd8d94bfcafe4fe`, branche de revue. **Proposition pédagogique : aucune équipe mobilisée, aucun sprint réalisé, aucun budget engagé ni avis organisationnel obtenu.** Les actions ci-dessous sont à réaliser, sauf les acquis explicitement renvoyés à C.2.

## Cadre, objectif et équipe proposée

**Objectif produit :** disposer d'un périmètre WellWork dont les accès, les usages de données et les droits sont démontrables, afin de permettre au responsable compétent de décider d'un pilote restreint. Le renouvellement commercial ne doit pas conduire à ouvrir un traitement non justifié.

Cette planification prolonge [C.1 — actions](../partie-c/01-plan-de-remediation.md), [C.2 — corrections existantes](../partie-c/02-correctifs-et-preuves.md), [C.3 — risques résiduels](../partie-c/03-risques-residuels.md) et la [synthèse de revue, dont MSG-01](../00-synthese-et-statuts.md). Les références `RR-*`, `NC-*`, `PRIV-*`, `SEC-*` et `RT-*` conservent leur sens dans A à C.

Les corrections déjà codées ne sont **ni reprogrammées comme neuves, ni recomptées dans le budget passé**. D-01 organise seulement leur recette sur la version retenue. Les dépendances juridiques, l'habilitation réelle et l'exploitation restent ouvertes. L'export assureur reste suspendu; les campagnes, le partage effectif à des tiers et le suivi sportif non implémenté ne sont pas ajoutés au périmètre.

**Méthode proposée :** trois sprints de deux semaines, avec revue à chaque fin de sprint et traitement immédiat des incidents. Le Product Owner ordonne le backlog; les personnes qui réalisent le travail réestiment et adaptent le plan. Les responsabilités et les événements s'appuient sur le Scrum Guide 2020 [S1](annexes/sources-et-controles.md#s1). Les durées, estimations et limites de travail en cours qui suivent sont des choix pour ce cas, non des prescriptions de Scrum. Les quatre jours du devoir ne sont pas la durée d'exécution de ce plan.

| Rôle proposé | Contribution et responsabilité | Disponibilité par sprint de 10 jours ouvrés |
|---|---|---:|
| Deux développeurs full-stack — DEV | API, interface, migrations, tests et revues croisées; répartition équilibrée, pas un développeur supposé travailler 16 jours | 20 jours-personne |
| Référent qualité — QA | Scénarios adverses et légitimes, recette indépendante de l'auteur, conservation des preuves | 6 jours-personne |
| Ingénieur exploitation — OPS | Configuration, données héritées, restauration et supervision | 6 jours-personne |
| Product Owner — PO | Objectif produit, ordre des travaux, clarification des règles avec les clients et suivi des décisions | 3 jours-personne |
| Scrum Master — SM | Facilitation, résolution des obstacles et amélioration du fonctionnement; ne distribue pas autoritairement les tâches | 2 jours-personne |
| DPO/conseil indépendant | Avis sur finalités, information, droits, AIPD et incident; contrôle et alerte | 3 jours-personne |
| RSSI/référent sécurité | Analyse des menaces, recette de sécurité et coordination technique d'incident | 3 jours-personne |

Équipe de réalisation : six personnes (PO, SM, deux développeurs, QA, OPS), appuyées par deux experts distincts. Les temps partiels sont réservés dès la planification; QA et OPS travaillent avec les développeurs pendant le sprint, pas dans une phase de test finale. Ce choix évite que le développeur soit seul juge de son correctif tout en limitant les postes à temps plein.

Le **responsable du traitement réellement compétent**, déterminé selon A.2, décide du traitement et des risques. Le sponsor débloque moyens et arbitrages; il ne peut décider à la place d'un client responsable autonome. Le PO ne devient pas responsable du traitement par son titre. Le DPO conseille et contrôle, sans assumer la décision du responsable; il est distinct des fonctions décisionnelles PO/RSSI dans cette proposition [S2](annexes/sources-et-controles.md#s2). Sa présence proposée ne démontre pas une obligation de désignation dans ce cas.

Hypothèses de dimensionnement : application fournie, un périmètre pilote limité, interlocuteurs client et exploitation identifiés, pas de refonte fonctionnelle générale. Volume, architecture de production et contrats étant inconnus, D-02/D-04 peuvent imposer un nouveau chiffrage. Le temps des signataires et des équipes clientes n'est pas assimilé à du temps de développement disponible.

## D.1 — Backlog, epics et critères d'acceptation

Un **epic** regroupe un objectif. Une **user story** décrit le résultat attendu par un bénéficiaire. Son **abuser story** décrit un usage abusif à empêcher : ce n'est ni une attaque réelle constatée ni un second ticket à chiffrer. Les tests correspondants sont compris dans l'estimation de la story.

| Epic | Résultat recherché | Tickets |
|---|---|---|
| E1 — Contenir et prouver la sécurité | Incident traité à temps, acquis vérifiés et exposition web maîtrisée | INC-01, SAFE-01, D-01, D-05, D-11, D-16 |
| E2 — Justifier et expliquer les usages | Finalités, information et décisions traçables, sans réouverture implicite | D-02, D-06, D-07, D-12, D-17 |
| E3 — Maîtriser les habilitations | Attribution, usage et révocation des accès démontrés | D-03, D-08, D-09, D-18 |
| E4 — Maîtriser le cycle de vie des données | Conservation, effacement, stockage et reprise cohérents | D-04, D-10, D-13, D-14, D-15 |

### Exemple complet — D-08, habilitations

**User story :** en tant que responsable des habilitations d'une entreprise cliente, je veux attribuer et révoquer des accès à partir d'une identité et d'un rattachement vérifiés, afin de protéger les salariés sans empêcher les missions autorisées.

**Abuser story :** en tant que salarié malveillant, je déclare une autre entreprise ou exploite une ancienne affectation pour lire les questionnaires d'un tiers.

**Critères :** (1) une entreprise autodéclarée ne produit aucun droit; (2) un acteur non habilité ne peut créer un rattachement ou une affectation; (3) un RH ne reçoit pas de santé individuelle et un coach n'accède qu'aux salariés autorisés; (4) après révocation, une session encore active ne permet plus l'accès retiré; (5) un cas autorisé fonctionne et chaque changement laisse une trace sans contenu de santé. Preuves : tests API, procédure d'approbation et trace de révocation. Origine : `PRIV-01/02/03`, `NC-05`, `RR-02`. Charge : 6,25 jours-personne; dépendances D-03/D-01; sprint S2.

### Exemple complet — D-13, conservation et droits

**User story :** en tant que salarié ayant quitté le service, je veux que les données devenues inutiles soient traitées selon les règles annoncées et que ma demande de droits soit suivie.

**Abuser story :** en tant qu'opérateur négligent, je conserve les anciens profils indéfiniment ou je déclare un effacement sans examiner les données liées.

**Critères :** règle et événement de départ approuvés pour chaque catégorie; données à échéance traitées et données encore nécessaires préservées; exception documentée au lieu d'une destruction aveugle; exécution répétée sans effet indésirable; demande, réponse et délai applicables tracés. Preuves : fixtures avant/à/après échéance et test répété, sans réensemencement. Origine : `PRIV-05`, `NC-08/09`, `RR-06`; 4,25 jours-personne; D-10/D-01; S2. Les sauvegardes font l'objet de D-15, pas d'une promesse d'effacement universel.

Les **20 fiches complètes**, avec critères vérifiables, rôles pilotes, dépendances et correspondance aux sources, sont dans le [backlog détaillé](annexes/backlog-detaille.md). Tous les tickets sont « proposés ». La préparation des textes dans ce devoir n'est pas leur réalisation en entreprise.

## D.2 — Estimation et priorisation justifiées

### Estimation

Un jour-personne (JP) représente **7 heures de travail**, pas une journée de délai. Les estimations incluent analyse, réalisation, tests, revue technique et documentation du ticket. Les événements communs et réserves sont déduits séparément de la capacité. Les attentes d'un contrat signé ou d'une information client ne sont pas cachées dans une charge en JP.

Les estimations initiales sont des hypothèses d'auteur. Avant sélection, DEV/QA/OPS et les experts concernés les revoient ensemble à partir des fichiers et critères. Aucun historique de vélocité n'est inventé et aucune conversion « un point = un jour » n'est utilisée. Les tickets de confiance faible sont réestimés après découverte; D-04 est précisément une exploration limitée, pas une promesse de migration déjà dimensionnée.

### Ordre de traitement

1. **P0 :** incident et confinement, sans attendre un sprint ni un score.
2. **P1 :** obstacles de licéité, droits, identités et protections du pilote.
3. **P2 :** exploitation et contrôles durables. P2 signifie ordre de préparation, **pas autorisation de lancer un pilote sans sauvegarde ou restauration validée**.

Dans une même classe, parmi les tickets dont les dépendances sont levées, l'indice indicatif est **I = (2R + V) / E**. R vaut 1 à 4 : confort, maîtrise durable, risque sérieux sous conditions, puis santé/identité ou obligation bloquante. V vaut 1 à 3 : amélioration locale, fiabilité opérationnelle, puis déblocage d'un parcours ou d'une décision essentielle. E est la charge totale en JP. Ce sont des appréciations explicites de pilotage, distinctes des CVSS de B et de la cotation AIPD; leurs valeurs détaillées sont dans [planning.json](annexes/planning.json).

Exemples : D-02 obtient `(2×4+3)/2,25 = 4,89`; D-08 obtient `11/6,25 = 1,76`. La décision de finalité précède donc utilement l'implémentation. D-17 a un indice de 3,38, mais reste en S3 car ses preuves dépendent des travaux antérieurs. D-04, P2, commence en S1 pour ne pas découvrir trop tard un stockage incompatible. L'indice aide à discuter l'ordre; il ne remplace ni dépendances, ni échéances, ni capacité des spécialistes. Le PO documente tout arbitrage.

## D.3 — Capacité, sprints et dépendances

### Capacité nette par sprint

| Rôle | Disponibilité brute | Événements/facilitation | Réserve d'imprévus | Capacité de tickets |
|---|---:|---:|---:|---:|
| DEV, deux personnes | 20 | 2 | 2 | 16 |
| QA | 6 | 1 | 1 | 4 |
| OPS | 6 | 1 | 1 | 4 |
| PO | 3 | 0,75 | 0,25 | 2 |
| DPO | 3 | 0,5 | 0,5 | 2 |
| RSSI | 3 | 0,5 | 0,5 | 2 |
| SM | 2 | 2 | 0 | 0 |
| **Total JP** | **43** | **7,75** | **5,25** | **30** |

Les heures de QA/OPS comprennent les synchronisations quotidiennes. La réserve n'est pas déjà remplie de tickets. Des JP inutilisés chez les développeurs ne remplacent pas un avis DPO ou une recette QA. Les tâches sont décomposées au planning et réparties entre les deux développeurs avec au plus 8 JP de tickets chacun.

### Immédiat — distinct des sprints

INC-01 et SAFE-01 mobilisent initialement DEV 1,5; QA 0,5; OPS 1; PO 0,5; DPO 0,5; RSSI 1 JP, plus 0,25 JP de coordination SM, soit **5,25 JP**. Il s'agit d'une première mobilisation à déclencher dès l'alerte, non d'une durée maximale d'enquête. Les deux actions peuvent avancer en parallèle; le confinement n'attend pas la cause exacte.

**Jp0** désigne le démarrage du plan; **T0** garde le sens de B.3, prise de connaissance d'une violation. Les délais de notification suivent T0, y compris pendant un week-end, et non la fin de sprint. Le sous-traitant alerte le responsable dans les meilleurs délais; la règle de 72 heures vise, sous ses conditions, la notification du responsable à l'autorité [S3](annexes/sources-et-controles.md#s3). Ici, aucun incident réel n'est traité ni message envoyé.

### Prévision de trois sprints

Les semaines se comptent après la mobilisation initiale, sous réserve de disponibilités. Chaque sprint associe clarification, implémentation et tests; il ne s'agit pas de trois phases « analyse, code, recette ».

| Sprint et objectif unique | Contenu prévu | Résultat démontrable et condition |
|---|---|---|
| **S1 — Stabiliser un périmètre contrôlé et décider de ses usages**; semaines 1–2 | D-01, D-02, D-03, D-04, D-05, D-10, D-11 | Acquis rejoués, durcissement web démontré, traitement de l'héritage engagé, décisions et règles prêtes pour les parcours. D-02 doit précéder D-03/D-10; D-01 précède D-11. D-05 prépare son plan de traitement en début de sprint pour la cible de 7 jours de C.3, sans détruire les preuves d'incident |
| **S2 — Rendre les parcours et les droits contrôlables de bout en bout**; semaines 3–4 | D-06, D-07, D-08, D-09, D-12, D-13 | Information et choix, habilitations, messagerie décidée et règles de conservation vérifiés sur données fictives. D-08 précède D-09; D-02/D-03/D-10 doivent avoir livré les décisions nécessaires. D-12 prépare les accords : leur signature reste une dépendance extérieure |
| **S3 — Démontrer la reprise et préparer une décision de pilote**; semaines 5–6 | D-14, D-15, D-16, D-18, puis D-17 | Migration, restauration sans résurrection, exercice d'incident et contrôles durables démontrés; AIPD réévaluée. D-14 précède D-15; D-17 vient après les preuves et peut conclure au maintien du refus de lancement |

| Charge prévue JP | DEV /16 | QA /4 | OPS /4 | PO /2 | DPO /2 | RSSI /2 | Total /30 |
|---|---:|---:|---:|---:|---:|---:|---:|
| S1 | 12 | 3,25 | 3,5 | 2 | 2 | 2 | **24,75** |
| S2 | 15,5 | 4 | 1,5 | 2 | 2 | 1,75 | **26,75** |
| S3 | 11,5 | 4 | 4 | 1,75 | 2 | 2 | **25,25** |

Les additions par rôle et les dépendances figurent dans l'annexe de planning. Le chemin sensible est `D-02 → D-03 → D-08 → D-14 → D-15 → D-17`; une autre branche passe par `D-10 → D-13`. Les totaux ne prouvent pas à eux seuls un ordonnancement : au planning, réserver les revues des experts et découper les dépendances internes avant d'engager le sprint. En S3, D-17 exige notamment des preuves D-15/D-18 disponibles avant la revue finale.

La fin de S2 représente le point court terme d'environ 30 jours de C.1, **pas une ouverture automatique**. La cible structurelle reste avant généralisation et sous 90 jours à confirmer. Entre la fin de S3 et Jp90 : contrôler le maintien des mesures et replanifier les écarts; cette période n'est pas fictivement remplie de sprints chiffrés.

**Sensibilité :** si D-08 passe de 4 à 6 JP DEV et de 1 à 1,5 JP QA, S2 atteint 17,5/16 et 4,5/4. Il faut consommer explicitement une réserve disponible ou retirer/replanifier un ticket avec le PO, puis recalculer S3. Ni les tests ni la confidentialité ne servent de variable d'ajustement. Un contrat non signé ne se résout pas par l'ajout d'un développeur.

### Budget prévisionnel pour préparer E

Taux journaliers **purement hypothétiques**, non issus d'un devis : DEV 600 €, QA 500 €, OPS/PO/SM 650 €, DPO/RSSI 800 €. On budgète la capacité réservée, pas seulement les tickets; événements, réserves et créneaux encore non attribués sont donc déjà inclus.

`Un sprint = 20×600 + 6×500 + 6×650 + 3×650 + 2×650 + 3×800 + 3×800 = 26 950 €`.

Trois sprints : **80 850 €**; mobilisation immédiate : **3 487,50 €**; provision de recette/hébergement temporaire : **1 500 €**, à confirmer. Enveloppe : **85 837,50 € HT, soit environ 86 000 €**, sans ajouter une seconde réserve forfaitaire. Les 81,75 JP de tickets ne sont pas les 134,25 JP de capacité totale réservée. Le détail exact permet de vérifier les calculs, sans prétendre à cette précision sur les coûts réels.

Sont exclus : coûts déjà engagés en A–C, incident réel au-delà de la mobilisation initiale, expertise contentieuse/certification, prestations spécialisées supplémentaires, temps interne des clients/signataires, exploitation après S3 et TVA. Si ces besoins apparaissent, le sponsor arbitre un complément avant engagement. Cette enveloppe est un scénario de planification, pas une promesse de conformité achetable à prix fixe.

## D.4 — Definition of Done intégrant sécurité et conformité

Les **critères d'acceptation** sont propres à la story; la **Definition of Done (DoD)** est la règle commune de qualité [S4](annexes/sources-et-controles.md#s4). Pour ce projet, une story ne passe à « terminé » que si :

- ses critères sont démontrés sur la version identifiée; une hypothèse non vérifiée reste indiquée et n'est pas convertie en résultat;
- le code a une revue par une autre personne, les tests légitimes et négatifs pertinents passent, et `npm test`/`npm run lint` restent verts; une revue documentaire tient lieu de revue de code pour un ticket documentaire, sans tests fictifs;
- les preuves indiquent commit, scénario, environnement et résultat; les constats historiques ouvrent la baseline et les corrections leur propre version;
- les champs, destinataires, droits et règles de conservation touchés sont contrôlés; l'avis DPO requis par le périmètre a été recueilli, avec décision du responsable compétent si nécessaire;
- aucune donnée réelle, aucun jeton ni secret n'entre dans Git ou les pièces de recette; le risque de régression, les migrations et le retour arrière applicables sont vérifiés;
- C.2/C.3, le registre/AIPD impactés et le ticket sont cohérents; les limites hors périmètre restent visibles et attribuées.

Un test échoué, un critère manquant ou une réserve bloquante **dans le périmètre de la story** empêchent sa clôture. Un élément incomplet retourne au backlog avec travail restant; on ne compte pas « 90 % terminé ». Les incréments intermédiaires sont utilisables dans le périmètre fictif contrôlé, pas déclarés conformes pour des données réelles.

**DoD n'est pas décision de production.** Maintenir des champs distincts : « ticket terminé », « correctif intégré », « déployé dans tel environnement » et « risque résiduel réévalué ». D-17 prépare une décision; son dossier peut être achevé avec une conclusion de refus. Un pilote réel exige les conditions de C.3, les accords requis, l'environnement vérifié, les avis et une décision traçable du responsable; une consultation préalable est à examiner si un risque résiduel élevé demeure [S5](annexes/sources-et-controles.md#s5). L'export assureur n'est pas réactivé par ce jalon.

## D.5 — Cérémonies, suivi et risques du projet

### Fonctionnement proposé

| Rendez-vous | Participants et durée proposée | Sortie attendue |
|---|---|---|
| Sprint Planning | Équipe de réalisation, 1 h 30; experts invités sur points nécessaires | Objectif unique, sélection selon capacités réelles, tâches et créneaux de validation |
| Daily Scrum | DEV/QA/OPS, 15 min par jour ouvré | Plan de la journée, dépendances et obstacles; pas un compte rendu hiérarchique |
| Affinement du backlog | 1 h par sprint, PO et personnes concernées | Critères précisés, estimations actualisées, tickets scindés; activité continue, pas événement officiel supplémentaire |
| Sprint Review | Équipe et parties pertinentes, 1 h | Démonstration avec preuves, retours et adaptation du backlog, pas simple approbation d'un diaporama |
| Rétrospective | Équipe de réalisation, 45 min | Une amélioration concrète, responsable et contrôle au sprint suivant |
| Arbitrage sécurité/conformité | PO, RSSI, DPO et décideur concerné, 30 min par semaine si nécessaire | Décision écrite sur obstacle, dépendance ou changement de périmètre |

Les événements ordinaires des réalisateurs représentent environ 6 h 45 par sprint et sont couverts par leur ligne de capacité. Les experts à temps partiel participent à des créneaux ciblés; leurs avis sur les tickets sont chiffrés dans les tickets. L'urgence n'attend aucun rendez-vous.

Tableau proposé : **À clarifier → Prêt → En cours → En revue/recette → Terminé**, avec état « Bloqué » et motif/date visibles. « Prêt » exige sources, critères, charge, dépendances et interlocuteur identifiés; c'est une convention locale, pas une obligation Scrum. Limiter à deux implémentations et deux revues en parallèle. Une voie urgente P0 est autorisée; son temps réel consomme la réserve puis entraîne un arbitrage de périmètre.

### Indicateurs sans faux résultats

| Indicateur | Calcul/preuve et fréquence | Signal déclenchant une action |
|---|---|---|
| Conditions de lancement ouvertes | Nombre de conditions non satisfaites de RR-01 à RR-09 et MSG-01, avec justificatif; revue hebdomadaire | Une seule condition bloquante suffit à maintenir le refus; ne pas sommer des CVSS |
| Couverture des critères | Critères vérifiés / critères applicables des tickets proposés comme terminés; chaque recette | Moins de 100 % : ticket non terminé; le nombre brut de tests n'est pas une couverture |
| Délai de blocage | Temps depuis passage « Bloqué » et responsable de résolution; quotidien | Plus d'un jour ouvré : alerte PO/SM; incident : alerte immédiate |
| Capacité restante par métier | Charge restante réestimée / capacité encore disponible, sans additionner la réserve deux fois; quotidien | Dépassement : réestimer, utiliser réserve explicitement ou réduire le périmètre |
| Flux livré et réouvertures | Tickets réellement conformes à la DoD et tickets rouverts pour défaut; revue de sprint | Réouvertures répétées : revoir critères et tests en rétrospective |
| Coût prévisionnel à terminaison | Coût constaté + coût du travail restant + besoins hors hypothèses; hebdomadaire | Dépassement de l'enveloppe : arbitrage avant engagement |

Aucune vélocité, aucun taux de réussite futur ni burndown fictif n'est rempli. Les résultats de recette antérieurs restent ceux de la note de revue, pas ceux de ces sprints proposés.

### Risques du projet et réponses

| Risque de réalisation | Indice observable | Réponse et responsable |
|---|---|---|
| Décisions/contrats indisponibles | D-02/D-12 ou signature bloqués | PO obtient un interlocuteur et une date; sponsor arbitre. Garder fermé le périmètre non justifié; ne pas transformer un contrat manquant en validation DPO |
| Experts ou QA saturés | Charge dépassant la capacité de leur rôle | SM réserve les créneaux tôt; PO retire du travail ou demande une disponibilité supplémentaire chiffrée |
| Architecture réelle différente | D-04 révèle plusieurs instances, volumes ou contraintes non prévus | OPS/DEV livrent l'exploration et réestiment D-14/D-15; aucun engagement de migration tenu artificiellement |
| Incident en cours de sprint | Nouvelle alerte pertinente ou trace probante | RSSI active INC-01; PO réorganise le sprint; délais de B.3 préservés. Si l'objectif devient obsolète, le PO examine l'annulation du sprint |
| Effacement ou migration destructifs | Perte de relation, compte réattribué, données effacées réapparues | QA bloque la recette; OPS teste la restauration; DEV corrige sur copie fictive et conserve la preuve |
| Preuves fragiles ou récit IA non vérifié | Mauvais commit, lien relatif ambigu, affirmation sans test | Référent audit traite D-01; revue humaine des liens et sources; aucune erreur IA inventée pour l'annexe |
| Pression commerciale | Demande d'ouverture malgré un RR bloquant | Responsable compétent maintient le refus ou réduit explicitement le périmètre; un calendrier ne régularise pas un traitement |

**Décisions à soumettre :** réserver les compétences et l'enveloppe proposée; nommer les interlocuteurs/décideurs; choisir le périmètre après D-02; maintenir les fonctions non justifiées fermées; examiner les preuves à chaque revue. La rédaction de D n'exécute aucune de ces décisions.

---

Pour l'assemblage : ce fichier constitue le corps de D; le [backlog détaillé](annexes/backlog-detaille.md), les [données chiffrées](annexes/planning.json) et les [sources/contrôles](annexes/sources-et-controles.md) sont des annexes. La pagination réelle doit être vérifiée lors du PDF final; les 30 pages maximum concernent l'ensemble A–D hors annexes, pas D seule.
