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

    function connectToDropbox() {
        let authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&response_type=token&redirect_uri=${window.location.origin}/journal.html`;
        window.location.href = authUrl;
    }

    function getDropboxClient() {
        let token = localStorage.getItem("dropboxToken");
        if (!token) {
            alert("Vous devez être connecté à Dropbox !");
            return null;
        }
        try {
            return new Dropbox.Dropbox({ accessToken: token });
        } catch (error) {
            console.error("Erreur lors de la création du client Dropbox :", error);
            return null;
        }
    }

   

    function saveFilesToDropbox(fichiers) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        Array.from(fichiers).forEach(fichier => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(fichier);
            reader.onload = () => {
                dbx.filesUpload({ path: `/ToxDetect Backup/${fichier.name}`, contents: reader.result, mode: { ".tag": "overwrite" } })
                    .then(() => {
                        alert(`Fichier ${fichier.name} enregistré avec succès sur Dropbox !`);
                        document.getElementById("fileUpload").value = "";
                    })
                    .catch(err => alert("Erreur Dropbox : " + err.message));
            };
        });
    }

    document.getElementById("save-journal").addEventListener("click", () => {
        const noteTexte = document.getElementById("journalEntry").value.trim();
        if (noteTexte !== "") {
            saveJournalToDropbox(noteTexte);
        } else {
            alert("Veuillez écrire quelque chose avant d'enregistrer.");
        }
    });

    document.getElementById("save-file").addEventListener("click", () => {
        const fichiers = document.getElementById("fileUpload").files;
        if (fichiers.length === 0) {
            alert("Aucun fichier sélectionné.");
            return;
        }
        saveFilesToDropbox(fichiers);
    });

    document.getElementById("connect-dropbox").addEventListener("click", connectToDropbox);

    const consultDropboxButton = document.createElement("button");
    consultDropboxButton.textContent = "Consulter ma Dropbox";
    consultDropboxButton.classList.add("icon-button");
    consultDropboxButton.onclick = () => {
        const dbx = getDropboxClient();
        if (dbx) {
            dbx.filesListFolder({ path: '/ToxDetect Backup' })
                .then(response => {
                    alert("Fichiers dans votre Dropbox : " + response.entries.map(entry => entry.name).join(", "));
                })
                .catch(err => alert("Erreur en consultant Dropbox : " + err.message));
        }
    };
    document.body.appendChild(consultDropboxButton);
});

function extractAccessToken() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("access_token");

    if (token) {
        localStorage.setItem("dropboxToken", token);
        console.log("Token enregistré :", token);
        alert("Connexion Dropbox réussie !");
        window.location.href = "journal.html";
    } else {
        console.error("Échec de la récupération du token d'accès.");
    }
}

window.onload = extractAccessToken;
