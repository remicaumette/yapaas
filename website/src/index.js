import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import Application from './component/application.vue';
import router from './core/router';
import apollo from './core/apollo';

Vue.use(Vuetify);

const vue = new Vue({
    router,
    provide: apollo.provide(),
    render: h => h(Application),
});

window.addEventListener('load', () => {
    vue.$mount('#root');
});
