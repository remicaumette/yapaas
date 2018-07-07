const { makeExecutableSchema } = require('graphql-tools');
const { readFileSync } = require('fs');
const { join } = require('path');
const { GraphQLDateTime } = require('graphql-iso-date');
const auth = require('./directive/auth');

module.exports = makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, '..', 'schema.graphql'), 'utf8'),
    resolvers: {
        DateTime: GraphQLDateTime,
        Query: require('./resolver/query'),
        Mutation: require('./resolver/mutation'),
        User: require('./resolver/user'),
        Project: require('./resolver/project'),
    },
    schemaDirectives: {
        auth,
    },
});
