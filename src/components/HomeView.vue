<template>
  <div class="container mt-4 text-center">
    <img src="/kicker_logo.ico" alt="Kicker" class="home-logo mb-4">
    <h1>Welcome to Kicker</h1>
    <p class="lead">Manage players, matches, and scores easily.</p>
    <div class="mt-4">
      <router-link to="/players" class="btn btn-primary me-2">View Players</router-link>
      <router-link to="/matches" class="btn btn-secondary">View Matches</router-link>
    </div>
  </div>
</template>

<style scoped>
.home-logo {
  width: 120px;
  height: auto;
  margin: 20px auto;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<script>
export default {
  setup() {}
};
</script>