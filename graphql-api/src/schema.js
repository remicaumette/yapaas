import { makeExecutableSchema } from 'graphql-tools';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as resolvers from './resolvers';
import * as schemaDirectives from './directives';

const SCHEMA_DIR = join(__dirname, '..', 'schema');

export default makeExecutableSchema({
    typeDefs: readdirSync(SCHEMA_DIR)
        .map(file => readFileSync(join(SCHEMA_DIR, file), 'utf8')),
    resolvers,
    schemaDirectives,
});
