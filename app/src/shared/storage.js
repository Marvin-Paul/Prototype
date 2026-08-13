// Port of prototype/js/utils.js AppUtils storage + DOM helpers.
// Only the persistence helpers are needed by the React app.

export function get(key, fallback = null) {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch (e) {
    return fallback
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    return false
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    return false
  }
}
