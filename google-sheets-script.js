/**
 * ===================================================================
 * GUIDE DE CONNEXION GOOGLE SHEETS EN 3 ÉTAPES (Gratuit & Immédiat)
 * ===================================================================
 * 
 * Étape 1 :
 * 1. Ouvrez Google Drive (drive.google.com) et créez une nouvelle feuille :
 *    "RSVP Mariage Tuborg & Yacine".
 * 2. Dans le menu de votre feuille, cliquez sur "Extensions" > "Apps Script".
 * 
 * Étape 2 :
 * 1. Supprimez tout le code existant dans l'éditeur Apps Script et collez
 *    l'intégralité du code ci-dessous.
 * 2. Cliquez sur l'icône de disquette "Enregistrer" (Ctrl+S ou Cmd+S).
 * 
 * Étape 3 :
 * 1. Cliquez sur le bouton bleu "Déployer" en haut à droite > "Nouveau déploiement".
 * 2. Cliquez sur la roue crantée à gauche de "Sélectionner un type" > Choisissez "Application Web".
 * 3. Configuration requise :
 *    - Description : "RSVP Mariage Webhook"
 *    - Exécuter en tant que : "Moi (votre adresse email)"
 *    - Qui a accès : "Tout le monde" (indispensable pour que les invités puissent envoyer leur réponse sans connexion Google).
 * 4. Cliquez sur "Déployer" et accordez les autorisations nécessaires.
 * 5. Copiez l'"URL de l'application Web" obtenue (ressemble à : https://script.google.com/macros/s/.../exec).
 * 6. Ouvrez le fichier `mariage-tuborg-yacine/js/rsvp.js` et collez cette URL dans la variable :
 *    const GOOGLE_SHEET_WEBHOOK_URL = "VOTRE_URL_ICI";
 * 
 * Félicitations ! Chaque réponse sur le site s'ajoutera automatiquement dans votre Google Sheet en temps réel !
 * ===================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Vérifier si les en-têtes existent, sinon les créer
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Horodatage",
        "Nom & Prénom",
        "Présence",
        "Événement(s) choisi(s)",
        "Nombre d'accompagnants",
        "Noms des accompagnants",
        "Téléphone / WhatsApp",
        "Régime alimentaire",
        "Message aux Mariés"
      ]);
      // Mise en forme de la première ligne (Rouge Bordeaux & Or)
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#780016").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "GMT", "dd/MM/yyyy HH:mm:ss");

    var row = [
      formattedDate,
      data.nomComplet || "",
      data.presence || "",
      data.evenementChoisi || "",
      data.nombreAccompagnants !== undefined ? data.nombreAccompagnants : 0,
      data.nomsAccompagnants || "",
      data.telephone || "",
      data.regimeAlimentaire || "",
      data.message || ""
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Le Webhook RSVP Tuborg & Yacine est actif et prêt.");
}
