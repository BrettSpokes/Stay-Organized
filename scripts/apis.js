"use strict";

const baseURL = 'http://localhost:8083/api/';

export async function api_PullUsers() {
    try {
        const response = await fetch(baseURL + 'users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export async function api_PullCategories() {
    try {
        const response = await fetch(baseURL + 'categories');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

export async function api_PullTodos(id = 0) {
    if (id) {
        try {
            const response = await fetch(baseURL + `todos/byuser/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching todos by user:', error);
        }
    } else if (id == 0) {
        try {
            const response = await fetch(baseURL + 'todos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching all todos:', error);
        }
    }
}

export async function api_PostTodo(todoData) {
    try {
        const response = await fetch(baseURL + 'todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting new todo:', error);
    }
}

export async function api_DeleteTodo(todoId) {
    try {
        const response = await fetch(baseURL + `todos/${todoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error deleting todo with ID ${todoId}:`, error);
    }
}
