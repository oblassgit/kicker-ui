// views/MatchesView.vue
<template>
  <div class="container mt-4">
    <h1 class="mb-3 text-center">Matches</h1>
    <button class="btn btn-primary mb-3" @click="fetchMatches">Load Matches</button>

    <div class="mb-4 p-3 border rounded bg-light">
      <h3>Create New Match</h3>
      <input type="date" class="form-control mb-2" v-model="newMatch.date"/>
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

    <div v-for="(group, index) in groupedMatches" :key="index" class="mb-4">
      <h3 class="text-left date-divider" v-if="index === 0 || groupedMatches[index - 1].date !== group.date">
        {{ group.date }}
      </h3>
      <div v-for="(match, matchIndex) in group.matches" :key="matchIndex" class="match-container" @click="openMatchDetail(match)">
        <div class="team">
          <div class="player-list">
            <p v-for="score in match.team1Scores" :key="score.player.id">
              {{ score.player.name }} ({{ score.goalsScored }})
            </p>
          </div>
        </div>

        <div class="score">
          <h2>{{ match.team1Goals }} - {{ match.team2Goals }}</h2>
        </div>

        <div class="team">
          <div class="player-list">
            <p v-for="score in match.team2Scores" :key="score.player.id">
              {{ score.player.name }} ({{ score.goalsScored }})
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import {computed, onMounted, ref} from 'vue';
import router from "@/router.js";

export default {
  setup() {
    const matchStore = useMatchStore();
    const playerStore = usePlayerStore();
    const newMatch = ref({ date: '', scores: [] });

    const players = computed(() => playerStore.players)

    const groupedMatches = computed(() => {
      const groups = [];
      const matchesByDate = {};

      matchStore.matches.forEach(match => {
        if (!match || !match.scores || match.scores.length === 0) return; // Ensure valid match data

        if (!matchesByDate[match.date]) {
          matchesByDate[match.date] = [];
        }

        matchesByDate[match.date].push({
          date: match.date,
          team1Scores: match.scores.filter(s => s.team === 'TEAM_1'),
          team2Scores: match.scores.filter(s => s.team === 'TEAM_2'),
          team1Goals: match.scores.filter(s => s.team === 'TEAM_1').reduce((acc, s) => acc + s.goalsScored, 0),
          team2Goals: match.scores.filter(s => s.team === 'TEAM_2').reduce((acc, s) => acc + s.goalsScored, 0),
        });
      });

      // Sort dates in descending order (most recent first)
      const sortedDates = Object.keys(matchesByDate)
          .sort((a, b) => new Date(b) - new Date(a));

      sortedDates.forEach(date => {
        if (matchesByDate[date].length > 0) {
          groups.push({
            date: new Intl.DateTimeFormat('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }).format(new Date(date)),  // Convert to readable format
            matches: matchesByDate[date],
          });
        }
      });

      return groups;
    });



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

    const openMatchDetail = async (match) => {
      await router.push('/matches/' + match.id);
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
      groupedMatches,
      players: players,
      fetchMatches: matchStore.fetchMatches,
      fetchPlayers: playerStore.fetchPlayers,
      openMatchDetail,
      newMatch,
      addScore,
      removeScore,
      createMatch
    };
  }
};
</script>

<style scoped>
.match-container {
  display: flex;
  align-items: center;
  justify-content: center; /* Ensure everything is centered */
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  text-align: center;
}

.match-container:hover {
  background-color: #e9ecef;
  border: 2px solid #ddd;
}

.team {
  flex: 1; /* Both teams take equal space */
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers text inside the team div */
}

.score {
  flex: 0 0 150px; /* Fixed width for score */
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
}

.player-list {
  margin-top: 10px;
}

.player-list p {
  margin: 5px 0; /* Removes bullet points & ensures spacing */
  font-size: 1.1rem;
}
.date-divider {
  font-size: 0.9rem; /* Make text smaller */
  font-weight: normal; /* Reduce boldness */
  background-color: #e9ecef; /* Lighter background */
  color: #6c757d; /* Muted text color */
  padding-inline: 1rem; /* Reduce padding */
  padding-block: 0.5rem;
  margin: 10px 0; /* Add some space */
  border-radius: 5px; /* Slight rounding */
}
</style>