# Annexe D — Backlog détaillé et traçabilité

Version 1.0 — 1er octobre 2026. À lire avec le [corps de D](../README.md). **Tous les tickets sont proposés, aucun n'est exécuté par la rédaction.** Les charges sont les hypothèses de [planning.json](planning.json); elles incluent les critères de l'abuser story, pas une seconde estimation. Le pilote coordonne le ticket; il ne se substitue pas au responsable du traitement pour les décisions qui lui appartiennent.

Sources du périmètre : [C.1](../../partie-c/01-plan-de-remediation.md), [C.2](../../partie-c/02-correctifs-et-preuves.md), [C.3](../../partie-c/03-risques-residuels.md), [A.2](../../partie-a/02-bases-legales-et-acteurs.md), [A.3](../../partie-a/03-aipd-questionnaires-sante.md), [B.3](../../partie-b/03-violation-et-notifications.md) et [MSG-01](../../00-synthese-et-statuts.md). Les scénarios d'abus ci-dessous sont des critères de conception, pas de nouvelles vulnérabilités prétendument démontrées.

## Réponse immédiate — pas un « sprint 0 »

### INC-01 — Qualifier immédiatement le signalement

E1; P0; 2,5 JP; pilote RSSI/référent incident; responsable des décisions : responsable du traitement selon A.2. Dépendance : aucune, à déclencher dès l'alerte. Origine : RR-09, B.2/B.3, scénarios S1–S6.

**User story :** en tant que responsable d'incident, je veux qualifier le signalement et préserver les éléments disponibles pour déclencher les bonnes mesures sans attendre une enquête exhaustive.

**Abuser story :** en tant qu'auteur d'une fuite, je profite de l'attente du prochain sprint ou du nettoyage des journaux pour prolonger l'exposition et rendre l'analyse plus difficile.

**Acceptation :** chronologie avec dates/fuseaux, faits et inconnues séparés; preuve protégée et accès tracés; T0 justifié s'il est déterminable; responsabilités d'alerte et décisions des articles 33/34 consignées; notification initiale et compléments préparés selon B.3 lorsque requis. Pas de copie de santé ni de secret dans Git. L'absence d'élément réel dans l'exercice n'est ni une cause identifiée ni une violation démontrée. Preuve attendue : fiche d'incident et exercice horodaté, ou traces réelles autorisées dans un environnement approprié. L'enveloppe ne promet pas la clôture de l'enquête.

### SAFE-01 — Maintenir le périmètre fictif et contenir une exposition éventuelle

E1; P0; 2,5 JP; pilote OPS, appui RSSI/DEV. Dépendance : aucune; parallèle à INC-01. Origine : RR-01/03/07, C.1.

**User story :** en tant qu'exploitant, je veux un périmètre explicitement autorisé afin d'éviter qu'un support pédagogique soit ouvert à des salariés réels.

**Abuser story :** en tant qu'utilisateur non autorisé, j'accède à une instance de démonstration accidentellement exposée et j'utilise ses fonctions de collecte ou d'export.

**Acceptation :** environnement, données et accès inventoriés; instance de démonstration isolée et jeu fictif confirmé; export maintenu fermé; si une instance réelle est découverte, décision immédiate de confinement coordonnée avec l'incident, sans effacer ses preuves. Vérifier l'inaccessibilité hors périmètre et le fonctionnement autorisé. Ne pas affirmer qu'une production inconnue a été arrêtée. Preuve : checklist d'environnement et essais d'accès. Le dispositif conservatoire est disponible avant les sprints, même si la décision métier santé reste ouverte.

## Sprint S1 — Stabiliser et décider

### D-01 — Revalider les acquis et figer les preuves

E1; P1; 2 JP; pilote QA. Dépendance : SAFE-01. Origine : C.2, note de fiabilisation; SEC-01 à SEC-05, PRIV-01 à PRIV-07; RR-02/03 pour le maintien des protections.

**User story :** en tant qu'auditeur, je veux rejouer les preuves et les tests sur les bonnes versions pour distinguer faille initiale et correction intégrée.

**Abuser story :** en tant que lecteur trompé par une étiquette « confirmé », j'accepte une démonstration qui utilise le mauvais commit ou masque une erreur.

**Acceptation :** baseline et candidat identifiés par SHA; reproduction historique et tests corrigés séparés; résultats négatifs effectivement détectés; anciens liens de A/B normalisés vers le commit initial et lignes pertinentes; résultats expurgés conservés avec environnement. Une erreur d'outillage devient un écart, pas un résultat vert inventé. Preuve : sorties de recette et index de liens. Cette story n'est pas un nouveau correctif de chaque faille de C.2.

### D-02 — Décider des finalités et du périmètre licite

E2; P1; 2,25 JP; pilote PO, avis DPO; décideur : responsable compétent. Pas de dépendance interne. Origine : RT-02/05, NC-02/03, RR-01/03, A.2.

**User story :** en tant que responsable du traitement, je veux décider quels usages sont justifiés afin de ne développer que les parcours autorisés.

**Abuser story :** en tant que décideur pressé, je traite le consentement marketing ou le contrat B2B comme une permission générale de traiter la santé.

**Acceptation :** matrice finalité/données/destinataires/rôle/base article 6/exception article 9 avec pièces et inconnues; décision motivée sur le questionnaire : autorisé sous conditions satisfaites, retiré, ou maintenu fermé; refus sans conséquence défavorable examiné si consentement retenu; export assureur toujours suspendu dans cet horizon. Preuve : note décisionnelle et avis attribué au bon rôle. Un dossier incomplet peut conduire à une décision de maintien fermé, jamais à une autorisation présumée. Les contraintes extérieures restent enregistrées.

### D-03 — Définir le provisionnement et la règle MSG-01

E3; P1; 3 JP; pilote PO/responsable métier des habilitations. Dépendance : D-02. Origine : PRIV-01/02/03, NC-05, RR-02 et MSG-01.

**User story :** en tant que responsable métier, je veux préciser qui attribue et révoque chaque habilitation, afin que les développeurs ne déduisent pas les droits d'un champ déclaré.

**Abuser story :** en tant que salarié malveillant, j'utilise une entreprise ou une mission de coaching non vérifiée pour contacter ou consulter un tiers.

**Acceptation :** matrice rôle/objet/entreprise/affectation; source d'autorité, approbateur, justificatif, révocation et transfert de périmètre définis; rôle de l'administrateur explicitement délimité. MSG-01 tranche si les messages libres sont voulus; sinon définit les relations autorisées, exceptions et effets de la révocation. Preuve : décision métier relue par RSSI/DPO dans leur périmètre et exemples autorisé/interdit. Aucune restriction de messagerie n'est inventée avant cette décision.

### D-04 — Lever les inconnues de stockage et reprise

E4; P2; 3,75 JP; pilote OPS/DEV. Pas de dépendance interne. Origine : NC-09, RR-05/06, AIPD R3/M4.

**User story :** en tant qu'exploitant, je veux vérifier les contraintes d'hébergement et de reprise avant de m'engager sur une migration.

**Abuser story :** en tant qu'opérateur négligent, je choisis un stockage inadapté au nombre d'instances et je promets une restauration sans l'avoir éprouvée.

**Acceptation :** nombre d'instances, volumes et contraintes collectés ou déclarés inconnus; décision d'architecture justifiée; prototype transactionnel isolé; objectifs chiffrés de perte de données admissible et de délai de reprise proposés puis soumis au responsable; étapes de migration et retour arrière évaluées. Les critères de succès D-14/D-15 reprennent ces valeurs, pas des durées inventées comme légales. Preuve : note d'exploration et petit essai reproductible. Si les hypothèses changent, livrer l'analyse et une réestimation, pas une fausse migration terminée.

### D-05 — Traiter les authentifiants et journaux hérités

E1; P1; 5,75 JP; pilote RSSI/OPS. Dépendance : INC-01 pour les consignes de préservation, **pas sa clôture complète**. Origine : SEC-04/05, NC-06/07, RR-04.

**User story :** en tant qu'exploitant, je veux traiter les anciens mots de passe et journaux qui ne sont pas réparés par le nouveau code.

**Abuser story :** en tant qu'attaquant ayant obtenu une ancienne copie, je continue à exploiter des secrets qui n'ont jamais été renouvelés.

**Acceptation :** inventaire des formats hérités et copies accessibles; plan de traitement préparé au début de S1, pour la cible sous 7 jours de C.3; renouvellement contrôlé après vérification appropriée d'identité, sans prétendre reconstruire un mot de passe depuis son hash; révocation des accès concernés; conservation des traces utiles, accès restreints et purge selon décision documentée. Preuve : fixture héritée sans reconnexion, traitement vérifié et rapport sans secrets. Les copies détenues par un tiers ne sont pas présentées comme effacées.

### D-10 — Arrêter les règles de conservation et les droits

E4; P1; 2,25 JP; pilote responsable des droits/PO, avis DPO. Dépendance : D-02. Origine : RT-01 à RT-07, NC-08/09, RR-05/06.

**User story :** en tant que salarié, je veux connaître le sort de mes informations et pouvoir exercer les droits applicables.

**Abuser story :** en tant qu'organisation négligente, je garde toute information « au cas où » ou j'efface une preuve indispensable sans justification.

**Acceptation :** pour chaque catégorie, finalité, événement de départ, durée ou critère, base active/archive/sauvegarde, accès et règle d'exception; procédure de demande avec identité vérifiée de manière proportionnée, décision motivée et délai applicable; interlocuteur et responsabilités documentés. Preuve : tableau approuvé ou décision de maintien fermé pour les éléments non résolus. D-13 ne programme aucune durée légale forfaitaire non justifiée. L'avis DPO ne remplace pas la décision du responsable.

### D-11 — Durcir le périmètre web sans régression

E1; P1; 5,75 JP; pilote DEV, recette RSSI/QA. Dépendance : D-01. Origine : RR-07, réserves B.1/C.1.

**User story :** en tant qu'utilisateur autorisé, je veux me connecter et utiliser le service sans exposition évitable de mon accès.

**Abuser story :** en tant qu'attaquant, je multiplie les tentatives ou exploite un jeton exposé par un parcours web mal configuré.

**Acceptation :** origines nécessaires et modèle de session décidés à partir des menaces; limitation des tentatives mesurée avec seuils configurables et reprise légitime; contrôle des secrets dans URL/journaux; tests des origines autorisées/interdites et des parcours valides. CORS n'est pas présenté comme un contrôle d'autorisation du serveur. Un changement éventuel vers des cookies traite aussi le risque CSRF et ne dégrade pas la révocation. Preuve : note de choix, configuration et tests ciblés. Aucune architecture navigateur n'est imposée par cette seule fiche.

## Sprint S2 — Parcours et droits

### D-06 — Encadrer le questionnaire selon la décision santé

E2; P1; 6,5 JP; pilote DEV/PO, avis DPO. Dépendance : D-02 et ses pièces nécessaires. Origine : RT-02, NC-02/03, RR-01, AIPD M3.

**User story :** en tant que salarié, je veux un questionnaire limité à une finalité expliquée et réellement autorisée.

**Abuser story :** en tant que service trop intrusif, je collecte des antécédents sans nécessité ou contourne un refus par un appel direct à l'API.

**Acceptation :** sans décision favorable étayée, interface et API de collecte restent fermées ou sont retirées du périmètre; si traitement autorisé, schéma fermé et justification de chaque champ; conditions de l'article 9 et éventuel consentement explicite respectées; refus/retrait effectifs selon la base retenue, sans pénalité professionnelle; tests directs de l'API, pas seulement d'une case d'interface. Preuve : parcours accepté/refusé/retrait et décision source. Le budget couvre une mise en œuvre limitée sur le support; un modèle métier différent entraîne une réestimation.

### D-07 — Informer et respecter les choix marketing/tiers

E2; P1; 3,75 JP; pilote PO/DEV, avis DPO. Dépendance : D-02. Origine : NC-01/03, PRIV-07, RR-01/08.

**User story :** en tant qu'utilisateur, je veux comprendre les usages et retrouver mon dernier choix sans être inscrit de force à une campagne.

**Abuser story :** en tant que destinataire de données, j'utilise une ancienne valeur forcée à vrai pour ignorer un retrait.

**Acceptation :** notice complète, accessible avant la collecte, adaptée au compte et aux usages effectivement décidés; choix facultatifs distincts et information versionnée associée à la preuve; retrait et changement de compte testés; anciens indicateurs invalidés non réutilisés. Aucun marketing ou transfert réel n'est activé dans ce périmètre. Si un système aval existe réellement, son contrat d'interface doit honorer le choix courant et le retrait avant activation; faute de preuve, activation bloquée. Preuve : notice, tests du parcours et état des usages aval. Une simple préférence enregistrée ne vaut pas licéité générale.

### D-08 — Implémenter les habilitations et leur révocation

E3; P1; 6,25 JP; pilote DEV, recette QA/RSSI. Dépendances : D-03, D-01. Origine : PRIV-01/02/03, NC-05, RR-02.

**User story :** en tant que responsable des habilitations, je veux attribuer et révoquer des droits sur la base d'un rattachement vérifié.

**Abuser story :** en tant que salarié, je m'autodéclare dans une autre entreprise ou je garde les droits d'une affectation révoquée.

**Acceptation :** aucun privilège issu de `company` autodéclaré; opération d'habilitation interdite à un acteur non autorisé; approbation et origine vérifiables; tests salarié/tiers, RH hors périmètre, coach sans mission; RH toujours sans questionnaires individuels; retrait ou transfert appliqué immédiatement à la prochaine requête même avec une session active. Le cas métier autorisé reste fonctionnel. Preuve : tests API et journal de changement sans santé. Un outil de provisionnement limité suffit; une refonte IAM complète n'est pas comprise dans cette charge.

### D-09 — Appliquer la règle de messagerie décidée

E3; P1; 3 JP; pilote DEV/PO. Dépendances : D-03 puis D-08 dans S2. Origine : RT-03, MSG-01, RR-02.

**User story :** en tant que salarié ou coach, je veux échanger selon les relations de service autorisées.

**Abuser story :** en tant qu'utilisateur indésirable, je contacte un salarié hors relation autorisée ou réutilise une ancienne relation révoquée.

**Acceptation :** règle MSG-01 transcrite et testée; si une relation est requise, refus sans relation, après révocation ou avec un destinataire supprimé; échange autorisé fonctionnel; lecture toujours limitée aux participants. Si l'envoi libre est explicitement retenu, justification et protections contre les abus validées et testées, sans inventer une isolation qui n'existe pas. Preuve : décision et tests correspondants. Aucune lecture globale de messages n'est prétendue démontrée par le défaut initial.

### D-12 — Documenter les prestataires et préparer les accords

E2; P1; 3 JP; pilote PO, appui DPO/OPS/RSSI. Dépendances : D-02/D-04. Origine : A.1/A.2, RR-01/03/08 et réserves d'hébergement de C.1.

**User story :** en tant que responsable du traitement, je veux connaître les intervenants et disposer des accords nécessaires avant de leur confier des données.

**Abuser story :** en tant qu'organisation pressée, je confonds un brouillon d'accord et un contrat signé, ou je conclus qu'aucun transfert n'existe parce que le code ne montre pas d'appel externe.

**Acceptation :** inventaire hébergement, pays, support, sauvegardes, sous-traitants et destinataires avec preuves ou inconnues explicites; qualification et accords préparés selon les rôles; clauses d'instructions, incidents, droits et fin de service; suivi des signatures et pièces manquantes. Preuve : dossier prêt pour décision et tableau des dépendances externes. La story de préparation peut être achevée; les signatures et garanties nécessaires restent des conditions indépendantes de D-17. L'assureur reste suspendu et les campagnes non activées.

### D-13 — Automatiser les durées et les demandes de droits

E4; P1; 4,25 JP; pilote DEV/OPS, critères métier validés en D-10. Dépendances : D-10/D-01. Origine : PRIV-05, NC-08/09, RR-06.

**User story :** en tant que salarié sortant, je veux que mes données et ma demande soient traitées selon les règles annoncées.

**Abuser story :** en tant qu'opérateur négligent, je lance une purge sans échéance définie ou je conserve les comptes supprimés historiques indéfiniment.

**Acceptation :** règles D-10 configurées; tests juste avant, à et après l'échéance avec horloge contrôlée; données actives nécessaires préservées; exceptions motivées; traitement des anciennes suppressions logiques; exécution répétée sans effet indésirable; identité et délais de demande suivis. Preuve : fixtures comparées et compte rendu de demande. Les tests d'effacement existants restent actifs. L'effacement des sauvegardes est traité en D-15; cette story ne le prétend pas réalisé.

## Sprint S3 — Reprise et décision

### D-14 — Migrer le stockage sans perdre les protections

E4; P2; 9,75 JP; pilote DEV/OPS. Dépendances : D-04/D-08/D-13. Origine : NC-09, RR-05/06, AIPD R3/M4.

**User story :** en tant qu'exploitant, je veux un stockage transactionnel adapté aux contraintes décidées, sans perdre les protections obtenues.

**Abuser story :** en tant qu'opérateur, je remplace le JSON en oubliant les habilitations, les suppressions ou l'invalidation des anciens choix.

**Acceptation :** migration d'une copie représentative fictive; conservation des relations, identifiants, choix et révocations; transactions testées avec interruption d'une opération; mêmes tests de confidentialité et de durée; comptes de service et permissions minimaux; retour arrière éprouvé sans ressusciter de droits révoqués. Preuve : rapport comparatif avant/après et test de reprise de migration. La charge suppose l'architecture limitée validée en D-04; besoins multi-instances ou contraintes nouvelles réouvrent le chiffrage.

### D-15 — Restaurer sans réactiver des données effacées

E4; P2; 5,25 JP; pilote OPS, recette QA. Dépendances : D-14/D-13/D-10. Origine : RR-05/06, AIPD R3/R4.

**User story :** en tant que salarié, je veux retrouver un service fonctionnel après incident sans que mes données effacées redeviennent accessibles.

**Abuser story :** en tant qu'exploitant, je restaure une ancienne copie et réactive silencieusement un compte ou un consentement supprimé.

**Acceptation :** sauvegarde protégée et restauration dans un environnement isolé; délai et perte de données mesurés contre les objectifs chiffrés D-04; règles d'effacement/retrait/révocation réappliquées avant ouverture des accès; copie expirée traitée selon D-10; exercice échoué bloque la recette. Preuve : chronologie, mesures et vérification des comptes/données sentinelles sans contenu réel. Une politique de sauvegarde écrite seule ne clôt pas RR-05/06.

### D-16 — Exercer la réponse aux incidents

E1; P2; 3 JP; pilote RSSI avec PO/DPO/OPS. Dépendances : INC-01/D-05. Origine : RR-09, B.3.

**User story :** en tant que responsable d'incident, je veux une chaîne d'alerte éprouvée pour ne pas découvrir les responsabilités pendant une crise.

**Abuser story :** en tant qu'auteur d'une fuite, je profite d'une alerte ignorée ou d'une notification reportée jusqu'au bilan technique final.

**Acceptation :** exercice sur table à scénario fictif; alerte, T0 ou inconnue justifiée, destinataire responsable, décisions 33/34 et compléments simulés; acteurs joignables ou suppléance identifiée; temps mesurés et écarts transformés en actions. Aucun véritable message aux personnes/CNIL n'est envoyé pendant la recette. Preuve : compte rendu et plan d'amélioration. Ce travail préventif de S3 ne retarde jamais le traitement immédiat du signalement en INC-01.

### D-18 — Rendre les contrôles durables et supervisés

E3; P2; 4 JP; pilote OPS/RSSI, concours PO/DPO. Dépendances : D-08/D-11. Origine : RR-02/07/08, C.1 structurel.

**User story :** en tant que responsable du service, je veux des contrôles reproductibles et attribués pour éviter le retour des écarts après l'audit.

**Abuser story :** en tant qu'utilisateur ayant quitté une mission, je conserve des droits parce qu'aucune revue n'est organisée et qu'aucune alerte n'est traitée.

**Acceptation :** revue des habilitations et contrôles de retrait définis, avec fréquence et responsable; exercice d'une revue sur comptes fictifs; événements d'accès/refus/administration utiles sans santé ni secrets; alerte sentinelle reçue et attribuée; procédure de mise à jour des tests et des dépendances. Preuve : export expurgé de revue, alerte et instruction opératoire. Les seuils et durées sont documentés et reliés aux choix validés, pas présentés comme des exigences légales universelles.

### D-17 — Réévaluer l'AIPD et préparer la décision de pilote

E2; P1; 3,25 JP; pilote PO pour le dossier, décision du responsable compétent; avis DPO/RSSI. Dépendances : D-06/D-07/D-09/D-12/D-15/D-16/D-18 et leurs antécédents. Origine : A.3, RR-01 à RR-09, MSG-01.

**User story :** en tant que responsable du traitement, je veux une décision de pilote fondée sur les preuves et les limites réellement restantes.

**Abuser story :** en tant que décideur pressé, je transforme des tests verts ou un ticket documentaire fermé en autorisation générale de collecter la santé.

**Acceptation :** chaque RR relié à une preuve, un statut, un rôle et une échéance; AIPD actualisée sans reprendre les cibles conditionnelles comme des mesures; avis requis et éventuels désaccords conservés; contrats/garanties et environnement vérifiés pour les usages retenus; décision explicite de pilote restreint ou de maintien fermé. Si consultation article 36 nécessaire, elle précède l'ouverture. Preuve : dossier décisionnel, dont une conclusion de refus est recevable. La fin du sprint n'impose aucune acceptation et n'autorise pas l'export assureur.

## Couverture des risques et dépendances externes

| Source ouverte de C.3/revue | Tickets opérationnels, hors simple décision finale D-17 |
|---|---|
| RR-01 — santé/information | SAFE-01, D-02, D-06, D-07, D-12 |
| RR-02 — habilitations | D-01, D-03, D-08, D-09, D-18 |
| RR-03 — assureur | SAFE-01, D-01, D-02, D-12; suspension maintenue, pas de réouverture prévue |
| RR-04 — historique | D-05, avec préservation décidée en INC-01 |
| RR-05 — stockage/reprise | D-04, D-10, D-14, D-15 |
| RR-06 — conservation/effacement | D-04, D-10, D-13, D-14, D-15 |
| RR-07 — surface web | SAFE-01, D-11, D-18 |
| RR-08 — usages marketing/tiers | D-07, D-12, D-18; activation non incluse |
| RR-09 — incident | INC-01 immédiatement; D-16 ensuite |
| MSG-01 — règle de messagerie | D-03 puis D-09 |

**Dépendances extérieures à rendre visibles dans le tableau projet :** disponibilité du responsable/client et des signataires; décisions de finalité/données; preuves d'hébergement et d'accès; signatures et garanties requises; éléments d'incident; avis et consultation éventuelle. Une charge de rédaction peut être consommée sans qu'une dépendance extérieure soit levée. Ces attentes ont un propriétaire, une date d'escalade et un effet sur le jalon; elles ne sont pas supposées durer zéro jour.

**Hors engagement de ces trois sprints :** réouverture de l'assureur, campagne réelle, transfert effectif à de nouveaux tiers, suivi sportif non implémenté, certification ou changement d'architecture non prévu. Toute demande est requalifiée, estimée et arbitrée; la réserver pour « plus tard » ne vaut pas acceptation du risque.
