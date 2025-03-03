<template>
  <div class="container mt-4">
    <h1 class="mb-3 text-center">Players Table</h1>
    <button class="btn btn-primary mb-3" @click="fetchPlayers">Load Players</button>

    <div class="table-responsive">
      <table class="table table-striped table-bordered text-center">
        <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Points</th>
          <th>Wins</th>
          <th>Losses</th>
          <th>Goals Scored</th>
          <th>Goals Conceded</th>
          <th>Total Games</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(player, index) in sortedPlayers"
            :key="player.id"
            class="player-row"
            @click="router.push({ name: 'playerDetails', params: {id: player.id}})">
          <td>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td>{{ player.points }}</td>
          <td>{{ player.wins }}</td>
          <td>{{ player.losses }}</td>
          <td>{{ player.goalsScored }}</td>
          <td>{{ player.goalsConceded }}</td>
          <td>{{ player.totalGames }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <h4>Add New Player</h4>
      <div class="row">
        <div class="col-md-6 mb-2">
          <input class="form-control" v-model="newPlayer.name" placeholder="Enter player name" @keyup.enter="addNewPlayer"/>
        </div>
        <div class="col-md-6 mb-2">
          <button class="btn btn-success" @click="addNewPlayer">
            Add Player <span class="enter-key-symbol">⏎</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePlayerStore } from '../stores/playerStore.js';
import {onMounted, computed, ref, onUnmounted} from 'vue';
import { storeToRefs } from 'pinia';
import {useRouter} from "vue-router";

export default {

  setup() {
    const router = useRouter();
    const store = usePlayerStore();
    const newPlayer = ref({ name: '' });

    const REFRESH_INTERVAL = 30000; // 30 seconds
    let refreshInterval;

    const startPolling = () => {
      // Initial fetch if store is empty
      if (!store.players.length) {
        store.fetchPlayers()
      }

      // Setup periodic refresh
      refreshInterval = setInterval(() => {
        store.fetchPlayers();
      }, REFRESH_INTERVAL);
    };

    onMounted(() => {
      store.fetchPlayers();
      startPolling()
    });

    onUnmounted(() => {
      clearInterval(refreshInterval);
    });

    const { players } = storeToRefs(store);

    const sortedPlayers = computed(() => {
      return [...store.players].sort((a, b) => b.points - a.points);
    });

    const addNewPlayer = () => {
      store.addPlayer(newPlayer.value);
      newPlayer.value.name = '';
    };

    return {
      players,
      sortedPlayers,
      fetchPlayers: store.fetchPlayers,
      newPlayer,
      addNewPlayer,
      router
    };
  }
};
</script>

<style scoped>
.enter-key-symbol {
  font-size: 0.8em;
  opacity: 0.7;
  margin-left: 4px;
}
.player-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.player-row:hover {
  background-color: #e9ecef !important;
}

/* Prevent double click selection */
.player-row td {
  user-select: none;
}
</style>