# 💍 Site Vitrine Officiel - Mariage de Tuborg & Yacine
**Samedi 28 Novembre 2026 à partir de 17h00**  
**Hôtel Keur Dada, Saint-Louis, Sénégal**

---

## 🌟 Présentation du Projet
Ce site vitrine one-page moderne, élégant et entièrement responsive a été spécialement conçu pour l'invitation officielle au mariage de **Tuborg & Yacine**.

Il propose une expérience immersive aux couleurs du Sénégal (Or Impérial, Vert Émeraude, Ivoire Chaud et Champagne), rythmée par l'ambiance musicale locale et un parcours invité d'un grand raffinement.

---

## 📱 Structure et Sections

### 1. Section Accueil / Bannière Héro & Carrousel d'Images
- **Accroche officielle** : *« Tuborg & Yacine ont le plaisir de vous inviter à la célébration de leur union »*
- **Carrousel fluide (Swiper.js)** : Défilement d'images haute résolution (effets Ken Burns et transitions douces).
- **Détails immédiats** : 28 novembre 2026 | 17h00 | Hôtel Keur Dada, Saint-Louis.
- **Compte à rebours dynamique** : Calcul en temps réel jusqu'au 28 novembre 2026 à 17h00 GMT.
- **Bouton d'action CTA** : *« Confirmer ma présence »* avec défilement fluide vers le formulaire RSVP.
- **Boutons Agenda** : Synchronisation en 1 clic avec **Google Agenda** et téléchargement du fichier **.ics (Apple / Outlook)**.

### 2. Ambiance Sonore Intégrée (Obree Daman - Banneex)
- **Morceau traditionnel** : *« Obree Daman - Banneex »*.
- **Lecteur audio flottant & discret** :
  - Disque vinyle rotatif doré.
  - Bouton Play / Pause interactif.
  - Bouton Mute / Unmute & égaliseur animé (barres spectrales).
  - Respect strict des politiques d'autoplay des navigateurs avec toast délicat d'invitation d'écoute.
  - Prise en charge native des formats `.m4a` et `.mp3`.

### 3. Le Déroulement (Timeline Interactive)
Affichage vertical moderne présentant la chronologie complète avec badges d'heures et icônes thématiques :
- **17h00** : Accueil des invités & Cocktail de bienvenue
- **18h00** : Cérémonie d’ouverture
- **18h45** : Entrée triomphale des mariés
- **19h15** : Discours & remerciements
- **19h45** : Dîner gastronomique
- **20h45** : Gâteau & première danse
- **21h30** : Changement de tenue
- **22h00** : Soirée dansante (DJ – Animations – Ambiance)
- **00h00** : Changement de tenue traditionnelle (Plateau – Partage – Danses)
- **00h30 – 02h00** : Suite de la soirée et célébration jusqu’au bout de la nuit

### 4. Localisation & Accès (Hôtel Keur Dada)
- **Module Google Maps interactif** centré sur l'Hôtel Keur Dada à Saint-Louis.
- **Itinéraires & GPS** : Boutons d'accès direct vers Google Maps & Waze.
- **Conseils de voyage** : Trajet depuis Dakar (A1 péage + RN2, 3h30-4h).
- **Parking & Sécurité** : Informations sur le parking gardé pour les invités.

### 5. Formulaire RSVP (Module de Confirmation Intelligent)
- **Texte d'introduction** : *« Confirmez votre présence. Merci de nous répondre pour que nous puissions prévoir votre place. »*
- **Champs** :
  - Nom & Prénom (Obligatoire)
  - Présence : Oui / Non avec affichage adaptatif des champs
  - Nombre d'accompagnants (0, 1, 2, 3+ personnes)
  - Prénom & Nom des accompagnants
  - Téléphone / WhatsApp
  - Préférences de table / Régimes alimentaires
  - Petit mot pour Tuborg & Yacine
- **Transmission WhatsApp Directe pour le Marié & l'Organisation** :
  - Dès la confirmation, un message pré-rempli complet est immédiatement envoyé/préparé par WhatsApp vers :
    1. **Tuborg (Le Marié)** : `+221 77 618 51 00`
    2. **Second numéro de coordination** : `+221 77 176 09 06`
  - Le message WhatsApp inclut automatiquement : le statut de présence, le nom de l'invité, le nombre d'accompagnants, les régimes alimentaires, le contact WhatsApp de l'invité et son mot de félicitations !
- **Expérience Festive** : Déclenchement d'une explosion de confettis dorés et émeraudes (`canvas-confetti`) et fenêtre modale de confirmation.
- **Sauvegarde triple garantie** :
  1. **Notification WhatsApp directe** sur les téléphones des mariés.
  2. **Google Sheets en temps réel** (via script Web App fourni).
  3. **Stockage Local (LocalStorage)** : Aucune réponse n'est perdue.
  4. **Tableau de bord administrateur secret** pour les mariés : tapez `Ctrl + Shift + R` ou cliquez 5 fois sur le logo *T&Y* pour consulter la liste des invités et télécharger un fichier **Excel / CSV** en un clic !

---

## 🚀 Comment lancer et tester le site

### Méthode 1 : Ouverture directe dans votre navigateur
Double-cliquez simplement sur le fichier `mariage-tuborg-yacine/index.html` ou glissez-le dans n'importe quel navigateur (Google Chrome, Safari, Firefox, Edge).

### Méthode 2 : Avec un serveur local (recommandé pour l'audio)
Ouvrez un terminal dans le dossier et lancez :
```bash
cd mariage-tuborg-yacine
# Avec Python 3 :
python3 -m http.server 8080
# Ou avec Node.js :
npx serve
```
Puis ouvrez [http://localhost:8080](http://localhost:8080).

---

## 🎵 Ajouter le fichier audio officiel `Daman Bannex`
1. Récupérez le fichier audio MP3 de la chanson *« Daman Bannex »* de la troupe Obree Daman.
2. Renommez le fichier en `daman-bannex.mp3`.
3. Déposez-le dans le dossier `mariage-tuborg-yacine/assets/audio/daman-bannex.mp3`.
4. Le lecteur le chargera automatiquement !

---

## 📊 Connecter le formulaire à Google Sheets
1. Ouvrez [google-sheets-script.js](file:///Users/MAC/Desktop/genieEnherbe/mariage-tuborg-yacine/google-sheets-script.js).
2. Suivez les 3 étapes indiquées dans l'en-tête pour créer votre Google Sheet et déployer le script Google Apps Script (100% gratuit).
3. Collez votre URL dans la variable `GOOGLE_SHEET_WEBHOOK_URL` du fichier `js/rsvp.js`.
4. Chaque réponse reçue sur le site créera automatiquement une nouvelle ligne dans votre Google Sheet !

---

## 🌐 Déploiement en ligne gratuit (Netlify, Vercel, GitHub Pages)
Ce site est entièrement statique (HTML / CSS / Vanilla JS). Vous pouvez le déployer gratuitement en 30 secondes :
- **Sur Netlify** : Glissez-déposez le dossier `mariage-tuborg-yacine` sur [app.netlify.com/drop](https://app.netlify.com/drop).
- **Sur Vercel** : `vercel` en ligne de commande.
- **Sur GitHub Pages** : Poussez le dossier sur un dépôt GitHub et activez GitHub Pages.
