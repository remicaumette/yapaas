import Vue from 'vue';
import VueApollo from 'vue-apollo';
import * as Auth from './auth';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';

Vue.use(VueApollo);

export default new VueApollo({
    defaultClient: new ApolloClient({
        link: concat(
            new ApolloLink((operation, forward) => {
                operation.setContext({
                    headers: {
                        Authorization: Auth.getToken(),
                    },
                });
                return forward(operation);
            }),
            new HttpLink({
                uri: 'http://localhost:3000/graphql',
            }),
        ),
        cache: new InMemoryCache(),
        connectToDevTools: true,
    }),
});
