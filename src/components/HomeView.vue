<template>
  <div class="container mt-4 text-center">
    <h1>Welcome to Kicker</h1>
    <p class="lead">Manage players, matches, and scores easily.</p>
    <div class="mt-4">
      <router-link to="/players" class="btn btn-primary me-2">View Players</router-link>
      <router-link to="/matches" class="btn btn-secondary">View Matches</router-link>
    </div>
  </div>
</template>

<script>
export default {
  setup() {}
};
</script>