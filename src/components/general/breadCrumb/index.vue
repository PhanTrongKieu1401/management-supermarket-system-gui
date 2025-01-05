<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="#">Home</a></li>
            <li class="breadcrumb-item"><a href="#">Application Center</a></li>
            <li class="breadcrumb-item"><a href="#">Application List</a></li>
            <li class="breadcrumb-item active" aria-current="page"><a href="#">An Application</a></li>
        </ol>
    </nav>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';

export default defineComponent({
    name: 'bread_crumb',
    setup() {
        onMounted(() => {
            loadData();
        });

        const loadData = async () => {
        };

        return {};
    },
});
</script>

<style scoped>
@import 'index.css';
</style>