<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1">
      <slot />
    </main>
    <FooterView />
  </div>
</template>

<script setup lang="ts">
import NavBar from './NavBar.vue'
import FooterView from './FooterView.vue'
</script>