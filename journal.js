document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Journal chargée.");
    
console.log("Script chargé !");
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM complètement chargé !");
    console.log(document.getElementById("save-journal"));
});

    
    // Affichage de la date du jour
    function afficherDate() {
        const date = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dateDisplay').textContent = `Date du jour : ${date.toLocaleDateString('fr-FR', options)}`;
    }

    afficherDate();
    
document.getElementById("save-journal").addEventListener("click", function() {
    const noteTexte = document.getElementById("journalEntry").value;
    
    if (!noteTexte) {
        alert("Veuillez écrire quelque chose avant d'enregistrer.");
        return;
    }

    saveJournalToDropbox(noteTexte);
});

    

    // Configuration Dropbox
    const dropboxAppKey = "0z41GO683A6XB20"; 
    let accessToken = localStorage.getItem("dropboxToken");
    console.log("Access Token:", accessToken);

    function connectToDropbox() {
        let authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxAppKey}&response_type=token&redirect_uri=${window.location.origin}/journal.html`;
        window.location.href = authUrl;
    }

    function getDropboxClient() {
         let accessToken = localStorage.getItem("dropboxToken");
    console.log("Token utilisé pour Dropbox:", accessToken);
    
    if (!accessToken) {
        alert("Vous devez être connecté à Dropbox !");
        return null;
    }

        try {
        return new Dropbox.Dropbox({ accessToken });
    } catch (error) {
        console.error("Erreur lors de la création du client Dropbox :", error);
        return null;
    }
}
function saveJournalToDropbox(noteTexte) {
    console.log("Envoi du journal à Dropbox :", noteTexte);

    let dbx = getDropboxClient();
    if (!dbx) return;

    const fileName = `Journal_${new Date().toISOString().split('T')[0]}.txt`;
    const fileContent = new Blob([noteTexte], { type: "text/plain" });

    fileContent.arrayBuffer().then(buffer => {
        dbx.filesUpload({
            path: `/ToxDetect Backup/${fileName}`,
            contents: buffer,
            mode: { ".tag": "overwrite" }
        }).then(response => {
            alert("Journal enregistré avec succès sur Dropbox !");
            console.log("Réponse Dropbox :", response);
        }).catch(error => {
            console.error("Erreur lors de l’enregistrement :", error);
            alert("Erreur lors de l'enregistrement sur Dropbox.");
        });
    });
}
    
    function saveJournalToDropbox(noteTexte) {
       console.log("Envoi du journal à Dropbox :", noteTexte);
        const dbx = getDropboxClient();

        if (!dbx) {
        console.log("Erreur : pas de client Dropbox");
        return;
    }
       
        const fileName = `toxdetect backup/journal-${new Date().toISOString().split("T")[0]}.txt`;

       dbx.filesUpload({ path: fileName, contents: noteTexte, mode: 'overwrite' })
        .then(() => {
                console.log("Enregistrement réussi !");
                alert("Journal enregistré avec succès sur Dropbox !");
                document.getElementById("journalEntry").value = "";
            })
             .catch(err => {
            console.error("Erreur Dropbox :", err);
            alert("Erreur Dropbox : " + JSON.stringify(err));
        });
    }

    function saveFilesToDropbox(fichiers) {
        const dbx = getDropboxClient();
        if (!dbx) return;

        Array.from(fichiers).forEach(fichier => {
            const reader = new FileReader();
            reader.onload = () => {
                dbx.filesUpload({ path: `/toxdetect backup/${fichier.name}`, contents: reader.result, mode: 'overwrite' })
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
