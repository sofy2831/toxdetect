document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Journal chargée.");

    // Fonction pour afficher la date du jour
    function afficherDate() {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('fr-FR', options);
        document.getElementById('dateDisplay').textContent = `Date du jour : ${dateString}`;
    }

    afficherDate();

    let dropboxAppKey = "0z41GO683A6XB20"; // Remplace par ta clé API Dropbox
    let dbx;

    function connectToDropbox() {
        let authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&response_type=token&redirect_uri=https://sofy2831.github.io/toxdetect/auth.html`;
        window.location.href = authUrl; 
    }

    function checkDropboxConnection() {
        if (Dropbox.auth.isAuthenticated()) {
            dbx = Dropbox.client();
            console.log("Connecté à Dropbox !");
        } else {
            console.log("Non connecté à Dropbox");
        }
    }

    function showDropboxConnectionMessage() {
        if (!Dropbox.auth.isAuthenticated()) {
            alert("Vous devez être connecté à Dropbox pour enregistrer vos fichiers.");
        }
    }

    function getDropboxClient() {
        const token = localStorage.getItem("dropboxToken");
        if (!token) {
            alert("Vous devez être connecté à Dropbox !");
            return null;
        }
        return new Dropbox.Dropbox({ accessToken: token });
    }

    function saveJournalToDropbox(noteTexte) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        const fileName = `journal-${new Date().toLocaleDateString()}.txt`;
        const fileContent = new Blob([noteTexte], { type: "text/plain" });

        dbx.filesUpload({ path: `/${fileName}`, contents: fileContent })
            .then(() => alert("Journal enregistré avec succès sur Dropbox !"))
            .catch(err => console.error("Erreur Dropbox :", err));
    }

    // Gérer l'enregistrement du journal
    document.getElementById("save-journal").addEventListener("click", () => {
        const noteTexte = document.getElementById("journalEntry").value;
        if (noteTexte.trim() !== "") {
            showDropboxConnectionMessage();
            saveJournalToDropbox(noteTexte);
            document.getElementById("journalEntry").value = ""; 
        }
    });

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

    document.getElementById("save-file").addEventListener("click", () => {
        const fichierInput = document.getElementById("fileUpload");
        const fichiers = fichierInput.files;
        if (fichiers.length === 0) {
            alert("Aucun fichier sélectionné.");
            return;
        }

        showDropboxConnectionMessage();
        saveFilesToDropbox(fichiers);
    });

    checkDropboxConnection();

    document.getElementById("connect-dropbox").addEventListener("click", () => {
        connectToDropbox();
    });
});

function extractAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
        localStorage.setItem("dropboxToken", accessToken);
        alert("Connexion Dropbox réussie !");
        window.location.href = "journal.html"; 
    } else {
        alert("Erreur lors de l'authentification Dropbox.");
    }
}

window.onload = extractAccessToken;
