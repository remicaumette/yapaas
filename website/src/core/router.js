import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Auth from './auth';
import Home from '../component/home.vue';
import NewProject from '../component/project/new.vue';
import ViewProject from '../component/project/view.vue';
import EditProject from '../component/project/edit.vue';
import Login from '../component/login.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        { name: 'home', path: '/home', component: Home },
        { name: 'new_project', path: '/project/new', component: NewProject },
        { name: 'view_project', path: '/project/:name', component: ViewProject },
        { name: 'edit_project', path: '/project/:name/edit', component: EditProject },
        { name: 'login', path: '/login', component: Login },
    ],
});

router.beforeEach((to, from, next) => {
    if (Auth.isLogged()) {
        if (to.name === 'login' || !to.name) {
            next({ name: 'home' });
        } else {
            next();
        }
    } else {
        if (to.name === 'login') {
            next();
        } else {
            next({ name: 'login' });
        }
    }
});

export default router;
