export function getCatalyst() {
  return window.catalyst
}

export async function isAuthenticated() {
  const catalyst = getCatalyst()

  if (!catalyst || !catalyst.auth) {
    return false
  }

  try {
    await catalyst.auth.isUserAuthenticated()
    return true
  } catch {
    return false
  }
}

export async function getCurrentUser() {
  const catalyst = getCatalyst()

  if (!catalyst || !catalyst.auth) {
    return null
  }

  try {
    const response = await catalyst.auth.isUserAuthenticated()
    return response?.content ?? null
  } catch {
    return null
  }
}

export async function signOutCurrentUser() {
  const catalyst = getCatalyst()

  if (!catalyst?.auth?.signOut) {
    return
  }

  const loginUrl = `${window.location.origin}/login`
  catalyst.auth.signOut(loginUrl)
}

export async function isAuthorizedUser(tableName = 'Users') {
  const catalyst = getCatalyst()

  if (!catalyst?.table) {
    return false
  }

  const currentUser = await getCurrentUser()
  const userEmail = String(currentUser?.email_id || currentUser?.email || '').toLowerCase()

  if (!userEmail) {
    return false
  }

  try {
    const table = catalyst.table.tableId(tableName)
    let hasNext = true
    let nextToken

    while (hasNext) {
      const response = await table.getPagedRows({
        next_token: nextToken,
        max_rows: 200
      })
      const rows = response?.content ?? []
      const found = rows.some((row) => {
        const rowEmail = String(row?.Email || row?.email || row?.email_id || '').toLowerCase()
        return rowEmail === userEmail
      })

      if (found) {
        return true
      }

      hasNext = Boolean(response?.more_records)
      nextToken = response?.next_token
    }

    return false
  } catch {
    return false
  }
}

