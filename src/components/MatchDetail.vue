<template>
  <div v-if="match" class="match-detail border p-4 mt-3">
    <h2 class="text-center mb-3">Match Details</h2>

    <div v-if="!isEditing">
      <p><strong>Date:</strong> {{ formatDate(match.date) }}</p>
      <p><strong>Score:</strong> {{ team1Goals }} - {{ team2Goals }}</p>

      <div class="players d-flex justify-content-between">
        <div class="team text-center">
          <h4>Team 1</h4>
          <ul class="list-unstyled">
            <li v-for="score in team1Scores" :key="score.id">
              {{ score.player.name }} ({{ score.goalsScored }} goals)
            </li>
          </ul>
        </div>
        <div class="team text-center">
          <h4>Team 2</h4>
          <ul class="list-unstyled">
            <li v-for="score in team2Scores" :key="score.id">
              {{ score.player.name }} ({{ score.goalsScored }} goals)
            </li>
          </ul>
        </div>
      </div>

      <div class="buttons text-center mt-3">
        <button class="btn btn-danger me-2" @click="deleteMatch">Delete Match</button>
        <button class="btn btn-warning" @click="isEditing = true">Edit Match</button>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else class="edit-form">
      <label for="matchDate">Match Date:</label>
      <input type="date" v-model="editableMatch.date" class="form-control mb-3" />

      <div v-if="isEditing && editableMatch.scores">
        <div class="d-flex justify-content-between">
          <div class="team-edit">
            <h4>Team 1 Scores</h4>
            <div v-for="(score, index) in team1Scores" :key="score.id" class="mb-2">
              <label>{{ score.player.name }}:</label>
              <input
                  type="number"
                  v-model.number="editableMatch.scores.find(s => s.id === score.id).goalsScored"
                  min="0"
                  class="form-control"
              />
            </div>
          </div>

          <div class="team-edit">
            <h4>Team 2 Scores</h4>
            <div v-for="(score, index) in team2Scores" :key="score.id" class="mb-2">
              <label>{{ score.player.name }}:</label>
              <input
                  type="number"
                  v-model.number="editableMatch.scores.find(s => s.id === score.id).goalsScored"
                  min="0"
                  class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="buttons text-center mt-3">
        <button class="btn btn-success me-2" @click="updateMatch">Save Changes</button>
        <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useMatchStore } from '@/stores/matchStore';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const matchStore = useMatchStore();
    const route = useRoute();
    const match = ref(null);
    const isEditing = ref(false);
    const editableMatch = ref({});

    // Fetch match by ID
    onMounted(async () => {
      const matchId = route.params.id;
      const response = await matchStore.fetchMatchById(matchId);
      match.value = response.data;
      editableMatch.value = JSON.parse(JSON.stringify(response.data)); // Deep copy after loading
    });

    // Computed properties for scores
    const team1Scores = computed(() => match.value?.scores.filter(score => score.team === 'TEAM_1') || []);
    const team2Scores = computed(() => match.value?.scores.filter(score => score.team === 'TEAM_2') || []);
    const team1Goals = computed(() => team1Scores.value.reduce((acc, score) => acc + score.goalsScored, 0));
    const team2Goals = computed(() => team2Scores.value.reduce((acc, score) => acc + score.goalsScored, 0));

    // Format date for display
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Edit actions
    const cancelEdit = () => {
      isEditing.value = false;
      editableMatch.value = JSON.parse(JSON.stringify(match.value)); // Deep copy
    };

    const updateMatch = async () => {
      try {
        console.log(match.value);
        await matchStore.updateMatch(match.value.id, editableMatch.value);
        match.value = JSON.parse(JSON.stringify(editableMatch.value)); // Reflect changes
        isEditing.value = false;
      } catch (error) {
        console.error('Failed to update match:', error);
      }
    };

    const deleteMatch = async () => {
      await matchStore.deleteMatch(match.value.id);
    };

    return {
      match,
      isEditing,
      editableMatch,
      team1Scores,
      team2Scores,
      team1Goals,
      team2Goals,
      formatDate,
      cancelEdit,
      updateMatch,
      deleteMatch,
    };
  },
};
</script>

<style scoped>
.match-detail {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
}

.team, .team-edit {
  flex: 1;
  padding: 1rem;
}

.buttons {
  margin-top: 1rem;
}
</style>
