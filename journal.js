document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Journal chargée.");

    // Affichage de la date du jour
    function afficherDate() {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dateDisplay').textContent = `Date du jour : ${date.toLocaleDateString('fr-FR', options)}`;
    }

    afficherDate();

    // Configuration Dropbox
    const dropboxAppKey = "0z41GO683A6XB20"; 
    let accessToken = localStorage.getItem("dropboxToken");

    // Connexion à Dropbox
    function connectToDropbox() {
        let authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&response_type=token&redirect_uri=${window.location.origin}/auth.html`;
        window.location.href = authUrl;
    }

    function getDropboxClient() {
        if (!accessToken) {
            alert("Vous devez être connecté à Dropbox !");
            return null;
        }
        return new Dropbox.Dropbox({ accessToken });
    }

    // Sauvegarde d'un journal sur Dropbox
    function saveJournalToDropbox(noteTexte) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        const fileName = `journal-${new Date().toISOString().split("T")[0]}.txt`;

        dbx.filesUpload({ path: `/${fileName}`, contents: noteTexte })
            .then(() => alert("Journal enregistré avec succès sur Dropbox !"))
            .catch(err => console.error("Erreur Dropbox :", err));
    }

    // Écouteur de l'événement pour la sauvegarde du journal
    document.getElementById("save-journal").addEventListener("click", () => {
        const noteTexte = document.getElementById("journalEntry").value.trim();
        if (noteTexte !== "") {
            saveJournalToDropbox(noteTexte);
            document.getElementById("journalEntry").value = "";
        }
    });

    // Sauvegarde de fichiers (images, pdf...) sur Dropbox
    function saveFilesToDropbox(fichiers) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        Array.from(fichiers).forEach(fichier => {
            const reader = new FileReader();
            reader.onload = () => {
                dbx.filesUpload({ path: `/fichiers/${fichier.name}`, contents: reader.result })
                    .then(() => alert(`Fichier ${fichier.name} enregistré avec succès sur Dropbox !`))
                    .catch(err => console.error("Erreur Dropbox :", err));
            };
            reader.readAsArrayBuffer(fichier);
        });
    }

    // Écouteur de l'événement pour le téléchargement de fichiers
    document.getElementById("save-file").addEventListener("click", () => {
        const fichiers = document.getElementById("fileUpload").files;
        if (fichiers.length === 0) {
            alert("Aucun fichier sélectionné.");
            return;
        }
        saveFilesToDropbox(fichiers);
    });

    // Connexion à Dropbox via le bouton
    document.getElementById("connect-dropbox").addEventListener("click", connectToDropbox);

    // Ajout des boutons pour rediriger vers les pages vidéo et audio
    const videoButton = document.createElement("button");
    videoButton.textContent = "Vidéo";
    videoButton.classList.add("icon-button");  // Ajouter une classe CSS pour l'icône
    videoButton.onclick = () => window.location.href = "video.html"; // Redirection vers la page vidéo
    document.body.appendChild(videoButton);

    const audioButton = document.createElement("button");
    audioButton.textContent = "Audio";
    audioButton.classList.add("icon-button");  // Ajouter une classe CSS pour l'icône
    audioButton.onclick = () => window.location.href = "audio.html"; // Redirection vers la page audio
    document.body.appendChild(audioButton);

    // Bouton pour consulter les fichiers de Dropbox
    const consultDropboxButton = document.createElement("button");
    consultDropboxButton.textContent = "Consulter ma Dropbox";
    consultDropboxButton.classList.add("icon-button");  // Ajouter une classe CSS pour l'icône
    consultDropboxButton.onclick = () => {
        const dbx = getDropboxClient();
        if (dbx) {
            dbx.filesListFolder({ path: '' })
                .then(response => {
                    alert("Fichiers dans votre Dropbox : " + response.entries.map(entry => entry.name).join(", "));
                })
                .catch(err => console.error("Erreur en consultant Dropbox :", err));
        }
    };
    document.body.appendChild(consultDropboxButton);
});

// Fonction pour extraire le token d'accès depuis l'URL
function extractAccessToken() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");

    if (accessToken) {
        localStorage.setItem("dropboxToken", accessToken);
        alert("Connexion Dropbox réussie !");
        window.location.href = "journal.html";
    }
}

window.onload = extractAccessToken;

// Exportation des données d'IndexedDB
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

// Téléversement des données vers Dropbox
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
