# Synthèse du dossier — état technique et décisions restantes

1er octobre 2026. Les accès, sessions et sorties de l'API ont été corrigés; l'export assureur reste suspendu. Les principaux points à résoudre concernent les usages des données de santé, l'attribution des habilitations et le cycle de vie des données. Cette synthèse relie les constats, les corrections et le plan de travail.

## Lecture des statuts

Les parties A et B analysent la version initiale `e16cedc`. [C.2](partie-c/02-correctifs-et-preuves.md) relie les corrections à leurs commits et tests. [C.3](partie-c/03-risques-residuels.md) présente les risques résiduels; [D](partie-d/README.md) planifie leur traitement en trois sprints proposés. Les recettes détaillées sont conservées dans la [note de fiabilisation](../audit/preuves/04-fiabilisation-et-recette.md).

| Ensemble | Correction technique déjà décrite en C.2 | Limite restant ouverte | Suite du travail |
|---|---|---|---|
| SEC-01 et SEC-02 / NC-05 | Contrôles techniques et champs de profil encadrés | Maintien de la politique d'accès lors des évolutions | Conserver les tests négatifs et la revue de chaque nouvelle route |
| SEC-03 / NC-06 | Sessions renforcées et fermeture des accès | Processus réel de gestion des identités et habilitations | RR-02, revue avant pilote |
| SEC-04 / NC-07 | Journaux actuels minimisés | Journaux et copies historiques non traités par le nouveau code | RR-04; les nouveaux tests couvrent aussi les connexions réussies et échouées |
| SEC-05 / NC-06 | Nouveau stockage des mots de passe et migration à la connexion | Comptes hérités qui ne se reconnectent pas | RR-04; plan de renouvellement à définir |
| PRIV-06 / NC-04 | Réponses limitées aux champs prévus | Nouvelles routes à maintenir dans le même cadre | Les nouveaux tests couvrent les réponses réussies de connexion et de modification du profil |
| PRIV-01/02/03 / NC-05 | Contrôles par objet, périmètre vérifié et affectation | Attribution et révocation organisationnelles non démontrées | RR-02; aucune entreprise autodéclarée ne doit servir de preuve d'habilitation |
| PRIV-04 / NC-02/04/05 | Export suspendu | Fondements, finalité et destinataire non établis | RR-03; aucune réouverture dans cette revue |
| PRIV-05 / NC-08/09 | Effacement du graphe connu dans la base active | Copies, archives, sauvegardes et exceptions de conservation | RR-06; étendre la procédure aux copies et tester la restauration |
| PRIV-07 / NC-01 | Choix distincts, historique et retrait techniques | Information sur les usages et respect du choix par les destinataires | RR-08; compléter l'information et contrôler les usages en aval |
| NC-02/03, RT-02 | Aucun fondement juridique ni notice ajoutés par cette revue | Santé, information, nécessité et droits | RR-01, obstacle au traitement de données réelles |
| NC-09, AIPD R3/R4 | Quelques chemins techniques sont corrigés | Conservation et restauration non finalisées | RR-05/06; définir les règles, responsables et tests de purge/restauration |

Les références de commit de chaque correction restent dans [C.2](partie-c/02-correctifs-et-preuves.md). Les responsables et échéances proposés restent dans [C.3](partie-c/03-risques-residuels.md). Un test réussi n'efface pas ces réserves.

## Décision métier inscrite au backlog : messagerie

RT-03 et B.1 signalent déjà l'absence de contrôle d'une relation de coaching à l'envoi. Dans la version relue, le destinataire doit être un compte actif et la lecture reste limitée aux participants. Cela ne démontre pas une lecture globale de messages.

**Action proposée MSG-01 :** le responsable produit, avec le responsable des habilitations et le DPO/RSSI selon le besoin, doit décider si l'envoi libre entre comptes est voulu ou si une relation autorisée est requise. En cas de restriction, préciser les interlocuteurs, les périmètres et les effets d'une révocation, puis tester un échange autorisé et un échange interdit.

Cette action est reprise dans le [backlog détaillé de D](partie-d/annexes/backlog-detaille.md) : D-03 prépare la décision métier et D-09 applique puis teste la règle retenue. Leur inscription au backlog ne clôt pas MSG-01.

## Planification D disponible, décisions encore ouvertes

Les 20 tickets de D couvrent les risques RR-01 à RR-09 et MSG-01, avec sources, pilotes proposés, critères vérifiables, dépendances, estimations et affectation à la réponse immédiate ou aux trois sprints. Les capacités et le budget sont des hypothèses explicites, pas des engagements obtenus. Les durées de conservation, contrats et validations réelles restent à établir selon ce plan.

Le [dossier PDF](../rendu/Dossier_remediation_WellWork.pdf) rassemble A–D et les annexes, dont la [transparence IA](annexes/01-transparence-ia.md). La [présentation E](../presentation/partie-e.pdf) comporte cinq diapositives accompagnées de [notes orales](../presentation/notes-orales.md). La pagination et les contrôles de rendu sont indiqués dans le [guide du PDF](../rendu/README.md).
