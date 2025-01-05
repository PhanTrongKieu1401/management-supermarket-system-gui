<template>
    <aside class="layout-sider w-1/6 mr-5">
        <Sider/>
    </aside>
    <main class="layout-content w-5/6">
        <ContentHome />
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Sider from '/src/components/general/sider/index.vue';
import ContentHome from '/src/components/products/contentHome/index.vue';

export default defineComponent({
    name: 'Content',
    components: {
        Sider,
        ContentHome,
    },
});
</script>

<style scoped>
@import 'index.css';
</style>