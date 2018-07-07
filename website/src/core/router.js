import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../component/login.vue';
import Home from '../component/home.vue';

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        { name: 'login', path: '/login', component: Login },
        { name: 'home', path: '/home', component: Home },
    ],
});
