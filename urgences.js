document.addEventListener("DOMContentLoaded", function () {
    let selectedContacts = [];

    // Ajoute un contact à la liste
    window.addContact = function () {
        const contactSelect = document.getElementById("contacts");
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
        const selectedMessageDiv = document.getElementById("selectedMessage");

        if (predefinedMessageSelect.value === "other") {
            customMessageTextarea.style.display = "block";
            selectedMessageDiv.innerText = "";
        } else {
            customMessageTextarea.style.display = "none";
            selectedMessageDiv.innerText = "Message : " + predefinedMessageSelect.value;
        }
    };

    // Récupération de la position GPS
    function getLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    callback(`Localisation : https://www.google.com/maps?q=${latitude},${longitude}`);
                },
                function (error) {
                    callback("Localisation non disponible");
                }
            );
        } else {
            callback("Localisation non disponible");
        }
    }

    // Envoie l'alerte avec le message sélectionné et la position GPS
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
        
        getLocation(function (location) {
            const fullMessage = `${message}\n${location}`;
            document.getElementById("selectedMessage").innerText = "Message : " + fullMessage;
            alert("Alerte envoyée à : " + selectedContacts.join(", ") + "\nMessage : " + fullMessage);
        });
    };

    // Envoie une alerte d'urgence aux autorités avec la position GPS
    window.sendEmergency = function () {
        getLocation(function (location) {
            const emergencyMessage = "🚨 URGENCE ! J'ai besoin d'aide immédiatement !\n" + location;
            alert("Urgence envoyée aux autorités !\n" + emergencyMessage);
        });
    };
});
