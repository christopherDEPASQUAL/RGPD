# Partie E — Notes pour une présentation de cinq minutes

Support : [PDF à projeter](partie-e.pdf) et [source HTML modifiable](partie-e.html). Les cinq minutes sont une cible de répétition, pas une durée mesurée de l'étudiant. Le texte ci-dessous sert de guide; ne pas lire toutes les diapositives mot à mot.

## 1 — Situation · 0:00 à 0:45

WellWork doit rétablir la confiance avant le renouvellement d'un grand contrat. Le sujet signale aussi un fichier d'utilisateurs sur un forum. Notre audit a reproduit des défauts graves sur la version initiale, avec des données fictives. En revanche, nous ne disposons ni du fichier signalé ni des traces permettant d'établir l'origine et l'étendue de cette fuite.

Le résultat est donc double : plusieurs protections ont été corrigées et testées, mais cela ne suffit pas à autoriser une utilisation réelle. Je recommande de rester dans un périmètre fictif et contrôlé, tout en finançant les travaux et décisions encore nécessaires.

## 2 — Risques · 0:45 à 1:40

Trois risques expliquent cette recommandation. Premièrement, dans la version initiale, un utilisateur pouvait consulter la santé d'une autre personne, y compris d'une autre entreprise. Un export rassemblait aussi trop de données. Pour les salariés, cela crée des risques de discrimination, de chantage et d'atteinte à la vie privée.

Deuxièmement, les droits d'accès étaient fragiles : un salarié pouvait modifier son propre rôle, et des secrets étaient insuffisamment protégés. Troisièmement, une demande de suppression ne fermait pas réellement les accès et conservait les données.

Pour WellWork, les enjeux sont la confiance des clients, le renouvellement du contrat et le coût de réponse à un incident. Ces conséquences sont des risques : nous ne prétendons pas qu'elles se sont déjà produites.

## 3 — Corrections et limites · 1:40 à 2:40

Dans la version corrigée, les accès sont restreints, l'export assureur est suspendu, et les mots de passe et connexions sont mieux protégés. Le mécanisme permettant d'exécuter une instruction fournie par l'utilisateur a été supprimé. L'effacement fonctionne dans la base active et les préférences marketing ne sont plus imposées.

Trente tests ont réussi, y compris sur les environnements Linux et Windows. Ils vérifient les comportements couverts, mais ne constituent pas une certification.

Il reste notamment à justifier les usages de santé, à informer les salariés, à organiser qui attribue les droits et à traiter les anciennes copies. Les choix marketing ne remplacent pas un éventuel accord spécifique pour la santé. Nous ne déclarons donc ni la conformité globale ni un déploiement réel.

## 4 — Plan et budget · 2:40 à 4:00

La réponse au signalement doit commencer immédiatement : qualifier les faits, préserver les preuves et contenir l'exposition identifiée. Elle ne doit pas attendre la fin du projet.

Ensuite, le plan prévoit trois périodes de deux semaines. La première stabilise la sécurité et clarifie les usages et les règles d'accès. La deuxième met en œuvre l'information, les droits et la conservation. La troisième éprouve le stockage et la restauration, puis prépare une décision d'essai limité avec de vrais utilisateurs, ou de maintien fermé.

L'enveloppe proposée est d'environ quatre-vingt-six mille euros hors taxes. Elle comprend les disponibilités réservées de l'équipe, la mobilisation initiale et l'environnement de test. Les coûts journaliers sont des hypothèses, pas des devis; les réserves sont déjà incluses.

Le budget ne couvre pas une crise prolongée ni l'exploitation après ces six semaines. Si les contrats, les décisions ou l'architecture réelle changent les besoins, il faudra réestimer. Le calendrier ne garantit donc pas une ouverture automatique.

## 5 — Décisions · 4:00 à 5:00

Je soumets trois décisions à la direction. D'abord, maintenir les restrictions : uniquement des données fictives dans le support, pas de réouverture de l'export assureur et traitement immédiat du signalement.

Ensuite, réserver l'enveloppe et les compétences nécessaires, et identifier les responsables des décisions métier, de la sécurité et de la protection des données. Les experts conseillent; ils ne remplacent pas le responsable compétent pour décider des traitements.

Enfin, conditionner tout essai réel à des preuves : usages justifiés, droits effectivement maîtrisés, contrats requis et restauration vérifiés. Si une condition bloque, nous reportons l'ouverture ou réduisons explicitement le périmètre.

L'objectif n'est pas d'acheter une promesse de conformité. C'est de réduire les risques de façon démontrable, pour protéger les salariés et présenter au client un plan crédible.

## Repères pour les questions — hors des cinq minutes

- **D'où viennent les preuves ?** B décrit la version initiale `e16cedc`; C décrit les corrections. La [recette du commit 3d00b4b](https://github.com/christopherDEPASQUAL/RGPD/actions/runs/36909164181) a réussi sous Linux et Windows. Un test ne démontre que le scénario couvert.
- **Pourquoi ce budget ?** D prévoit 26 950 € par période × 3, plus 3 487,50 € de mobilisation et 1 500 € d'environnement : 85 837,50 € HT. Les disponibilités, événements et réserves sont inclus; ne pas ajouter un pourcentage de réserve une seconde fois. Voir [D](../dossier/partie-d/README.md) et [planning.json](../dossier/partie-d/annexes/planning.json) pour les exclusions complètes et les taux hypothétiques.
- **Les risques sont-ils acceptés ?** Aucune acceptation organisationnelle réelle n'est obtenue. C.3 propose uniquement une tolérance du stockage JSON pour une démonstration fictive locale; pas pour des données réelles.
- **Faut-il notifier la CNIL ?** Se référer à B.3 : distinguer le signalement non qualifié du scénario d'une divulgation confirmée; les modèles de notification ne sont pas des envois réalisés. Ne pas attendre la cause exacte si une notification est déjà requise.
- **Que signifient les sigles du dossier ?** RGPD : règlement général sur la protection des données. DPO : délégué à la protection des données. RSSI : responsable de la sécurité des systèmes d'information. AIPD : analyse d'impact sur la protection des données. Ces sigles ne sont pas nécessaires au discours projeté.

## Traçabilité et répétition

| Diapositive | Références du dossier |
|---|---|
| 1 — Situation | Énoncé, B.2 et C.3 : contexte commercial, signalement et limites |
| 2 — Risques | A.3–A.4 et B.1 : accès tiers, privilèges, authentifiants et suppression |
| 3 — Corrections | C.2, C.3 et recette GitHub : acquis techniques et limites |
| 4 — Plan et budget | D.3 et planning.json : immédiat, trois périodes, capacité, hypothèses et exclusions |
| 5 — Décisions | A.2, C.3 et D.4–D.5 : responsabilités, conditions de lancement et arbitrages |

Faire une répétition chronométrée personnelle. Si le temps dépasse cinq minutes, raccourcir les exemples, pas les réserves sur la fuite, le budget ou l'autorisation d'utiliser des données réelles. La soutenance et sa durée effective ne sont pas attestées par ces notes. Ce PDF de présentation est distinct du dossier A–D limité à 30 pages hors annexes.
