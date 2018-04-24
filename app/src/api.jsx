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
}
