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
      <MatchList :matches="playerMatches" />
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
import MatchList from "@/components/MatchList.vue";

export default {
  components: { MatchList },
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
      console.log(playerMatches.value); // Ensure this logs the expected data
    });

    const updatePlayer = async () => {
      await store.updatePlayer(player.value);
      alert('Player updated successfully');
    };

    const deletePlayer = async () => {
      if (confirm(`Are you sure you want to delete ${player.value.name}?`)) {
        await store.deletePlayer(player.value.id);
        await router.replace({name: 'players'});
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