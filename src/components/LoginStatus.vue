<script setup>
// Diese Datei muss für die Projektarbeit
// nicht verändert werden.


import { useToken } from '../api/auth'

const { token, clearToken } = useToken()
</script>

<template>
  <div class="login-status">
    <div v-if="token">
      Du bist angemeldet
      <a href="#" @click="clearToken">(Abmelden)</a>
    </div>
    <div v-else>
      Du bist <strong>nicht</strong> angemeldet
      <a href="/login">(Anmelden)</a>
    </div>
  </div>
</template>