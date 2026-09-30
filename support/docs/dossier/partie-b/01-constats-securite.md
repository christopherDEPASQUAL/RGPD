# Partie B.1 — Constats de sécurité

- **Version :** 1.1 — 1er octobre 2026
- **Référence :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`.
- **Vérification :** scénario local réexécuté le 1er octobre; douze constats dynamiques et un constat statique retrouvés. Les procédures et résultats attendus figurent dans les [preuves reproductibles](../../audit/preuves/01-preuves-execution.md).

## Méthode et reproduction

Depuis `support/`, `node scripts/audit/reproduce-findings.js` lance une copie temporaire sur `127.0.0.1` avec données fictives, sans toucher à la base du projet. Les requêtes détaillées, prérequis et résultats attendus figurent dans les [preuves reproductibles](../../audit/preuves/01-preuves-execution.md). Le script affiche des observations : son libellé `confirmed-by-execution` est écrit en dur et ne remplace pas la vérification des booléens et codes HTTP. Il ne constitue pas encore une suite de tests de non-régression.

Les scores ci-dessous utilisent **CVSS 3.1 Base**, choisi pour une cotation reproductible à huit métriques; ce n'est pas la version la plus récente. Pas de mélange avec CVSS 4.0, ni de score environnemental faute de déploiement réel connu. Références : [spécification FIRST](https://www.first.org/cvss/v3.1/specification-document), [guide et chaînes de vulnérabilités](https://www.first.org/cvss/v3.1/user-guide). `node scripts/audit/verify-cvss.js` recalcule les scores et contrôle des exemples FIRST.

**Conventions de scénario :** les routes HTTP sont cotées réseau (`AV:N`), même si la preuve est confinée en local. `PR:L` décrit un accès authentifié ordinaire ou métier sans contrôle administratif étendu; l'inscription libre rend l'accès salarié très facile à obtenir. Selon FIRST, `PR:H` suppose un contrôle significatif, par exemple administratif, sur les paramètres et fichiers de l'ensemble du composant : le nom d'un rôle ne suffit pas. `UI:N` : pas d'action d'une autre personne pendant l'exploitation. `S:U` : effets cotés dans la même application et ses données. Les impacts potentiels déduits du code sont signalés sans prétendre avoir exécuté une attaque destructive ([définitions FIRST de PR et AC](https://www.first.org/cvss/v3.1/specification-document)).

## Scores calculés

| Constat | Score | Vecteur CVSS 3.1 |
|---|---|---|
| SEC-01 | 8.8 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H` |
| SEC-02 | 7.1 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:L/A:N` |
| SEC-03 | 8.2 | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N` |
| SEC-04 | 5.5 | `CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` |
| SEC-05 | 4.7 | `CVSS:3.1/AV:L/AC:H/PR:L/UI:N/S:U/C:H/I:N/A:N` |
| PRIV-01 / PRIV-03 | 6.5 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` |
| PRIV-02 | 6.5 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` |
| PRIV-04 | 6.5 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` |
| PRIV-05 | 4.3 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N` |
| PRIV-06 | 6.5 | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` |

Ce sont des évaluations d'audit, pas des scores officiels attribués par FIRST au projet. Les scores 7–8.9 sont élevés, 4–6.9 moyens. Ils ne mesurent ni la licéité ni la gravité humaine d'A.3. Les constats se recoupent : **ne pas additionner leurs scores ni compter chaque facette comme une attaque indépendante**.

## Fiches et justification des impacts

### SEC-01 — Injection JavaScript côté serveur

**Preuve.** Un salarié appelle `GET /api/users` avec le filtre `(row.auditProof='SAFE_MARKER',row.id===1)` : HTTP 200, un objet portant le marqueur. Entrée : [data.js:31–34](../../../src/routes/data.js); interprétation : [db.js:32–37](../../../src/db.js). Il s'agit de JavaScript exécuté par `new Function`, pas de SQL.

**Cotation.** AC:L, expression directement évaluée. C:H/I:H/A:H : exécution dans le processus Node, sans bac à sable, permettant raisonnablement de compromettre les données et la disponibilité de l'application. Seule la modification inoffensive d'une propriété en mémoire a été exécutée; aucun arrêt du serveur, accès à des secrets ou commande système n'a été testé. **OWASP : A05:2025 Injection.** Correctif cible : filtres déclaratifs autorisés, sans interprétation de code.

### SEC-02 — Élévation de privilèges par modification de profil

**Preuve.** `PATCH /api/me` avec `{"role":"admin"}` retourne le rôle administrateur; l'export suivant réussit. [accounts.js:52–58](../../../src/routes/accounts.js) applique tout champ sauf `id`.

**Cotation.** AC:L; C:H car le rôle obtenu ouvre l'export; I:L pour la modification d'attributs protégés du compte, sans attribuer un pouvoir général d'écriture sur les comptes tiers; A:N faute d'effet propre de disponibilité établi. **OWASP : API3:2023 / A01:2025.** La chaîne `SEC-02` → `PRIV-04` est explicitée en B.2, sans y ajouter SEC-01 artificiellement. Correctif : liste de champs modifiables et administration séparée des rôles.

### SEC-03 — Session administrative préchargée, sans expiration

**Preuve.** La session fictive du seed, datée du 1er mars 2024, donne HTTP 200 sur `/api/me`; aucun champ d'expiration. [seed.js:71–72](../../../db/seed.js), [auth.js:7–21](../../../src/auth.js).

**Cotation.** PR:N pour le scénario précis du jeton fixe reconstructible à partir du seed fourni, pas pour tout vol de session. AC:L; C:H pour les lectures offertes au compte; I:L pour ses attributs modifiables; A:N. Ces capacités découlent des routes, au-delà de la preuve de connexion. Score applicable à une instance utilisant ce seed; présence du jeton en production inconnue. La prédiction d'un jeton arbitraire fondé sur l'heure n'a pas été démontrée. **OWASP : API2:2023 / A07:2025.** Correctif : pas de session active distribuée, aléa cryptographique, expiration et révocation.

### SEC-04 — Secrets en clair dans les journaux

**Preuve.** Une tentative de connexion avec une sentinelle fictive écrit celle-ci en clair dans le log temporaire. [accounts.js:15,39](../../../src/routes/accounts.js), [logger.js:6–14](../../../src/logger.js).

**Cotation conditionnelle.** AV:L/PR:L : attaquant disposant d'un accès local de lecture aux journaux, pas un lecteur HTTP anonyme. AC:L; C:H pour les authentifiants révélés; I:N/A:N pour cette divulgation seule, sans intégrer une future usurpation. Aucune exposition web des logs démontrée. **OWASP : A09:2025**, qui couvre notamment l'insertion de données sensibles dans les logs. Correctif : exclusion des secrets à la source et contrôle de tous les canaux de journalisation.

### SEC-05 — Empreintes de mots de passe trop faciles à tester hors ligne

**Preuve.** Deux inscriptions avec le même mot de passe fictif donnent la même empreinte SHA-256 de 64 caractères; le code ne sale pas et n'applique pas de facteur de travail. [db.js:25–28](../../../src/db.js), [seed.js:8–9](../../../db/seed.js).

**Cotation conditionnelle.** Le scénario coté isole le stockage faible : l'attaquant doit pouvoir lire localement le fichier JSON contenant les empreintes (`AV:L`). `PR:L` suppose qu'un compte local peu privilégié possède cette lecture; le support ne documente ni déploiement ni permissions. Si seuls un administrateur ou le compte de service y accèdent, `PR:H` devra remplacer `PR:L`. L'obtention par l'API relève plutôt de la chaîne avec `PRIV-06`, pas de ce vecteur local autonome.

`AC:H` est retenu car la récupération d'un secret utilisable dépend de la présence du mot de passe réel dans l'espace testé et d'un effort mesurable, conditions que l'attaquant ne maîtrise pas. SHA-256 sans sel rend chaque essai rapide, répétable et mutualisable, mais ne garantit pas la réussite; aucun craquage n'a été exécuté. Si le scénario évalué se limite à la capacité certaine de lancer des essais rapides, sans exiger la récupération du secret, l'impact `C:H` devrait lui aussi être réexaminé. Le score 4,7 décrit donc une hypothèse précise, non une extraction réseau démontrée ([FIRST, Attack Complexity](https://www.first.org/cvss/v3.1/specification-document)). **OWASP : A04:2025.** Correctif : fonction adaptée aux mots de passe, salée et à coût réglable, avec stratégie de migration.

### PRIV-01 / PRIV-03 — Profils et santé lisibles entre utilisateurs/entreprises

**Preuve.** Un salarié `AuditTenant` lit `/api/users/4` : profil d'une autre entreprise et trois questionnaires, HTTP 200. [data.js:23–27](../../../src/routes/data.js). Deux angles du même défaut : contrôle de l'objet et cloisonnement des clients.

**Cotation.** AC:L; C:H compte tenu des données médicales directement exposées et des identifiants énumérables; I:N/A:N, lecture seulement. **OWASP : API1:2023 / A01:2025.** Correctif : autorisation par objet et appartenance vérifiée au client, pas un simple filtre fondé sur une entreprise autodéclarée.

### PRIV-02 — Annuaire complet accessible au salarié

**Preuve.** `GET /api/users` retourne 65 comptes et six valeurs d'entreprise dans l'essai (63 comptes du seed et deux comptes ajoutés). [data.js:31–34](../../../src/routes/data.js).

**Cotation.** AC:L; C:H pour le répertoire intégral incluant les empreintes; I:N/A:N. **OWASP : API5:2023 / A01:2025**, accès à une fonction annoncée pour coachs/RH. Correctif : restriction métier, client et champs. Ce résultat n'établit pas que 65 personnes réelles ont subi une fuite.

### PRIV-04 — Export RH non cloisonné et excessif

**Preuve.** Un RH obtient directement 65 lignes avec comptes et questionnaires; un salarié élevé par SEC-02 obtient la même réponse. [auth.js:32–37](../../../src/auth.js), [data.js:48–55](../../../src/routes/data.js).

**Cotation de l'accès RH direct.** `PR:L` est retenu : le compte doit être authentifié avec le rôle métier `rh`, mais le code ne démontre pas que ce rôle contrôle les paramètres ou fichiers de l'ensemble du composant. FIRST réserve `PR:H` à un contrôle significatif, notamment administratif; une fonction sensible autorisée au rôle RH ne suffit pas à l'établir. Avec AC:L, C:H et I:N/A:N, le score est **6,5**. Si l'organisation démontre que tout compte RH dispose déjà d'un tel contrôle administratif avant l'exploitation, le vecteur devra revenir à `PR:H` et 4,9. Le scénario salarié après `SEC-02` reste une chaîne distincte. **OWASP : A01:2025 / API3:2023.** Cible A.2/A.3 : suspendre l'export tant que finalité et licéité ne sont pas établies, puis définir l'habilitation si réouverture justifiée.

### PRIV-05 — Accès encore actif après demande de suppression

**Preuve.** Après `DELETE /api/me`, ancien jeton et nouvelle connexion fonctionnent; compte, questionnaire, deux sessions et consentement subsistent. [accounts.js:37–45,62–64](../../../src/routes/accounts.js), [auth.js:15–21](../../../src/auth.js).

**Cotation de la composante sécurité.** Scénario d'un détenteur d'ancien accès après fermeture demandée : PR:L, AC:L; C:L pour la lecture persistante du profil de ce compte, I:N/A:N conservateurs. Les lectures de tiers sont déjà cotées ailleurs. La conservation illicite éventuelle relève séparément de NC-08/09. **OWASP : API2:2023 / A07:2025.** Correctif : procédure d'effacement motivée et révocation effective des accès.

### PRIV-06 — Empreintes exposées par les réponses API

**Preuve.** `passwordHash` est présent dans inscription, profil tiers et annuaire; [accounts.js:34,45,49](../../../src/routes/accounts.js), [data.js:27,34](../../../src/routes/data.js). Les routes renvoient les objets complets.

**Cotation.** Scénario de lecture des empreintes de tiers : AC:L, C:H, I:N/A:N. Le hash de son propre compte à l'inscription ne suffirait pas à justifier cet impact. **OWASP : API3:2023 / A01:2025.** Le recoupement avec PRIV-01/02/04 est assumé; cette fiche isole le défaut de sélection des propriétés. Correctif : schémas de sortie excluant systématiquement les secrets dérivés.

## Constats non cotés comme vulnérabilités autonomes

`PRIV-07` (consentements imposés) est un constat RGPD, traité en A.4, pas un score CVSS artificiel. `CODE-01` (configuration et générateur aléatoire inutilisés) explique de fausses protections apparentes : impact déjà couvert par SEC-03 et A. Aucun score 0 ne signifie « conforme ». CORS ouvert, `localStorage`, absence de limitation de débit visible et messagerie sans relation de coaching méritent un durcissement contextualisé; aucune exploitation supplémentaire n'est prétendue démontrée ici.

## Références OWASP vérifiées

Les correspondances sont notre analyse du code, fondée sur les catégories officielles : [A01:2025 accès](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/), [A04:2025 cryptographie](https://top10.owasp.org/2025/A04_2025-Cryptographic_Failures/), [A05:2025 injection](https://top10.owasp.org/2025/A05_2025-Injection/), [A07:2025 authentification](https://top10.owasp.org/2025/A07_2025-Authentication_Failures/), [A09:2025 journaux](https://top10.owasp.org/2025/A09_2025-Security_Logging_and_Alerting_Failures/); [API1:2023 objets](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/), [API2:2023 authentification](https://api-security.owasp.org/editions/2023/en/0xa2-broken-authentication/), [API3:2023 propriétés](https://api-security.owasp.org/editions/2023/en/0xa3-broken-object-property-level-authorization/), [API5:2023 fonctions](https://api-security.owasp.org/editions/2023/en/0xa5-broken-function-level-authorization/). Ne pas intervertir les numéros des éditions 2021, 2025 et API 2023.
