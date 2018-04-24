import 'whatwg-fetch';

export const API_URL = 'http://localhost:3000';

export function postLogin(email, password) {
    return fetch(`${API_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) })
        .then(resp => resp.json());
}
