const { SchemaDirectiveVisitor } = require('graphql-tools');
const { GraphQLError } = require('graphql');
const Jwt = require('jsonwebtoken');
const BCrypt = require('bcrypt-nodejs');

module.exports = class Auth extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { args: { admin } } = this;
        const { resolve: defaultResolve } = field;

        field.resolve = function resolve(root, args, context, info) {
            if (!context.user) {
                throw new GraphQLError('User not authenticated.');
            }

            if (admin && !context.user.admin) {
                throw new GraphQLError('You are not allowed to do this action.');
            }

            return defaultResolve(root, args, context, info);
        };
    }

    static getTokenContent(token) {
        return new Promise((resolve, reject) => {
            Jwt.verify(token, process.env.SECRET || 'wowthisismysecret', (error, data) => {
                if (error) {
                    if (error.constructor.name === 'JsonWebTokenError') {
                        resolve(null);
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(data);
                }
            });
        });
    }

    static comparePassword(password1, password2) {
        return new Promise((resolve, reject) => {
            BCrypt.compare(password1, password2, (error, ok) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(ok);
                }
            });
        });
    }

    static createToken(id) {
        return new Promise((resolve, reject) => {
            Jwt.sign({ user: id, created_at: Date.now() }, process.env.SECRET || 'wowthisismysecret', (error, ok) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(ok);
                }
            });
        });
    }
};
