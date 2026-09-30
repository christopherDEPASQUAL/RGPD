# Résultats des outils dans une copie isolée

## Environnement

- date : 30 septembre 2026 ;
- Node.js : `v24.11.0` ;
- npm : `11.12.1` ;
- copie temporaire : créée sous le répertoire temporaire Windows, sans `.env`, base du projet, logs du projet ni `node_modules` du projet ;
- installation : `npm ci --ignore-scripts` à partir du lockfile.

## Commandes et codes de sortie

| Commande | Code | Résultat expurgé |
|---|---:|---|
| `npm ci --ignore-scripts` | 0 | 155 paquets installés; 0 vulnérabilité annoncée pendant l'installation; avertissement indiquant qu'ESLint 9.39.5 n'est plus supporté. |
| `npm test` | 1 | Échec avant npm : `npm.ps1` bloqué par la politique PowerShell de cette surface d'exécution. Ce résultat ne concerne pas le code. |
| `npm.cmd test` | 0 | 3 tests, 3 réussites, 0 échec; durée annoncée 3 735,2839 ms. |
| `npm.cmd run lint` | 0 | 0 erreur, 1 avertissement : directive `eslint-disable` inutilisée à `src/db.js:35`. |
| `npm.cmd audit --json` sans accès réseau | 1 | Endpoint npm inaccessible dans le bac à sable; résultat non interprétable. |
| `npm.cmd audit --json` avec accès réseau autorisé | 0 | 0 avis info, faible, modéré, élevé ou critique; 155 dépendances analysées. |

## Interprétation limitée

Le blocage des tests précédemment attribué au logger n'est pas reproduit : l'exécution correcte via `npm.cmd` se termine normalement. La seule défaillance observée venait du choix de wrapper PowerShell. Il n'existe donc pas de preuve suffisante pour attribuer un blocage au flux du logger.

Le lint et `npm audit` ne détectent pas les défauts d'autorisation, de consentement, d'effacement, d'isolation tenant ou d'exécution dynamique confirmés par ailleurs.
