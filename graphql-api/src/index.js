import { apolloUploadExpress } from 'apollo-upload-server';
import { graphqlExpress } from 'apollo-server-express';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import signale from 'signale';
import graphiqlExpress from 'graphql-playground-middleware-express';
import database from './database';
import schema from './schema';
import userModel from './model/user';
import projectModel from './model/project';
import userContext from './context/user';

signale.config({
    displayTimestamp: true,
    displayLabel: true,
    displayBadge: false,
});

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    apolloUploadExpress(),
    graphqlExpress(async req => ({
        schema,
        debug: true,
        context: {
            user: await userContext(req),
        },
    })),
);
app.use('/explorer', graphiqlExpress({ endpoint: '/graphql' }));

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

export default app;
