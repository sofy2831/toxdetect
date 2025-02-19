// ✅ Fonction pour exporter les données d'un store IndexedDB
async function exportDataFromIndexedDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onsuccess = (event) => {
            const db = event.target.result;
            console.log(`📂 Stores disponibles dans "${dbName}" :`, db.objectStoreNames);

            // 📌 Vérifie si le store demandé existe
            if (!db.objectStoreNames.contains(storeName)) {
                return reject(`⚠️ Le store "${storeName}" n'existe pas dans la base de données "${dbName}".`);
            }

            const transaction = db.transaction(storeName, 'readonly');
            const objectStore = transaction.objectStore(storeName);
            const data = [];

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(data); // ✅ Retourne les données sous forme de tableau JSON
                }
            };

            transaction.onerror = (event) => {
                reject('❌ Erreur lors de l\'exportation des données : ' + event.target.error);
            };
        };

        request.onerror = (event) => {
            reject('❌ Erreur lors de l\'ouverture de la base de données : ' + event.target.error);
        };
    });
}

// ✅ Fonction pour exporter toutes les données de plusieurs stores
async function exportAllData() {
    const dbStores = {
        "videoDB": "videos",
        "audioDB": "audios",
        "monjournaldebordDB": ["fichiersDB", "journalDB"]
    };

    let allData = {};

    for (let dbName in dbStores) {
        let stores = dbStores[dbName];
        if (!Array.isArray(stores)) {
            stores = [stores];
        }

        for (let storeName of stores) {
            try {
                console.log(`📤 Exportation depuis "${dbName}" -> "${storeName}"...`);
                allData[`${dbName}_${storeName}`] = await exportDataFromIndexedDB(dbName, storeName);
            } catch (error) {
                console.error(`⚠️ Erreur lors de l'export depuis "${dbName}" -> "${storeName}" :`, error);
            }
        }
    }

    return JSON.stringify(allData); // 📂 Retourne toutes les données en JSON
}

// ✅ Fonction pour téléverser les données vers Dropbox
async function uploadToDropbox(accessToken, data, fileName) {
    const dbx = new Dropbox.Dropbox({ accessToken: accessToken });
    try {
        const response = await dbx.filesUpload({
            path: '/ToxDetect Backup/' + fileName,
            contents: new Blob([data], { type: 'application/json' }), // 🛠️ Correction ici
            mode: 'overwrite'
        });
        console.log('✅ Fichier téléversé avec succès :', response.name);
    } catch (error) {
        console.error('❌ Erreur lors du téléversement du fichier :', error);
    }
}

// ✅ Fonction principale pour exporter vers Dropbox
async function exportDataToDropbox() {
    try {
        const data = await exportAllData(); // 🔄 Récupère toutes les données
        const accessToken = localStorage.getItem('dropboxToken'); // 📌 Vérification du token
        if (accessToken) {
            await uploadToDropbox(accessToken, data, "backup.json"); // 📤 Envoie à Dropbox
            alert("✅ Les fichiers ont été transférés vers votre Dropbox !");
               }
    } catch (error) {
        console.error("❌ Erreur de transfert :", error);
        alert("Une erreur est survenue lors du transfert des fichiers.");
    }
}

// Exécuter automatiquement le transfert des données vers Dropbox au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    exportDataToDropbox();
});
