# Partie C.1 — Plan de remédiation priorisé

- **Version :** 1.0 — 1er octobre 2026
- **Baseline auditée :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`
- **Branche de correction :** `remediation/rgpd-security`
- **Portée :** correctifs du support pédagogique et actions proposées. Ce document ne vaut ni recette de production, ni approbation juridique, ni décision d'acceptation d'un risque réel.

## Principes de décision

La priorité combine l'exposition technique démontrée en B, la sensibilité des questionnaires de santé et les non-conformités de A.4. Un correctif de code peut fermer un chemin d'attaque sans établir la licéité du traitement. Inversement, une politique écrite ne remplace pas les tests d'autorisation.

Les échéances ci-dessous sont des **jalons proposés**, à compter d'une décision réelle de poursuivre le service. « Avant production » signifie avant toute utilisation avec des personnes ou données réelles. Aucun délai n'est présenté comme déjà accepté par WellWork ou une entreprise cliente.

## Horizon immédiat — avant toute donnée réelle

| Action | Constats concernés | État dans cette branche | Pilote proposé | Critère de sortie |
|---|---|---|---|---|
| Supprimer l'exécution de filtres fournis par le client | `SEC-01`, NC-05, AIPD R2/R3 | Réalisé et testé | Développement + RSSI | Rejet des expressions exécutables; seuls les filtres déclaratifs autorisés sont traités |
| Bloquer l'auto-attribution de privilèges et appliquer le refus par défaut | `SEC-02`, `PRIV-01/02/03`, NC-05, AIPD R1 | Réalisé techniquement; processus d'habilitation restant | Développement + responsable métier | Aucun accès tiers sans périmètre vérifié; entreprise déclarée sans effet d'habilitation |
| Remplacer les sessions faibles et supprimer toute session du seed | `SEC-03`, NC-06 | Réalisé et testé | Développement + RSSI | Jetons aléatoires, expiration, révocation et refus des comptes supprimés |
| Séparer les trois corrections C4 | `SEC-04`, `SEC-05`, `PRIV-06`, NC-04/06/07 | Trois commits distincts réalisés et testés | Développement + RSSI | Secrets absents des logs et réponses; mots de passe nouveaux sous scrypt; transition SHA-256 testée |
| Suspendre l'export assureur | `PRIV-04`, NC-02/04/05, AIPD R1 | Réalisé dans un commit indépendant | Responsable du traitement + développement | Réponse sans donnée et aucune trace d'export créée; réouverture interdite sans décision documentée |
| Rendre l'effacement actif dans le stockage de démonstration | `PRIV-05`, NC-08, AIPD R4 | Réalisé et testé dans la base active | Responsable des droits + développement | Compte, sessions et données associées supprimés; reconnexion impossible |
| Invalider les faux consentements historiques et recueillir deux choix distincts | `PRIV-07`, NC-01 | Réalisé et testé | Produit + DPO/conseil | Valeurs historiques non reconnues comme accords; choix facultatifs et retraits historisés |
| Empêcher la collecte réelle de santé tant que les articles 6 et 9 et l'information ne sont pas établis | NC-02/03, AIPD R1 | **Non réalisé : obstacle à la production** | Responsable du traitement, conseillé par le DPO | Fondements documentés, notice article 13, nécessité des champs, destinataires, retrait/droits et AIPD validés |
| Qualifier le signalement de fuite et préserver les preuves | B.2/B.3, scénarios S1–S6, RR-09 | **À engager sans retard; aucune qualification réelle fournie dans l'exercice** | Responsable incident + responsable du traitement, conseillé par le DPO | Déterminer nature, périmètre et T0; si une violation avec risque est constatée, notifier dans les meilleurs délais et, si possible, sous 72 h, avec compléments ultérieurs ([CNIL](https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles)) |

Les correctifs techniques sont présents dans la branche; ils ne justifient pas à eux seuls l'ouverture du questionnaire à de vraies personnes. Tant que les conditions relatives à la santé, à l'information et aux habilitations ne sont pas satisfaites, le support doit rester limité à des données fictives.

## Court terme — avant pilote, cible proposée sous 30 jours

1. **Formaliser l'habilitation.** Définir qui crée, vérifie, modifie et révoque `tenantId`, les rôles RH et les affectations coach–salarié. Conserver une preuve d'origine et une piste d'audit. Tester les appartenances absentes, falsifiées, transférées et révoquées.
2. **Décider du traitement de santé.** Identifier le ou les responsables, la finalité exacte, les articles 6 et 9 applicables, le caractère réellement facultatif et les conséquences d'un refus. Si aucun fondement n'est démontré, retirer le questionnaire plutôt que recueillir une case générique.
3. **Informer au point de collecte.** Ajouter une notice complète et accessible pour le compte, le questionnaire et les préférences; distinguer information, consentement marketing et éventuel consentement explicite santé.
4. **Minimiser.** Définir un schéma fermé pour les réponses de santé et justifier chaque champ, notamment antécédents et traitements. Les RH restent exclus des questionnaires individuels.
5. **Traiter l'historique.** Organiser le renouvellement contrôlé des mots de passe SHA-256 qui ne se reconnectent pas, protéger ou purger les anciens journaux selon les besoins de preuve, et vérifier les anciennes copies/exportations.
6. **Définir les durées.** Arrêter des critères par finalité pour comptes, questionnaires, décisions de préférence, journaux, archives et sauvegardes; tester la purge et la restauration sans relancer le seed sur une base existante.

## Structurel — avant généralisation, cible proposée sous 90 jours puis en continu

- Remplacer le fichier JSON par un stockage transactionnel exploité avec comptes de service minimaux, chiffrement et sauvegardes testées; documenter l'hébergement et les transferts.
- Centraliser le cycle de vie des identités, rôles, entreprises clientes et missions de coaching; ajouter une revue périodique des habilitations et des journaux d'accès sans contenu sensible.
- Durcir l'exposition web : origines CORS autorisées, protection des jetons côté navigateur, limitation de débit, politique de secrets et supervision des anomalies.
- Encadrer contractuellement les responsables, sous-traitants, destinataires, instructions et demandes de droits; renseigner les coordonnées réelles et le DPO lorsqu'il est applicable.
- Mettre à jour l'AIPD avec les preuves de recette, l'avis des parties pertinentes et la décision motivée du responsable. Consulter préalablement l'autorité si un risque résiduel élevé demeure.
- Organiser une recette de sécurité récurrente : tests négatifs multi-rôles/multi-entreprises, migration sur copie temporaire, restauration, effacement, dépendances et revue après incident ou changement substantiel.

## Conditions de passage

Un passage vers un pilote réel exige simultanément : tests techniques verts; procédure d'habilitation démontrée; base juridique santé et exception de l'article 9 documentées; information accessible; durées et droits opérables; AIPD réévaluée; décision écrite du responsable réel. En leur absence, le statut demeure **non accepté** et non « accepté faute de temps ».
