# Partie C.2 — Correctifs, commits et preuves

- **Version :** 1.2 — 1er octobre 2026
- **Référence des constats :** [partie B.1](../partie-b/01-constats-securite.md) et [matrice initiale](../../audit/02-matrice-des-constats.md)
- **Principe :** chaque statut ci-dessous décrit le code de la branche de remédiation, pas une production inconnue.

## Traçabilité des corrections

| Constat | Commit | Correction vérifiée | Limite à ne pas masquer |
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

## Résultats réellement obtenus

### Recette historique — 18 tests

Recette exécutée le 1er octobre 2026 depuis `support/`, sous Windows/PowerShell, avec Node `v24.11.0` et npm `11.12.1`, sur le HEAD technique `61e7316`. Les fichiers de tests et de seed étaient temporaires; la base locale existante n'a pas été réensemencée.

| Commande ou contrôle | Résultat observé |
|---|---|
| `npm test` | **18 tests réussis, 0 échec** : 14 tests sécurité/confidentialité, 3 tests de fonctionnement et 1 test UI |
| `npm run lint` | Succès, aucun diagnostic ESLint |
| `node scripts/audit/verify-cvss.js` | 10 scores du rapport et exemples FIRST vérifiés |
| `git diff --check` | Succès, aucune erreur d'espace dans les changements réalisés |
| `DB_FILE=<fichier temporaire> node db/seed.js` | 63 utilisateurs, 132 questionnaires, 0 session active et 63 empreintes au nouveau format paramétré; fichier temporaire supprimé après lecture |

Le comptage est celui du lanceur Node; les intitulés détaillés restent visibles dans la sortie de recette. Les assertions multiples d'un même scénario, par exemple les quatre états d'expiration refusés, restent regroupées dans un seul test nommé.

### Recette locale de clôture du fond — 30 tests

Contrôles réexécutés le 1er octobre 2026 sous Windows/PowerShell, Node `v24.11.0` et npm `11.12.1`, sur `review/retouches-audit-partie-d` : HEAD `261b27bfa2f990c6920e74bd3a10d3a3c9cf094f` **avec modifications locales non commitées**, notamment le validateur d'observations et les tests de références documentaires. Les résultats portent sur cet état de travail, pas sur le commit seul; le détail des retouches figure dans la [note de fiabilisation](../../audit/preuves/04-fiabilisation-et-recette.md).

| Commande ou contrôle | Résultat observé |
|---|---|
| `npm test` | **30 tests réussis, 0 échec** : régressions applicatives, fonctionnement, interface, outillage de preuve et références historiques |
| `npm run lint` | Succès, aucun diagnostic ESLint |
| `node scripts/audit/verify-cvss.js` | 10 scores du rapport et contrôles de calcul vérifiés |
| `node scripts/audit/reproduce-findings.js` | Sur le commit initial vérifié : 12 constats dynamiques et 1 statique retrouvés; `summary.failed` vide. Ce résultat confirme les défauts historiques, pas les corrections |
| `git diff --check` | Aucune erreur d'espace; avertissements de conversion LF/CRLF distincts d'un échec |
| Base locale | Empreinte SHA-256 identique avant/après les contrôles; aucun réensemencement de cette base |

Cette recette complète celle à 18 tests sans la réécrire. Elle n'atteste ni une exécution du workflow GitHub sur ces retouches ni un déploiement. Après enregistrement des modifications, identifier le commit final et refaire la recette de livraison sur une copie propre.

## Baseline historique et branche corrigée

Lors de la recette `61e7316` ci-dessus, le script historique copiait le **code présent dans le répertoire de travail** : afficher le hash `e16cedc…` ne suffisait pas à prouver la provenance. Cette limite explique pourquoi la recette C utilisait ses propres tests de non-régression.

Depuis la [revue de fiabilisation](../../audit/preuves/04-fiabilisation-et-recette.md), `node scripts/audit/reproduce-findings.js` extrait et vérifie les objets Git du commit initial, sans changer le répertoire de travail. Les scénarios historiques sont préservés; le lanceur valide leurs observations. La preuve des corrections reste distincte : `npm test` s'exécute sur le code corrigé avec des fichiers temporaires. Les résultats de la recette initiale ne sont pas réattribués à cette nouvelle version de l'outillage.

## Interprétation des résultats

Un test vert démontre le comportement couvert dans cet environnement pédagogique. Il ne démontre ni le déploiement en production, ni la licéité de la collecte de santé, ni l'efficacité d'une procédure organisationnelle absente. Les réserves correspondantes sont consignées dans [C.3](03-risques-residuels.md).
