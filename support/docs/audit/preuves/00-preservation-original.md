# Preuve de préservation de l'original

## Copie locale

- source : `C:\Users\Christopher\Desktop\RATTRAPAGE RGPD\RGPD\support` ;
- destination hors Git : `C:\Users\Christopher\Desktop\RATTRAPAGE RGPD\preservation-originale\support-original-20260930T-audit` ;
- date de l'opération : 30 septembre 2026 ;
- fichiers copiés : 20 ;
- taille totale : 654 531 octets ;
- exclusion : `node_modules/**` uniquement ;
- contrôle après copie : 20 empreintes sur 20 identiques ;
- manifeste original : `SHA256-manifest.json` dans la destination hors Git.

La copie inclut les fichiers initiaux `.env`, `db/wellwork.json` et `logs/app.log`. Ils ne sont pas ajoutés à Git et leur contenu n'est pas reproduit dans la documentation. Les empreintes servent à prouver l'intégrité, pas à révéler leur contenu.

## Inventaire et SHA-256

| Chemin original | Octets | SHA-256 |
|---|---:|---|
| `.env` | 109 | `75cb8fbd7b2c9766b1206ead263810629276eab62732f950a55c12f60cb5294c` |
| `.gitignore` | 20 | `a3f99acad89f776d5ea7ab0e2ee6b789b0bac589dc866dcc5c90ca68f66adfc8` |
| `db/seed.js` | 3 588 | `b49471f5b6215c3804f29efbaae583b245e4a9de0234035fe7bee1ed577c2dfe` |
| `db/wellwork.json` | 75 057 | `5b5e6f5d0bb68dd75ad2c10c64e87d3addfdaec377466f35b50f5975896b29ee` |
| `enonce.pdf` | 488 062 | `023ee6727c428bdf31f7ffe6851a90e7179dd36100d0d21019928b2d6c94afbe` |
| `eslint.config.js` | 438 | `9844e22da029ffcec559407296365e358b49e9941aa5a7a83628ef74ddd4549e` |
| `logs/app.log` | 209 | `28494e9ecf83437ae66c759decf7de4519b49081d68786671479b2f832633d8a` |
| `package.json` | 561 | `24573135b395e2b4be10f64aa212633721fd7bbfbd1a935f34c2e948230e0603` |
| `package-lock.json` | 70 272 | `c971351452618715c26c9eaa00ea12fa91a9b6adde89c10c7f81bbdd2d553ed4` |
| `public/index.html` | 2 619 | `93b36ad24840218d044e83ced4c397900ffbee8fd418935001621c6b85033a81` |
| `README.md` | 1 493 | `efad275036ccc7494ec808e204e3bab916ab3aa08ad9940e26bd748c006e6bff` |
| `src/app.js` | 844 | `3135c2f407794b6b5774ac1b6671e43c79cf391d4aa70ad75ede57b42a24a90f` |
| `src/auth.js` | 1 452 | `c08a8e8812fb8621c35f7ba70847964f6d857292f07a1325fca6b23f3013eff8` |
| `src/config.js` | 435 | `b49986afef9f24596a5fc02d6b8e6ff9abf3ec87c2791a99ade1120a12cce1fa` |
| `src/db.js` | 1 958 | `98e1b84692fa449c831415a0213275b0c16a17a45343e192d09466b23eb8e326` |
| `src/logger.js` | 642 | `0571941949ad20cc5739896b968f8a770ab4ca54e2e6b5dcf148a833d02c8114` |
| `src/routes/accounts.js` | 2 386 | `621d90acada616be5440a77bc2aaf075f7fcb53a95c268b4b0003de1fc23c65f` |
| `src/routes/data.js` | 2 130 | `7fc0ba00e173c6d87847baf20373183b97e747ee6f286cb81befa4580a8fe9f8` |
| `src/server.js` | 229 | `eb573650771117d3807cc0ee3fbf83c367a92b1962f97d9acab5c6651b30b63b` |
| `test/smoke.test.js` | 2 027 | `6338c00c594506f939034478cc41bc2f1862ea482024dea0dea9717dbf9f016d` |

## Différence volontaire de la baseline

Avant le commit, quatre champs de `src/config.js` ont été neutralisés sans recopier leurs valeurs : secret de session, clé d'API assureur, hôte SMTP et mot de passe SMTP. La version neutralisée a pour SHA-256 `a075581a13ba8c79cc60d72666d158ff36ec79ba7c6f961dcae1ca9ea063d5e9`. La version originale reste identifiable par l'empreinte du tableau ci-dessus.

La recherche statique n'a trouvé aucun import de ce fichier. La neutralisation protège la baseline sans masquer un comportement exécuté par l'application.
