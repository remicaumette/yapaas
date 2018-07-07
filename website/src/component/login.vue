<template>
    <v-layout row wrap>
        <v-flex xs4 offset-xs4>
            <h1>Login</h1>

            <v-alert :value="error" type="error">
                {{error}}
            </v-alert>

            <v-form v-model="valid">
                <v-text-field v-model="email" type="email" label="Email" required></v-text-field>
                <v-text-field v-model="password" type="password" label="Password" required></v-text-field>
                <v-btn @click="submit">Login</v-btn>
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';

export default {
    data() {
        return {
            email: '',
            password: '',
            error: '',
        };
    },
    methods: {
        async submit() {
            try {
                const { data: { createToken: token } } = await this.$apollo.mutate({
                    mutation: gql`
                        mutation ($email: String!, $password: String!) {
                            createToken(email: $email, password: $password)
                        }
                    `,
                    variables: {
                        email: this.email,
                        password: this.password,
                    },
                });

                this.$store.commit('setToken', token);
                this.$router.push('home');
            } catch (error) {
                this.error = error.graphQLErrors[0].message;
            }
        },
    },
}
</script>
