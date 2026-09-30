# Journal de transparence IA — phase initiale

Ce journal prépare l'annexe demandée par l'énoncé. Il ne prétend pas être l'annexe finale.

## Outil et usage

Un assistant de développement OpenAI a été utilisé pour :

- inventorier le dépôt et vérifier Git ;
- lire l'énoncé et les sources ;
- préserver l'original et calculer les empreintes ;
- construire puis exécuter des preuves locales inoffensives ;
- consigner les constats et limites.

## Requête principale résumée

La consigne principale demandait de sécuriser le point de départ, préserver l'original avant modification, créer une baseline et une branche de remédiation, revalider une liste de pistes dans une instance isolée, exécuter tests/lint/audit, produire les documents de preuve, ne pas appliquer de correctif fonctionnel et ne rien pousser.

Des contraintes explicites interdisaient l'usage de secrets contre des services, les contacts avec l'assureur ou SMTP, les preuves d'injection dangereuses, l'invention de références juridiques/CVSS et l'affirmation non prouvée d'une causalité avec la fuite.

## Principaux résultats conservés

- état Git initial sans commit confirmé ;
- préservation de 20 fichiers et contrôle SHA-256 complet ;
- baseline et branche créées ;
- 12 constats dynamiques confirmés et un constat statique ;
- tests 3/3 réussis, lint avec un avertissement, audit npm sans avis connu ;
- causalité de la fuite et analyse juridique laissées ouvertes.

## Erreurs ou imprécisions corrigées

Les cinq corrections réellement observées sont détaillées dans `docs/audit/01-pieges-et-hypotheses.md` : méthode PowerShell de copie incompatible, hypothèse non démontrée sur le logger, wrapper `npm.ps1` bloqué, qualification SQL corrigée en JavaScript et lecture trop précoce du flux de journal dans le premier script de preuve.

## Règles pour la suite

- conserver les prompts futurs significatifs et les décisions qui en découlent ;
- vérifier chaque référence juridique sur une source officielle avant de l'utiliser ;
- conserver les résultats bruts expurgés nécessaires à la reproduction ;
- distinguer erreurs d'outil, hypothèses d'analyse et vulnérabilités du projet ;
- conserver ces cinq cas réels et leurs preuves sans en inventer d'autres.
