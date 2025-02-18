const CLIENT_ID = "0z41GO683A6XB"; // Remplace par ton client ID Dropbox
const REDIRECT_URI = "https://sofy2831.github.io/toxdetect/auth.html"; // L'URL vers laquelle Dropbox redirige après l'authentification
const AUTH_URL = `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}`;

// Fonction d'authentification
function authenticateDropbox() {
    window.location.href = AUTH_URL;
}

// Fonction de récupération du token d'accès
function getAccessTokenFromUrl() {
    const hashParams = window.location.hash.substring(1).split('&');
    const params = {};
    hashParams.forEach(param => {
        const pair = param.split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    });
    return params.access_token || null;
}

// Fonction pour vérifier si l'utilisateur est connecté à Dropbox
function checkDropboxAuth() {
    const token = localStorage.getItem("dropbox_token");
    if (!token) {
        alert("Vous n'êtes pas authentifié. Veuillez vous connecter.");
        window.location.href = "rapport.html";
        return null;
    }
    return token;
}

// Fonction de déconnexion
function logoutFromDropbox() {
    localStorage.removeItem("dropbox_token");
    alert("Vous avez été déconnecté de Dropbox.");
    window.location.href = "rapport.html";
}

// Fonction pour envoyer un fichier à Dropbox
async function uploadFileToDropbox(file, token) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`https://content.dropboxapi.com/2/files/upload`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: `/ToxDetect Backup/${file.name}`,
                mode: "add",
                autorename: true,
                mute: false
            }),
            "Content-Type": "application/octet-stream"
        },
        body: file
    });
    const data = await response.json();
    if (response.ok) {
        console.log("Fichier téléchargé avec succès");
    } else {
        console.error("Erreur lors de l'envoi du fichier", data);
    }
}

// Fonction pour afficher la liste des fichiers dans le dossier Dropbox
async function listFilesFromDropbox(token) {
    const response = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            path: "/ToxDetect Backup",
            recursive: false
        })
    });

    const data = await response.json();
    if (response.ok) {
        console.log("Fichiers récupérés : ", data.entries);
        return data.entries;
    } else {
        console.error("Erreur lors de la récupération des fichiers", data);
    }
}

// Fonction pour récupérer un fichier spécifique depuis Dropbox
async function downloadFileFromDropbox(filePath, token) {
    const response = await fetch("https://content.dropboxapi.com/2/files/download", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Dropbox-API-Arg": JSON.stringify({
                path: filePath
            })
        })
    ;

    const blob = await response.blob();
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filePath.split("/").pop();
    link.click();
    URL.revokeObjectURL(fileUrl);
}
