<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { signOutCurrentUser } from './services/catalystAuth'

const route = useRoute()
const router = useRouter()
const isLoginPage = computed(() => route.name === 'login')

async function logout() {
  await signOutCurrentUser()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <header v-if="!isLoginPage">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <h1>Y3MS Inventory System</h1>

        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/add-user">Add User</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <button class="logout" @click="logout">Logout</button>
        </nav>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.logout {
  margin-left: 1rem;
  padding: 0.3rem 0.6rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
