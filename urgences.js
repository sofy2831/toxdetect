document.addEventListener("DOMContentLoaded", function () {
    let selectedContacts = JSON.parse(localStorage.getItem("selectedContacts")) || [];
    let lastMessage = localStorage.getItem("lastMessage") || "";
    updateContactsDisplay();
    updateMessageDisplay();

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
                const contactItem = document.createElement("div");
                contactItem.innerText = contact;

                const removeButton = document.createElement("button");
                removeButton.innerText = "❌";
                removeButton.onclick = function () {
                    removeContact(contact);
                };

                contactItem.appendChild(removeButton);
                selectedContactsDiv.appendChild(contactItem);
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
        }
    };

    function getLocation(callback) {
        const loadingIndicator = document.getElementById("loadingIndicator");
        loadingIndicator.style.display = "block";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    loadingIndicator.style.display = "none";
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    callback(`Localisation : https://www.google.com/maps?q=${latitude},${longitude}`);
                },
                function (error) {
                    loadingIndicator.style.display = "none";
                    let errorMessage = "Localisation non disponible";
                    if (error.code === 1) {
                        errorMessage = "Accès à la localisation refusé";
                    } else if (error.code === 2) {
                        errorMessage = "Impossible de récupérer la position";
                    } else if (error.code === 3) {
                        errorMessage = "Délai d'attente dépassé";
                    }
                    callback(errorMessage);
                }
            );
        } else {
            loadingIndicator.style.display = "none";
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
            localStorage.setItem("lastMessage", fullMessage);
            alert("Alerte envoyée à : " + selectedContacts.join(", ") + "\nMessage : " + fullMessage);
        });
    };

    window.sendEmergency = function () {
        getLocation(function (location) {
            const emergencyMessage = "🚨 URGENCE ! J'ai besoin d'aide immédiatement !\n" + location;
            alert("Urgence envoyée aux autorités !\n" + emergencyMessage);
        });
    };

    function updateMessageDisplay() {
        const selectedMessageDiv = document.getElementById("selectedMessage");
        selectedMessageDiv.innerText = "Message : " + lastMessage;
    }
});
