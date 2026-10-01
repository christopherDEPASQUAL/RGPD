# WellWork — branche de remédiation

Support pédagogique B2B de bien-être au travail. Données fictives uniquement : cette branche n'est pas déclarée prête à recevoir des données réelles de santé. L'export assureur est suspendu; les conditions juridiques et organisationnelles restant ouvertes figurent dans [C.3](docs/dossier/partie-c/03-risques-residuels.md).

## Installation et lancement local

Depuis `support/`, avec Git et une version compatible de Node.js (`>=20`, recette de revue sous Node 22) :

```bash
npm ci --ignore-scripts
npm test
npm run lint
```

**Seulement pour créer une nouvelle base fictive :**

```bash
npm run seed
npm start
```

Ouvrir `http://localhost:3000`. Ne pas exposer ce support sur Internet. `npm run seed` remplace le fichier de base; ne pas l'utiliser pour tester une migration sur une base existante. Pour isoler une nouvelle fixture, définir `DB_FILE` vers un fichier temporaire. Les tests utilisent leurs propres fichiers temporaires.

L'application ne charge pas automatiquement `.env`. Fournir les variables à l'environnement du processus; voir `.env.example`. Sous PowerShell, utiliser `npm.cmd` si la politique d'exécution bloque `npm.ps1`, sans désactiver cette politique.

## Comptes de démonstration

Les identifiants et mots de passe fictifs historiques sont conservés dans le [README du support initial](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/README.md). Le seed corrigé crée 63 comptes et 132 questionnaires, mais **aucune session active préchargée**. Il inclut des comptes historiquement marqués supprimés pour vérifier leur exclusion. Ces nombres ne décrivent pas une production ni des victimes réelles.

Le RH ACME dispose d'un périmètre fictif vérifié. Le coach n'a aucune affectation par défaut. Un utilisateur qui déclare « ACME » à l'inscription n'obtient pas les droits de cette entreprise. Le provisionnement des habilitations reste à organiser; aucun accès global implicite n'est ajouté à l'administrateur.

## API actuelle

| Méthode | Route | Comportement principal |
|---|---|---|
| POST | `/api/register` | Inscription salarié; préférences non acceptées par défaut; aucun rattachement vérifié autodéclaré |
| POST | `/api/login` | Connexion; migration d'une empreinte héritée après authentification réussie |
| GET | `/api/me` | Profil courant, sans propriétés internes sensibles |
| PATCH | `/api/me` | `firstName`, `lastName`, `birthDate` uniquement |
| DELETE | `/api/me` | Effacement du graphe connu de la base active et fermeture des accès; limites hors base active en C.3 |
| GET/PATCH | `/api/preferences` | Lecture et enregistrement des deux choix booléens `marketing` et `thirdParty`; ne couvre pas le consentement santé |
| POST | `/api/questionnaires` | Enregistrement fictif; cadre juridique et validation des champs encore à traiter |
| GET | `/api/users/:id` | Soi-même, RH du périmètre vérifié ou coach affecté; aucune santé individuelle pour les RH |
| GET | `/api/users?role=employee` | Annuaire limité aux RH/coachs autorisés; seul le filtre `role` est accepté |
| POST/GET | `/api/messages` | Destinataire actif requis, lecture limitée aux participants; règle de relation de coaching encore à décider |
| GET | `/api/exports/insurer` | Salarié refusé; RH/admin : HTTP 503 sans export ni création de trace d'export |

L'ancien paramètre `filter` n'est plus accepté. Le fonctionnement historique reste consultable au commit initial, pas dans ce tableau.

## Deux validations distinctes

**Code corrigé :**

```bash
npm test
npm run lint
node scripts/audit/verify-cvss.js
git diff --check 7fbb8f942696bf161ac5e9ead628f1aa740fa00e HEAD
```

**Preuves de la version vulnérable :**

```bash
node scripts/audit/reproduce-findings.js
```

Le lanceur extrait les fichiers du commit exact `e16cedcf0f8adb359621240366c8f0cbb251b8c9` depuis les objets Git et vérifie leurs empreintes. Il ne fait ni checkout, ni reset, ni modification de la base courante. Le script historique est conservé sans modification dans `scripts/audit/historical-harness.js`, mais **ne doit pas être lancé directement** : le nouveau lanceur fournit la bonne version du code et valide les observations au lieu de croire les anciens libellés de statut.

Un clone contenant l'historique et des dépendances installées avec le lockfile compatible est nécessaire. Un ZIP sans `.git`, un commit absent ou un lockfile différent provoque un refus explicite, jamais un repli silencieux sur le code courant. La sortie JSON contient le commit audité, le manifeste des sources, l'environnement, les observations et `summary.failed`. Le code de sortie vaut 1 si une observation attendue n'est pas retrouvée. Aucun jeton ni contenu de questionnaire n'est publié. Les fichiers temporaires sont supprimés.

## Documents et validation de revue

Les parties A et B décrivent l'état initial; C décrit les correctifs et leurs limites. Voir la [synthèse et les statuts](docs/dossier/00-synthese-et-statuts.md) et la [note de fiabilisation](docs/audit/preuves/04-fiabilisation-et-recette.md).

Le workflow `Audit review validation` teste cette branche de revue sous Linux et Windows. Il conserve pendant sept jours uniquement les résultats expurgés de recette, pas les bases ni les journaux applicatifs. Un workflow vert ne démontre ni conformité globale ni aptitude à la production.

## Stack

Node.js, Express, stockage fichier JSON, interface statique dans `public/`. Aucune base SQL à installer.
