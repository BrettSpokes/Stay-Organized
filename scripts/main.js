"use strict";

// Import the api functions from api.js
import { api_PullUsers, api_PullTodos } from './apis.js';

let usersData;

document.addEventListener('DOMContentLoaded', async function () {
    if (window.location.pathname == '/Stay-Organized-Workshop/todos.html') {
        await fetchUsers().then(populateUsers);

        document.getElementById('userDropDown').addEventListener('change', handleUserSelect);




    }
});

//Functions for Todo Selection//

const fetchUsers = async () => {
    usersData = await api_PullUsers();
};

const fetchTodosByUser = async function(_targetId) {
    const usersTodos = await api_PullTodos(_targetId);
    return usersTodos;
};

const fetchTodosByAll = async () => {
    const usersTodos = await api_PullTodos(0);
    return usersTodos;
};

const populateUsers = () => {
    if (usersData) {
        populateDropdown(usersData, 'userDropDown');
    }
}

const findUsersName = function(_targetId) {
    return usersData.find(user => user.id === Number(_targetId));
}

function populateDropdown(arr_Data, str_ElementId) {
    const dropDown = document.getElementById(str_ElementId);
    dropDown.innerHTML = `
    <option selected value="">Select One...</option>
    <option value="All">Select All</option>
    `;
    let fragment = document.createDocumentFragment();
    arr_Data.forEach(entry => {
        fragment.appendChild(new Option(entry.name, entry.id));
    });
    dropDown.appendChild(fragment);
}

function populateList(arr_Data, str_ElementId) {

}


function handleUserSelect(event) {
    if (event.target.value != 'All' && event.target.value) {
        const selectedUser = findUsersName(event.target.value);
        console.log('Select user ID', event.target.value, selectedUser.name);

        //Get Data
        fetchTodosByUser(event.target.value).then(pulledTodos => {
            console.log('Pulled Todos', pulledTodos);
            displayListTodos(pulledTodos);
        });
        
        
    } else if (event.target.value === "All") {
        console.log('Pull All Todos');
        fetchTodosByAll().then(pulledTodos => {
            displayListTodos(pulledTodos);
        });
    }
    else {
        console.log('No User Selected');
    }

}


function displayListTodos(arr) {
    let tableElement = document.getElementById('tBody');
    tableElement.innerHTML = ``;

    const cellMappings = [
        { dataKey: 'category', cellName: 'Category' },
        { dataKey: 'description', cellName: 'Task' },
        { dataKey: 'completed', cellName: 'Completed' }
    ];

    arr.forEach(todo => {
        const row = document.createElement('tr');

        const userCell = document.createElement('td');
        userCell.textContent = findUsersName(todo.userid).name;
        row.appendChild(userCell);

        // Iterate over cell mappings to create corresponding cells
        cellMappings.forEach(mapping => {
            const cell = document.createElement('td');
            switch (todo[mapping.dataKey]) {
                case true:
                    cell.textContent = '✔';
                  break;
                case false:
                    cell.textContent = '✘';
                  break;
                default:
                    cell.textContent = todo[mapping.dataKey];
                  break;
              }
            
            row.appendChild(cell);
        });

        tableElement.appendChild(row);
    });

}

//End of Functions for Todos Selection//