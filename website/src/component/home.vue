<template>
    <v-layout align-start justify-center row fill-height>
        <v-flex sm12 md8 :v-if="projects">
            <h1>Home</h1>
            
            <v-list two-line>
                <div v-for="(project, index) in projects" :key="index">
                    <v-divider v-if="index !== 0" inset></v-divider>
                    <v-list-tile avatar @click="goTo(project)">
                        <v-list-tile-avatar>
                            <img :src="getRuntimeLogo(project)" />
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                            <v-list-tile-title>{{project.name}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{project.description}}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </div>
            </v-list>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';
import nodejs from '../asset/nodejs.png';
import php from '../asset/php.png';
import static from '../asset/static.png';

export default {
    apollo: {
        projects: gql`
            query {
                projects {
                    name
                    description
                    port
                    runtime
                }
            }
        `,
    },
    methods: {
        getRuntimeLogo(project) {
            switch (project.runtime.toLowerCase()) {
            case 'nodejs':
                return nodejs;
            case 'php':
                return php;
            case 'static':
                return static;
            }
        },
        goTo(project) {
            this.$router.push({ name: 'project', params: { name: project.name } });
        },
    },
}
</script>
