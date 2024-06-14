"use strict";

// Import the API functions from apis.js
import { api_PullUsers, api_PullTodos, api_PullCategories, api_PostTodo, api_DeleteTodo } from './apis.js';

let usersData;
let categoryData;

document.addEventListener('DOMContentLoaded', async function () {
    if (window.location.pathname.includes('todos.html')) {
        await fetchUsers().then(populateUsers);
        document.getElementById('userDropDown').addEventListener('change', handleUserSelectTodos);
    } else if (window.location.pathname.includes('new_todo.html')) {
        await fetchUsers().then(populateUsers);

        document.getElementById('userDropDown').addEventListener('change', handleUserSelect);

        await fetchCategories().then(populateCategories);

        // Add event listener to the submit button
        document.getElementById('todoSubmit').addEventListener('click', handleSubmitTodo);
    }
});

// Function to handle form submission
const handleSubmitTodo = async () => {
    // Get form data
    const formData = getFormData();

    // Log the form data to the console (you can replace this with any other action you want)
    console.log(formData);

    // Post the form data
    try {
        const response = await postFormData(formData);
        console.log('New Todo created:', response);
    } catch (error) {
        console.error('Error creating new Todo:', error);
    }
};

// Function to post form data
const postFormData = async (formData) => {
    try {
        const response = await api_PostTodo(formData);
        return response;
    } catch (error) {
        throw error;
    }
};

// Function to get the values from the form elements
function getFormData() {
    // Get values from dropdowns
    const userid = document.getElementById('userDropDown').value;
    const category = document.getElementById('categoryDropDown').value;
    const priority = document.getElementById('urgencyDropDown').value;

    // Get value from textarea
    const description = document.getElementById('TA_todoDescription').value;

    // Get value from deadline input
    const deadline = document.getElementById('txt_Deadline').value;

    return {
        userid: userid,
        category: category,
        priority: priority,
        description: description,
        deadline: deadline
    };
}

// Functions for Todo Selection

const fetchUsers = async () => {
    usersData = await api_PullUsers();
};

const fetchCategories = async () => {
    categoryData = await api_PullCategories();
};

const fetchTodosByUser = async function (_targetId) {
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
};

const populateCategories = () => {
    if (categoryData) {
        populateDropdown(categoryData, 'categoryDropDown');
    }
};

const findUsersName = function (_targetId) {
    return usersData.find(user => user.id === Number(_targetId));
};

function populateDropdown(arr_Data, str_ElementId) {
    const dropDown = document.getElementById(str_ElementId);
    if (window.location.pathname.includes('todos.html')) {
        dropDown.innerHTML = `
        <option selected value="">Select One...</option>
        <option value="All">Select All</option>
        `;
    }
    let fragment = document.createDocumentFragment();
    arr_Data.forEach(entry => {
        fragment.appendChild(new Option(entry.name, entry.id));
    });
    dropDown.appendChild(fragment);
}

function populateList(arr_Data, str_ElementId) {
    // Implementation needed
}

function handleUserSelect() {
    // Implementation needed
}

function handleUserSelectTodos(event) {
    if (event.target.value != 'All' && event.target.value) {
        const selectedUser = findUsersName(event.target.value);
        console.log('Select user ID', event.target.value, selectedUser.name);

        // Get Data
        fetchTodosByUser(event.target.value).then(pulledTodos => {
            console.log('Pulled Todos', pulledTodos);
            displayListTodos(pulledTodos);
        });
    } else if (event.target.value === "All") {
        console.log('Pull All Todos');
        fetchTodosByAll().then(pulledTodos => {
            displayListTodos(pulledTodos);
        });
    } else {
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

        // Create delete button
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', () => handleDelete(todo.id, row));
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tableElement.appendChild(row);
    });
}

// Function to handle delete
async function handleDelete(todoId, row) {
    try {
        await api_DeleteTodo(todoId);
        row.remove();
        console.log(`Todo with ID ${todoId} deleted`);
    } catch (error) {
        console.error(`Error deleting todo with ID ${todoId}:`, error);
    }
}
