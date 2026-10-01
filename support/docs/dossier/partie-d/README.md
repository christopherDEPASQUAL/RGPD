# Partie D — Pilotage agile de la remédiation

Version 1.2 — 1er octobre 2026. **Plan proposé pour traiter les risques restants après les corrections de C.2.** L'équipe, les disponibilités et le budget ci-dessous sont des hypothèses de planification.

## Cadre, objectif et équipe proposée

**Objectif produit :** démontrer les accès, usages et droits nécessaires à une décision de pilote restreint. L'échéance commerciale ne justifie pas l'ouverture d'un traitement non autorisé.

Cette planification prolonge [C.1 — actions](../partie-c/01-plan-de-remediation.md), [C.2 — corrections existantes](../partie-c/02-correctifs-et-preuves.md), [C.3 — risques résiduels](../partie-c/03-risques-residuels.md) et la [synthèse de revue, dont MSG-01](../00-synthese-et-statuts.md). Les références `RR-*`, `NC-*`, `PRIV-*`, `SEC-*` et `RT-*` conservent leur sens dans A à C.

D-01 revalide les acquis, sans recompter les correctifs existants comme du travail neuf. Le plan traite les limites juridiques, d'habilitation et d'exploitation. Il exclut la réouverture de l'assureur, les campagnes, les nouveaux transferts et le suivi sportif non implémenté.

**Méthode :** trois sprints de deux semaines, avec revue et adaptation; incidents traités immédiatement. Le Product Owner ordonne le backlog, les réalisateurs réestiment le travail. Les responsabilités et événements suivent le Scrum Guide 2020 [S1](annexes/sources-et-controles.md#s1); durées, charges et limites de travail en cours sont nos hypothèses. Les quatre jours du devoir ne sont pas la durée d'exécution de ce plan.

| Rôle proposé | Contribution et responsabilité | Disponibilité par sprint de 10 jours ouvrés |
|---|---|---:|
| Deux développeurs full-stack — DEV | API, interface, migrations, tests et revues croisées; charge répartie entre les deux développeurs | 20 jours-personne |
| Référent qualité — QA | Scénarios adverses et légitimes, recette indépendante de l'auteur, conservation des preuves | 6 jours-personne |
| Ingénieur exploitation — OPS | Configuration, données héritées, restauration et supervision | 6 jours-personne |
| Product Owner — PO | Objectif produit, ordre des travaux, clarification des règles avec les clients et suivi des décisions | 3 jours-personne |
| Scrum Master — SM | Facilitation, résolution des obstacles et amélioration du fonctionnement | 2 jours-personne |
| DPO/conseil indépendant | Avis sur finalités, information, droits, AIPD et incident; contrôle et alerte | 3 jours-personne |
| RSSI/référent sécurité | Analyse des menaces, recette de sécurité et coordination technique d'incident | 3 jours-personne |

Six réalisateurs (PO, SM, deux DEV, QA, OPS), appuyés par deux experts distincts. Les temps partiels sont réservés au planning. QA/OPS interviennent pendant le sprint : la recette n'est pas une phase finale ni une simple auto-validation du développeur.

Le **responsable compétent selon A.2** décide des traitements et risques; ni le sponsor ni le titre de PO ne remplacent cette responsabilité. Le DPO conseille et contrôle, distinct des fonctions décisionnelles PO/RSSI [S2](annexes/sources-et-controles.md#s2). Sa présence proposée ne démontre pas une obligation de désignation.

Dimensionnement : application fournie, pilote limité, interlocuteurs client/exploitation identifiés, sans refonte générale. D-02/D-04 peuvent imposer un nouveau chiffrage face aux volumes, contrats ou à l'architecture inconnus. Les attentes de signataires ne sont pas du temps de développement disponible.

## D.1 — Backlog, epics et critères d'acceptation

Un **epic** regroupe un objectif. Une **user story** décrit le résultat attendu par un bénéficiaire. Son **abuser story** décrit un usage abusif à empêcher : ce n'est ni une attaque réelle constatée ni un second ticket à chiffrer. Les tests correspondants sont compris dans l'estimation de la story.

| Epic | Résultat recherché | Tickets |
|---|---|---|
| E1 — Contenir et prouver la sécurité | Incident traité à temps, acquis vérifiés et exposition web maîtrisée | INC-01, SAFE-01, D-01, D-05, D-11, D-16 |
| E2 — Justifier et expliquer les usages | Finalités, information et décisions traçables, sans réouverture implicite | D-02, D-06, D-07, D-12, D-17 |
| E3 — Maîtriser les habilitations | Attribution, usage et révocation des accès démontrés | D-03, D-08, D-09, D-18 |
| E4 — Maîtriser le cycle de vie des données | Conservation, effacement, stockage et reprise cohérents | D-04, D-10, D-13, D-14, D-15 |

### Exemple — D-08, habilitations

**User story :** en tant que responsable des habilitations, je veux attribuer et révoquer des accès vérifiés pour protéger les salariés sans bloquer les missions autorisées.

**Abuser story :** en tant que salarié malveillant, je déclare une autre entreprise ou réutilise une affectation révoquée pour lire la santé d'un tiers.

**Acceptation :** autodéclaration sans droit; attribution interdite aux acteurs non habilités; RH sans santé individuelle; coach limité aux affectations; révocation effective dès la requête suivante; cas autorisé fonctionnel et changement tracé sans santé. Preuves : tests API et procédure d'approbation. Origine : `PRIV-01/02/03`, `NC-05`, `RR-02`; 6,25 JP; D-03/D-01; S2.

Les **20 fiches complètes**, dont D-13 pour la conservation, sont dans le [backlog détaillé](annexes/backlog-detaille.md) : critères, pilotes, dépendances et sources.

## D.2 — Estimation et priorisation justifiées

### Estimation

Un jour-personne (JP) représente **7 heures de travail**, pas une journée de délai. Les charges incluent analyse, réalisation, tests, revue et documentation. Événements et réserves sont déduits séparément; les attentes de contrats ou d'informations sont des dépendances extérieures.

DEV/QA/OPS et les experts revoient les estimations avant sélection. Les tickets de confiance faible sont réestimés après découverte; D-04 explore notamment les contraintes du stockage avant de dimensionner la migration.

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

QA/OPS incluent les synchronisations quotidiennes; la réserve reste libre. Une disponibilité DEV ne remplace pas un avis DPO ou une recette QA. Au planning, répartir au plus 8 JP de tickets par développeur.

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

Chemin sensible : `D-02 → D-03 → D-08 → D-14 → D-15 → D-17`, avec une branche `D-10 → D-13`. Les totaux ne prouvent pas l'ordonnancement : réserver les experts et séquencer les dépendances internes. En S3, D-15/D-18 doivent notamment fournir leurs preuves avant D-17. Le détail est en annexe.

La fin de S2 représente le point court terme d'environ 30 jours de C.1, **pas une ouverture automatique**. La cible structurelle reste avant généralisation et sous 90 jours à confirmer. Entre la fin de S3 et Jp90 : contrôler le maintien des mesures et replanifier les écarts; cette période n'est pas fictivement remplie de sprints chiffrés.

**Sensibilité :** si D-08 passe de 4 à 6 JP DEV et de 1 à 1,5 JP QA, S2 atteint 17,5/16 et 4,5/4. Il faut consommer explicitement une réserve disponible ou retirer/replanifier un ticket avec le PO, puis recalculer S3. Ni les tests ni la confidentialité ne servent de variable d'ajustement. Un contrat non signé ne se résout pas par l'ajout d'un développeur.

### Budget prévisionnel pour préparer E

Taux journaliers **purement hypothétiques**, non issus d'un devis : DEV 600 €, QA 500 €, OPS/PO/SM 650 €, DPO/RSSI 800 €. On budgète la capacité réservée, pas seulement les tickets; événements, réserves et créneaux encore non attribués sont donc déjà inclus.

`Un sprint = 20×600 + 6×500 + 6×650 + 3×650 + 2×650 + 3×800 + 3×800 = 26 950 €`.

Trois sprints : **80 850 €**; mobilisation immédiate : **3 487,50 €**; provision de recette/hébergement temporaire : **1 500 €**, à confirmer. Enveloppe : **85 837,50 € HT, soit environ 86 000 €**, sans ajouter une seconde réserve forfaitaire. Les 81,75 JP de tickets ne sont pas les 134,25 JP de capacité totale réservée. Le détail exact permet de vérifier les calculs, sans prétendre à cette précision sur les coûts réels.

Exclusions : coûts passés A–C, incident au-delà de la mobilisation initiale, contentieux/certification, prestations spécialisées, temps des clients/signataires, exploitation après S3 et TVA. Tout besoin supplémentaire nécessite un arbitrage avant engagement; le budget n'est pas une promesse de conformité.

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

### Indicateurs de suivi

| Indicateur | Calcul/preuve et fréquence | Signal déclenchant une action |
|---|---|---|
| Conditions de lancement ouvertes | Nombre de conditions non satisfaites de RR-01 à RR-09 et MSG-01, avec justificatif; revue hebdomadaire | Une seule condition bloquante suffit à maintenir le refus; ne pas sommer des CVSS |
| Couverture des critères | Critères vérifiés / critères applicables des tickets proposés comme terminés; chaque recette | Moins de 100 % : ticket non terminé; le nombre brut de tests n'est pas une couverture |
| Délai de blocage | Temps depuis passage « Bloqué » et responsable de résolution; quotidien | Plus d'un jour ouvré : alerte PO/SM; incident : alerte immédiate |
| Capacité restante par métier | Charge restante réestimée / capacité encore disponible, sans additionner la réserve deux fois; quotidien | Dépassement : réestimer, utiliser réserve explicitement ou réduire le périmètre |
| Flux livré et réouvertures | Tickets réellement conformes à la DoD et tickets rouverts pour défaut; revue de sprint | Réouvertures répétées : revoir critères et tests en rétrospective |
| Coût prévisionnel à terminaison | Coût constaté + coût du travail restant + besoins hors hypothèses; hebdomadaire | Dépassement de l'enveloppe : arbitrage avant engagement |

Ces indicateurs seront renseignés pendant l'exécution du plan.

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

**Décisions à soumettre :** réserver les compétences et l'enveloppe proposée; nommer les interlocuteurs/décideurs; choisir le périmètre après D-02; maintenir les fonctions non justifiées fermées; examiner les preuves à chaque revue.

---

Pour l'assemblage : ce fichier constitue le corps de D; le [backlog détaillé](annexes/backlog-detaille.md), les [données chiffrées](annexes/planning.json) et les [sources/contrôles](annexes/sources-et-controles.md) sont des annexes. La pagination réelle doit être vérifiée lors du PDF final; les 30 pages maximum concernent l'ensemble A–D hors annexes, pas D seule.
