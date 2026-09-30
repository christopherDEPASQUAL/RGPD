# Périmètre et méthode de l'audit initial

## Objet de cette phase

Cette phase sécurise le point de départ et établit des preuves reproductibles. Elle ne constitue ni l'analyse juridique complète, ni l'AIPD, ni le plan agile, ni les cinq correctifs demandés par l'énoncé. Aucun correctif fonctionnel n'a été appliqué et aucun envoi vers le dépôt distant n'a été effectué.

## Sources examinées

- `mail_rattrapage.txt`, situé hors du dépôt ;
- `support/enonce.pdf`, lu intégralement : 3 pages ;
- `README.md`, `package.json`, `package-lock.json` ;
- sources, tests, configuration, seed, interface statique et fichiers d'exécution présents au départ ;
- état Git et instructions applicables (aucun fichier `AGENTS.md` trouvé dans la hiérarchie examinée).

L'énoncé demande notamment un dossier PDF de 30 pages maximum hors annexes, une branche dédiée avec au moins cinq correctifs (dont deux RGPD et deux sécurité), un commit et une preuve de non-régression par correctif, une présentation de cinq minutes et une annexe de transparence IA.

## État Git constaté avant intervention

- racine Git : `C:\Users\Christopher\Desktop\RATTRAPAGE RGPD\RGPD` ;
- application : `RGPD/support/` ;
- branche annoncée : `main` ;
- aucun commit ;
- `support/` entièrement non suivi ;
- distant `origin` configuré, mais `origin/main` absent localement (`gone`) ;
- aucun push réalisé pendant cette phase.

## Préservation et référence

L'original a été copié hors du dépôt avant toute modification dans :

`C:\Users\Christopher\Desktop\RATTRAPAGE RGPD\preservation-originale\support-original-20260930T-audit`

La copie contient 20 fichiers pour 654 531 octets. `node_modules/` est la seule exclusion : il s'agit de dépendances installées. Les empreintes de chaque fichier copié ont été recalculées après copie et correspondent toutes au manifeste. Voir `docs/audit/preuves/00-preservation-original.md`.

Le commit de référence est `e16cedcf0f8adb359621240366c8f0cbb251b8c9`, étiqueté `baseline-vulnerable`. La branche de travail est `remediation/rgpd-security`.

La baseline exclut explicitement `.env`, `db/wellwork.json`, `logs/` et `node_modules/`. Quatre champs de `src/config.js` ressemblant à des secrets ou à une cible externe ont été remplacés par des valeurs de démonstration inertes avant le commit. L'original exact reste uniquement dans la copie locale hors Git. Cette neutralisation ne change pas le comportement observé : une recherche statique confirme que `src/config.js` n'est importé nulle part.

Le commit de préparation `681e4e189017032c32e9428d6b42008f750e87b4` ajoute les protections Git et `.env.example`. L'application ne charge pas automatiquement les fichiers `.env`; les variables doivent être fournies à l'environnement du processus.

## Méthode d'exécution

Les preuves dynamiques utilisent `scripts/audit/reproduce-findings.js`. Le script :

1. crée une copie dans le répertoire temporaire du système ;
2. génère une nouvelle base à partir du seed fictif, sans toucher à `db/wellwork.json` du projet ;
3. utilise des chemins `DB_FILE` et `LOG_FILE` temporaires ;
4. lie Express à `127.0.0.1` sur un port éphémère ;
5. n'appelle aucun assureur, serveur SMTP ou autre cible externe ;
6. emploie, pour l'injection JavaScript, un marqueur inoffensif limité aux données jetables en mémoire ;
7. arrête le serveur et supprime la copie temporaire à la fin.

Les scénarios isolés sont décrits individuellement. La chaîne `SEC-02` puis `PRIV-04` (élévation de rôle, puis export) est signalée séparément afin de ne pas la confondre avec l'accès direct d'un compte RH à l'export.

## Outils et résultats de contrôle

- système observé le 30 septembre 2026 ;
- Node.js `v24.11.0` ;
- npm `11.12.1` ;
- `npm ci --ignore-scripts` : code 0, 155 paquets installés, avertissement de support sur ESLint `9.39.5` ;
- `npm.cmd test` : code 0, 3 tests réussis sur 3, durée annoncée 3 735 ms ;
- `npm.cmd run lint` : code 0, aucune erreur et un avertissement (`src/db.js:35`, directive ESLint inutilisée) ;
- `npm.cmd audit --json` : code 0 après autorisation réseau, aucune vulnérabilité connue signalée sur 155 dépendances.

Le premier appel `npm test` dans une surface PowerShell distincte a échoué avec le code 1 parce que `npm.ps1` était bloqué par la politique d'exécution. L'appel explicite à `npm.cmd` a ensuite réussi. Aucun blocage lié au flux du logger n'a été reproduit. Un lint acceptable et un audit npm sans alerte ne démontrent pas la sécurité de l'application.

## Limites

- Les données du seed sont fictives et ne prouvent aucun volume de production.
- Une réponse HTTP d'export ne prouve aucun transfert réel vers un assureur.
- Les vulnérabilités démontrées rendent une fuite plausible, mais ne prouvent ni l'origine du fichier évoqué dans l'énoncé ni un incident réel.
- L'authenticité des anciennes valeurs ressemblant à des secrets n'a pas été testée.
- Les références RGPD, qualifications OWASP et scores CVSS restent à établir dans les phases dédiées.
