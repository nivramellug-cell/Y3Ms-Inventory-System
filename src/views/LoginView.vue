<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authenticateWithDatastore, isAuthenticated } from '../services/catalystAuth'

const route = useRoute()
const router = useRouter()
const error = ref('')
const username = ref('')
const password = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true

  try {
    const user = await authenticateWithDatastore(username.value, password.value, 'Users')

    if (!user) {
      error.value = 'Invalid username or password.'
      return
    }

    await router.replace('/')
  } catch (err) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (route.query.reason === 'auth') {
    error.value = 'Login required to access this page.'
  }

  const alreadyLoggedIn = await isAuthenticated()

  if (alreadyLoggedIn) {
    await router.replace('/')
    return
  }
})
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <h2>Login</h2>
      <p>Sign in with your Data Store user credentials.</p>

      <p v-if="error" class="error">{{ error }}</p>
      <form class="login-box" @submit.prevent="login">
        <label>
          Username
          <input v-model="username" type="text" autocomplete="username" />
        </label>

        <label>
          Password
          <input v-model="password" type="password" autocomplete="current-password" />
        </label>

        <button :disabled="loading" type="submit">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.auth-card {
  width: min(680px, 100%);
}

.error {
  color: #c62828;
  margin: 1rem 0;
}

.login-box {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
}

label {
  display: grid;
  gap: 0.25rem;
}

input {
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
}

button {
  width: fit-content;
  padding: 0.5rem 0.8rem;
}
</style>

