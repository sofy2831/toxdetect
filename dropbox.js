// ✅ Fonction pour exporter les données d'IndexedDB
async function exportDataFromIndexedDB(dbName, storeName) {
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
                    resolve(JSON.stringify(data)); // ✅ Conversion en JSON
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

// ✅ Fonction pour téléverser des données vers Dropbox
async function uploadToDropbox(accessToken, data, fileName) {
    const dbx = new Dropbox.Dropbox({ accessToken: accessToken });
    try {
        const response = await dbx.filesUpload({
            path: '/ToxDetect Backup/' + fileName,
            contents: data,
            mode: 'overwrite'
        });
        console.log('Fichier téléversé avec succès :', response.name);
    } catch (error) {
        console.error('Erreur lors du téléversement du fichier :', error);
    }
}
