<script setup>
import { ref } from 'vue'
import { getCatalyst } from '../services/catalystAuth'

const tableName = ref('Users')
const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const createdRow = ref(null)

async function addUser() {
  error.value = ''
  success.value = ''
  createdRow.value = null

  if (!name.value.trim() || !email.value.trim()) {
    error.value = 'Name and Email are required.'
    return
  }

  const catalyst = getCatalyst()

  if (!catalyst || !catalyst.table) {
    error.value =
      'Catalyst Web SDK is not initialized. Run this page inside Catalyst hosting.'
    return
  }

  loading.value = true

  try {
    const table = catalyst.table.tableId(tableName.value.trim())
    const rows = await table.addRow([
      {
        Name: name.value.trim(),
        Email: email.value.trim()
      }
    ])

    createdRow.value = rows?.content?.[0] ?? rows?.content ?? rows
    success.value = 'User added successfully.'
    name.value = ''
    email.value = ''
  } catch (err) {
    error.value = err?.message || String(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="add-user">
    <h2>Add User</h2>
    <p>Insert a new user row to Catalyst Data Store.</p>

    <div class="controls">
      <label>
        Table Name
        <input v-model="tableName" type="text" />
      </label>

      <label>
        Name
        <input v-model="name" type="text" />
      </label>

      <label>
        Email
        <input v-model="email" type="email" />
      </label>

      <button :disabled="loading" @click="addUser">
        {{ loading ? 'Saving...' : 'Add User' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
    <pre v-if="createdRow" class="result">{{ JSON.stringify(createdRow, null, 2) }}</pre>
  </main>
</template>

<style scoped>
.add-user {
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

.success {
  color: #1b5e20;
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

