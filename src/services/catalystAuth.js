export function getCatalyst() {
  return window.catalyst
}

const SESSION_KEY = 'y3ms_logged_user'

function saveSessionUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function getSessionUser() {
  const rawUser = localStorage.getItem(SESSION_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export async function isAuthenticated() {
  return Boolean(getSessionUser())
}

export async function signOutCurrentUser() {
  localStorage.removeItem(SESSION_KEY)
}

export async function authenticateWithDatastore(username, password, tableName = 'Users') {
  const catalyst = getCatalyst()

  if (!catalyst?.table) {
    throw new Error('Catalyst Web SDK is not initialized. Open this app inside Catalyst hosting.')
  }

  const cleanUsername = String(username || '').trim().toLowerCase()
  const cleanPassword = String(password || '').trim()

  if (!cleanUsername || !cleanPassword) {
    return null
  }

  const table = catalyst.table.tableId(tableName)
  let hasNext = true
  let nextToken

  while (hasNext) {
    const response = await table.getPagedRows({
      next_token: nextToken,
      max_rows: 200
    })
    const rows = response?.content ?? []
    const matchedUser = rows.find((row) => {
      const rowUsername = String(row?.username || '').trim().toLowerCase()
      const rowPassword = String(row?.password || '').trim()
      return rowUsername === cleanUsername && rowPassword === cleanPassword
    })

    if (matchedUser) {
      saveSessionUser(matchedUser)
      return matchedUser
    }

    hasNext = Boolean(response?.more_records)
    nextToken = response?.next_token
  }

  return null
}

