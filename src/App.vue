<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Kicker</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
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

<script>
export default { setup() {} };
</script>
