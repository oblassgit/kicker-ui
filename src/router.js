import {createRouter, createWebHashHistory} from 'vue-router';
import HomeView from './components/HomeView.vue';
import PlayersView from './components/PlayersView.vue';
import MatchesView from './components/MatchesView.vue';
import PlayerDetail from "@/components/PlayerDetail.vue";
import MatchDetail from "@/components/MatchDetail.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/players', component: PlayersView, name: 'players' },
    { path: '/players/:id', component: PlayerDetail, props: true, name: 'playerDetails' },
    { path: '/matches', component: MatchesView },
    { path: '/matches/:id', component: MatchDetail, props: true },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;