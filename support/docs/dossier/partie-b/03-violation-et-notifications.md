# Partie B.3 — Violation de données et projets de notifications

Version 1.0 — 1er octobre 2026. **Exercice pédagogique : aucun incident réel confirmé par cet audit et aucune notification envoyée.** Les projets ci-dessous sont préparés pour le scénario d'une divulgation confirmée de données WellWork identifiantes et de santé. Les champs entre crochets doivent être renseignés uniquement à partir de faits vérifiés.

## 1. Décision motivée

**Situation fournie :** un signalement de fichier sur un forum, sans contenu ni chronologie accessibles. Investigation rapide indispensable; on ne peut calculer une échéance réelle à partir de la date du seed ou du présent audit. Le seul succès des preuves fictives ne déclenche pas une notification d'incident réel.

**Scénario retenu pour préparer la réponse :** si le signalement permet de confirmer raisonnablement une divulgation non autorisée de profils identifiables et de santé, le risque est élevé : informations intimes, contexte de travail, possibilité de discrimination, stigmatisation et chantage; diffusion publique difficilement réversible. Dans ce scénario, notifier l'autorité compétente **et** informer les personnes. Inutile d'attendre l'identification de la faille exploitée ou le décompte définitif.

| Situation après qualification | Décision |
|---|---|
| Fichier seulement fictif, étranger au service ou signalement non corroboré | Consigner l'analyse et les investigations; pas de notification automatique fondée sur nos essais fictifs |
| Violation établie, risque pour les personnes peu probable et justification solide | Documenter la violation et la décision de ne pas notifier au titre de 33(5); réévaluer si nouveaux éléments |
| Violation établie avec risque, sans risque élevé | Notification article 33; pas de communication automatique article 34 |
| Données de santé identifiantes réellement divulguées dans le scénario retenu | Notification article 33 et communication article 34, sauf exception précisément démontrée |

Les [articles 33 et 34](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4) fixent deux seuils distincts. La CNIL reçoit la notification sous réserve de sa compétence; en présence de traitements transfrontaliers, vérifier l'autorité compétente plutôt que déduire celle-ci de la seule langue du projet.

## 2. Délais, rôles et exceptions

- **T0 = prise de connaissance :** degré raisonnable de certitude qu'un incident a compromis des données personnelles, pas nécessairement certitude de sa cause. Une alerte déjà suffisamment probante peut être T0. Une investigation initiale courte est possible, mais pas un report artificiel jusqu'au rapport final ([CEPD 9/2022, §31–35](https://www.edpb.europa.eu/system/files/documents/2023-04/edpb_guidelines_202209_personal_data_breach_notification_v2.0_en.pdf)).
- **Responsable :** notifier sans retard indu et, si possible, sous 72 heures après T0. Ce ne sont pas 72 heures ouvrées. Si informations incomplètes, notification initiale puis compléments sans retard indu; si retard, en expliquer les motifs. Consigner faits, effets, mesures et décisions.
- **Sous-traitant :** avertir chaque responsable concerné sans retard indu après connaissance, sans attendre son propre bilan exhaustif; le délai de 72 heures de l'article 33(1) n'est pas son délai légal d'alerte au client. Assister celui-ci selon l'article 28(3)(f). Les rôles restent ceux analysés en A.2 : WellWork ne notifie pas automatiquement comme responsable de tous les traitements.
- **Personnes :** si risque élevé, communiquer dans les meilleurs délais, en termes clairs; aucun délai chiffré de 72 heures n'est fixé par l'article 34. Le responsable assume la décision, conseillé par le DPO; RSSI/exploitation fournissent les faits. Un accord entre responsables conjoints doit organiser la réponse, sans effacer leurs obligations.

Les exceptions de l'article 34(3) exigent une preuve : données rendues incompréhensibles à l'auteur de l'accès, mesures ultérieures supprimant effectivement le risque élevé, ou efforts disproportionnés remplacés par une communication publique aussi efficace. **Aucune n'est démontrée ici.** Le SHA-256 des mots de passe ne protège pas le questionnaire; corriger une route n'efface pas une copie déjà divulguée; un grand nombre de personnes ne dispense pas, à lui seul, de les informer.

L'alerte, T0 et sa justification, l'échéance T0+72 h, les décisions, envois et compléments doivent être horodatés dans le registre d'incident. Référence opérationnelle : [CNIL — notifier une violation](https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles).

## 3. Projet de notification initiale à la CNIL — article 33

**À compléter puis déposer par le responsable ou son mandataire via le téléservice, si la CNIL est compétente. Ne pas joindre spontanément le fichier divulgué ou des secrets.**

**Objet : notification initiale d'une divulgation non autorisée de données sur la plateforme WellWork — référence [INCIDENT].**

**Organisme et contact.** Responsable du traitement : [raison sociale, adresse, coordonnées, identifiant]. WellWork intervient comme [rôle vérifié pour le traitement]. Contact DPO ou référent : [nom/fonction, email professionnel, téléphone]. Entreprises clientes concernées et coordination : [éléments vérifiés].

**Nature et chronologie.** Un fichier présenté comme issu de WellWork a été signalé sur un forum le [date, heure, fuseau]. Les vérifications [éléments probants, sans données sensibles superflues] ont permis d'établir une divulgation non autorisée le [T0, heure, fuseau]. La période de compromission est [période estimée ou inconnue]. La cause technique demeure [établie avec preuve / en cours d'investigation]. Des failles d'autorisation et d'export existent dans le support audité; leur rôle dans cet incident n'est pas établi par leur seule présence.

**Données et personnes.** Catégories confirmées : [identité/contact/entreprise et catégories de santé effectivement présentes]. Catégories de personnes : [salariés et autres titulaires réellement concernés]. Nombre approximatif de personnes : [estimation motivée ou inconnu à ce stade]. Nombre approximatif d'enregistrements : [estimation séparée ou inconnu]. Pays et destinataires non autorisés : [connus/inconnus]. Les 63 comptes et 132 questionnaires de démonstration ne sont pas utilisés comme décompte de victimes.

**Conséquences probables.** La divulgation conjointe d'identité et de santé peut entraîner une atteinte à la vie privée, une stigmatisation, une discrimination professionnelle ou des tentatives de chantage. Selon les données effectivement exposées, un risque d'hameçonnage ciblé ou de compromission de compte doit aussi être considéré. Aucun de ces préjudices n'est présenté comme déjà observé sans élément probant.

**Mesures.** Mesures effectivement réalisées : [action, périmètre, date et preuve]. Mesures proposées, à ne pas confondre avec des actions réalisées : confinement de l'export et des accès excessifs, révocation des accès compromis, protection des journaux, conservation des preuves, correction des autorisations et analyse de l'étendue de l'incident. Si les authentifiants sont concernés, prévoir les mesures de renouvellement adaptées. Examiner une demande de retrait du fichier par une voie autorisée sans détruire les preuves utiles.

**Information et suivi.** Les personnes [ont été informées le… / seront informées dans les meilleurs délais selon le dispositif…]. Un complément sera communiqué dès que [périmètre, décompte, cause, mesures] sera établi, sans retard indu. Si la présente notification intervient au-delà de 72 heures après T0 : [motifs précis du retard].

## 4. Projet de message aux personnes — article 34

**Modèle à adapter au périmètre confirmé, sans diffusion effective dans cet exercice. Utiliser un canal direct fiable et éviter d'exposer la liste des destinataires.**

**Objet : information importante concernant vos données sur WellWork**

Bonjour,

Nous vous informons d'une divulgation non autorisée de données vous concernant utilisées dans le service WellWork. Nous en avons pris connaissance le [date]. Un fichier contenant [catégories de données confirmées pour cette personne, sans recopier ses réponses médicales] a été [circonstances vérifiées de divulgation].

Ces informations peuvent porter atteinte à votre vie privée et être utilisées pour vous adresser des messages trompeurs, vous stigmatiser ou exercer des pressions. [Indiquer seulement les risques correspondant aux données effectivement exposées.] À ce stade, [faits confirmés sur les utilisations abusives, ou absence d'information permettant de les établir].

Nous avons [mesures réellement réalisées et datées]. Nous prévoyons également [mesures encore à réaliser]. Nos investigations se poursuivent pour préciser [éléments restant inconnus]. Nous vous communiquerons les évolutions importantes et toute action supplémentaire utile.

Soyez vigilant face aux messages qui utilisent ces informations pour gagner votre confiance. Ne transmettez ni mot de passe ni code de connexion à un interlocuteur qui vous contacte. Accédez au service par son adresse habituelle. [Si les authentifiants sont effectivement concernés : précisez la procédure vérifiée de changement du mot de passe et conseillez de changer les mots de passe identiques utilisés ailleurs.] Vous n'avez pas à nous renvoyer vos données de santé.

Pour obtenir des précisions, de l'aide ou exercer vos droits, contactez [DPO ou référent, email et téléphone vérifiés]. Nous regrettons cet incident et restons disponibles pour vous accompagner.

[Nom du responsable du traitement ou de l'expéditeur mandaté]

## 5. Vérification avant tout envoi réel

Valider l'identité de l'émetteur, le périmètre, T0, le contact, la compétence de l'autorité et les faits; remplacer tous les crochets. Vérifier les rubriques obligatoires de 33(3) et la clarté du message de 34(2). Ne pas attendre la clôture de l'enquête pour une notification initiale requise. Conserver les accusés de réception et les versions envoyées; ne pas publier de listes de victimes, tokens ou mots de passe dans le dépôt.
