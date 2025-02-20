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
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(player, index) in sortedPlayers" :key="player.id">
          <td>{{ index + 1 }}</td>
          <td>
            <router-link :to="`/players/${player.id}`" class="text-decoration-none">
              {{ player.name }}
            </router-link>
          </td>
          <td>{{ player.points }}</td>
          <td>{{ player.wins }}</td>
          <td>{{ player.losses }}</td>
          <td>{{ player.goalsScored }}</td>
          <td>{{ player.goalsConceded }}</td>
          <td>{{ player.totalGames }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deletePlayer(player)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <h4>Add New Player</h4>
      <div class="row">
        <div class="col-md-6 mb-2">
          <input class="form-control" v-model="newPlayer.name" placeholder="Enter player name" />
        </div>
        <div class="col-md-6 mb-2">
          <button class="btn btn-success" @click="addNewPlayer">Add Player</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePlayerStore } from '../stores/playerStore.js';
import { onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const store = usePlayerStore();
    const newPlayer = ref({ name: '' });

    onMounted(() => {
      store.fetchPlayers();
    });

    const { players } = storeToRefs(store);

    const sortedPlayers = computed(() => {
      return [...store.players].sort((a, b) => b.points - a.points);
    });

    const deletePlayer = (player) => {
      store.deletePlayer(player.id);
    };

    const addNewPlayer = () => {
      store.addPlayer(newPlayer.value);
      newPlayer.value.name = '';
    };

    return {
      players,
      sortedPlayers,
      fetchPlayers: store.fetchPlayers,
      deletePlayer,
      newPlayer,
      addNewPlayer,
    };
  }
};
</script>
