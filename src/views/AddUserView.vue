<script setup>
import { ref } from 'vue'
import { getCatalyst } from '../services/catalystAuth'

const tableName = ref('Users')
const firstname = ref('')
const lastname = ref('')
const username = ref('')
const password = ref('')
const role = ref('staff')
const loading = ref(false)
const error = ref('')
const success = ref('')
const createdRow = ref(null)

async function addUser() {
  error.value = ''
  success.value = ''
  createdRow.value = null

  if (!firstname.value.trim() || !lastname.value.trim() || !username.value.trim() || !password.value.trim()) {
    error.value = 'Firstname, lastname, username, and password are required.'
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
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        username: username.value.trim(),
        password: password.value.trim(),
        role: role.value.trim() || 'staff'
      }
    ])

    createdRow.value = rows?.content?.[0] ?? rows?.content ?? rows
    success.value = 'User added successfully.'
    firstname.value = ''
    lastname.value = ''
    username.value = ''
    password.value = ''
    role.value = 'staff'
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
        Firstname
        <input v-model="firstname" type="text" />
      </label>

      <label>
        Lastname
        <input v-model="lastname" type="text" />
      </label>

      <label>
        Username
        <input v-model="username" type="text" autocomplete="username" />
      </label>

      <label>
        Password
        <input v-model="password" type="password" autocomplete="new-password" />
      </label>

      <label>
        Role
        <input v-model="role" type="text" placeholder="admin / staff" />
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

