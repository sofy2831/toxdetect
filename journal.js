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
        if (!accessToken) {
            alert("Vous devez être connecté à Dropbox !");
            return null;
        }
        return new Dropbox.Dropbox({ accessToken });
    }

    function saveJournalToDropbox(noteTexte) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        const fileName = `backup/journal-${new Date().toISOString().split("T")[0]}.txt`;

        dbx.filesUpload({ path: `/${fileName}`, contents: noteTexte, mode: 'overwrite' })
            .then(() => {
                alert("Journal enregistré avec succès sur Dropbox !");
                document.getElementById("journalEntry").value = "";
            })
            .catch(err => alert("Erreur Dropbox : " + err.message));
    }

    function saveFilesToDropbox(fichiers) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        Array.from(fichiers).forEach(fichier => {
            const reader = new FileReader();
            reader.onload = () => {
                dbx.filesUpload({ path: `/backup/${fichier.name}`, contents: reader.result, mode: 'overwrite' })
                    .then(() => {
                        alert(`Fichier ${fichier.name} enregistré avec succès sur Dropbox !`);
                        document.getElementById("fileUpload").value = "";
                    })
                    .catch(err => alert("Erreur Dropbox : " + err.message));
            };
            reader.readAsArrayBuffer(fichier);
        });
    }

    document.getElementById("save-journal").addEventListener("click", () => {
        const noteTexte = document.getElementById("journalEntry").value.trim();
        if (noteTexte !== "") {
            saveJournalToDropbox(noteTexte);
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

    const videoButton = document.createElement("button");
    videoButton.textContent = "Vidéo";
    videoButton.classList.add("icon-button");
    videoButton.onclick = () => window.location.href = "videos.html";
    document.body.appendChild(videoButton);

    const audioButton = document.createElement("button");
    audioButton.textContent = "Audio";
    audioButton.classList.add("icon-button");
    audioButton.onclick = () => window.location.href = "audios.html";
    document.body.appendChild(audioButton);

    const consultDropboxButton = document.createElement("button");
    consultDropboxButton.textContent = "Consulter ma Dropbox";
    consultDropboxButton.classList.add("icon-button");
    consultDropboxButton.onclick = () => {
        const dbx = getDropboxClient();
        if (dbx) {
            dbx.filesListFolder({ path: '/backup' })
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
    const accessToken = params.get("access_token");

    if (accessToken) {
        localStorage.setItem("dropboxToken", accessToken);
        alert("Connexion Dropbox réussie !");
        window.location.href = "journal.html";
    }
}

window.onload = extractAccessToken;
