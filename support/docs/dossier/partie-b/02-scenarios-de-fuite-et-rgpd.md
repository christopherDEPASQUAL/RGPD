# Partie B.2 — Risques de violation et scénarios de fuite

Version 1.0 — 1er octobre 2026. Référence : `baseline-vulnerable`, commit `e16cedcf0f8adb359621240366c8f0cbb251b8c9`.

## Ce qui est établi et ce qui ne l'est pas

L'énoncé signale un fichier d'utilisateurs sur un forum. Ni ce fichier, ni URL, date, journaux de production ou preuve de correspondance avec WellWork ne sont fournis. Les essais locaux démontrent des vulnérabilités sur données fictives, pas une violation réelle ni la cause de l'événement du sujet.

Une vulnérabilité est une possibilité d'attaque; une violation implique une atteinte aux données, notamment perte, altération, accès ou divulgation non autorisés. Un téléchargement prouvé par un attaquant n'est pas toujours nécessaire : une mise à disposition publique non autorisée constitue déjà une divulgation. Référence : [RGPD, article 4(12)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre1).

## Scénarios à investiguer, sans classement de probabilité inventé

| Scénario | Faits locaux qui le rendent plausible | Ce qui manque pour le relier au forum |
|---|---|---|
| S1 — Extraction par un salarié ou un compte créé librement | `PRIV-01/02/03/06` : annuaire puis lecture de profils/questionnaires de tiers sans cloisonnement | Requêtes réelles, compte utilisé, horaires, volumes, correspondance des champs et des personnes |
| S2 — Export par un compte RH | `PRIV-04` : rôle RH directement autorisé, export global avec santé | Auteur réel, historique `exports`, événements `insurer_export`, destination et éventuel détournement après réception |
| S3 — Salarié devenu administrateur | `CHAIN-01` : `SEC-02` puis `PRIV-04`, chaîne reproduite | Changements de rôle suivis d'exports, sessions et chronologie de production; `profile_updated` ne journalise que les noms de champs, pas une preuve complète de l'auteur réel |
| S4 — Rejeu d'une session préchargée ou compromise | `SEC-03` : jeton du seed encore accepté; `PRIV-05` : fermeture demandée sans révocation | Usage de ce seed en production, traces de session, source d'obtention du jeton; ne pas supposer que le secret de démonstration est actif ailleurs |
| S5 — Exécution de code via le filtre | `SEC-01` : expression JavaScript exécutée; données de l'application potentiellement accessibles/altérables | Requêtes de filtre et traces système réelles; la preuve locale est seulement un marqueur inoffensif, pas une exfiltration |
| S6 — Compromission d'authentifiants puis accès à la plateforme | `SEC-04` expose les mots de passe aux lecteurs des logs; `PRIV-06` + `SEC-05` facilitent un scénario de récupération hors ligne | Accès effectif aux logs/empreintes, mot de passe récupéré et réutilisation constatée. Le craquage n'est pas démontré |

`PRIV-05` prolonge aussi l'exposition d'anciens comptes. `PRIV-07` viole les conditions d'un consentement invoqué mais ne constitue pas, à lui seul, une preuve de fuite. L'export HTTP n'est pas une preuve d'envoi à l'assureur; inversement, l'absence de code d'envoi n'exclut pas une transmission manuelle dans l'organisation.

## Rattachement aux obligations RGPD

| Constats | Atteinte redoutée et personnes exposées | Rattachement à A.4 |
|---|---|---|
| `SEC-01/02`, `PRIV-01/02/03/04` | Confidentialité et, pour l'injection, intégrité/disponibilité; salariés de plusieurs clients | NC-05, articles 5(1)(f), 25(2), 32 |
| `SEC-03/04/05`, `PRIV-06` | Usurpation, compromission de profils et données de santé | NC-04/06/07, articles 5(1)(c)/(f), 25(2), 32 |
| `PRIV-05` | Accès persistants et conservation subie après départ | NC-08/09, articles 5(1)(e), 12, 17 et 32 selon les faits |

Références : [principes](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2), [droits](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3), [sécurité](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4). Une violation réelle déclenche en plus l'analyse des articles 33/34; elle ne découle pas automatiquement du seul score CVSS.

## Investigation proposée et limites de l'exercice

Le RSSI ou référent incident doit préserver les traces, dates/fuseaux, empreintes et droits d'accès aux preuves avant nettoyage, puis examiner avec le responsable et le DPO un échantillon obtenu par une voie autorisée. Identifier les données réellement exposées, personnes/clients, période, lisibilité et destinataires; recouper avec sessions, exports et traces d'infrastructure disponibles. Les logs actuels sont incomplets et contiennent des secrets : accès restreint, aucune publication brute dans Git.

Ne pas retarder le confinement pendant une investigation exhaustive : restreindre les accès/export à risque et révoquer les accès compromis de façon coordonnée, en conservant les éléments utiles. Ne pas déduire une absence d'attaque d'une absence de logs. Ces actions sont **proposées**, pas exécutées sur une production inconnue. Aucun forum, partenaire ou utilisateur réel n'a été contacté dans cet audit.

**Conclusion :** plusieurs chemins compatibles avec une fuite existent; aucun ne peut être désigné comme sa cause. La décision de notification est développée en [B.3](03-violation-et-notifications.md).
