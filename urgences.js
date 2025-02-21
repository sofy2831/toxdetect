document.addEventListener("DOMContentLoaded", function () {
    checkOtherOption();
});

function addContact() {
    let contactsSelect = document.getElementById("contacts");
    let selectedContactsDiv = document.getElementById("selectedContacts");

    let selectedValue = contactsSelect.value;
    let selectedText = contactsSelect.options[contactsSelect.selectedIndex].text;

    if (selectedValue !== "") {
        let existingContacts = selectedContactsDiv.getElementsByClassName("contact-badge");
        for (let i = 0; i < existingContacts.length; i++) {
            if (existingContacts[i].getAttribute("data-value") === selectedValue) {
                return; // Contact déjà ajouté
            }
        }

        let contactBadge = document.createElement("div");
        contactBadge.classList.add("contact-badge");
        contactBadge.setAttribute("data-value", selectedValue);
        contactBadge.innerHTML = `${selectedText} (${selectedValue}) 
            <button class="remove-btn" onclick="removeContact(this)">X</button>`;

        selectedContactsDiv.appendChild(contactBadge);
    }

    contactsSelect.value = "";
}

function removeContact(button) {
    button.parentElement.remove();
}

function checkOtherOption() {
    let predefinedMessageSelect = document.getElementById("predefinedMessage");
    let customMessageTextarea = document.getElementById("customMessage");
    let selectedMessageDiv = document.getElementById("selectedMessage");
    
    if (predefinedMessageSelect.value === "other") {
        customMessageTextarea.style.display = "block";
        selectedMessageDiv.innerText = ""; // Efface l'affichage précédent       
    } else {
        customMessageTextarea.style.display = "none";
        selectedMessageDiv.innerText = "Message sélectionné : " + predefinedMessageSelect.value;
    }
}

function sendAlert() {
    let contacts = document.querySelectorAll(".contact-badge");
    let predefinedMessage = document.getElementById("predefinedMessage").value;
    let customMessage = document.getElementById("customMessage").value.trim();

    if (contacts.length === 0) {
        alert("Veuillez ajouter au moins un contact.");
        return;
    }

    let finalMessage = predefinedMessage === "other" ? customMessage : predefinedMessage;

    if (!finalMessage) {
        alert("Veuillez saisir un message d’alerte.");
        return;
    }

    // Récupérer la localisation de l'utilisateur
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                let contactNumbers = Array.from(contacts).map(contact => contact.getAttribute("data-value"));
                let alertMessage = `🚨 Alerte envoyée à : ${contactNumbers.join(", ")}\n\n📩 Message : ${finalMessage}\n\n📍 Localisation : https://www.google.com/maps?q=${latitude},${longitude}`;
                
                alert(alertMessage); // Affiche l'alerte avec les infos
                console.log(alertMessage); // Log dans la console

                // Ici, possibilité d'envoyer via une API SMS/Email.
            },
            function (error) {
                alert("Erreur lors de la récupération de la localisation : " + error.message);
            }
        );
    } else {
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
}

// ✅ Fonction pour envoyer l'alerte d'urgence avec localisation GPS
function sendEmergency() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                let emergencyMessage = `🚨 Urgence ! Appel des services d'urgence en cours...\n\n📍 Localisation : https://www.google.com/maps?q=${latitude},${longitude}`;
                
                alert(emergencyMessage); // Affiche un message d'urgence avec la localisation
                console.log(emergencyMessage); // Log pour test

                // Ici, possibilité d'ajouter un appel direct aux urgences (ex : via `tel:` dans un lien).
            },
            function (error) {
                alert("Erreur lors de la récupération de la localisation : " + error.message);
            }
        );
    } else {
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
}
