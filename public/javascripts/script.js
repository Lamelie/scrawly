//script exécuté dans le navigateur. C'est pas le script node js.

var socket = io.connect('http://localhost:3001');
var form = document.getElementById('form-event');

socket.on('add-row', data => addRow(data)) //TODO:écoute la fonction 'add-row' qui permet de rajouter une ligne ajoutée par quelqu'un d'autre

form.addEventListener('submit', event => {
  event.preventDefault();

  var data = new FormData(form); //récupère les données du formulaire et les stocke dans data
  fetch(window.location.href + '/dates/new', {
    method: 'POST',
    body: new URLSearchParams(data)
  })
  .then(response => response.json())
  .then(data => {
    // Ajouter la nouvelle ligne en JS - un peu complexe
    addRow(data); //todo: ajouter la fonction addRow

    // notifier les utilisateurs de la nouvelle ligne rajoutée.
    socket.emit('new-row', data); //todo: ajout fonction 'new row'
  }) 
});

//todo: création de la fonction addRow

function addRow(data) {
  const table = form.querySelector('table tbody');

  let tr = document.createElement('tr');
  let td = document.createElement('td');
  td.innerText = data.fullName;
  tr.appendChild(td);

  table.insertBefore(tr, table.querySelector('tr:last-child'));
}
