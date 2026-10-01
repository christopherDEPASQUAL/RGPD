# Dossier PDF final

[Dossier_remediation_WellWork.pdf](Dossier_remediation_WellWork.pdf) contient A–D et les annexes : **30 pages de corps, couverture et sommaire inclus, puis 19 pages d'annexes**, soit 49 pages. E reste [un PDF distinct de cinq diapositives](../presentation/partie-e.pdf).

## Contenu

Les onze sources A–D sont intégrées sans résumé supplémentaire. Les tableaux d'au moins quatre colonnes deviennent des fiches conservant leurs cellules; les autres tableaux peuvent se poursuivre avec leur en-tête répété. Seule la consigne interne d'assemblage terminant le Markdown de D est omise de l'export. Elle reste dans la source. Les annexes regroupent la transparence IA, le backlog, les données chiffrées de planification présentées en tableaux, les sources de D et deux documents de preuves historiques.

Les détails des recettes historiques restent en annexe; C.2 présente les corrections et les résultats essentiels. Les notes personnelles et la base applicative ne sont pas intégrées.

Les références internes deviennent des destinations du PDF. Les liens vers le code pointent vers des commits GitHub. Le dépôt doit être accessible au correcteur pour les ouvrir. Le manifeste `sources.json` conserve les empreintes des textes utilisés et le commit de référence de la génération.

## Régénération locale

Prévoir Python 3 avec `markdown-it-py`, Node >= 22 et Chrome ou Edge. Aucun ajout de dépendance à l'application ou modification du lockfile n'est nécessaire. Depuis `support/` :

```text
node docs/rendu/render.cjs
```

`PYTHON` et `REPORT_BROWSER` permettent de désigner les exécutables. Le navigateur fonctionne sans fenêtre, avec un profil isolé dans le répertoire temporaire et sans désactiver son bac à sable. Le rendu n'utilise ni données applicatives ni ressources Web. Il conserve les aperçus temporaires pour relecture.

`build.py` assemble les sources et leur manifeste SHA-256 dans `sources.json`. `paginate.js` calcule le sommaire et la pagination. `render.cjs` refuse de remplacer le PDF final si le corps dépasse 30 pages, si des blocs sources sont absents, si un renvoi interne manque ou si une page déborde. Le diagnostic est enregistré dans `verification.json`. Toute modification de texte impose une nouvelle génération et une nouvelle vérification de la limite.

## Contrôles du 1er octobre 2026

- Pagination du PDF lui-même vérifiée par extraction : 49 pages A4, annexe IA à la page 31, aucune page vide; fin de D à la page 30.
- Sommaire et références internes contrôlés par le rendu; aucun renvoi interne manquant ni bloc de texte absent.
- Aperçus de couverture, sommaire et pages de contenu examinés pour la lisibilité; texte extrait contrôlé. Le fichier reste dense pour respecter le format demandé.
- Suite applicative : 30 tests réussis; ESLint sans diagnostic. Les essais utilisent des fichiers temporaires.

Avant remise : relire le PDF et vérifier l'accès au dépôt depuis le lien de la branche finale.
