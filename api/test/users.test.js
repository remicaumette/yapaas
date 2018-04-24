const request = require('supertest');
const app = require('../src/app');

describe('NAMESPACE /users', () => {
    describe('POST /users', () => {
        it('should create the user', () =>
            request(app)
                .post('/users')
                .send({ email: 'test1@test.fr', username: 'Test1', password: 'testtest' })
                .expect(201, {}));

        it('should return already used error', () => request(app)
            .post('/users')
            .send({ email: 'test2@test.fr', username: 'Test2', password: 'testtest' })
            .expect(201, {})
            .then(() => request(app)
                .post('/users')
                .send({ email: 'test2@test.fr', username: 'Test2', password: 'testtest' })
                .expect(403, { error: 'This email or username is already used.' })));
    });
});
