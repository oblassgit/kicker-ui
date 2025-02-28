import { defineStore } from 'pinia';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:8080/kicker/api/players",
    headers: {
        "Content-Type": "application/json",
    },
});

export const usePlayerStore = defineStore('playerStore', {
    state: () => ({ players: [] }),
    actions: {
        async fetchPlayers() {
            try {
                const response = await apiClient.get();
                this.players = response.data;
            } catch (error) {
                console.error("Error fetching players:", error);
                throw error;
            }
        },

        async fetchPlayer(id) {
            if (!id) {
                console.error("Invalid player ID");
                throw new Error("Invalid player ID");
            }

            try {
                const response = await apiClient.get(`${id}`);
                return response.data;
            } catch (error) {
                console.error("Error fetching player:", error);
                throw error;
            }
        },

        async fetchPlayerMatches(id) {
            if (!id) {
                console.error("Invalid player ID");
                throw new Error("Invalid player ID");
            }

            try {
                const response = await apiClient.get(`${id}/matches`);
                return response.data;
            } catch (error) {
                console.error("Error fetching player matches:", error);
                throw error;
            }
        },

        async addPlayer(player) {
            if (!player || typeof player !== 'object' || !player.name) {
                console.error("Invalid player data:", player);
                throw new Error("Invalid player data");
            }

            try {
                await apiClient.post("", player);
                await this.fetchPlayers();
            } catch (error) {
                console.error("Error adding player:", error);
                throw error;
            }
        },

        async updatePlayer(player) {
            if (!player || typeof player !== 'object' || !player.id || !player.name) {
                console.error("Invalid player data:", player);
                throw new Error("Invalid player data");
            }

            try {
                await apiClient.put(player.id, player);
                await this.fetchPlayers();
            } catch (error) {
                console.error("Error updating player:", error);
                throw error;
            }
        },

        async deletePlayer(id) {
            if (!id) {
                console.error("Invalid player ID");
                throw new Error("Invalid player ID");
            }

            try {
                await apiClient.delete(id);
                await this.fetchPlayers();
            } catch (error) {
                console.error("Error deleting player:", error);
                throw error;
            }
        }
    }
});