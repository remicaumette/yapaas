const request = require('supertest');
const app = require('../src/app');
const { assert } = require('chai');

describe('Projects', () => {
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
                assert.hasAllKeys(res.body[0], ['id', 'name', 'description', 'owner_id', 'updated_at', 'created_at']);
            }));
    });

    describe('GET /projects/:name', () => {
        it('should return the "Awesome" project', () => request(app)
            .get('/projects/awesome')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200)
            .then((res) => {
                assert.hasAllKeys(res.body, ['id', 'name', 'description', 'owner_id', 'updated_at', 'created_at']);
            }));

        it('should return not found', () => request(app)
            .get('/projects/zeezez')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(404, {}));
    });

    describe('PUT /projects/:name', () => {
        it('should update the "Awesome" project', () => request(app)
            .put('/projects/awesome')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ description: 'This is my awesome project! zezezze' })
            .expect(200, {}));

        it('should return not found', () => request(app)
            .put('/projects/awesomee')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({ description: 'This is my awesome project! zezezze' })
            .expect(404, {}));

        it('should return an error', () => request(app)
            .put('/projects/awesome')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(403));
    });

    describe('GET /account/projects', () => {
        it('should return all projects on this account', () => request(app)
            .get('/account/projects')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200)
            .then((res) => {
                assert.isNotNull(res.body[0]);
                assert.hasAllKeys(res.body[0], ['id', 'name', 'description', 'owner_id', 'updated_at', 'created_at']);
            }));
    });

    describe('GET /users/:name/projects', () => {
        it('should return all projects for this user', () => request(app)
            .get('/users/test6/projects')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200)
            .then((res) => {
                assert.isNotNull(res.body[0]);
                assert.hasAllKeys(res.body[0], ['id', 'name', 'description', 'owner_id', 'updated_at', 'created_at']);
            }));
    });

    describe('DELETE /projects/:name', () => {
        it('should return ok', () => request(app)
            .delete('/projects/awesome')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(200, {}));

        it('should return not found', () => request(app)
            .delete('/projects/awesome')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .expect(404, {}));
    });
});
