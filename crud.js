// C.R.U.D OPERATIONS

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));

const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
}

const readClient = () => getLocalStorage();

const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient); 
}

const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

// LAYOUT INTERACTION 

const validateFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.form-control');
    fields.forEach(field => field.value = "");
}

const saveClient = () => {
    if (validateFields()) {
        const client = {
            nome: document.getElementById('inputFirstName').value,
            sobrenome: document.getElementById('inputLastName').value,
            nascimento: document.getElementById('inputAge').value,
            email: document.getElementById('inputEmail').value,
            contato: document.getElementById('inputCel').value,
            cidade: document.getElementById('inputCity').value
        }
        const index = document.getElementById('inputFirstName').dataset.index
        if (index == "new") {
        createClient(client)
        clearFields()
        updateTable()
        } else {
            updateClient(index, client)
            updateTable()
            clearFields()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.sobrenome}</td>
    <td>${client.nascimento}</td>
    <td>${client.email}</td>
    <td>${client.contato}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" id="edit-${index}" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#newRegister"><ion-icon name="ellipsis-horizontal-outline"></ion-icon></button>
        <button type="button" id="delete-${index}" class="btn btn-outline-secondary"><ion-icon name="trash-outline"></ion-icon></button>               
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('inputFirstName').value = client.nome
    document.getElementById('inputLastName').value = client.sobrenome
    document.getElementById('inputAge').value = client.nascimento
    document.getElementById('inputEmail').value = client.email
    document.getElementById('inputCel').value = client.contato
    document.getElementById('inputCity').value = client.cidade
    document.getElementById('inputFirstName').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')
        if (action == 'edit') {
            editClient(index)    
        } else {
            const client = readClient()[index]
            const response = confirm (`Confirma a exclusão do usuário ${client.nome} ${client.sobrenome}`)
            if (response) {
            deleteClient(index)
            updateTable()
            }
        }
    }
}


updateTable() 

// EVENTS 

document.getElementById('saveClient')
    .addEventListener('click', saveClient)

document.getElementById('cancelClient')
    .addEventListener('click', clearFields)

document.getElementById('modalClose')
    .addEventListener('click', clearFields)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

