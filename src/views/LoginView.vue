<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCatalyst, isAuthenticated, isAuthorizedUser, signOutCurrentUser } from '../services/catalystAuth'

const route = useRoute()
const router = useRouter()
const error = ref('')

onMounted(async () => {
  if (route.query.reason === 'not-registered') {
    error.value = 'You are logged in but your user is not in the Users Data Store table.'
  }

  const alreadyLoggedIn = await isAuthenticated()

  if (alreadyLoggedIn) {
    const allowed = await isAuthorizedUser('Users')

    if (allowed) {
      await router.replace('/')
      return
    }

    await signOutCurrentUser()
    error.value = 'Your account is not registered in the Users table. Contact an admin.'
    return
  }

  const catalyst = getCatalyst()

  if (!catalyst || !catalyst.auth) {
    error.value = 'Catalyst Web SDK is not initialized. Open this app inside Catalyst hosting.'
    return
  }

  try {
    catalyst.auth.signIn('catalyst-login', {
      service_url: `${window.location.origin}/`
    })
  } catch (err) {
    error.value = err?.message || String(err)
  }
})
</script>

<template>
  <main class="auth">
    <h2>Login</h2>
    <p>Sign in to continue to the inventory app.</p>

    <p v-if="error" class="error">{{ error }}</p>
    <div id="catalyst-login" class="login-box"></div>
  </main>
</template>

<style scoped>
.auth {
  max-width: 640px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.error {
  color: #c62828;
  margin: 1rem 0;
}

.login-box {
  margin-top: 1rem;
  min-height: 280px;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
}
</style>

