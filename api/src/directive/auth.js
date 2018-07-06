const { SchemaDirectiveVisitor } = require('graphql-tools');

module.exports = class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        console.log(field, arguments);
    }
};
