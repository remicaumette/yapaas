<template>
    <v-layout align-start justify-center row fill-height>
        <v-flex sm12 md8 v-if="project">
            <h1>{{project.name}}</h1>

            <v-card>
                <p>
                    hello
                    {{project.description}}
                </p>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';

export default {
    apollo: {
        project: {
            query: gql`
                query($name: String!) {
                    projectByName(name: $name) {
                        name
                        description
                        port
                        runtime
                        owner {
                            id
                            username
                            admin
                        }
                    }
                }
            `,
            variables() {
                return {
                    name: this.$route.params.name,
                };
            },
            update({ projectByName }) {
                return projectByName;
            },
        },
    },
}
</script>
