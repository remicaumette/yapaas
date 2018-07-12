<template>
    <v-layout align-start justify-center row fill-height>
        <v-flex xs12 sm6 md4>
            <v-card class="form">
                <v-card-title>
                    <span class="headline">Edit: {{name}}</span>
                </v-card-title>

                <v-alert color="red darken-2" :value="error" type="error">
                    {{error}}
                </v-alert>

                <v-form @submit="submit">
                    <v-text-field color="blue accent-3" v-model="name" type="text" label="Name" required disabled></v-text-field>
                    <v-select color="blue accent-3" v-model="runtime" :items="runtimes"
                        item-text="name" item-value="value" label="Runtime" required disabled></v-select>
                    <v-textarea color="blue accent-3" v-model="description" label="Description"></v-textarea>
                    <v-btn type="submit" color="blue accent-3">Save</v-btn>
                    <v-btn flat @click="$router.go(-1)">Cancel</v-btn>
                </v-form>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';

export default {
    data() {
        return {
            runtimes: [
                { name: 'Static', value: 'STATIC' },
                { name: 'Node.js', value: 'NODEJS' },
                { name: 'PHP', value: 'PHP' },
            ],
            error: '',
            id: '',
            name: '',
            runtime: '',
            description: '',
        };
    },
    methods: {
        async submit(event) {
            event.preventDefault();

            try {
                const { data: { updateProject: { name } } } = await this.$apollo.mutate({
                    mutation: gql`
                        mutation ($id: ID!, $description: String) {
                            updateProject(id: $id, description: $description) {
                                name
                            }
                        }
                    `,
                    variables: {
                        id: this.id,
                        description: this.description,
                    },
                });

                this.$router.push({ name: 'view_project', params: { name } });
            } catch (error) {
                this.error = error.graphQLErrors[0].message;
            }
        },
    },
    apollo: {
        project: {
            query: gql`
                query($name: String!) {
                    projectByName(name: $name) {
                        id
                        name
                        runtime
                        description
                    }
                }
            `,
            variables() {
                return {
                    name: this.$route.params.name,
                };
            },
            update({ projectByName: project }) {
                this.id = project.id;
                this.name = project.name;
                this.runtime = project.runtime;
                this.description = project.description;
            },
        },
    },
}
</script>
