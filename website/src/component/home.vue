<template>
    <v-layout row wrap>
        <v-flex xs8 offset-xs2>
            <h1>Home</h1>
            
            <v-data-table :items="projects" hide-actions>
                <template slot-scope="project">
                    <td>{{ props.project.name }}</td>
                    <td class="text-xs-right">{{ props.item.calories }}</td>
                    <td class="text-xs-right">{{ props.item.fat }}</td>
                    <td class="text-xs-right">{{ props.item.carbs }}</td>
                    <td class="text-xs-right">{{ props.item.protein }}</td>
                    <td class="text-xs-right">{{ props.item.iron }}</td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';

export default {
    apollo: {
        projects: gql`
            query {
                projects {
                    name
                    description
                    port
                    owner {
                    username
                    }
                }
            }
        `,
    },
}
</script>
