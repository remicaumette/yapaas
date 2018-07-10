<template>
    <v-app dark>
        <v-toolbar color="blue accent-3" dark>
            <v-toolbar-title style="width: 300px" class="ml-0">
                <span class="hidden-sm-and-down" @click="home">Coding Club Platform</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <div v-if="isLogged">
                <v-btn icon to="create">
                    <v-icon>add</v-icon>
                </v-btn>
                <v-btn icon @click="logout">
                    <v-icon>exit_to_app</v-icon>
                </v-btn>
            </div>
        </v-toolbar>

        <router-view></router-view>
    </v-app>
</template>

<script>
import * as Auth from '../core/auth';

export default {
    computed: {
        isLogged() {
            return Auth.isLogged();
        },
    },
    methods: {
        logout() {
            Auth.removeToken();
            this.$router.push({ name: 'login' });
        },
        home() {
            if (this.isLogged) {
                this.$router.push({ name: 'home' });
            } else {
                this.$router.push({ name: 'login' });
            }
        },
    },
}
</script>
