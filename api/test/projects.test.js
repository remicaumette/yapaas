const request = require('supertest');
const app = require('../src/app');
const { assert } = require('chai');

describe('NAMESPACE /projects', () => {
    let token;

    before(() => request(app)
        .post('/users')
        .set('Content-Type', 'application/json')
        .send({ email: 'test6@test.fr', username: 'Test6', password: 'testtest' })
        .expect(201, {})
        .then(() => request(app)
            .post('/auth/login')
            .send({ email: 'test6@test.fr', password: 'testtest' })
            .expect(200)
            .then((res) => {
                token = res.body.token;
            })));

    describe('POST /projects', () => {
        it('should create a project', () => request(app)
            .post('/projects')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ name: 'Awesome', description: 'This is my awesome project!' })
            .expect(201, {}));

        it('should return an error', () => request(app)
            .post('/projects')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ name: 'z', description: 'This is my awesome project!' })
            .expect(403));

        it('should return already used error', () => request(app)
            .post('/projects')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ name: 'Awesome', description: 'This is my awesome project!' })
            .expect(403, { error: 'This project name is already used.' }));
    });

    describe('GET /projects', () => {
        it('should list projects', () => request(app)
            .get('/projects')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200)
            .then((res) => {
                assert.isNotNull(res.body[0]);
                assert.hasAllKeys(res.body[0], ['id', 'name', 'description', 'updated_at', 'created_at']);
            }));
    });
});
