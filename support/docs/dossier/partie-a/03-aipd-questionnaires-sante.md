# Partie A.3 — AIPD des questionnaires de santé

- **Version :** 1.1 — 1er octobre 2026
- **Référence :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`
- **Statut :** analyse du cas pédagogique et mesures proposées; aucune validation organisationnelle ni remédiation technique n'est présumée.

## 1. Obligation et périmètre retenu

L'AIPD est obligatoire pour le traitement de santé des salariés décrit dans le sujet : données sensibles et déséquilibre employeur–salarié se combinent à des accès interentreprises et à un export nominatif. Le traitement est susceptible d'engendrer un risque élevé pour les personnes, au sens de l'[article 35(1)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4#Article35).

Deux critères des [lignes directrices WP248 rév.01, pages 11 à 13](https://www.cnil.fr/sites/cnil/files/atoms/files/wp248_rev.01_fr.pdf) sont établis : données sensibles (antécédents, traitements médicaux) et personnes vulnérables dans la relation de travail. Le cumul est un indicateur fort, pas une règle automatique remplaçant l'analyse du contexte. Les impacts professionnels possibles et les destinataires multiples confirment ici le risque élevé.

La grande échelle, le profilage et la décision automatisée ne sont pas démontrés : les 63 comptes de démonstration ne mesurent pas la population réelle. On ne fonde donc pas la conclusion sur l'article 35(3)(b). Les [listes CNIL](https://www.cnil.fr/fr/listes-des-traitements-pour-lesquels-une-aipd-est-requise-ou-non) ne permettent ni d'assimiler ce service à un établissement de soins, ni d'appliquer sans vérification l'exemption relative à certaines gestions RH courantes.

**Traitement choisi : RT-02**, depuis la collecte des réponses jusqu'à leur consultation, export et effacement. RT-01, RT-04 et RT-05 sont inclus comme dépendances : ils permettent l'identification et l'exposition des questionnaires. Ce périmètre est prioritaire car il associe identité, santé et contexte professionnel. RT-03 et RT-08 devront être réévalués si leurs usages réels révèlent de la santé.

## 2. Description du traitement — article 35(7)(a)

La finalité annoncée est l'accompagnement au bien-être; les usages précis de prévention et d'assurance restent à justifier. Selon l'hypothèse d'[A.2](02-bases-legales-et-acteurs.md), le client pilote son programme et WellWork l'exécute sur instruction; les éventuelles finalités autonomes ou conjointes restent à qualifier.

Le salarié saisit ses réponses; l'API ajoute son identifiant et la date puis conserve l'ensemble dans un fichier JSON. La fiche utilisateur les restitue; l'export joint tous les questionnaires aux comptes. La suppression du compte conserve les réponses et laisse les accès fonctionner. Preuves : [routes de données](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/routes/data.js#L11-L55), [stockage](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/db.js#L16-L53), [comptes](https://github.com/christopherDEPASQUAL/RGPD/blob/e16cedcf0f8adb359621240366c8f0cbb251b8c9/support/src/routes/accounts.js#L37-L64) et constats `PRIV-01`, `PRIV-03`, `PRIV-04`, `PRIV-05` de la [matrice initiale](../../audit/02-matrice-des-constats.md).

Destinataires métier à définir : salarié et accompagnants habilités; l'énoncé annonce un assureur. Accès réel : tout compte authentifié peut lire un tiers; RH et administrateurs exportent toutes les entreprises. La collection `exports` conserve des métadonnées, pas la réponse complète. Aucun envoi effectif à l'assureur n'est prouvé par le code. Hébergement, pays, sauvegardes, protections de l'infrastructure et volume réel restent inconnus.

## 3. Nécessité et proportionnalité — article 35(7)(b)

| Point | Évaluation et décision proposée |
|---|---|
| Licéité | Articles 6 et 9 à satisfaire ensemble. Le consentement explicite n'est envisageable que pour un service réellement facultatif, sans désavantage au refus. Aucune preuve correspondante dans le support : ne pas ouvrir une collecte réelle en l'état |
| Données nécessaires | Justifier chaque question par l'accompagnement fourni; retirer les antécédents et traitements si cette nécessité n'est pas démontrée. Remplacer les réponses arbitraires de l'API par un schéma limité |
| Destinataires | Exclure la santé individuelle de l'annuaire RH. Réserver la lecture au salarié et aux accompagnants effectivement habilités. Suspendre l'export assureur tant que sa finalité et sa licéité ne sont pas établies |
| Alternative moins intrusive | Pour le pilotage RH, étudier des indicateurs réellement anonymisés avec prévention des petits groupes; enlever le nom ou remplacer l'identifiant ne suffit pas à garantir l'anonymat |
| Information et droits | Fournir une notice avant collecte, des choix distincts, une preuve et un retrait effectifs; procédure d'accès, rectification, effacement et autres droits selon la base. Aucun droit n'est remplacé par une simple case d'acceptation |
| Conservation | Limiter la base active à la période d'accompagnement justifiée, puis supprimer les réponses devenues inutiles; fixer et tester le délai opérationnel. Toute archive et sauvegarde doit avoir une finalité, une durée et des accès propres. Aucun délai légal forfaitaire n'est inventé |

Ces décisions appliquent les [articles 5, 6, 7 et 9](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2) et les [articles 12 à 22](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3). Elles restent à mettre en œuvre : une AIPD ne régularise pas une collecte illicite.

## 4. Risques pour les personnes — article 35(7)(c)

Échelle propre à cet audit, non imposée par la CNIL et distincte du CVSS : gravité **G**, de 1 (désagrément limité) à 4 (atteinte majeure potentiellement durable); vraisemblance **V**, de 1 (peu probable avec garanties vérifiées) à 4 (exposition facilement reproductible). G2 correspond à un préjudice réversible, G3 à un préjudice sérieux; V2 à un scénario plausible non vérifié, V3 à un scénario facilité mais demandant des conditions supplémentaires. Score G×V : 1–3 faible, 4–7 modéré, 8–11 élevé, 12–16 critique. La qualification juridique de risque élevé ne dépend pas uniquement du score.

| Risque, source et scénario | Conséquence humaine possible | Évaluation initiale motivée |
|---|---|---|
| R1 — Divulgation : salarié, compte compromis ou RH lisant/exportant hors habilitation (`PRIV-01/03/04`, `SEC-02/03`) | Stigmatisation, chantage, discrimination professionnelle; diffusion difficile à réparer | G4×V4 = **16, critique** : accès excessifs reproduits, sans preuve d'une fuite réelle par ce chemin |
| R2 — Altération : attaquant authentifié utilisant l'évaluation JavaScript (`SEC-01`) | Données fausses attribuées au salarié, accompagnement inadapté, démarches de rectification | G3×V3 = **9, élevé** : exécution démontrée par marqueur inoffensif; altération de santé non testée |
| R3 — Perte/indisponibilité : panne pendant l'écriture du JSON ou action malveillante via le filtre exécutable et des accès abusifs (`SEC-01/02/03`) | Perte du suivi, impossibilité temporaire d'accéder à ses réponses ou d'exercer ses droits | G2×V2 = **4, modéré** : panne plausible et capacité d'exécution démontrée sans test destructif; restauration, sauvegardes et protections d'accès insuffisamment documentées; aucun service médical vital établi |
| R4 — Conservation subie : ancien salarié conservé et réauthentifiable après suppression (`PRIV-05`) | Perte durable de contrôle et prolongation du risque de divulgation | G3×V4 = **12, critique** : maintien des données et accès reproduit |

Une réutilisation défavorable par un assureur aggraverait R1, mais aucun usage assurantiel concret ni décision discriminatoire ne sont établis. Les conséquences ci-dessus sont des risques, pas des préjudices déjà constatés.

## 5. Mesures, vérification et risque résiduel — article 35(7)(d)

| Mesure proposée | Pilote proposé | Preuve exigée avant réévaluation |
|---|---|---|
| M1 — Contrôles objet/rôle/entreprise, champs modifiables autorisés, suppression du filtre exécutable | Référent développement + RSSI | Tests négatifs salarié/tiers, interentreprises, élévation de rôle, accès abusifs et injection. L'entreprise d'appartenance doit être vérifiée, pas simplement déclarée par l'inscrit |
| M2 — Retrait des secrets des réponses/logs, mots de passe adaptés, sessions aléatoires, expirables et révocables | Référent développement + RSSI | Sentinelles absentes des sorties; tests de stockage, expiration et révocation; absence de session admin préchargée |
| M3 — Minimisation, information, choix/retrait santé et suppression cohérente; suspension de l'export injustifié | Responsable du traitement, conseillé par le DPO | Parcours sans consentement refusé pour la santé, refus sans pénalité, contrôle des champs, test d'effacement et de conservation justifiée |
| M4 — Écriture robuste, sauvegardes limitées et restauration; protections des fichiers et transport | Exploitation + RSSI | Test de restauration, revue des accès, configuration du chiffrement et des sauvegardes dans l'environnement réel |
| M5 — Finalités, rôles, contrats, destinataires, durées et exercice des droits formalisés | Responsable du traitement, conseillé par le DPO | Décisions datées, contrats/instructions et procédures vérifiables, pas une simple approbation de principe |

**Cibles conditionnelles, non résultats mesurés :** R1 → G4×V1 = 4 après M1–M5; R2 → G3×V1 = 3 après M1/M2/M4; R3 → G2×V1 = 2 après M1/M2/M4; R4 → G3×V1 = 3 après M2/M3/M5. Pour R3, M4 traite la panne et la restauration; M1/M2 réduisent l'action malveillante par injection, élévation ou session abusive. Les gravités ne disparaissent pas; seule la vraisemblance espérée baisse. Une réouverture de l'export ou un changement de destinataire impose une nouvelle évaluation.

## 6. Décision et suivi

**Avis d'audit : pas de mise en service avec de vraies données de santé en l'état.** Aucun risque résiduel n'est accepté ici. Le responsable réel doit vérifier les mesures, motiver sa décision et solliciter l'avis du DPO s'il est désigné; cet avis n'a pas été obtenu dans l'exercice. Recueillir, lorsque pertinent, l'avis des salariés ou de leurs représentants avec des modalités sans pression professionnelle.

Si un risque résiduel élevé demeure, consulter préalablement l'autorité selon l'article 36; ce n'est pas la notification de violation des articles 33–34, traitée en B. Réexaminer l'AIPD après correctifs, incident ou modification substantielle. Ces étapes et les avis restent **à réaliser**, conformément aux [articles 35(2), 35(9), 35(11) et 36](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4).
