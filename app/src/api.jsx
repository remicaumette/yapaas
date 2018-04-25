import 'whatwg-fetch';

export default class Api {
    static getEndpoint() {
        return 'http://localhost:3000';
    }

    static login(email, password) {
        return fetch(`${Api.getEndpoint()}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }).then(resp => resp.json());
    }

    static register(email, username, password) {
        return fetch(`${Api.getEndpoint()}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, username, password }),
        }).then(resp => resp.json());
    }

    static getAccount(token) {
        return fetch(`${Api.getEndpoint()}/account`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }).then(resp => resp.json());
    }

    static updateAccount(token, description) {
        return fetch(`${Api.getEndpoint()}/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ description }),
        }).then(resp => resp.json());
    }

    static createProject(token, name, description) {
        return fetch(`${Api.getEndpoint()}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ name, description }),
        }).then(resp => resp.json());
    }

    static listProjects(token) {
        return fetch(`${Api.getEndpoint()}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }).then(resp => resp.json());
    }
}
