# Partie C.2 — Correctifs, commits et preuves

- **Version :** 1.0 — 1er octobre 2026
- **Référence des constats :** [partie B.1](../partie-b/01-constats-securite.md) et [matrice initiale](../../audit/02-matrice-des-constats.md)
- **Principe :** chaque statut ci-dessous décrit le code de la branche de remédiation, pas une production inconnue.

## Traçabilité des corrections

| Constat | Commit | Correction vérifiée | Limite à ne pas masquer |
|---|---|---|---|
| `SEC-01` | `4663155` | Suppression de `new Function`; recherche par paramètres déclaratifs et test de rejet d'une expression exécutable | La validation métier des filtres autorisés reste à maintenir lors de toute extension |
| `SEC-02` | `60015bf` | `PATCH /api/me` limité à `firstName`, `lastName`, `birthDate`; rôle, entreprise et périmètre refusés | La route d'administration des rôles et son processus d'approbation restent à concevoir |
| `SEC-03` | `49aae3d` | Jetons aléatoires de 256 bits, expiration, révocation, refus des sessions expirées/révoquées et retrait de la session du seed | Le stockage navigateur, la rotation et la protection opérationnelle des sessions restent à durcir |
| `SEC-04` | `f06e422` | Mot de passe retiré des événements d'inscription/connexion et masquage récursif des clés sensibles par le logger | Les journaux déjà produits doivent être traités selon l'enquête et la politique de conservation |
| `SEC-05` | `bed88f7` | scrypt avec sel aléatoire pour les nouveaux secrets; vérification SHA-256 héritée puis migration uniquement après authentification réussie | Les comptes hérités qui ne se reconnectent pas exigent un renouvellement contrôlé; aucun ancien hash n'est « migré » en le hachant à nouveau |
| `PRIV-06` | `e243374` | Présentateurs de sortie supprimant `passwordHash`, `passwordMigratedAt` et les attributs internes de périmètre | Toute future route doit utiliser un schéma de sortie explicite |
| `PRIV-01/02/03` | `31d3eda` | Refus par défaut, périmètre d'entreprise vérifié, annuaire limité, RH sans santé individuelle et coach autorisé uniquement par une affectation vérifiée | `company` reste déclaratif et n'accorde rien. `PRIV-03` n'est pas clos organisationnellement sans provisionnement fiable des périmètres et affectations |
| `PRIV-04` | `44c6623` | Export assureur suspendu : HTTP 503 sans donnée et sans création d'un export | La finalité, les bases des articles 6/9 et le destinataire ne sont toujours pas démontrés; aucune réouverture implicite |
| `PRIV-05` | `d675e3b` | Effacement du compte et des données associées dans la base active, révocation des accès et reconnexion refusée | Archives, sauvegardes, exceptions de l'article 17 et preuves minimales restent à définir hors de ce stockage pédagogique |
| `PRIV-07` | `8d7be25` | Défauts à `false`, invalidation des enregistrements hérités, choix marketing/tiers distincts et historique des choix/retraits | Cela ne constitue pas un consentement à la santé et ne valide aucune campagne ou transmission passée |

Le découpage garde volontairement `SEC-04`, `SEC-05` et `PRIV-06` dans trois commits indépendants. La suspension de l'export assureur est également distincte du correctif général d'autorisation.

## Ce que vérifient les tests actuels

La suite [security-regression.test.js](../../../test/security-regression.test.js) travaille avec un fichier de base et un fichier de log temporaires propres à l'exécution. Elle couvre notamment :

- expression de filtre rejetée et filtre déclaratif accepté;
- champs de privilège refusés sur le profil;
- jetons distincts, expiration, révocation et invalidation après suppression;
- sentinelles de mot de passe absentes des journaux;
- scrypt salé et migration d'un SHA-256 seulement après mot de passe correct;
- absence de secrets dans les réponses utilisateur;
- accès interentreprises refusés lorsque l'appartenance est absente, falsifiée ou modifiée;
- RH exclus des questionnaires individuels et coach limité à une affectation explicite vérifiée, indépendante de son employeur;
- export assureur sans donnée;
- effacement des objets associés;
- invalidation d'un ancien indicateur forcé à `true`, nouveau choix, retrait et persistance après rechargement.

Les tests généraux de santé de l'API, d'inscription/profil et d'enregistrement d'un questionnaire complètent ces régressions. Les commandes de recette sont :

```text
npm test
npm run lint
node scripts/audit/verify-cvss.js
git diff --check
```

Le seed doit être vérifié avec `DB_FILE` pointant vers un fichier temporaire. Il ne faut pas exécuter `npm run seed` sur la base locale existante pour masquer un défaut de migration ou faire passer un test.

## Baseline historique et branche corrigée

Le script `scripts/audit/reproduce-findings.js` est une preuve de reproduction historique, mais il copie le **code présent dans le répertoire de travail**. Le simple affichage du hash `e16cedc…` ne prouve donc pas que ce code historique a réellement été exécuté. Il ne doit pas être utilisé comme preuve de non-régression des correctifs.

La preuve des corrections repose sur les tests actuels, exécutés contre le code du HEAD de la branche et sur des fichiers temporaires. Reproduire strictement la baseline nécessiterait un checkout ou worktree propre du commit de référence, opération qui n'a pas été faite ici afin de ne pas remplacer les changements locaux existants.

## Interprétation des résultats

Un test vert démontre le comportement couvert dans cet environnement pédagogique. Il ne démontre ni le déploiement en production, ni la licéité de la collecte de santé, ni l'efficacité d'une procédure organisationnelle absente. Les réserves correspondantes sont consignées dans [C.3](03-risques-residuels.md).
