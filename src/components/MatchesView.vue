// views/MatchesView.vue (Football Matches UI)
<template>
  <div class="container mt-4">
    <h1 class="mb-3 text-center">Matches</h1>
    <button class="btn btn-primary mb-3" @click="fetchMatches">Load Matches</button>

    <div class="mb-4 p-3 border rounded bg-light">
      <h3>Create New Match</h3>
      <input type="date" class="form-control mb-2" v-model="newMatch.date" />
      <div v-for="(score, index) in newMatch.scores" :key="index" class="d-flex gap-2 mb-2">
        <select class="form-control" v-model="score.player">
          <option v-for="player in players" :key="player.id" :value="player">{{ player.name }}</option>
        </select>
        <select class="form-control" v-model="score.team">
          <option value="TEAM_1">TEAM 1</option>
          <option value="TEAM_2">TEAM 2</option>
        </select>
        <input type="number" class="form-control" v-model="score.goalsScored" placeholder="Goals" min="0" max="10"/>
        <button class="btn btn-danger" @click="removeScore(index)">X</button>
      </div>
      <button class="btn btn-secondary me-2" @click="addScore">+ Add Player</button>
      <button class="btn btn-success" @click="createMatch">Create Match</button>
    </div>

    <div class="table-responsive">
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
        <tr v-for="(match, matchIndex) in matches" :key="match.id">
          <td :rowspan="match.scores.length">{{ matchIndex + 1 }}</td>
          <td :rowspan="match.scores.length">{{ match.date }}</td>
          <template v-for="(score, scoreIndex) in match.scores" :key="score.id">
            <tr v-if="scoreIndex > 0"></tr>
            <td>{{ score.player.name }}</td>
            <td>{{ score.team }}</td>
            <td>{{ score.goalsScored }}</td>
          </template>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const matchStore = useMatchStore();
    const playerStore = usePlayerStore();
    const newMatch = ref({ date: '', scores: [] });

    onMounted(() => {
      matchStore.fetchMatches();
      playerStore.fetchPlayers();
    });

    const addScore = () => {
      if (newMatch.value.scores.length < 4) {
        newMatch.value.scores.push({ player: null, team: 'TEAM_1', goalsScored: 0 });
      }
    };


    const removeScore = (index) => {
        newMatch.value.scores.splice(index, 1);
    };

    const createMatch = () => {
      if (newMatch.value.scores.length < 2 || newMatch.value.scores.length > 4) {
        alert("A match must have between 2 and 4 players.");
        return;
      }

      for (const score of newMatch.value.scores) {
        if (!score.player) {
          alert("Each score entry must have a player selected.");
          return;
        }
        if (!score.team) {
          alert("Each score entry must have a team selected.");
          return;
        }
      }

      if (!newMatch.value.date) {
        alert("Please select a match date.");
        return;
      }

      // Attach the match reference to each score
      const matchToSend = {
        date: newMatch.value.date,
        scores: newMatch.value.scores.map((score) => ({
          player: score.player,
          team: score.team,
          goalsScored: score.goalsScored,
          match: null, // Backend should set this automatically
        })),
      };

      try {
        console.log(JSON.stringify(matchToSend, null, 2)); // Debugging
        matchStore.createMatch(matchToSend);
        newMatch.value.date = '';
        newMatch.value.scores = [];
      } catch (e) {
        alert("Error creating match.");
      }
    };

    return {
      matches: matchStore.matches,
      players: playerStore.players,
      fetchMatches: matchStore.fetchMatches,
      fetchPlayers: playerStore.fetchPlayers,
      newMatch,
      addScore,
      removeScore,
      createMatch
    };
  }
};
</script>