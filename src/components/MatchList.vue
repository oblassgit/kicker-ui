<template>
  <div v-for="(group, index) in groupedMatches" :key="index" class="mb-4">
    <h3 class="text-left date-divider" v-if="index === 0 || groupedMatches[index - 1].date !== group.date">
      {{ group.date }}
    </h3>
    <div v-for="(match, matchIndex) in group.matches" :key="matchIndex" class="match-container" @click="openMatchDetail(match)">
      <div class="team">
        <div class="player-list">
          <p v-for="score in match.scores.filter(s => s.team === 'TEAM_1')" :key="score.id">
            {{ score.player.name }} ({{ score.goalsScored }})
          </p>
        </div>
      </div>

      <div class="score">
        <h2>
          {{
            match.scores.filter(s => s.team === 'TEAM_1').reduce((acc, s) => acc + s.goalsScored, 0)
          }} - {{
            match.scores.filter(s => s.team === 'TEAM_2').reduce((acc, s) => acc + s.goalsScored, 0)
          }}
        </h2>
      </div>

      <div class="team">
        <div class="player-list">
          <p v-for="score in match.scores.filter(s => s.team === 'TEAM_2')" :key="score.id">
            {{ score.player.name }} ({{ score.goalsScored }})
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  props: {
    matches: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter();

    const groupedMatches = computed(() => {
      const groups = [];
      const matchesByDate = {};

      if (props.matches) {
        props.matches.forEach(match => {
          if (!match || !match.scores || match.scores.length === 0 || !match.date) return;

          try {
            // Validate date
            const dateObj = new Date(match.date);
            if (isNaN(dateObj.getTime())) return; // Skip invalid dates

            if (!matchesByDate[match.date]) {
              matchesByDate[match.date] = [];
            }

            matchesByDate[match.date].push(match);
          } catch (error) {
            console.error(`Invalid date format for match:`, match);
            return;
          }
        });
      }

      const sortedDates = Object.keys(matchesByDate)
          .sort((a, b) => new Date(b) - new Date(a));

      sortedDates.forEach(date => {
        if (matchesByDate[date].length > 0) {
          try {
            groups.push({
              date: new Intl.DateTimeFormat('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              }).format(new Date(date)),
              matches: matchesByDate[date],
            });
          } catch (error) {
            console.error(`Error formatting date: ${date}`, error);
          }
        }
      });

      return groups;
    });

    const openMatchDetail = async (match) => {
      await router.push(`/matches/${match.id}`);
    };

    return {
      groupedMatches,
      openMatchDetail
    };
  }
};
</script>

<style scoped>
.match-container {
  display: flex;
  align-items: center;
  justify-content: center;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score {
  flex: 0 0 150px;
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
}

.player-list {
  margin-top: 10px;
}

.player-list p {
  margin: 5px 0;
  font-size: 1.1rem;
}

.date-divider {
  font-size: 0.9rem;
  font-weight: normal;
  background-color: #e9ecef;
  color: #6c757d;
  padding-inline: 1rem;
  padding-block: 0.5rem;
  margin: 10px 0;
  border-radius: 5px;
}
</style>