<script setup>
import { RouterView } from 'vue-router'
import LoginStatus from './components/LoginStatus.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <LoginStatus/>
  <RouterView/>
  <Footer/>
</template>
