const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');
const usersController = require('./controller/usersController');
const authController = require('./controller/authController');
const authMiddleware = require('./middleware/authMiddleware');
const accountController = require('./controller/accountController');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(cors());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(bodyParser.json());

app.post('/users', usersController.postUser);
app.post('/auth/login', authController.postLogin);
app.get('/account', authMiddleware, accountController.getAccount);
app.delete('/account', authMiddleware, accountController.deleteAccount);

Promise.all([database.authenticate(), require('./model/user').sync()])
    .then(() => {
        if (process.env.NODE_ENV !== 'test') {
            app.listen(app.get('port'), () => {
                console.log('   Spring Camp Platform API started!');
                if (process.env.NODE_ENV !== 'production') {
                    console.log('   /!\\ If you are in production please set NODE_ENV to production');
                }
                console.log();
            });
        }
    })
    .catch((error) => {
        console.error('Unable to connect to the database!');
        console.error(error);
        process.exit(1);
    });

module.exports = app;
