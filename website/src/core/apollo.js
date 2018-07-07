import Vue from 'vue';
import VueApollo from 'vue-apollo';
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
                        Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjczNzVmZmItNmFiZi00NGUxLWIwOWUtN2IzN2MzODJhY2VhIiwiY3JlYXRlZF9hdCI6MTUzMDk2OTMxMTg5NCwiaWF0IjoxNTMwOTY5MzExfQ.YPHXV3WZdnMguf1CLsOk6a2fUYsKA2iitK3F3elB63E",
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
