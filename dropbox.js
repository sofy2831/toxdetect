document.getElementById('ma-dropbox-btn').addEventListener('click', async function() {
    console.log("Bouton Ma Dropbox cliqué.");
    
    // Vérifier si l'utilisateur est connecté à Dropbox
    const token = localStorage.getItem("dropbox_token");
    if (!token) {
        alert("Veuillez vous connecter à Dropbox d'abord.");
        return;
    }

    // Récupérer les fichiers enregistrés dans IndexedDB
    const fichiers = await recupererFichiersDepuisIndexedDB();
    if (fichiers.length === 0) {
        alert("Aucun fichier trouvé dans IndexedDB.");
        return;
    }

    // Envoyer les fichiers vers Dropbox
    for (const fichier of fichiers) {
        await envoyerFichierVersDropbox(fichier, token);
    }

    alert("Tous les fichiers ont été envoyés vers Dropbox !");
});

// Fonction pour récupérer les fichiers depuis IndexedDB
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
            reject("Impossible d'ouvrir IndexedDB.");
        };
    });
}

// Fonction pour envoyer un fichier vers Dropbox
async function envoyerFichierVersDropbox(fichier, token) {
    console.log(`Envoi du fichier ${fichier.nom} vers Dropbox...`);

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

// Convertir Data URL en Blob
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

