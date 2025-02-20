import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/kicker/api/players", // Adjust baseURL to your backend
    headers: {
        "Content-Type": "application/json",
    },
});

export const usePlayerStore = defineStore('playerStore', {
    state: () => ({ players: [] }),
    actions: {
        async fetchPlayers() {
            const response = await apiClient.get();
            console.log(response.data);
            this.players = response.data;
        },
        async fetchPlayer(id) {
            const response = await apiClient.get(`${id}`);
            return response.data;
        },
        async fetchPlayerMatches(id) {
            return (await apiClient.get(`${id}/matches`)).data;
        },
        async addPlayer(player) {
            console.log(player);

            if (!player || typeof player !== 'object' || !player.name) {
                console.error("Invalid player data:", player);
                return;
            }

            try {
                await apiClient.post("", player);
                await this.fetchPlayers();
            } catch (error) {
                console.error("Error adding player:", error);
            }
        },
        async updatePlayer(player) {
          await apiClient.put(player.id, player);
          await this.fetchPlayers();
        },
        async deletePlayer(id) {
            await apiClient.delete(id);
            await this.fetchPlayers();
        }
    }
});