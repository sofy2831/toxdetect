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
    let message = document.getElementById("predefinedMessage").value;
    let customMessage = document.getElementById("customMessage").value;

    if (message === "other" && customMessage.trim() === "") {
        alert("Veuillez entrer un message personnalisé.");
        return;
    }

    let finalMessage = message === "other" ? customMessage : message;

    if (contacts.length === 0) {
        alert("Veuillez ajouter au moins un contact.");
        return;
    }

    let contactNumbers = Array.from(contacts).map(contact => contact.getAttribute("data-value"));

    alert("Message envoyé aux contacts :\n" + contactNumbers.join(", ") + "\n\nMessage : " + finalMessage);
}

function sendEmergency() {
    alert("Appel des services d'urgence en cours...");
}
