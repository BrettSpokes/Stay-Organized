"use strict";

const baseURL = 'http://localhost:8083/api/';

export async function api_PullUsers() {
    try {
        const response = await fetch(baseURL+'users');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

export async function api_PullTodos(id = 0) {
    if (id) {

        try {
            const response = await fetch(baseURL+`todos/byuser/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
        }

    } else if (id == 0) {

        try {
            const response = await fetch(baseURL+'todos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
}
