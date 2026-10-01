# Partie E — Support du comité de direction

- [Présentation PDF](partie-e.pdf) : cinq diapositives au format 16:9, à projeter.
- [Source HTML](partie-e.html) : texte et mise en page modifiables, sans dépendance ni ressource distante.
- [Notes orales](notes-orales.md) : discours proposé, repères de temps et réponses aux questions.

Ce support est distinct du dossier PDF A–D de 30 pages maximum hors annexes. Les cinq diapositives couvrent situation, risques, corrections, plan/budget et décisions. Les sources sont identifiées en pied de page et détaillées dans les notes. La durée de cinq minutes doit être vérifiée par une répétition personnelle.

## Régénérer après modification

Le rendu nécessite Node **22 ou ultérieur** et Chrome/Edge installé, sans ajouter de paquet au projet. Depuis `support/` :

```powershell
node docs/presentation/render.cjs
```

Si le navigateur n'est pas trouvé, définir `PRESENTATION_BROWSER` avec son chemin absolu. Le script lance un navigateur invisible avec un profil temporaire isolé et un port de contrôle local, ouvre le HTML local, contrôle les débordements et génère `partie-e.pdf`. Il conserve cinq aperçus PNG et le profil dans le répertoire temporaire affiché. Aucun service de conversion externe n'est utilisé. En cas de débordement détecté, le PDF précédent n'est pas remplacé; corriger le HTML et relancer.

Une restriction d'exécution du navigateur peut empêcher le rendu dans un environnement cloisonné; elle ne justifie pas de désactiver ses protections. Le PDF fourni reste consultable sans Node ni navigateur de développement.

## Contrôles de cette version

Le 1er octobre 2026 : cinq pages 16:9 confirmées par lecture du PDF; texte extrait et rapproché des diapositives; cinq rendus visuels examinés; absence de débordement de blocs vers les pieds de page. Un chevauchement de la zone de preuves en diapositive 3 a été corrigé avant export final. Le budget reprend les hypothèses de D, pas un devis. Les 30 tests affichés concernent le commit `3d00b4b` et sa recette, non une certification.

La création et le contrôle du support par l'assistant sont déclarés dans l'[annexe IA](../dossier/annexes/01-transparence-ia.md). Ni répétition personnelle chronométrée ni validation par un comité réel ne sont prétendues réalisées.
