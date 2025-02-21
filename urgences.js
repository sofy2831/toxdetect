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
                return; // Contact déjà ajouté, on ne fait rien
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
function updateSelectedMessage() {
    let predefinedMessage = document.getElementById("predefinedMessage").value;
    let customMessageField = document.getElementById("customMessage");
    let selectedMessageDiv = document.getElementById("selectedMessage");

    if (predefinedMessage === "other") {
        customMessageField.style.display = "block";
        selectedMessageDiv.innerText = ""; // Efface l'ancien message si "Autre" est choisi
    } else {
        customMessageField.style.display = "none";
        selectedMessageDiv.innerText = "Message sélectionné : " + predefinedMessage;
    }
}

function sendAlert() {
    let contacts = document.querySelectorAll(".contact-badge");
    let selectedMessage = document.getElementById("predefinedMessage").value;
    let message = document.getElementById("predefinedMessage").value;
    let customMessage = document.getElementById("customMessage").value;

    }
    
    if (message === "other" && customMessage.trim() === "") {
        alert("Veuillez entrer un message personnalisé.");
        return;
    }

    let finalMessage = message === "other" ? customMessage : message;

    if (contacts.length === 0) {
        alert("Veuillez ajouter au moins un contact.");
        return;
    }
 // Vérifier le message (pré-enregistré ou personnalisé)
    let finalMessage = selectedMessage === "other" ? customMessage : selectedMessage;
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

                let contactNumbers = Array.from(contacts).map(contact => contact.dataset.number);
                let alertMessage = `🚨 Alerte envoyée à : ${contactNumbers.join(", ")}\n\n📩 Message : ${finalMessage}\n\n📍 Localisation : https://www.google.com/maps?q=${latitude},${longitude}`;
                
                alert(alertMessage); // Affiche l'alerte avec les infos

                console.log(alertMessage); // Log dans la console

                // Ici, tu pourrais ajouter un envoi réel via une API SMS/Email si nécessaire.
            },
            function (error) {
                alert("Erreur lors de la récupération de la localisation : " + error.message);
            }
        );
    } else {
        alert("La géolocalisation n'est pas prise en charge par votre navigateur.");
    }
}


    let contactNumbers = Array.from(contacts).map(contact => contact.getAttribute("data-value"));

    alert("Message envoyé aux contacts :\n" + contactNumbers.join(", ") + "\n\nMessage : " + finalMessage);
}

function sendEmergency() {
    alert("Appel des services d'urgence en cours...");
}
