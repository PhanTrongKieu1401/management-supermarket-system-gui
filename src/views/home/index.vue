<template>
  <div class="layout">
    <header class="layout-header">
      <Header />
    </header>
    <div class="layout-main mb-5">
      <router-view/>
    </div>
    <footer class="layout-footer">
      <Footer/>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Header from '/src/components/general/header/index.vue';
import Footer from '/src/components/general/footer/index.vue';
</script>

<style scoped>
@import 'index.css';
</style>
