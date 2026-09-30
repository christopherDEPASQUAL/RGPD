# Partie A.4 — Constats de non-conformité RGPD

- **Version :** 1.0 — 1er octobre 2026
- **Référence :** `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`
- **Sources techniques :** [matrice initiale](../../audit/02-matrice-des-constats.md) et [preuves d'exécution](../../audit/preuves/01-preuves-execution.md). Les identifiants ci-dessous regroupent les constats techniques sans les remplacer.

## Méthode

Chaque fiche relie article, preuve, risque humain et gravité. **Confirmé** signifie observé sur le support; **non démontré** signifie qu'une pièce organisationnelle manque, pas qu'elle n'existe nulle part. Les preuves dynamiques sont celles déjà consignées, sans nouvelle exécution pour cette rédaction.

La gravité qualifie ici l'importance du constat : **critique** pour une exposition massive de santé ou un contrôle généralisé des accès; **élevée** pour une atteinte sérieuse à la confidentialité, aux choix ou aux droits. Ce classement de priorité n'est ni le CVSS de B ni le produit gravité×vraisemblance d'A.3. Les articles cités sont vérifiés dans les [principes, articles 5 à 9](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2), les [droits, articles 12 à 22](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3) et les [obligations, articles 24 à 36](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4).

## NC-01 — Choix marketing/tiers imposés et retrait incohérent

- **Articles :** 5(1)(a), 6(1)(a), 7(1) et 7(3), si ces usages sont fondés sur le consentement.
- **Preuve :** `PRIV-07`; [accounts.js](../../../src/routes/accounts.js), lignes 20–32, impose `marketingOptIn`, `marketing` et `thirdParty` à `true` sans choix envoyé. Lignes 52–58, modifier le premier champ ne met pas à jour `consents`.
- **Risque :** utilisation contre la volonté de la personne; impossibilité de prouver un choix ou un retrait cohérent.
- **Gravité : élevée.** Indicateurs artificiels confirmés; aucune campagne effective ni transmission marketing démontrée. Remplacer les valeurs imposées par un choix facultatif, spécifique, traçable et réversible.

## NC-02 — Licéité de la collecte santé et de l'export non démontrée

- **Articles :** 5(1)(a), 5(2), 6 et 9(1)–(2).
- **Preuve :** [data.js](../../../src/routes/data.js), lignes 11–19 et 48–55, collecte puis restitue des réponses de santé sans contrôle d'un fondement santé; [interface](../../../public/index.html), lignes 28–32 et 59–61, sans recueil explicite. Aucun justificatif d'exception de l'article 9 dans le support.
- **Risque :** perte de maîtrise d'informations médicales et usage professionnel ou assurantiel défavorable.
- **Gravité : critique.** Collecte/export confirmés; fondement externe non démontré, non présumé inexistant. Aucun consentement générique marketing ne couvre la santé. Appliquer l'analyse RT-02/RT-05 d'A.2 avant une collecte réelle.

## NC-03 — Information absente des parcours fournis

- **Articles :** 12(1), 13(1)–(2).
- **Preuve :** [index.html](../../../public/index.html), lignes 16–61 : formulaires d'inscription et de santé sans notice ni lien exposant responsable, finalités, bases, destinataires, durées et droits.
- **Risque :** divulgation de données sans compréhension des usages, destinataires ou possibilités de recours.
- **Gravité : élevée.** Absence confirmée dans l'interface; une information éventuellement remise hors application reste à vérifier. Ajouter une information accessible au moment de la collecte, sans confondre information et consentement.

## NC-04 — Données excessives dans les réponses et exports

- **Articles :** 5(1)(c), 25(2).
- **Preuve :** `PRIV-06`, `PRIV-04`; [accounts.js](../../../src/routes/accounts.js), lignes 34, 45 et 49, renvoie l'utilisateur complet; [data.js](../../../src/routes/data.js), lignes 23–34 et 48–55, expose profils, `passwordHash` et, selon la route, questionnaires.
- **Risque :** attaques hors ligne sur les mots de passe, circulation inutile de données identifiantes et médicales.
- **Gravité : élevée.** Excès confirmés. Définir des réponses autorisées par usage; ne jamais retourner l'empreinte du mot de passe. La nécessité de champs tels que la date de naissance reste à justifier, pas à supposer.

## NC-05 — Confidentialité et cloisonnement défaillants

- **Articles :** 5(1)(f), 25(2), 32(1)(b) et 32(2).
- **Preuve :** `PRIV-01/02/03/04`, `SEC-01/02`; [data.js](../../../src/routes/data.js), lignes 23–34 et 48–55 : lecture de tiers et accès interentreprises; [accounts.js](../../../src/routes/accounts.js), lignes 52–58 : auto-attribution du rôle admin; [db.js](../../../src/db.js), lignes 32–37 : évaluation du filtre JavaScript. Chaîne `SEC-02` → `PRIV-04` reproduite.
- **Risque :** divulgation massive, discrimination et chantage; altération potentielle des informations.
- **Gravité : critique.** Accès et élévation confirmés; l'exploitation comme origine de la fuite du sujet n'est pas prouvée. Corriger ensemble autorisations, appartenance vérifiée à l'entreprise et filtre; un simple contrôle « connecté » ne suffit pas.

## NC-06 — Protection insuffisante des authentifiants et sessions

- **Articles :** 5(1)(f), 32(1)(b) et 32(2).
- **Preuve :** `SEC-03/05`; [auth.js](../../../src/auth.js), lignes 7–21 : jeton déterministe encodé et absence d'expiration; [seed.js](../../../db/seed.js), lignes 71–72 : session admin ancienne acceptée; [db.js](../../../src/db.js), lignes 25–28 : SHA-256 non salé.
- **Risque :** usurpation et accès prolongé à la santé d'autrui, particulièrement après compromission d'un jeton ou d'empreintes.
- **Gravité : élevée.** Mécanismes et réutilisation confirmés. Le RGPD n'impose pas un algorithme nommé; l'insuffisance s'apprécie au regard du risque. Prévoir stockage adapté, jetons aléatoires, expiration et révocation.

## NC-07 — Mots de passe en clair dans les journaux

- **Articles :** 5(1)(c), 5(1)(f), 32(1)(b).
- **Preuve :** `SEC-04`; [accounts.js](../../../src/routes/accounts.js), lignes 15 et 39; [logger.js](../../../src/logger.js), lignes 6–14 : mot de passe sentinelle retrouvé dans le journal temporaire.
- **Risque :** usurpation par une personne accédant aux logs, y compris sur d'autres services en cas de réutilisation du mot de passe.
- **Gravité : élevée.** Journalisation confirmée, accès extérieur aux logs non démontré. Exclure les secrets à la source et contrôler fichiers/stdout; traiter les traces existantes sans détruire des preuves nécessaires à l'investigation.

## NC-08 — Suppression sans effacement ni fermeture effective

- **Articles :** 5(1)(e), 12(2), 17(1), sous réserve des exceptions de 17(3).
- **Preuve :** `PRIV-05`; [accounts.js](../../../src/routes/accounts.js), lignes 62–64 : seul un marquage est écrit; lignes 37–45 et [auth.js](../../../src/auth.js), lignes 15–21 : reconnexion et session toujours acceptées. Compte, questionnaire, sessions et consentement conservés dans la preuve.
- **Risque :** faux sentiment de départ du service et exposition prolongée d'informations sensibles.
- **Gravité : élevée.** Comportement confirmé; l'API annonce un marquage, pas un effacement réalisé. Définir la procédure d'effacement lorsqu'il est dû, les exceptions motivées, la révocation et les délais. Toute demande n'exige pas la destruction immédiate de toute trace.

## NC-09 — Conservation non maîtrisée dans le support

- **Articles :** 5(1)(e), 5(2), 25(1).
- **Preuve :** [db.js](../../../src/db.js), lignes 16–23 et 40–53 : persistance sans purge; [logger.js](../../../src/logger.js), lignes 6–14 : ajout continu; RT-01 à RT-07 d'A.1 sans politique de durée fournie. `PRIV-05` illustre la persistance après fermeture demandée.
- **Risque :** accumulation de profils anciens et augmentation de la durée d'exposition possible.
- **Gravité : élevée.** Absence de purge applicative confirmée; absence de politique organisationnelle ou de rotation externe non prouvée. Obtenir puis appliquer des critères de durée par finalité, y compris archives et sauvegardes; aucune durée arbitraire présentée comme légale.

## Écarts documentaires à lever, sans inventer des infractions

Le support initial ne fournit pas les contrats, les décisions de rôle, l'hébergement, les garanties de transfert ou une AIPD antérieure. A.1–A.3 apportent une analyse, pas des contrats signés ni une validation réelle. Vérifier les exigences des articles 5(2), 24, 26/28 selon les rôles, 30 et 35. **Priorité élevée** : sans ces éléments, les salariés risquent de ne pas identifier leur interlocuteur ni les destinataires effectifs. L'absence d'une pièce dans le dépôt ne prouve pas son inexistence dans l'organisation.

Ne pas inventer une obligation de DPO, un transfert hors UE, des sauvegardes absentes, une lecture de tous les messages ou une cause certaine de fuite. Le défaut de relation de coaching à l'envoi est observé statiquement (`data.js:38–41`), mais la lecture des messages filtre bien expéditeur/destinataire (`43–44`). Il doit être encadré sans prétendre avoir démontré une fuite globale de messagerie.

## Passage aux parties suivantes

Les preuves `SEC-*` et `PRIV-*` restent les références de B; les `NC-*` relient ces faits aux exigences RGPD. C devra relier chaque correction à ces identifiants et produire ses tests. Aucun constat n'est déclaré corrigé par la seule rédaction de cette partie.
