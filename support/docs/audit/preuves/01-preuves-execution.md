# Procédures et résultats expurgés

Toutes les preuves ci-dessous visent `baseline-vulnerable` (`e16cedcf0f8adb359621240366c8f0cbb251b8c9`). Les comptes, mots de passe sentinelles et données sont fictifs. Aucun jeton ni mot de passe n'est reproduit dans ce document.

## Reproduction automatisée

Depuis `support/` :

```powershell
node scripts/audit/reproduce-findings.js
```

Le script doit indiquer `temporaryCopy: true`, `fictionalSeed: true`, `bindAddress: 127.0.0.1`, `externalRequestsMade: false` et `projectDatabaseTouched: false`. Il supprime la copie temporaire après l'essai. Définir `AUDIT_KEEP_TEMP=1` uniquement si une inspection locale manuelle est nécessaire.

## SEC-01 — injection JavaScript côté serveur

- prérequis : n'importe quel compte authentifié ;
- code : `src/routes/data.js:31-34`, puis `src/db.js:32-37` ;
- requête conceptuelle : `GET /api/users?filter=(row.auditProof='SAFE_MARKER',row.id===1)` ;
- résultat observé : HTTP 200, une ligne, propriété `auditProof` égale à `SAFE_MARKER` ;
- résultat attendu : le serveur refuse toute expression et n'accepte que des filtres déclaratifs autorisés ;
- impact : du JavaScript fourni par l'utilisateur est exécuté dans le processus serveur ;
- statut : confirmé par exécution.

La preuve modifie seulement un objet de la base fictive en mémoire. Elle ne lit aucun secret, n'exécute aucune commande et ne contacte aucun réseau externe.

## PRIV-01, PRIV-02 et PRIV-03 — accès horizontal, annuaire et tenants

- prérequis : compte salarié fictif de l'entreprise `AuditTenant` ;
- requêtes : `GET /api/users/4`, puis `GET /api/users` avec le même jeton ;
- code : `src/routes/data.js:23-34` ;
- observé : profil d'un autre utilisateur et 3 questionnaires retournés; annuaire de 65 comptes et 6 valeurs d'entreprise retourné ;
- attendu : autorisation par objet, rôle et tenant, avec minimisation des champs ;
- données : identité, entreprise, date de naissance, rôle, hash de mot de passe et réponses de santé ;
- impact : accès inter-utilisateurs et inter-entreprises ;
- statut : confirmé par exécution.

Les trois constats partagent des requêtes mais couvrent des contrôles différents : propriété de l'objet, autorisation de l'annuaire et isolation B2B.

## SEC-02 — élévation de rôle

- prérequis : compte salarié fictif ;
- requête : `PATCH /api/me` avec le JSON `{"role":"admin"}` ;
- code : `src/routes/accounts.js:52-58` ;
- observé : HTTP 200 et rôle `admin` dans la réponse ;
- attendu : seuls les champs de profil explicitement autorisés peuvent être modifiés ;
- impact : accès aux opérations privilégiées ;
- statut : confirmé par exécution.

## PRIV-04 — export excessif

Scénario individuel RH :

- prérequis : compte RH fictif du README ;
- requête : `GET /api/exports/insurer` ;
- observé : HTTP 200 et 65 lignes couvrant toutes les entreprises.

Chaîne `CHAIN-01` :

1. appliquer `SEC-02` à un compte salarié ;
2. appeler `GET /api/exports/insurer` avec le même jeton ;
3. observer HTTP 200 et 65 lignes.

Code : `src/auth.js:32-37`, `src/routes/data.js:48-55`. Attendu : habilitation dédiée, périmètre tenant et export minimisé. La réponse locale ne prouve pas un transfert à un assureur. Statut : confirmé par exécution.

## SEC-03 — session admin préchargée sans expiration

- prérequis : base temporaire nouvellement générée par `db/seed.js` ;
- procédure : lire la session de fixture dans la copie temporaire et l'utiliser sur `GET /api/me` ;
- code : `db/seed.js:71-72`, `src/auth.js:7-21` ;
- observé : session créée le 1er mars 2024 acceptée avec HTTP 200; aucun champ d'expiration ;
- attendu : aucun jeton actif dans le seed et rejet des sessions expirées ;
- impact : accès administratif durable avec un jeton prédictible ;
- statut : confirmé par exécution.

## PRIV-05 — suppression non effective

- prérequis : compte fictif ayant créé un questionnaire ;
- procédure : `DELETE /api/me`, `GET /api/me` avec l'ancien jeton, puis nouvelle connexion ;
- code : `src/routes/accounts.js:37-45,62-64`, `src/auth.js:15-28` ;
- observé : DELETE 200, ancienne session valide, reconnexion 200, ligne utilisateur encore présente, 1 questionnaire, 2 sessions et 1 consentement restants ;
- attendu : comportement documenté de suppression/anonymisation, révocation des sessions et impossibilité de reconnexion lorsque l'effacement est annoncé ;
- statut : confirmé par exécution.

## SEC-04 — mot de passe en clair dans les journaux

- prérequis : fichier de log temporaire vide ;
- procédure : tenter une connexion avec un mot de passe sentinelle fictif, puis rechercher uniquement cette sentinelle dans le log temporaire ;
- code : `src/routes/accounts.js:15,39`, `src/logger.js:11-14` ;
- observé : sentinelle présente en clair ;
- attendu : aucun secret d'authentification dans les logs ou stdout ;
- statut : confirmé par exécution.

## PRIV-06 — exposition de `passwordHash`

- procédures : inscription, lecture d'un profil tiers et lecture de l'annuaire ;
- code : `src/routes/accounts.js:34,45,49`, `src/routes/data.js:27,34` ;
- observé : champ présent dans les trois types de réponse ;
- attendu : DTO de sortie excluant systématiquement les secrets dérivés ;
- statut : confirmé par exécution.

## PRIV-07 — consentements imposés

- prérequis : inscription sans aucun champ de consentement ;
- code : `src/routes/accounts.js:20-32` ;
- observé : `marketingOptIn`, consentement marketing et consentement tiers tous à `true` ;
- attendu : choix séparés, non pré-cochés, traçables et révocables ;
- statut : confirmé par exécution.

## SEC-05 — SHA-256 sans sel

- procédure : inscrire deux comptes avec le même mot de passe fictif et comparer uniquement leurs hash ;
- code : `src/db.js:25-28`, `db/seed.js:8-9` ;
- observé : deux chaînes hexadécimales SHA-256 identiques de 64 caractères et aucun champ de sel ;
- attendu : fonction adaptative avec sel propre à chaque hash ;
- statut : confirmé par exécution.

## CODE-01 — configuration et fonction inutilisées

- recherche statique : aucun import de `src/config.js` ;
- `randomToken` : deux occurrences, définition et export dans `src/auth.js:40-44` ;
- conséquence : ni les champs de configuration ni `randomToken` ne protègent les sessions actuelles ;
- statut : constat statique.
