<!-- components/MatchDetailView.vue -->
<template>
  <div v-if="match" class="match-detail border p-4 mt-3">
    <h2 class="text-center mb-3">Match Details</h2>

    <p><strong>Date:</strong> {{ formatDate(match.date) }}</p>
    <p><strong>Score:</strong> {{ match.team1Goals }} - {{ match.team2Goals }}</p>

    <div class="players d-flex justify-content-between">
      <div class="team text-center">
        <h4>Team 1</h4>
        <ul class="list-unstyled">
          <li v-for="score in match.team1Scores" :key="score.player.id">
            {{ score.player.name }} ({{ score.goalsScored }} goals)
          </li>
        </ul>
      </div>
      <div class="team text-center">
        <h4>Team 2</h4>
        <ul class="list-unstyled">
          <li v-for="score in match.team2Scores" :key="score.player.id">
            {{ score.player.name }} ({{ score.goalsScored }} goals)
          </li>
        </ul>
      </div>
    </div>

    <div class="buttons text-center mt-3">
      <button class="btn btn-danger me-2" @click="deleteMatch">Delete Match</button>
      <button class="btn btn-warning" @click="updateMatch">Update Match</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: Object
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    deleteMatch() {
      this.$emit("delete", this.match.id);
    },
    updateMatch() {
      alert("Update functionality to be implemented");
    }
  }
};
</script>

<style scoped>
.match-detail {
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
}

.team {
  flex: 1;
  padding: 1rem;
}

.buttons {
  margin-top: 1rem;
}
</style>
