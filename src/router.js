import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './components/HomeView.vue';
import PlayersView from './components/PlayersView.vue';
import MatchesView from './components/MatchesView.vue';

const routes = [
    { path: '/', component: HomeView },
    { path: '/players', component: PlayersView },
    { path: '/matches', component: MatchesView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;