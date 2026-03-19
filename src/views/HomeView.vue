<script setup>
import { ref } from 'vue'

const tableName = ref('Users')
const rowId = ref('')
const loading = ref(false)
const error = ref('')
const userRow = ref(null)

async function fetchUser() {
  error.value = ''
  userRow.value = null

  if (!rowId.value.trim()) {
    error.value = 'Enter a row ID first.'
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
    const datastore = catalyst.table
    const table = datastore.tableId(tableName.value)
    const row = table.rowId(rowId.value.trim())
    const response = await row.get()

    userRow.value = response?.content ?? null
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
    <p>Fetch one user row by row ID.</p>

    <div class="controls">
      <label>
        Table Name
        <input v-model="tableName" type="text" />
      </label>

      <label>
        User Row ID
        <input v-model="rowId" type="text" placeholder="e.g. 2136000000011011" />
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
