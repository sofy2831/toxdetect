document.addEventListener("DOMContentLoaded", function () {
    // Liste des contacts sélectionnés
    let selectedContacts = [];

    // Ajoute un contact à la liste
    window.addContact = function () {
        const contactSelect = document.getElementById("contacts");
        const selectedContactsDiv = document.getElementById("selectedContacts");

        let contact = contactSelect.value;
        if (contact && !selectedContacts.includes(contact)) {
            selectedContacts.push(contact);
            updateContactsDisplay();
        }
    };

    // Met à jour l'affichage des contacts sélectionnés
    function updateContactsDisplay() {
        const selectedContactsDiv = document.getElementById("selectedContacts");
        selectedContactsDiv.innerHTML = selectedContacts.length > 0 
            ? "Contacts : " + selectedContacts.join(", ") 
            : "Aucun contact sélectionné.";
    }

    // Vérifie si "Autre" est sélectionné et affiche le champ de texte
    window.checkOtherOption = function () {
        const predefinedMessageSelect = document.getElementById("predefinedMessage");
        const customMessageTextarea = document.getElementById("customMessage");

        if (predefinedMessageSelect.value === "other") {
            customMessageTextarea.style.display = "block";
        } else {
            customMessageTextarea.style.display = "none";
        }
    };

    // Envoie l'alerte avec le message sélectionné
    window.sendAlert = function () {
        let message = document.getElementById("predefinedMessage").value;

        if (message === "other") {
            message = document.getElementById("customMessage").value;
        }

        if (selectedContacts.length === 0) {
            alert("Veuillez sélectionner au moins un contact.");
            return;
        }

        if (!message.trim()) {
            alert("Veuillez écrire un message.");
            return;
        }

        document.getElementById("selectedMessage").innerText = "Message : " + message;

        // Simulation d'envoi (remplace cette ligne par une requête API SMS si nécessaire)
        alert("Alerte envoyée à : " + selectedContacts.join(", ") + "\nMessage : " + message);
    };

    // Envoie une alerte d'urgence
    window.sendEmergency = function () {
        alert("🚨 Urgence envoyée aux autorités !");
    };
});
