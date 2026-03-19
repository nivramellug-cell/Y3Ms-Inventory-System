<script setup>
import { ref } from 'vue'

const tableName = ref('Users')
const username = ref('')
const loading = ref(false)
const error = ref('')
const userRow = ref(null)

async function fetchUser() {
  error.value = ''
  userRow.value = null

  if (!username.value.trim()) {
    error.value = 'Enter a username first.'
    return
  }

  const catalyst = window.catalyst

  if (!catalyst || !catalyst.table) {
    error.value =
      'Catalyst Web SDK is not initialized. Run this page inside a Catalyst project environment.'
    return
  }

  loading.value = true

  try {
    const table = catalyst.table.tableId(tableName.value)
    let hasNext = true
    let nextToken
    const targetUsername = username.value.trim().toLowerCase()

    while (hasNext) {
      const response = await table.getPagedRows({
        next_token: nextToken,
        max_rows: 200
      })
      const rows = response?.content ?? []
      const found = rows.find(
        (row) => String(row?.username || '').trim().toLowerCase() === targetUsername
      )

      if (found) {
        userRow.value = found
        return
      }

      hasNext = Boolean(response?.more_records)
      nextToken = response?.next_token
    }

    error.value = 'No user found with that username.'
  } catch (err) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="home">
    <h2>Catalyst Data Store Example</h2>
    <p>Fetch one user row by username.</p>

    <div class="controls">
      <label>
        Table Name
        <input v-model="tableName" type="text" />
      </label>

      <label>
        Username
        <input v-model="username" type="text" placeholder="e.g. john.doe" />
      </label>

      <button :disabled="loading" @click="fetchUser">
        {{ loading ? 'Fetching...' : 'Fetch User' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <pre v-if="userRow" class="result">{{ JSON.stringify(userRow, null, 2) }}</pre>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  width: 100%;
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.controls {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
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

.error {
  color: #c62828;
  margin-top: 0.75rem;
}

.result {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f6f8fa;
  border-radius: 6px;
  overflow-x: auto;
}
</style>
