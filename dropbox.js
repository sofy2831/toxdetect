document.getElementById('ma-dropbox-btn').addEventListener('click', function() {
    const lienDropboxPublic = "https://www.dropbox.com/home/Applications/ToxDetect%20Backup"; // Remplace par ton lien public réel
    document.getElementById('dropbox-embedder').innerHTML = `
        <iframe src="${lienDropboxPublic}" width="100%" height="600px"></iframe>
    `;
});

        return;
    }

    // Récupérer les fichiers depuis IndexedDB
    const fichiers = await recupererFichiersDepuisIndexedDB();
    if (fichiers.length === 0) {
        alert("Aucun fichier trouvé.");
        return;
    }

    // Envoi des fichiers vers Dropbox
    for (const fichier of fichiers) {
        await envoyerFichierVersDropbox(fichier, token);
    }

    alert("Tous les fichiers ont été envoyés vers Dropbox !");
});

async function recupererFichiersDepuisIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("monjournaldebordDB", 1);
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction("fichiersDB", "readonly");
            const store = transaction.objectStore("fichiersDB");
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = function() {
                resolve(getAllRequest.result);
            };
            getAllRequest.onerror = function() {
                reject("Erreur lors de la récupération des fichiers.");
            };
        };
        request.onerror = function() {
            reject("Erreur lors de l'ouverture de IndexedDB.");
        };
    });
}

async function envoyerFichierVersDropbox(fichier, token) {
    const blob = dataURLtoBlob(fichier.contenu);
    const response = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: `/ToxDetect Backup/${fichier.nom}`,
                mode: "add",
                autorename: true,
                mute: false
            }),
            "Content-Type": "application/octet-stream"
        },
        body: blob
    });

    if (response.ok) {
        console.log(`${fichier.nom} envoyé avec succès.`);
    } else {
        console.error(`Erreur lors de l'envoi du fichier ${fichier.nom}.`);
    }
}

// Fonction de conversion de Data URL en Blob
function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(",");
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
