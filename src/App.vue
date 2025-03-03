<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="/kicker_logo.ico" alt="Kicker" class="brand-icon">
      </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/players">Players</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/matches">Matches</router-link>
            </li>
          </ul>
        </div>
    </div>
  </nav>
  <div class="container mt-4">
    <router-view />
  </div>
</template>

<style scoped>
.brand-icon {
  height: 35px;
  width: auto;
  transition: transform 0.2s;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
}

.brand-icon:hover {
  transform: scale(1.1);
}
</style>

<script>
export default { setup() {} };
</script>
