const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const signale = require('signale');
const database = require('./database');
const user = require('./model/user');
const project = require('./model/project');
const usersController = require('./controller/usersController');
const authController = require('./controller/authController');
const authMiddleware = require('./middleware/authMiddleware');
const accountController = require('./controller/accountController');
const projectsController = require('./controller/projectsController');

signale.config({
    displayTimestamp: true,
    displayLabel: true,
    displayBadge: false,
});

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());

app.post('/users', usersController.postUsers);
app.post('/auth/login', authController.postLogin);
app.get('/users', authMiddleware, usersController.getUsers);
app.get('/users/:name', authMiddleware, usersController.getUserByNameOrId);
app.get('/users/:name/projects', authMiddleware, usersController.getUserProjectsByNameOrId);
app.get('/account', authMiddleware, accountController.getAccount);
app.put('/account', authMiddleware, accountController.putAccount);
app.delete('/account', authMiddleware, accountController.deleteAccount);
app.get('/account/projects', authMiddleware, accountController.getAccountProjects);
app.post('/projects', authMiddleware, projectsController.postProjects);
app.get('/projects', authMiddleware, projectsController.getProjects);
app.get('/projects/:name', authMiddleware, projectsController.getProjectByNameOrId);
app.put('/projects/:name', authMiddleware, projectsController.putProjectByNameOrId);
app.delete('/projects/:name', authMiddleware, projectsController.deleteProjectByNameOrId);
app.post('/projects/:name/upload', authMiddleware, projectsController.uploadProjectByNameOrId);

user.hasMany(project, { as: 'Projects' });
Promise.all([database.authenticate(), user.sync(), project.sync()])
    .then(() => {
        if (process.env.NODE_ENV !== 'test') {
            app.listen(app.get('port'), () => {
                signale.info('Spring Camp Platform API started!');
                if (process.env.NODE_ENV !== 'production') {
                    signale.warn('If you are in production please set NODE_ENV to production');
                }
            });
        }
    })
    .catch((error) => {
        signale.fatal('Unable to connect to the database!');
        signale.fatal(error);
        process.exit(1);
    });

module.exports = app;
