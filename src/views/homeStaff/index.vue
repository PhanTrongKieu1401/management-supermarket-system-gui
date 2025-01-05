<template>
    <div class="layout">
        <div class="layout_sider">
            <Dashboard/>
        </div>
        <div class="layout_main">
            <router-view/>
        </div>
    </div>
</template>

<script setup lang="ts">
import Dashboard from '/src/components/staff/dashboard/index.vue';
</script>

<style scoped>
@import "index.css";
</style>