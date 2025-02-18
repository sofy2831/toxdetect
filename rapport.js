// 1. Exporter les données d'IndexedDB
window.exportDataFromIndexedDB = async function exportDataFromIndexedDB(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const data = [];
      
      objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          console.log("📁 Données récupérées depuis IndexedDB :", data);
          resolve(JSON.stringify(data));
        }
      };
      transaction.onerror = (event) => {
        reject('Erreur lors de l\'exportation des données : ' + event.target.error);
      };
    };
    request.onerror = (event) => {
      reject('Erreur lors de l\'ouverture de la base de données : ' + event.target.error);
    };
  });
}

// 2. Authentifier l'utilisateur avec Dropbox
async function authenticateWithDropbox() {
  const CLIENT_ID = '0z41GO683A6XB20';
  const REDIRECT_URI = 'https://sofy2831.github.io/toxdetect/auth.html';
  const dbx = new Dropbox.Dropbox({ clientId: CLIENT_ID });
  const authUrl = dbx.auth.getAuthenticationUrl(REDIRECT_URI);
  // Rediriger l'utilisateur vers l'URL d'authentification
  window.location.href = authUrl;
}

// 3. Téléverser les données vers Dropbox
async function uploadToDropbox(accessToken, data, fileName) {
  const dbx = new Dropbox.Dropbox({ accessToken: accessToken });
  try {
    const response = await dbx.filesUpload({
      path: '/' + fileName,
      contents: data,
      mode: 'overwrite'
    });
    console.log('Fichier téléversé avec succès :', response.name);
  } catch (error) {
    console.error('Erreur lors du téléversement du fichier :', error);
  }
}

// Fonction principale pour exporter et téléverser les données
async function exportAndUpload() {
  try {
    // Authentifier l'utilisateur et obtenir le token d'accès
    const accessToken = await authenticateWithDropbox();

    // Exporter et téléverser chaque base de données
    const databases = [
      { dbName: 'IndexedDB', storeName: 'videoDB', fileName: 'videoDB.json' },
      { dbName: 'IndexedDB', storeName: 'audioDB', fileName: 'audioDB.json' },
      { dbName: 'IndexedDB', storeName: 'fichiersDB', fileName: 'fichiersDB.json' },
      { dbName: 'IndexedDB', storeName: 'journalDB', fileName: 'journalDB.json' }
    ];

    for (const db of databases) {
      const data = await exportDataFromIndexedDB(db.dbName, db.storeName);
      await uploadToDropbox(accessToken, data, db.fileName);
    }
  } catch (error) {
    console.error('Erreur lors de l\'exportation et du téléversement :', error);
  }
}
Dropbox.embed({
    link: '/https://www.dropbox.com/home/Applications/ToxDetect%20Backup',
    container: document.getElementById('dropbox-embedder'),
    width: '100%',
    height: '600px'
});


document.getElementById('ma-dropbox-btn').addEventListener('click', function() {
    Dropbox.choose({
        success: function(files) {
            // Afficher les informations des fichiers sélectionnés
            files.forEach(function(file) {
                console.log('Nom : ' + file.name);
                console.log('Lien : ' + file.link);
                // Vous pouvez également afficher ces informations dans votre page
            });
        },
        cancel: function() {
            // L'utilisateur a annulé l'opération
        },
        linkType: 'preview', // ou 'direct' selon vos besoins
        multiselect: true, // ou false si vous ne souhaitez permettre la sélection que d'un seul fichier
        extensions: ['.pdf', '.doc', '.docx'], // Filtrer les types de fichiers si nécessaire
    });
});


