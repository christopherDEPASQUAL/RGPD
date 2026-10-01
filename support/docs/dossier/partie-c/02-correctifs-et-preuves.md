# Partie C.2 — Correctifs, commits et preuves

- **Version :** 1.2 — 1er octobre 2026
- **Référence des constats :** [partie B.1](../partie-b/01-constats-securite.md) et [matrice initiale](../../audit/02-matrice-des-constats.md)
- **Périmètre :** code corrigé de la branche de remédiation, testé sur données fictives.

## Traçabilité des corrections

| Constat | Commit | Correction vérifiée | Limite restante |
|---|---|---|---|
| `SEC-01` | `4663155` | Suppression de `new Function`; recherche par paramètres déclaratifs et test de rejet d'une expression exécutable | La validation métier des filtres autorisés reste à maintenir lors de toute extension |
| `SEC-02` | `60015bf` | `PATCH /api/me` limité à `firstName`, `lastName`, `birthDate`; rôle, entreprise et périmètre refusés | La route d'administration des rôles et son processus d'approbation restent à concevoir |
| `SEC-03` | `49aae3d` | Jetons aléatoires de 256 bits, expiration, révocation, refus des sessions expirées/révoquées et retrait de la session du seed | Cette première correction ne validait pas encore une date illisible ni la configuration de durée; complément ci-dessous |
| `SEC-04` | `f06e422` | Mot de passe retiré des événements d'inscription/connexion et masquage récursif des clés sensibles par le logger | Les journaux déjà produits doivent être traités selon l'enquête et la politique de conservation |
| `SEC-05` | `bed88f7` | scrypt avec sel aléatoire pour les nouveaux secrets; vérification SHA-256 héritée puis migration uniquement après authentification réussie | Le premier format utilisait encore les paramètres scrypt par défaut; complément ci-dessous |
| `PRIV-06` | `e243374` | Présentateurs de sortie supprimant `passwordHash`, `passwordMigratedAt` et les attributs internes de périmètre | Toute future route doit utiliser un schéma de sortie explicite |
| `PRIV-01/02/03` | `31d3eda` | Refus par défaut, périmètre d'entreprise vérifié, annuaire limité, RH sans santé individuelle et coach autorisé uniquement par une affectation vérifiée | `company` reste déclaratif et n'accorde rien. `PRIV-03` n'est pas clos organisationnellement sans provisionnement fiable des périmètres et affectations |
| `PRIV-04` | `44c6623` | Export assureur suspendu : HTTP 503 sans donnée et sans création d'un export | La finalité, les bases des articles 6/9 et le destinataire ne sont toujours pas démontrés; aucune réouverture implicite |
| `PRIV-05` | `d675e3b` | Suppression du compte et du graphe de données alors identifié dans la base active, révocation des accès et reconnexion refusée | Cette première vérification ne couvrait ni la réutilisation de l'identifiant supprimé, ni les anciens comptes en suppression logique; compléments ci-dessous |
| `PRIV-07` | `8d7be25` | Défauts à `false`, invalidation des enregistrements hérités, choix marketing/tiers distincts et historique des choix/retraits | Cela ne constitue pas un consentement à la santé et ne valide aucune campagne ou transmission passée |

Le découpage garde volontairement `SEC-04`, `SEC-05` et `PRIV-06` dans trois commits indépendants. La suspension de l'export assureur est également distincte du correctif général d'autorisation.

## Retouches issues de la recette complémentaire

| Retouche | Commit | Résultat couvert |
|---|---|---|
| Identifiants et messages après effacement | `4bd6669` | Compteurs d'identifiants persistants; destinataire absent ou supprimé refusé; séquence suppression → envoi → rechargement → réinscription → rechargement testée sans réattribution ni message hérité |
| Anciens comptes `deleted: true` | `975da14`; test `61e7316` | Réponse 404 sur la consultation individuelle, exclusion de l'annuaire, session refusée et message entrant rejeté après rechargement. Les lignes héritées restent à traiter selon la durée et la procédure d'effacement, sans réensemencer la base |
| Expiration des sessions | `e720a94` | Date absente, illisible, expirée ou session révoquée refusée; `SESSION_TTL_MS` validé au démarrage entre 1 ms et 24 h |
| Minimisation par rôle | `478ab2f` | Listes positives de champs; RH et coach ne reçoivent ni date de naissance ni préférence marketing; les RH restent privés des questionnaires individuels |
| État des préférences dans l'interface | `6a2b3c8` | Cases remises à zéro avant changement de compte, puis rechargées depuis l'API après connexion, inscription et retour sur la page |
| Paramètres scrypt | `9efa859` | Nouveau format auto-descriptif `scrypt$N=32768,r=8,p=3$…`; ancien scrypt par défaut et SHA-256 vérifiés puis remplacés seulement après authentification valide |

Le profil scrypt retenu (`N=2^15`, `r=8`, `p=3`, environ 32 MiB) fait partie des configurations minimales proposées par [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt). `maxmem` est fixé à 64 MiB conformément au fonctionnement documenté de [`crypto.scryptSync`](https://nodejs.org/api/crypto.html#cryptoscryptsyncpassword-salt-keylen-options). Ce choix doit encore être mesuré sur l'infrastructure réelle; il n'est pas présenté comme universel.

## Ce que vérifient les tests actuels

La suite [security-regression.test.js](../../../test/security-regression.test.js) travaille avec un fichier de base et un fichier de log temporaires propres à l'exécution. Elle couvre notamment :

- expression de filtre rejetée et filtre déclaratif accepté;
- champs de privilège refusés sur le profil;
- jetons distincts, expiration, révocation, dates stockées invalides, configuration de durée et invalidation après suppression;
- sentinelles de mot de passe absentes des journaux;
- scrypt salé avec paramètres stockés, compatibilité de l'ancien format et migration d'un SHA-256 seulement après mot de passe correct;
- absence de secrets dans les réponses utilisateur;
- accès interentreprises refusés lorsque l'appartenance est absente, falsifiée ou modifiée;
- RH exclus des questionnaires individuels, profils tiers minimisés et coach limité à une affectation explicite vérifiée, indépendante de son employeur;
- export assureur sans donnée;
- effacement des objets associés, absence de réutilisation d'identifiant, rejet des messages orphelins et masquage des suppressions logiques historiques après rechargement;
- invalidation d'un ancien indicateur forcé à `true`, nouveau choix, retrait et persistance après rechargement.
- rechargement des préférences au retour sur la page et lors de deux changements successifs de compte dans [ui-preferences.test.js](../../../test/ui-preferences.test.js).

Les tests généraux de santé de l'API, d'inscription/profil et d'enregistrement d'un questionnaire complètent ces régressions. Les commandes de recette sont :

```text
npm test
npm run lint
node scripts/audit/verify-cvss.js
git diff --check
```

Le seed doit être vérifié avec `DB_FILE` pointant vers un fichier temporaire. Il ne faut pas exécuter `npm run seed` sur la base locale existante pour masquer un défaut de migration ou faire passer un test.

## Résultats de validation

Le commit `3d00b4b` a été vérifié sur copie propre sous Windows (Node `v24.11.0`, npm `11.12.1`) et par la [CI Linux/Windows](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36909164181).

| Contrôle | Résultat |
|---|---|
| Tests du code corrigé | **30 réussis, 0 échec** : application, interface, outillage de preuve et références historiques |
| Lint | Aucun diagnostic ESLint |
| Calculs CVSS | 10 scores du rapport vérifiés |
| Reproduction sur la version initiale `e16cedc` | 12 constats dynamiques et 1 statique retrouvés; `summary.failed` vide |

Les deux vérifications répondent à des questions différentes : `npm test` contrôle les corrections; `reproduce-findings.js` retrouve les défauts dans les fichiers extraits du commit initial et vérifiés par empreinte. Ce dernier remplace l'ancien lanceur, qui copiait le répertoire de travail et pouvait donc tester la mauvaise version.

La suite est passée de 18 tests sur `61e7316` à 30 après la revue. Les recettes intermédiaires, dont celle sur `261b27b` avec retouches locales, restent détaillées dans la [note de fiabilisation](../../audit/preuves/04-fiabilisation-et-recette.md). Les essais utilisent des fichiers temporaires et préservent la base locale.

Ces résultats valident les comportements testés. Les décisions sur les données de santé, les habilitations et l'exploitation restent à traiter dans [C.3](03-risques-residuels.md) et D.
