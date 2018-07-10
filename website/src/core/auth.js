let token = localStorage.getItem('token');


export function getToken() {
    return token;
}

export function isLogged() {
    return !!getToken();
}

export function updateToken(newToken) {
    token = newToken;
    localStorage.setItem('token', token);
}

export function removeToken() {
    token = undefined;
    localStorage.removeItem('token');
}
