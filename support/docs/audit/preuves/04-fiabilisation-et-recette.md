# Fiabilisation des preuves et recette de revue

Date : 1er octobre 2026. Branche : `review/fiabilisation-audit`. Point de départ : `7fbb8f942696bf161ac5e9ead628f1aa740fa00e`. Cette note complète les documents historiques sans réécrire les faits de leurs exécutions antérieures.

## Ce qui change dans la procédure

Les passages anciens de B.1 et C.2 décrivant un script qui copie le répertoire courant concernent le script antérieur à cette revue. Pour l'exécution depuis la branche de revue, **la procédure ci-dessous prévaut**. Le code historique du script reste conservé byte pour byte dans `scripts/audit/historical-harness.js`; il ne doit plus être lancé directement.

La commande publique reste :

```text
node scripts/audit/reproduce-findings.js
```

Le nouveau lanceur lit les objets Git du commit exact `e16cedcf0f8adb359621240366c8f0cbb251b8c9`, vérifie les empreintes de chaque fichier et construit une copie temporaire. Il refuse un historique absent, des entrées de fichiers non autorisées, un script historique modifié ou un lockfile incompatible. Il ne fait ni checkout, ni reset, ni modification de la base courante. Il réutilise les scénarios historiques existants, sans ajouter d'attaque ni contacter un système réel.

Les anciens libellés de statut ne sont plus tenus pour des preuves : les codes HTTP et les observations attendues déterminent les nouveaux statuts. Un résultat manquant ou négatif fait échouer la validation. La sortie contient le commit réellement audité, les empreintes des sources, le commit du lanceur, la présence éventuelle de changements suivis, l'environnement et les observations expurgées. Les déclarations d'isolation décrivent la procédure du script; elles ne constituent pas une capture réseau indépendante.

Le lanceur nécessite un clone Git contenant la baseline et `npm ci --ignore-scripts` avec le lockfile compatible. Les fichiers de travail sont temporaires et supprimés. Il ne remplace pas `npm test`, qui valide l'application corrigée.

## Recette effectivement observée

Référence technique exécutée : `44d887928b6fde77c48f783b25e866f7bd9a48d6`.

Source : [exécution GitHub Actions 36857703645](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36857703645), jobs [Linux](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36857703645/job/110354059695) et [Windows](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36857703645/job/110354059425). Les deux jobs sont terminés avec succès. La sortie Linux a été relue : Node `v22.23.2`, npm `10.9.8`.

| Contrôle | Résultat |
|---|---|
| Suite de tests | 25 réussis, 0 échec dans la sortie Linux; étape de tests réussie également sous Windows |
| ESLint | Étape réussie sur les deux systèmes |
| Vérification CVSS | 10 scores et exemples du vérificateur existant validés; ce contrôle vérifie l'arithmétique, pas la pertinence de chaque hypothèse |
| Baseline | 12 constats dynamiques et 1 constat statique retrouvés; `summary.failed` vide dans la sortie Linux; étape réussie également sous Windows |
| Version réellement exécutée | Commit initial explicite et 12 fichiers source accompagnés de leurs empreintes Git |
| Diff et répertoire de travail | Contrôles de whitespace et d'absence de modification suivie réussis |

Les sept tests ajoutés sont : trois pour l'extraction Git, deux pour la validation des observations et deux pour compléter les parcours de connexion/journalisation et la minimisation des réponses réussies. Ils ne suppriment ni ne relâchent les 18 tests antérieurs. Les fichiers applicatifs de `src/`, le seed, l'interface et le lockfile n'ont pas été modifiés par cette revue.

Les actions de CI ont uniquement une permission de lecture du contenu; aucun déploiement ni fusion n'est exécuté. Les artefacts contiennent seulement l'environnement et les résultats expurgés, conservés sept jours. Ils ne contiennent pas la base ou les journaux applicatifs. L'installation signale notamment un avertissement de support ESLint; le lockfile n'a pas été modifié pour faire disparaître cet avertissement. Aucun nouvel audit des avis de dépendances n'est revendiqué.

Les ajouts documentaires ultérieurs à `44d8879` ne sont pas présentés comme réexécutés par cette recette : cette référence identifie exactement le code testé.

## Index figé des sources initiales

Pour les preuves historiques, utiliser les liens ci-dessous plutôt qu'un lien relatif ouvrant le code corrigé. Les numéros restent ceux de la baseline.

| Fichier initial | Lien immuable | Repères des constats |
|---|---|---|
| Comptes | [accounts.js, lignes 11–64](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/routes/accounts.js#L11-L64) | SEC-02/04, PRIV-05/06/07; A.4 NC-01/04/05/07/08 |
| Données | [data.js, lignes 10–55](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/routes/data.js#L10-L55) | SEC-01, PRIV-01/02/03/04/06; questionnaires, annuaire, messages et export |
| Sessions | [auth.js, lignes 7–44](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/auth.js#L7-L44) | SEC-03, PRIV-05, CODE-01 |
| Stockage | [db.js, lignes 16–53](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/db.js#L16-L53) | SEC-01/05; conservation |
| Journaux | [logger.js, lignes 6–14](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/logger.js#L6-L14) | SEC-04; conservation |
| Jeu fictif | [seed.js](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/db/seed.js) | Données de démonstration et session historique |
| Interface | [index.html, lignes 16–61](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/public/index.html#L16-L61) | Parcours de collecte, A.4 NC-02/03 |

**Reste à faire à l'assemblage :** certains liens relatifs anciens dans A.3/A.4/B.1 ouvrent encore le code de la branche consultée. Cet index fournit les références correctes mais ne remplace pas automatiquement tous ces liens dans le corps des documents. Leur normalisation exhaustive n'est donc pas déclarée terminée. Conserver les ancres de lignes précises lors de cette dernière passe.

**Suivi des retouches du 1er octobre :** le point ci-dessus décrit l'état de la première revue. Les 38 liens vers le code dans A.3/A.4/B.1 ont ensuite été remplacés par des liens au commit initial avec ancres de lignes. Le test `dossier-references.test.js` vérifie les liens de A/B contre les objets Git, sans requête réseau. La pagination et les liens du PDF final restent à vérifier après export. Cette mise à jour ne modifie pas les résultats historiques de CI rapportés plus haut.

## Limites conservées

Aucune base légale, durée de conservation, autorisation métier ou acceptation de risque réel n'a été inventée. Les réserves de C.3 restent ouvertes. Les observations sur données fictives ne prouvent toujours pas l'origine du fichier signalé sur le forum. Voir la [synthèse des statuts et des décisions restantes](../../dossier/00-synthese-et-statuts.md).

## Recette locale des retouches — 1er octobre 2026

Branche locale `review/retouches-audit-partie-d`, issue de `261b27bfa2f990c6920e74bd3a10d3a3c9cf094f`, avec les retouches non commitées lors de cette recette. Environnement : Windows/PowerShell, Node `v24.11.0`. Ce résultat ne remplace pas la recette GitHub Actions historique et ne prétend pas à une nouvelle exécution Linux.

- **Preuve PRIV-03 :** le script historique préservé peut produire un indicateur vrai lorsqu'un profil répond 403 sans propriété `company`. Le validateur exige désormais aussi les observations réussies de profil/annuaire. Trois tests supplémentaires couvrent succès, contre-exemple exact et dix cas de corroboration absente ou incohérente. Le script historique et son empreinte restent inchangés.
- **Références :** 38 liens A/B ancrés sur le commit initial; deux tests contrôlent l'absence de liens relatifs vers le code courant et la validité des fichiers/plages dans les objets Git. Les explications de B.1/C.2 distinguent maintenant l'ancien script du lanceur actuel.
- **Workflow :** pushes sur `main`, `remediation/**`, `review/**`, `docs/**` pour `support/**` ou le workflow; toutes les pull requests; déclenchement manuel déclaré. Interface, seed et dossier sont inclus. Permissions de lecture conservées, aucun déploiement. Les filtres et événements suivent la [syntaxe officielle GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax). Le déclenchement manuel nécessite la présence du workflow sur la branche par défaut.
- **D :** abuser story D-01 reformulée du point de vue du contributeur fautif; revalidation des références déjà corrigées, sans présenter cette correction comme future. Corps réduit de 3 658 à 3 219 mots comptés par séparation sur les espaces, soit environ 12 %. Les 20 fiches, charges, dépendances et budget sont conservés; le PDF n'a pas encore été paginé.

| Contrôle local | Résultat final |
|---|---|
| Tests ciblés observations/références | 7 réussites, 0 échec |
| `npm.cmd test` | 30 réussites, 0 échec |
| `npm.cmd run lint` | Aucun diagnostic |
| Vérificateur CVSS | 10 scores et contrôles internes validés |
| Lanceur historique | 12 constats dynamiques + 1 statique, `summary.failed` vide |
| Workflow | YAML parsé et filtres/permissions contrôlés localement; aucune exécution distante déclenchée |

Une première exécution a détecté une fermeture de fonction manquante dans le nouveau test de références; elle a été corrigée avant les résultats finaux ci-dessus. Ce défaut du test n'a pas été attribué à l'application. Aucune modification de `src/`, du seed, de l'interface, du lockfile ou de la base locale n'a été nécessaire. Les quatre notes locales exclues ont été préservées; aucun push ni fusion n'a été effectué pendant ces retouches.
