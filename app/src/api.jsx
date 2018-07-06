import 'whatwg-fetch';

export default class Api {
    static getIp() {
        return 'localhost';
    }

    static getEndpoint() {
        return `http://${Api.getIp()}:3000`;
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

    static createProject(token, name, runtime, description) {
        return fetch(`${Api.getEndpoint()}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ name, runtime, description }),
        }).then(resp => resp.json());
    }

    static getProject(token, name) {
        return fetch(`${Api.getEndpoint()}/projects/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
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

    static uploadProject(token, project, file) {
        const data = new FormData();
        data.append('file', file);

        return fetch(`${Api.getEndpoint()}/projects/${project}/upload`, {
            method: 'POST',
            headers: {
                Authorization: token,
            },
            body: data,
        }).then(resp => resp.json());
    }

    static updateProject(token, project, description) {
        return fetch(`${Api.getEndpoint()}/projects/${project}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ description }),
        }).then(resp => resp.json());
    }

    static deleteProject(token, project) {
        return fetch(`${Api.getEndpoint()}/projects/${project}`, {
            method: 'DELETE',
            headers: {
                Authorization: token,
            },
        }).then(resp => resp.json());
    }

    static getRuntimes(token) {
        return fetch(`${Api.getEndpoint()}/runtimes`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }).then(resp => resp.json());
    }
}
