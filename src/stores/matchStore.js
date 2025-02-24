// stores/matchStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/kicker/api/matches", // Adjust baseURL to your backend
    headers: {
        "Content-Type": "application/json",
    },
});


export const useMatchStore = defineStore('matchStore', {
    //const matches = ref([]);
    state: () => ({matches: []}),

    actions: {
        async fetchMatches() {
            try {
                const response = await apiClient.get('');
                this.matches = response.data;
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        },
        async fetchMatchById(id) {
            return await apiClient.get(`/${id}`);
        },
        async createMatch(match) {
            try {
                await apiClient.post(``, match)
                await this.fetchMatches();
            } catch (error) {
                console.error('Error creating match:', error);
            }
        },
        async updateMatch(id, match) {
            try {
                await apiClient.put(`/${id}`, match)
                await this.fetchMatches();
            } catch (error) {
                console.error('Error updating match:', error);
            }
        },
        async deleteMatch(id) {
            try {
                await apiClient.delete(`/${id}`);
                await this.fetchMatches();
            } catch (error) {
                console.error('Error deleting match:', error);
            }
        }
    }
    /*const fetchMatches = async () => {
        try {
            const response = await axios.get('http://localhost:8080/kicker/api/matches');
            matches.value = response.data;
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    const fetchMatchById = async (id) => {
        return await apiClient.get(`/matches/${id}`);
    }

    const createMatch = async (matchData) => {
        try {
            await axios.post('http://localhost:8080/kicker/api/matches', matchData);
            await fetchMatches();
        } catch (error) {
            console.error('Error creating match:', error);
        }
    };

    return { matches, fetchMatches, createMatch };*/
});