document.addEventListener("DOMContentLoaded", function () {
    let selectedContacts = JSON.parse(localStorage.getItem("selectedContacts")) || [];
    let lastMessage = localStorage.getItem("lastMessage") || "";
    updateContactsDisplay();
    updateMessageDisplay(lastMessage);

    window.addContact = function () {
        const contactSelect = document.getElementById("contacts");
        const contact = contactSelect.value;
        if (contact && !selectedContacts.includes(contact)) {
            selectedContacts.push(contact);
            localStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
            updateContactsDisplay();
        }
    };

    function updateContactsDisplay() {
        const selectedContactsDiv = document.getElementById("selectedContacts");
        selectedContactsDiv.innerHTML = "";

        if (selectedContacts.length > 0) {
            selectedContacts.forEach(contact => {
                const contactBadge = document.createElement("span");
                contactBadge.classList.add("contact-badge");
                contactBadge.innerHTML = contact + ' <button class="remove-btn">❎
🗑️
</button>';
                contactBadge.style.cursor = "pointer";
                contactBadge.onclick = function () {
                    removeContact(contact);
                };
                selectedContactsDiv.appendChild(contactBadge);
            });
        } else {
            selectedContactsDiv.innerText = "Aucun contact sélectionné.";
        }
    }

    window.removeContact = function (contact) {
        selectedContacts = selectedContacts.filter(c => c !== contact);
        localStorage.setItem("selectedContacts", JSON.stringify(selectedContacts));
        updateContactsDisplay();
    };

    window.resetContacts = function () {
        selectedContacts = [];
        localStorage.removeItem("selectedContacts");
        updateContactsDisplay();
    };

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
            localStorage.setItem("lastMessage", predefinedMessageSelect.value);
        }
    };

    function getLocation(callback) {
        const locationIndicator = document.getElementById("locationIndicator");
        locationIndicator.innerText = "Localisation en cours...";
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    locationIndicator.innerText = "Localisation obtenue";
                    callback(`Localisation : https://www.google.com/maps?q=${latitude},${longitude}`);
                },
                function (error) {
                    let errorMessage = "Localisation non disponible";
                    if (error.code === 1) {
                        errorMessage = "Accès à la localisation refusé";
                    } else if (error.code === 2) {
                        errorMessage = "Impossible de récupérer la position";
                    } else if (error.code === 3) {
                        errorMessage = "Délai d'attente dépassé";
                    }
                    locationIndicator.innerText = errorMessage;
                    callback(errorMessage);
                }
            );
        } else {
            locationIndicator.innerText = "Localisation non supportée";
            callback("Localisation non disponible");
        }
    }

    window.sendAlert = function () {
        let message = document.getElementById("predefinedMessage").value;
        if (message === "other") {
            message = document.getElementById("customMessage").value.trim();
        }

        selectedContacts = JSON.parse(localStorage.getItem("selectedContacts")) || [];

        if (selectedContacts.length === 0) {
            alert("Veuillez sélectionner au moins un contact.");
            return;
        }

        if (!message) {
            alert("Veuillez écrire un message.");
            return;
        }

        if (!confirm("Voulez-vous vraiment envoyer cette alerte ?")) {
            return;
        }

        getLocation(function (location) {
            const fullMessage = `${message}\n${location}`;
            document.getElementById("selectedMessage").innerText = "Message : " + fullMessage;
            alert("Alerte envoyée à : " + selectedContacts.join(", ") + "\nMessage : " + fullMessage);
        });
    };

    window.sendEmergency = function () {
        getLocation(function (location) {
            const emergencyMessage = "🚨 URGENCE ! J'ai besoin d'aide immédiatement !\n" + location;
            alert("Urgence envoyée aux autorités !\n" + emergencyMessage);
        });
    };

    function updateMessageDisplay(message) {
        if (message) {
            document.getElementById("selectedMessage").innerText = "Message : " + message;
        }
    }
});
