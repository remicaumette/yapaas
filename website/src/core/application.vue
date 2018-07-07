<template>
    <v-app>
        <v-toolbar color="blue darken-3" dark>
            <v-toolbar-title style="width: 300px" class="ml-0">
                <span class="hidden-sm-and-down">Coding Club Platform</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-items v-if="isLogged">
                <v-btn flat to="home">Home</v-btn>
                <v-btn flat to="create">Create</v-btn>
                <v-btn flat @click="logout">Logout</v-btn>
            </v-toolbar-items>
            <v-toolbar-items v-else>
                <v-btn flat to="login">Login</v-btn>
                <v-btn flat to="register">Register</v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <router-view></router-view>
    </v-app>
</template>

<script>
export default {
    computed: {
        isLogged() {
            return !!this.$store.getters.token;
        },
    },
    methods: {
        logout() {
            this.$store.commit('removeToken');
            this.$router.push('login');
        },
    },
}
</script>
