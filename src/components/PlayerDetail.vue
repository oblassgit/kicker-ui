<template>
  <div class="container mt-4">
    <h1 class="mb-3">Player Details</h1>

    <div v-if="player">
      <div class="mb-3">
        <label class="form-label">Player Name</label>
        <input class="form-control" v-model="player.name" />
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="updatePlayer">Save Changes</button>
        <button class="btn btn-danger" @click="deletePlayer">Delete Player</button>
        <router-link to="/players" class="btn btn-secondary">Back</router-link>
      </div>

      <hr />

      <h4>Matches Played</h4>
      <div class="table-responsive" v-if="playerMatches.length > 0">
        <table class="table table-striped table-bordered text-center">
          <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Player</th>
            <th>Team</th>
            <th>Goals Scored</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(match, matchIndex) in playerMatches" :key="match.id">
            <tr v-for="(score, scoreIndex) in match.scores" :key="score.id" :class="{ 'highlighted': score.player.id === player.id }">
              <!-- Only show the match index and date in the first row of each match -->
              <td v-if="scoreIndex === 0" :rowspan="match.scores.length" class="no-highlight">{{ matchIndex + 1 }}</td>
              <td v-if="scoreIndex === 0" :rowspan="match.scores.length" class="no-highlight">{{ match.date }}</td>
              <td>{{ score.player.name }}</td>
              <td>{{ score.team }}</td>
              <td>{{ score.goalsScored }}</td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
      <p v-else>No matches found for this player.</p>
    </div>

    <div v-else>
      <p>Loading player details...</p>
    </div>
  </div>
</template>

<style scoped>
.highlighted {
  font-weight: bold;
}
.no-highlight {
  font-weight: normal !important; /* Ensure normal font-weight */
}
</style>

<script>
import { usePlayerStore } from '../stores/playerStore.js';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const store = usePlayerStore();
    const route = useRoute();
    const router = useRouter();
    const player = ref(null);
    const playerMatches = ref([]);

    onMounted(async () => {
      const playerId = route.params.id;
      player.value = await store.fetchPlayer(playerId);
      if (player.value) {
        playerMatches.value = await store.fetchPlayerMatches(playerId);
      }
      console.log(playerMatches.value);
    });

    const updatePlayer = async () => {
      await store.updatePlayer(player.value);
      alert('Player updated successfully');
    };

    const deletePlayer = async () => {
      if (confirm(`Are you sure you want to delete ${player.value.name}?`)) {
        await store.deletePlayer(player.value.id);
        await router.push('/players');
      }
    };

    return {
      player,
      playerMatches,
      updatePlayer,
      deletePlayer
    };
  }
};
</script>