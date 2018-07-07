import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Application from './core/application.vue';
import router from './core/router';
import store from './core/store';
import apollo from './core/apollo';

Vue.use(Vuetify);

window.vue = new Vue({
    el: '#root',
    router,
    store,
    provide: apollo.provide(),
    render: h => h(Application),
});
