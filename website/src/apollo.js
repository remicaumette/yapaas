import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';

Vue.use(VueApollo);

export default new VueApollo({
    defaultClient: new ApolloClient({
        link: concat(
            new ApolloLink((operation, forward) => {
                operation.setContext({
                    headers: {
                        Authorization: window.app.$store.getters.token,
                    },
                });
                return forward(operation);
            }),
            createUploadLink({
                uri: 'http://localhost:3000/graphql',
            }),
        ),
        cache: new InMemoryCache(),
        connectToDevTools: true,
    }),
    defaultOptions: {
        $query: {
            fetchPolicy: 'network-only',
        },
    },
});
