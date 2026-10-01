# Annexe — Transparence sur l'utilisation de l'IA

Version 1.3 — 1er octobre 2026. Cette annexe couvre l'audit, les corrections, les parties A à E et la préparation du rendu.

## 1. Outils utilisés et contributions

L'IA a participé substantiellement à l'analyse, à la rédaction et au développement, et pas seulement à la correction orthographique. Plusieurs conversations ont été utilisées pour séparer propositions, implémentations et revues; une seconde réponse d'IA ne constitue pas une validation indépendante.

| Outil et usage | Parties concernées et productions |
|---|---|
| Codex, assistant de développement OpenAI dans l'espace de travail | Lecture de l'énoncé et du code, préservation de la version initiale, audit, assistance aux textes A–C, correctifs et tests, revue de D, vérification du barème, consolidation documentaire, présente annexe et présentation E (texte, mise en page HTML/PDF, notes orales et script de rendu) |
| ChatGPT, autre conversation avec connexion GitHub | Revue sur `review/fiabilisation-audit` : fiabilisation des preuves, tests et workflow; rédaction de D sur `docs/partie-d-agile` : backlog, capacité, budget et sources |
| Navigation Web pilotée par les assistants | Vérification des références CNIL/RGPD/CEPD, FIRST, OWASP, Scrum et GitHub utilisées dans les documents; ces organismes sont les sources, pas des outils d'IA |
| Git, terminal PowerShell, scripts Node/Python et GitHub Actions, utilisés par les assistants | Comparaison des versions, calculs et contrôles reproductibles. Ces outils d'exécution ne sont pas des modèles génératifs et leurs résultats ne prouvent pas à eux seuls la conformité |

Les versions exactes des modèles de chaque conversation n'ont pas été consignées de façon fiable : aucun numéro de modèle n'est reconstitué. Les sources documentaires de la revue et de D sont conservées dans le [complément de revue](../../audit/preuves/05-journal-ia-revue.md) et les [sources et contrôles de D](../partie-d/annexes/sources-et-controles.md).

## 2. Principales requêtes formulées

Les demandes ci-dessous sont des **reformulations synthétiques**, non des citations intégrales. Elles reprennent les échanges disponibles et les journaux de travail; les prompts complets des autres conversations ne sont pas tous conservés.

| Étape | Demande principale | Effet recherché |
|---|---|---|
| Audit initial | Comprendre le projet et examiner les éléments susceptibles d'induire l'analyse en erreur avant de traiter le sujet | Vérifier les mécanismes réellement utilisés, sans déduire une protection du seul nom d'une fonction ou d'un commentaire |
| Préservation | Sécuriser le point de départ et établir les preuves | Garder une version initiale identifiable, travailler sur une branche et isoler les essais |
| A et B | Vérifier les parties rédigées, notamment la longueur d'A.1, leur conformité à l'énoncé et les risques de perdre des points au barème | Relier chaque constat au projet et aux sources; distinguer faits, hypothèses et limites |
| C | Transmettre les corrections à la conversation d'implémentation, puis tester les problèmes évoqués et leurs corrections | Obtenir des correctifs traçables et des preuves de non-régression |
| Revue et D | Examiner la pertinence de l'audit, des corrections et de D produits par l'autre conversation; implémenter les recommandations retenues | Revoir l'outillage, les références, les stories et les calculs sans inventer de règles métier |
| Clôture | Vérifier le fond, actualiser les statuts, distinguer recettes historiques et actuelles, puis enregistrer et publier les corrections | Éviter les contradictions entre dossier, commits et résultats |
| Présente annexe | Finaliser l'annexe de transparence IA | Déclarer les contributions, les demandes et les erreurs corrigées, sans inventer de traces |
| E | Faire la présentation de cinq minutes et préciser si le support sera un PDF | Produire cinq diapositives pour la direction, une source modifiable et des notes de répétition |

La demande initiale parlait de « pièges » posés par l'IA à l'origine du projet. L'audit établit des comportements et des incohérences observables, **pas une intention de tromper** de cet auteur supposé.

## 3. Erreurs et imprécisions détectées et corrigées

Les cas IA-01 à IA-05 proviennent des fragments consignés pendant la revue d'A.2 dans le journal préparatoire local `03-journal-ia-phase-initiale.md`. Ils sont repris ici pour rendre l'annexe autonome : cette trace n'est pas un export intégral des conversations, et les crochets signalent les coupures déjà présentes dans le journal. Les cas IA-06 et IA-07 disposent en plus d'un historique Git vérifiable.

Ces corrections sont issues du processus de revue assistée. Elles ne sont pas présentées comme sept découvertes faites personnellement et sans aide par l'étudiant.

### IA-01 — Confondre choix techniques et responsabilité du traitement

**Fragment conservé :** « WellWork devient toutefois responsable […] par exemple [pour] ses propres opérations de sécurité ».

**Correction :** le choix d'outils ou de mesures techniques ne suffit pas à changer le rôle. Distinguer l'exécution sur instruction d'une finalité autonome décidée par WellWork. Correction intégrée dans [A.2](../partie-a/02-bases-legales-et-acteurs.md), hypothèse générale et RT-07. Justification : [CNIL — identifier son rôle](https://www.cnil.fr/fr/rgpd-comment-bien-identifier-son-role), distinction des moyens essentiels et non essentiels.

### IA-02 — Présenter le contrat comme une base préférable par principe

**Fragment conservé :** « L'article 6(1)(b) serait préférable seulement si un contrat […] lie directement le salarié ».

**Correction :** remplacer « préférable » par « applicable sous conditions » : nécessité objective et contrat auquel la personne est partie. L'existence d'un contrat ne crée pas une priorité automatique sur les autres bases. Correction intégrée dans A.2, RT-01. Justification : [article 6(1)(b)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2) et [CNIL — absence de hiérarchie entre bases légales](https://www.cnil.fr/la-liceite-du-traitement-lessentiel-sur-les-bases-legales-prevues-par-le-rgpd).

### IA-03 — Déclarer une donnée inutile sans connaître tous les besoins

**Fragment conservé :** « la date de naissance inutile ».

**Correction :** sa nécessité n'est **pas démontrée** dans le support; cela ne permet pas d'exclure tout usage justifié. A.2, RT-01, demande cette justification. Preuve du champ : [comptes de la version initiale, lignes 12–25](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/routes/accounts.js#L12-L25). Justification : [article 5(1)(c), minimisation](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2).

### IA-04 — Oublier que stocker un message constitue déjà un traitement

**Fragment conservé :** « Si WellWork prévoit ou exploite des messages de santé ».

**Correction :** dès que le contenu stocké comporte des données de santé, l'analyse de l'article 9 s'impose aussi sans exploitation médicale. Correction intégrée dans A.2, RT-03. Preuve : [insertion des messages, lignes 38–41](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/routes/data.js#L38-L41). Justification : [article 4(2), définition du traitement](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre1) et [article 9](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2).

### IA-05 — Réduire excessivement l'exception de l'article 9(2)(h)

**Fragment conservé :** « L'article 9(2)(h) ne peut être invoqué sans cadre de soins ».

**Correction :** cette exception couvre aussi, notamment, la médecine préventive ou du travail; vérifier la finalité admissible, le fondement prévu et les garanties de secret. A.2, RT-02, ne présume pas qu'un coach bien-être remplit ces conditions. Justification : [articles 9(2)(h) et 9(3)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2).

### IA-06 — Valider un faux positif possible dans l'outil de preuve

**Production concernée :** le validateur issu de la revue ChatGPT confirmait PRIV-03 à partir de deux indicateurs booléens, sans corroboration HTTP. L'expression historique `company !== 'AuditTenant'` peut être vraie lorsque `company` est absent d'une réponse d'erreur.

**Correction :** exiger aussi les observations réussies du profil et de l'annuaire. Le contre-exemple HTTP 403 doit être rejeté; le scénario réellement vulnérable doit rester confirmé. Source avant correction : [validateur, commit 261b27b](https://github.com/christopherDEPASQUAL/RGPD/blob/261b27bfa2f990c6920e74bd3a10d3a3c9cf094f/support/scripts/audit/validate-observations.js#L4-L9). Preuve de correction : [commit 7b8c3fe et ses trois tests](https://github.com/christopherDEPASQUAL/RGPD/commit/7b8c3fe76768ef6d39106f544ab07aea6b312e98). Il s'agit d'une erreur de preuve, pas d'une nouvelle faille de l'application.

### IA-07 — Écrire une abuser story du point de vue du lecteur trompé

**Production concernée :** D-01 décrivait un lecteur acceptant une preuve erronée, sans décrire l'acteur à l'origine de l'abus.

**Correction :** décrire le contributeur négligent ou malveillant qui présente les résultats d'un mauvais commit comme valides. Le critère vérifie ensuite la provenance des preuves. Sources : [formulation initiale](https://github.com/christopherDEPASQUAL/RGPD/blob/261b27bfa2f990c6920e74bd3a10d3a3c9cf094f/support/docs/dossier/partie-d/annexes/backlog-detaille.md#L31-L39) et [correction 730c79b](https://github.com/christopherDEPASQUAL/RGPD/commit/730c79b903434b481c11f637002e99543022e77a), rapprochées de l'exigence d'abuser stories de l'[énoncé, page 2](../../../enonce.pdf). C'est une amélioration de conception du scénario, pas une obligation juridique.

Les difficultés de commande PowerShell ne sont pas utilisées pour remplir le minimum de cinq erreurs de contenu. La mention « injection SQL » n'est pas attribuée à l'IA, faute de sortie initiale conservée permettant cette attribution.

## 4. Vérifications, intervention personnelle et limites

**Contrôles outillés.** Sur une copie propre du commit `3d00b4b`, la recette locale a réussi : 30 tests, lint sans diagnostic, 10 scores CVSS recalculés, 12 constats dynamiques et 1 statique retrouvés sur la version initiale vérifiée. La [recette GitHub du même commit](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36909164181) a réussi sous Linux et Windows. Les recettes antérieures restent datées séparément dans [C.2](../partie-c/02-correctifs-et-preuves.md); ces succès ne mesurent ni une conformité globale ni une compréhension personnelle.

**Intervention déclarée par l'étudiant.** Les échanges montrent des demandes d'explication, de réduction des textes et de vérification par rapport au barème. Avant cette annexe, l'étudiant a déclaré avoir consulté le site de la CNIL pour contrôler les problèmes RGPD, puis reproduit les comportements graves sur les fonctions originales. Le détail de chaque essai personnel et ses captures n'a pas été fourni dans ces échanges : aucune liste exhaustive de tests personnels n'est donc attestée ici.

**Limites assumées.** Les recherches, calculs, relectures et tests effectués par les assistants ne sont pas réattribués à l'étudiant. Les cinq corrections juridiques ont été rapprochées des sources officielles lors de la consolidation; les deux autres sont rattachées au code et à l'historique. Aucun avis réel de DPO, contrat signé, incident de production confirmé ou sprint exécuté n'est inventé. Les hypothèses d'équipe et de budget restent celles de D.

**Préparation du rendu.** L'assistant a rédigé les cinq diapositives de E et les notes orales, puis créé la mise en page et les scripts de génération des deux PDF. Il a contrôlé la pagination, les débordements et les liens. À la demande de l'étudiant, il a ensuite allégé les répétitions et les commentaires de procédure, en conservant les preuves et les limites de fond. L'historique Git d'origine a été retenu pour la remise.

La relecture finale et la répétition chronométrée de la présentation restent à effectuer par l'étudiant.
