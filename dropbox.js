Dropbox.embed({
    link: '/https://www.dropbox.com/home/Applications/ToxDetect%20Backup',
    container: document.getElementById('dropbox-embedder'),
    width: '100%',
    height: '600px'
});


document.getElementById('ma-dropbox-btn').addEventListener('click', function() {
    Dropbox.choose({
        success: function(files) {
            // Afficher les informations des fichiers sélectionnés
            files.forEach(function(file) {
                console.log('Nom : ' + file.name);
                console.log('Lien : ' + file.link);
                // Vous pouvez également afficher ces informations dans votre page
            });
        },
        cancel: function() {
            // L'utilisateur a annulé l'opération
        },
        linkType: 'preview', // ou 'direct' selon vos besoins
        multiselect: true, // ou false si vous ne souhaitez permettre la sélection que d'un seul fichier
        extensions: ['.pdf', '.doc', '.docx'], // Filtrer les types de fichiers si nécessaire
    });
});
