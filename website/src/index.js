import 'babel-polyfill';
import Vue from 'vue';
import Vuetify from 'vuetify';
import VueMoment from 'vue-moment';
import Application from './component/application.vue';
import store from './core/store';
import router from './router';
import apollo from './apollo';

Vue.use(Vuetify);
Vue.use(VueMoment);

const vue = new Vue({
    store,
    router,
    provide: apollo.provide(),
    render: h => h(Application),
});

window.app = vue;

window.addEventListener('load', () => {
    vue.$mount('#root');
});
