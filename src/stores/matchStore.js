// stores/matchStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useMatchStore = defineStore('matchStore', () => {
    const matches = ref([]);

    const fetchMatches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/kicker/api/matches');
            matches.value = response.data;
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const createMatch = async (matchData) => {
        try {
            await axios.post('http://localhost:8080/kicker/api/matches', matchData);
            fetchMatches();
        } catch (error) {
            console.error('Error creating match:', error);
        }
    };

    return { matches, fetchMatches, createMatch };
});