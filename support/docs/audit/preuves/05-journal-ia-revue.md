# Transparence IA — complément de revue

1er octobre 2026. Ce complément s'ajoute au journal de phase initiale; il ne remplace pas l'annexe finale demandée par l'énoncé.

## Demande et périmètre

L'utilisateur a autorisé une branche distincte et une pull request sans fusion automatique, en demandant explicitement de ne pas appliquer des corrections dénuées de sens. Un assistant conversationnel, avec le connecteur GitHub, a préparé les changements et déclenché leur validation.

Travail réalisé : lecture des sources et de l'historique; création de `review/fiabilisation-audit`; extraction vérifiée de la baseline; réutilisation sans modification des scénarios historiques; validation des observations; tests complémentaires; workflow de recette; README et notes de synthèse. Le code métier, le lockfile, les analyses juridiques et les scores du rapport ont été conservés.

## Vérifications et limites

Les résultats ne sont pas présentés comme des vérifications manuelles effectuées par l'étudiant. La [recette GitHub Actions](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36857703645) identifie le commit réellement testé; la [note de recette](04-fiabilisation-et-recette.md) distingue les résultats observés des limites restantes. Les permissions du workflow sont en lecture seule.

Une première proposition consistait à réécrire largement le script de reproduction. Cette écriture n'a pas abouti. La version finalement retenue conserve au contraire les scénarios existants dans un fichier historique dont l'empreinte est vérifiée, et ajoute un lanceur de provenance et une validation des résultats. Elle a été testée en CI.

La tentative de remplacement intégral d'un document de constats n'a pas abouti non plus. Aucun changement de ce document n'est donc revendiqué : un index de références immuables a été ajouté séparément, et la normalisation exhaustive des liens internes reste explicitement ouverte. Ces incidents de méthode ne sont pas présentés comme de nouvelles non-conformités de WellWork.

Les cinq cas d'erreurs de la phase initiale restent à rattacher, dans l'annexe finale, à une véritable proposition ou affirmation de l'IA, à la correction et à la source ou preuve justificative. Un simple problème d'environnement ne doit pas être artificiellement présenté comme une erreur d'analyse de l'IA. Aucune erreur supplémentaire n'est inventée pour atteindre un quota.
