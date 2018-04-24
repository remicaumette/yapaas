const request = require('supertest');
const app = require('../src/app');
const { assert } = require('chai');

describe('Users', () => {
    describe('POST /users', () => {
        it('should create the user', () =>
            request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send({ email: 'test1@test.fr', username: 'Test1', password: 'testtest' })
                .expect(201, {}));

        it('should return already used error', () => request(app)
            .post('/users')
            .set('Content-Type', 'application/json')
            .send({ email: 'test2@test.fr', username: 'Test2', password: 'testtest' })
            .expect(201, {})
            .then(() => request(app)
                .post('/users')
                .set('Content-Type', 'application/json')
                .send({ email: 'test2@test.fr', username: 'Test2', password: 'testtest' })
                .expect(403, { error: 'This email or username is already used.' })));
    });

    describe('GET /users', () => {
        let token;

        before(() => request(app)
            .post('/auth/login')
            .send({ email: 'test1@test.fr', password: 'testtest' })
            .expect(200)
            .then((res) => {
                token = res.body.token;
            }));

        it('should return all users', () =>
            request(app)
                .get('/users')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .expect(200)
                .then((res) => {
                    assert.isNotNull(res.body[0]);
                    assert.hasAllKeys(res.body[0], ['id', 'email', 'username', 'description', 'created_at']);
                }));
    });

    describe('GET /users', () => {
        let token;

        before(() => request(app)
            .post('/auth/login')
            .send({ email: 'test1@test.fr', password: 'testtest' })
            .expect(200)
            .then((res) => {
                token = res.body.token;
            }));

        it('should return the "Test1" user', () =>
            request(app)
                .get('/users/test1')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .expect(200)
                .then((res) => {
                    assert.isNotNull(res.body);
                    assert.hasAllKeys(res.body, ['id', 'email', 'username', 'description', 'created_at']);
                }));

        it('should return not found', () =>
            request(app)
                .get('/users/test')
                .set('Content-Type', 'application/json')
                .set('Authorization', token)
                .expect(404, {}));
    });
});
