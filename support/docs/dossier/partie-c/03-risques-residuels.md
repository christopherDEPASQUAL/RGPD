# Partie C.3 — Risques résiduels et décision

- **Version :** 1.1 — 1er octobre 2026
- **Statut général :** aucune approbation organisationnelle réelle n'est fournie ou inventée. Les statuts sont des recommandations d'audit.

## Règles de statut

- **Non accepté :** obstacle à la mise en production réelle tant que les conditions ne sont pas satisfaites.
- **Proposé à acceptation :** décision encore attendue du rôle indiqué, après production des preuves demandées.
- **Hypothèse pédagogique uniquement :** tolérance limitée au support local, avec données fictives et sans destinataire réel; elle ne vaut jamais acceptation pour une production.

## Registre des risques résiduels

| Risque résiduel | Constat concerné | Mesures restantes et justification | Statut recommandé | Rôle responsable de la décision | Conditions et échéance de réexamen |
|---|---|---|---|---|---|
| **RR-01 — Collecte de santé sans licéité ni information démontrées** | NC-02/03; AIPD R1; RT-02 | Établir les articles 6 et 9, la finalité, le caractère facultatif, la nécessité de chaque question, les destinataires, une notice article 13 et les droits. Les contrôles d'accès ne régularisent pas la collecte | **Non accepté — obstacle à la production** | Responsable réel du traitement, conseillé par le DPO; le développeur ne peut accepter ce risque | Avant tout pilote ou toute donnée réelle; réexamen à chaque changement de finalité, question ou destinataire |
| **RR-02 — Provisionnement des entreprises, RH et coachs non défini** | `PRIV-01/02/03`, NC-05, AIPD R1 | Mettre en place une source d'autorité, une double vérification adaptée, la révocation et une piste d'audit. Le refus par défaut est codé, mais aucune procédure ne prouve qui renseigne `tenantId` ou les affectations | **Non accepté** pour une exploitation multi-entreprises | Responsable métier des habilitations + RSSI, sous responsabilité du responsable du traitement | Avant le premier rattachement réel; puis revue trimestrielle proposée et à chaque départ, mutation ou fin de mission |
| **RR-03 — Export ou usage assureur sans justification** | `PRIV-04`, NC-02/04/05, RT-05, AIPD R1 | Maintenir la suspension; identifier destinataire, données strictement nécessaires, finalité et fondements des articles 6/9. Définir un nouveau test d'autorisation et de minimisation si réouverture | **Non accepté** | Responsable du traitement; DPO/conseil; RSSI pour la recette | Avant toute réouverture, puis revue à chaque changement de destinataire ou contrat |
| **RR-04 — Anciens secrets et journaux déjà créés** | `SEC-04/05`, NC-06/07 | Renouveler de façon contrôlée les comptes SHA-256 non migrés, restreindre l'accès aux logs historiques, préserver les preuves utiles puis appliquer la durée décidée. Le nouveau code ne répare pas les copies antérieures | **Non accepté** tant que le périmètre réel n'est pas qualifié | RSSI/exploitation, avec responsable incident et DPO selon le contenu | Inventaire avant production; plan de traitement proposé sous 7 jours après décision de poursuite; réexamen après clôture de l'enquête |
| **RR-05 — Stockage fichier, sauvegarde et restauration non robustes** | NC-09; AIPD R3; M4 | Stockage transactionnel, droits minimaux, chiffrement adapté, sauvegardes limitées et test de restauration. L'injection et les accès abusifs ont été corrigés, mais la panne et la reprise ne sont pas couvertes | **Proposé à acceptation dans l'hypothèse pédagogique uniquement**, jamais avec données réelles; aucune acceptation réelle constatée | Exploitation + RSSI; responsable du traitement pour le risque aux personnes | Tolérance seulement tant que données fictives et exécution locale; réexamen avant pilote et après tout incident de stockage |
| **RR-06 — Effacement incomplet hors base active** | `PRIV-05`, NC-08/09, AIPD R4 | Définir les exceptions de conservation, les délais, le sort des sauvegardes, journaux et preuves de retrait. Le commit supprime correctement le graphe connu du fichier actif, pas des systèmes externes inconnus | **Non accepté** pour une production | Responsable des droits + responsable du traitement, conseillé par le DPO | Procédure et essai de bout en bout avant pilote; réexamen annuel proposé et après toute demande échouée |
| **RR-07 — Surface web encore à durcir** | Réserves de B.1 : CORS ouvert, jeton dans `localStorage`, absence de limitation de débit visible | Autoriser seulement les origines nécessaires, choisir un stockage/session adapté au modèle de menace, limiter les tentatives et superviser sans secrets | **Non accepté** avant exposition Internet réelle | RSSI + responsable technique | Revue de configuration avant déploiement; test d'intrusion après changement d'authentification ou d'architecture |
| **RR-08 — Préférences sans information ni contrôle des usages aval** | `PRIV-07`, NC-01, RT-06 | Ajouter la notice correspondant aux campagnes et tiers réels; garantir que les systèmes aval lisent le dernier choix et honorent le retrait. L'historique technique ne prouve aucun usage aval conforme | **Non accepté** avant toute campagne ou transmission | Responsable marketing/tiers + responsable du traitement, conseillé par le DPO | Avant activation d'un canal ou destinataire; contrôle à chaque retrait et revue annuelle proposée |
| **RR-09 — Incident évoqué mais non qualifié** | B.2/B.3; scénarios S1–S6 | Préserver et recouper les éléments autorisés, déterminer les données, personnes, période et T0; décider les articles 33/34 à partir de faits. Les correctifs ne suppriment pas une copie déjà diffusée | **Non accepté comme risque clos**; investigation requise | Responsable incident + responsable du traitement, conseillé par le DPO | Qualification sans retard; si violation avec risque, échéance article 33 calculée depuis le T0 réel, non depuis cet audit |

## Réévaluation de l'AIPD

- **R1 — divulgation :** les contrôles objet/rôle/entreprise, la limitation des champs et la suspension de l'export réduisent les chemins démontrés. Le risque ne peut toutefois pas être accepté tant que l'habilitation réelle, la licéité santé et les destinataires ne sont pas validés.
- **R2 — altération :** le filtre exécutable est supprimé et le test négatif passe. Une recette sur l'environnement déployé et une surveillance restent nécessaires avant de retenir la cible conditionnelle d'A.3.
- **R3 — perte/indisponibilité :** la composante malveillante est réduite par la suppression de l'injection, le contrôle des privilèges et les sessions renforcées. La composante panne reste ouverte faute de stockage robuste et de test de restauration.
- **R4 — conservation subie :** l'accès et les données associées sont supprimés dans la base active de démonstration. La politique de conservation, les exceptions et les sauvegardes empêchent encore de déclarer le risque clos en production.

Les valeurs résiduelles cibles proposées en A.3 ne deviennent donc pas des mesures acquises. Une nouvelle cotation doit être faite avec les preuves de l'environnement réel.

## Décision proposée

**Réponse à la rubrique « constats résiduels acceptés » : aucune acceptation organisationnelle réelle n'est attestée.** RR-05 fait uniquement l'objet d'une proposition de tolérance pédagogique :

- **Périmètre et justification :** conserver temporairement le stockage JSON pour une démonstration locale isolée sur données fictives, afin de vérifier les corrections sans attendre une migration. Cela ne démontre pas la robustesse du stockage ni des sauvegardes; une perte du jeu de démonstration reste possible.
- **Décideur attendu :** responsable du traitement pour toute exploitation réelle, sur analyse exploitation/RSSI et avis DPO pour les risques aux personnes. Aucun accord de ces acteurs n'est fourni; l'audit ne le remplace pas.
- **Conditions et réexamen :** aucune donnée réelle ni exposition Internet; réexamen avant tout pilote, changement de périmètre ou après un incident de stockage. D-04, D-14 et D-15 prévoient l'étude, la migration et la preuve de restauration. L'acceptation réelle éventuelle devra être datée et attribuée au décideur compétent.

Cette proposition limitée à RR-05 ne vaut pas acceptation des autres risques du registre.

La branche peut servir à une recette pédagogique sur données fictives. Elle ne doit pas être présentée comme prête pour une mise en production de questionnaires de santé. La décision de passage appartient au responsable réel du traitement, après satisfaction des conditions de RR-01 à RR-09 et réévaluation de l'AIPD; aucune acceptation implicite n'est déduite du calendrier de l'exercice.
