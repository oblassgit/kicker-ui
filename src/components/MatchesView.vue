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
        <template v-for="(match, matchIndex) in matches" :key="match.id">
          <tr v-for="(score, scoreIndex) in match.scores" :key="score.id">
            <!-- Only show the match index and date in the first row of each match -->
            <td v-if="scoreIndex === 0" :rowspan="match.scores.length">{{ matchIndex + 1 }}</td>
            <td v-if="scoreIndex === 0" :rowspan="match.scores.length">{{ match.date }}</td>
            <td>{{ score.player.name }}</td>
            <td>{{ score.team }}</td>
            <td>{{ score.goalsScored }}</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import {computed, onMounted, ref} from 'vue';

export default {
  setup() {
    const matchStore = useMatchStore();
    const playerStore = usePlayerStore();
    const newMatch = ref({ date: '', scores: [] });

    const matches = computed(() => matchStore.matches);
    const players = computed(() => playerStore.players);

    onMounted(() => {
      matchStore.fetchMatches();
      playerStore.fetchPlayers();
    });

    const addScore = () => {
      const playerCount = newMatch.value.scores.length;

      if (playerCount >= 4) {
        alert("A match can only have 4 players (2 per team).");
        return;
      }

      let assignedTeam = '';

      if (playerCount === 0) {
        assignedTeam = 'TEAM_1';
      } else if (playerCount === 1) {
        assignedTeam = 'TEAM_2';
      } else {
        // Ensure each team has max 2 players
        const team1Count = newMatch.value.scores.filter(s => s.team === 'TEAM_1').length;
        const team2Count = newMatch.value.scores.filter(s => s.team === 'TEAM_2').length;

        if (team1Count < 2) {
          assignedTeam = 'TEAM_1';
        } else if (team2Count < 2) {
          assignedTeam = 'TEAM_2';
        } else {
          alert("Each team can only have 2 players.");
          return;
        }
      }

      newMatch.value.scores.push({
        player: null, // Player will be selected from dropdown
        team: assignedTeam, // Auto-assigned
        goalsScored: 0
      });
    };


    const removeScore = (index) => {
        newMatch.value.scores.splice(index, 1);
    };

    const createMatch = () => {
      if (newMatch.value.scores.length < 2 || newMatch.value.scores.length > 4) {
        alert("A match must have between 2 and 4 players.");
        return;
      }

      const team1Scores = newMatch.value.scores.filter(s => s.team === 'TEAM_1');
      const team2Scores = newMatch.value.scores.filter(s => s.team === 'TEAM_2');

      if (team1Scores.length === 0 || team2Scores.length === 0) {
        alert("Each team must have at least one player.");
        return;
      }

      const team1Goals = team1Scores.reduce((total, s) => total + s.goalsScored, 0);
      const team2Goals = team2Scores.reduce((total, s) => total + s.goalsScored, 0);

      if (team1Goals === team2Goals) {
        alert("The match must have a clear winner. Adjust the goals scored.");
        return;
      }

      for (const score of newMatch.value.scores) {
        if (!score.player) {
          alert("Each score entry must have a player selected.");
          return;
        }
      }

      if (!newMatch.value.date) {
        alert("Please select a match date.");
        return;
      }

      // Match object to send
      const matchToSend = {
        date: newMatch.value.date,
        scores: newMatch.value.scores.map((score) => ({
          player: score.player,
          team: score.team,
          goalsScored: score.goalsScored,
          match: null, // Backend should handle match association
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
      matches: matches,
      players: players,
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