const request = require('supertest');
const app = require('../src/app');
const { assert } = require('chai');

describe('Account', () => {
    let token;

    before(() => request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({ email: 'test5@test.fr', username: 'Test5', password: 'testtest' })
        .expect(201, {})
        .then(() => request(app)
            .post('/auth/login')
            .send({ email: 'test5@test.fr', password: 'testtest' })
            .expect(200)
            .then((res) => {
                token = res.body.token;
            })));

    describe('GET /account', () => {
        it('should return a token', () => request(app)
            .get('/account')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200)
            .expect((res) => {
                assert.hasAllKeys(res.body, ['id', 'email', 'username', 'description', 'created_at']);
            }));

        it('should return not found', () => request(app)
            .get('/account')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'token')
            .expect(404, {}));
    });

    describe('PUT /account', () => {
        it('should update the account', () => request(app)
            .put('/account')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ description: 'This is my description! Awesome.' })
            .expect(200, {}));
    });

    describe('DELETE /account', () => {
        it('should delete the account', () => request(app)
            .delete('/account')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200, {}));
    });
});
