const express = require('express');
const cors = require('cors');
const signale = require('signale');
const { json } = require('body-parser');
const { graphqlExpress: graphql } = require('apollo-server-express');
const { default: graphiql } = require('graphql-playground-middleware-express');
const schema = require('./schema');
const database = require('./database');
const userModel = require('./model/user');
const projectModel = require('./model/project');
const userContext = require('./context/user');

signale.config({
    displayTimestamp: true,
    displayLabel: true,
    displayBadge: false,
});

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(json());
app.use('/graphql', graphql(async req => ({
    schema,
    debug: false,
    context: {
        user: await userContext(req),
    },
})));
app.use('/explorer', graphiql({ endpoint: '/graphql' }));

userModel.hasMany(projectModel, { as: 'Projects' });

Promise.all([database.authenticate(), userModel.sync(), projectModel.sync()])
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
