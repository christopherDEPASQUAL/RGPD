# Annexe D — Sources, hypothèses et contrôles

Version 1.0 — 1er octobre 2026. Cette annexe distingue ce qui vient du projet, des sources officielles consultées et de la proposition de planification. Elle complète la transparence IA; elle ne remplace pas l'annexe finale exigée par l'énoncé.

## 1. Ce qui provient du dépôt

Instantané de référence : `1a80376bf249dabdbc8782388fd8d94bfcafe4fe`, avant ajout de D.

| Source immuable | Utilisation dans D |
|---|---|
| [Énoncé, partie D, page 2](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/enonce.pdf) | Backlog/epics/stories/abuser stories, estimations, sprints, DoD, rôles, cérémonies, indicateurs et risques du projet |
| [Plan C.1](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/partie-c/01-plan-de-remediation.md) | Horizons immédiat, court terme et structurel; maintien de la suspension et conditions de passage |
| [Correctifs C.2](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/partie-c/02-correctifs-et-preuves.md) | Acquis à maintenir, sans les reprogrammer comme des corrections neuves |
| [Risques résiduels C.3](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/partie-c/03-risques-residuels.md) | Couverture complète de RR-01 à RR-09 et maintien des limites de production |
| [Synthèse de revue](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/00-synthese-et-statuts.md) | MSG-01; distinction correction technique/décision organisationnelle |
| [A.2](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/partie-a/02-bases-legales-et-acteurs.md), [A.3](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/partie-a/03-aipd-questionnaires-sante.md) et [B.3](https://github.com/christopherDEPASQUAL/RGPD/blob/1a80376bf249dabdbc8782388fd8d94bfcafe4fe/support/docs/dossier/partie-b/03-violation-et-notifications.md) | Acteurs sous hypothèses, nécessité d'une décision santé, AIPD et traitement de l'incident |

Les contrats, l'hébergement, les données d'incident et les validations manquants ne sont pas complétés par invention. Les données fictives ne servent pas à dimensionner une production réelle.

## 2. Recherche externe — sources primaires

Sources consultées le 1er octobre 2026. Les liens ci-dessous justifient la méthode et les limites de responsabilité, **pas les durées ou coûts choisis**.

<a id="s1"></a>
### S1 — Scrum Guide, édition novembre 2020

Ken Schwaber et Jeff Sutherland, [version HTML officielle](https://scrumguides.org/scrum-guide.html). Sections utilisées : Scrum Team, Product Owner, Developers, Scrum Events, Product Backlog et Sprint Backlog. Appui sur les responsabilités, l'inspection/adaptation et l'objectif de sprint. Les trois sprints, l'équipe, les JP, l'indice de priorité et les limites de travail en cours sont des choix propres au dossier, non des obligations du guide. Le guide ne fournit pas une vélocité de WellWork.

<a id="s2"></a>
### S2 — CNIL, rôle et indépendance du DPO

[Devenir délégué à la protection des données](https://www.cnil.fr/fr/le-delegue-la-protection-des-donnees-dpo/devenir-delegue-la-protection-des-donnees) et [identifier/gérer les conflits d'intérêts](https://www.cnil.fr/fr/dpo-identifier-gerer-conflits-interets). Fondement de la séparation entre conseil/contrôle du DPO et décision du responsable. D ne transfère pas la responsabilité de conformité au DPO et ne démontre pas que WellWork est obligée d'en désigner un.

<a id="s3"></a>
### S3 — CNIL, gestion des violations

[Notifier une violation](https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles), [règles à suivre](https://www.cnil.fr/fr/violations-de-donnees-personnelles-les-regles-suivre) et articles 33/34 dans le [chapitre IV du RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4). Appui sur le traitement sans retard, les rôles et les notifications initiales/complémentaires. Le repère de planification Jp0 n'est pas le T0 de prise de connaissance de B.3; aucun calendrier agile ne remplace ces obligations.

<a id="s4"></a>
### S4 — Scrum.org, Definition of Done

[What is a Definition of Done?](https://www.scrum.org/resources/what-definition-done). Appui sur la DoD comme niveau commun de qualité de l'incrément, distinct des critères propres à un ticket. Les contrôles de code, de données, de preuves et de décision ajoutés dans D sont adaptés au périmètre WellWork. Un ticket documentaire terminé n'est pas présenté comme une application autorisée en production.

<a id="s5"></a>
### S5 — RGPD, AIPD et décision

[Chapitre IV, articles 24, 35, 36, 38 et 39](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4). Appui sur les obligations du responsable, l'avis du DPO, la réévaluation et la consultation préalable lorsque nécessaire. Les conditions juridiques restent celles analysées en A; D organise leur traitement sans réécrire leur conclusion.

## 3. Hypothèses assumées

Équipe et disponibilités; journée de 7 heures; sprints de 10 jours ouvrés; efforts et indices R/V; réserves; trois sprints; coûts journaliers; provision de 1 500 €; seuils d'alerte de pilotage : **hypothèses pédagogiques proposées**, sans devis ni historique d'équipe. Les coûts ne sont pas des prix de marché vérifiés. L'objectif reste un périmètre limité sur le support existant; une contrainte nouvelle déclenche la réestimation.

Une prévision totalisant moins que la capacité ne prouve pas que toutes les validations arriveront à temps. Exemple de séquencement à discuter en S3 : D-14 en jours ouvrés 1–5; D-16 en parallèle; D-18 en jours 4–7; D-15 après D-14, en jours 6–8; D-17 en jours 9–10 après les preuves. Les présences QA/OPS/DPO doivent être réservées dans ces fenêtres, et non uniformément supposées disponibles. Ce séquencement est une hypothèse, pas un calendrier approuvé. Si D-14 glisse, D-15 puis D-17 glissent; aucun feu vert n'est conservé artificiellement.

## 4. Contrôles effectués sur les valeurs de planification

Un recalcul indépendant par script Python standard, dans l'environnement de travail de l'assistant, a contrôlé la matrice de préparation utilisée pour les tableaux et `planning.json`. Il ne s'agit pas d'une nouvelle exécution des tests applicatifs ni d'un workflow GitHub Actions de D.

| Contrôle | Résultat calculé |
|---|---|
| Identifiants uniques et epics | 20 tickets distincts; 4 epics |
| Dépendances | Tous les identifiants résolus; aucun cycle; aucune dépendance programmée dans un sprint ultérieur |
| Sources couvertes hors D-17 | Chaque RR-01 à RR-09 et MSG-01 a au moins un ticket opérationnel, indépendamment de la décision finale |
| Décomposition de la capacité | Pour chaque rôle : brute = événements + réserve + capacité de tickets |
| Charges par sprint | S1 24,75; S2 26,75; S3 25,25 JP; aucune capacité nette de rôle dépassée dans le scénario nominal |
| Charge de tickets | 76,75 JP sur les sprints + 5 JP immédiats = 81,75 JP |
| Capacité totale réservée | 3 × 43 + 5 + 0,25 = 134,25 JP, incluant facilitation et réserves |
| Budget de capacité par sprint | 26 950 € avec les taux hypothétiques déclarés |
| Mobilisation initiale | 3 325 € de tickets + 162,50 € de coordination = 3 487,50 € |
| Enveloppe totale | 80 850 + 3 487,50 + 1 500 = 85 837,50 € HT |

Les critères des fiches sont reliés aux sources et aux limites de C.3. Le scénario de sensibilité de D-08 montre volontairement un dépassement à résoudre; il ne fait pas partie des totaux nominaux. Aucune somme de CVSS ni fausse vitesse historique ne sert à calculer le budget.

**Limites :** ces contrôles vérifient la cohérence arithmétique et les dépendances déclarées; ils ne valident ni la productivité réelle, ni la disponibilité des signataires, ni l'architecture inconnue, ni les futures preuves de sécurité/conformité. La pagination finale A–D n'est pas mesurée ici. Les sources existantes A–C, l'application, ses tests et son workflow ne sont pas modifiés pour produire D.

## 5. Complément de transparence IA

Demande principale de l'étudiant : rédiger la partie D sur une branche, en insistant sur la qualité et en autorisant la recherche. L'assistant de cette conversation a utilisé la connexion GitHub pour lire les parties existantes et écrire la branche, le Web pour les sources officielles, et un script de calcul pour les charges, dépendances et coûts.

Productions : structure et texte de D, fiches de backlog, hypothèses chiffrées et contrôles. À relire personnellement par l'étudiant : caractère réaliste de l'équipe, compromis de périmètre, hypothèses de charge et budget, explication des droits des acteurs et soutenabilité des sprints. L'étudiant doit pouvoir défendre ces choix à l'oral.

Ce complément **n'atteste pas** que l'étudiant a déjà réalisé cette relecture, participé à un atelier d'estimation, obtenu des avis ou exécuté les sprints. Il n'invente pas cinq nouvelles erreurs IA; l'annexe finale doit rester fondée sur des productions réellement rencontrées et vérifiées. Les décisions métier à prendre, notamment MSG-01 et la finalité santé, sont conservées comme telles.
