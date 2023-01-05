import { ref } from 'vue'

export const STORAGE_KEY = 'session_token'

const auth = ref(localStorage.getItem(STORAGE_KEY))

export function useToken () {
  function setToken (newToken) {
    auth.value = newToken
    localStorage.setItem(STORAGE_KEY, newToken)
  }

  function clearToken () {
    auth.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    token: auth,
    setToken,
    clearToken,
  }
}