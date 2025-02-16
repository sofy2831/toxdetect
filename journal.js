document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Journal chargée.");

   // Fonction pour afficher la date du jour
function afficherDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString('fr-FR', options);
    document.getElementById('dateDisplay').textContent = `Date du jour : ${dateString}`;
}

// Appel de la fonction pour afficher la date
afficherDate();

   
    // Ouvrir IndexedDB
    let db;
    const request = indexedDB.open("monjournaldebordDB", 1);
    
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("journalDB")) {
            db.createObjectStore("journalDB", { keyPath: "id", autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("fichiersDB")) {
            db.createObjectStore("fichiersDB", { keyPath: "id", autoIncrement: true });
        }
    };
    
    request.onsuccess = (event) => {
        db = event.target.result;
        console.log("IndexedDB ouvert avec succès");

    };
    
    request.onerror = (event) => {
        console.error("Erreur d'accès à IndexedDB", event.target.errorCode);
    };

    // Fonction d'ajout dans IndexedDB
    function ajouterDansIndexedDB(storeName, data) {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        store.add(data);
    }

    // Gérer l'enregistrement des notes
    document.getElementById("save-journal").addEventListener("click", () => {
        const noteTexte = document.getElementById("journalEntry").value;
        if (noteTexte.trim() !== "") {
            const noteData = { texte: noteTexte, date: new Date().toLocaleString() };
            ajouterDansIndexedDB("journalDB", noteData);
            document.getElementById("journalEntry").value = ""; // Réinitialisation
            alert("Journal enregistré dans IndexedDB !");
        }
    });

    // Gérer l'enregistrement des fichiers
    document.getElementById("save-file").addEventListener("click", () => {
        const fichierInput = document.getElementById("fileUpload");
        const fichiers = fichierInput.files;
        if (fichiers.length === 0) {
            alert("Aucun fichier sélectionné.");
            return;
        }
        
        let filesAdded = 0;
        
        Array.from(fichiers).forEach(fichier => {
            const reader = new FileReader();
            reader.onload = () => {
                const fichierData = { nom: fichier.name, contenu: reader.result, date: new Date().toLocaleString() };
                ajouterDansIndexedDB("fichiersDB", fichierData);
                filesAdded++;
                if (filesAdded === fichiers.length) {
                    alert("Fichiers enregistrés dan IndexedDB !");
                    fichierInput.value = "";
                }
            };
            reader.readAsDataURL(fichier);
        });
    });
});
