# Pièges, hypothèses et corrections d'analyse

## Conclusions vérifiées

| Point | Conclusion à ce stade | Preuve ou limite |
|---|---|---|
| Nature du filtre | Injection JavaScript côté serveur, pas injection SQL | `src/routes/data.js:31-34` transmet directement le filtre à `new Function` dans `src/db.js:32-37`; marqueur inoffensif confirmé à l'exécution (`SEC-01`). |
| Commentaire « SQLite » | Commentaire inexact | Le stockage réel est un fichier JSON lu et écrit par `fs` (`src/db.js:15-23`). |
| `config.js` | Inutilisé dans l'application observée | Aucun import trouvé. Ses valeurs ont néanmoins été neutralisées avant la baseline. |
| `randomToken` | Inutilisé | Deux occurrences seulement : définition et export (`src/auth.js:40-44`). Les jetons actifs proviennent de `issueToken`. |
| `requireAdmin` | Autorise aussi le rôle RH | Condition explicite dans `src/auth.js:32-37`; export RH confirmé à l'exécution. |
| `deleted: true` | Marquage, pas effacement | L'utilisateur, ses questionnaires, consentements et sessions restent stockés; ancienne session et reconnexion fonctionnent (`PRIV-05`). |
| Export assureur | Réponse HTTP locale et trace d'export | Aucun client assureur ni appel sortant n'existe dans le code examiné. Ne pas présenter la preuve comme un transfert réel. |
| Volume des données | Jeu de démonstration uniquement | Le seed crée 63 comptes et des questionnaires; aucune conclusion de production n'en découle. |
| Séances de sport | Fonction annoncée mais non implémentée comme route | Une collection `sessionsSport` existe dans le stockage, sans route correspondante dans les sources examinées. |
| Fuite signalée | Causalité non établie | Plusieurs chemins d'exposition existent, mais aucun artefact ne relie l'un d'eux au fichier signalé sur le forum. |
| Intention de l'auteur | Non démontrable | Des commentaires incohérents ne prouvent pas une volonté de tromper une IA. |
| Chargement de `.env` | Absent | Pas de dépendance ni d'appel `dotenv`; seules les variables déjà présentes dans `process.env` sont lues. |
| Expiration des sessions | Absente dans le code observé | `createdAt` est stocké, mais aucune durée ni vérification d'expiration n'est appliquée (`SEC-03`). |

## Hypothèses restant ouvertes

- Le fichier mentionné sur un forum peut provenir d'un export excessif, d'un accès horizontal, d'une élévation de privilèges ou d'une autre cause externe au code fourni. Aucun scénario ne doit être présenté comme la cause certaine.
- Le statut précis des acteurs, les bases légales, la nécessité et le périmètre de l'AIPD restent à analyser avec des sources juridiques fiables.
- La gravité, les vecteurs CVSS et les catégories OWASP restent à établir lors de l'analyse sécurité formelle.
- L'absence d'alertes `npm audit` au 30 septembre 2026 couvre les avis connus du registre, pas les défauts de logique métier.

## Corrections et incidents de méthode réellement observés

1. Une première copie de préservation a utilisé une méthode .NET indisponible dans la version locale de PowerShell. Elle a copié zéro fichier. Le dossier vide généré a été supprimé, la méthode de calcul des chemins a été remplacée et les 20 copies ont ensuite été vérifiées par SHA-256.
2. Une causalité antérieure attribuait un blocage des tests au flux du logger. La reproduction isolée ne la confirme pas : les trois tests se terminent avec le code 0. La cause antérieure reste donc non établie et n'est pas reprise comme fait.
3. Le premier appel `npm test` a sélectionné `npm.ps1` et a échoué à cause de la politique PowerShell. L'appel explicite `npm.cmd test` a réussi; l'échec ne concernait pas l'application.
4. La piste « injection SQL » a été corrigée en « injection JavaScript côté serveur » après lecture de `new Function` et preuve dynamique.
5. Le script de preuve lisait initialement le journal immédiatement après la requête. Une relance a produit un faux négatif parce que le flux de fichier est asynchrone. Une attente bornée du marqueur a été ajoutée, puis la preuve a été relancée plusieurs fois.

Ces cinq éléments ont réellement été rencontrés ou hérités d'une analyse antérieure puis vérifiés pendant cette phase. Aucun élément supplémentaire ne doit être inventé dans la future annexe IA.
