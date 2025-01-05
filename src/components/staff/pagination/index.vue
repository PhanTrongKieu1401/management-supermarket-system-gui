<template>
    <div class="pagination flex items-center" v-if="totalPages > 1"> <!-- Chỉ hiển thị phân trang nếu có nhiều hơn 1 trang -->
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
            <font-awesome-icon :icon="['fas', 'chevron-left']" class="pr-1"/>Trang trước
        </button>

        <button @click="goToPage(1)" :class="{ 'active': currentPage === 1 }" :disabled="currentPage === 1">1</button>

        <span v-if="showStartEllipsis">...</span>

        <button v-for="page in middlePages" :key="page" @click="goToPage(page)"
            :class="{ 'active': page === currentPage }">
            {{ page }}
        </button>

        <span v-if="showEndEllipsis">...</span>

        <button v-if="totalPages > 1" @click="goToPage(totalPages)" :class="{ 'active': currentPage === totalPages }" :disabled="currentPage === totalPages">{{ totalPages }}</button>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
            Trang sau<font-awesome-icon :icon="['fas', 'chevron-right']" class="pl-1"/>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Pagination',
});
</script>

<script setup lang="ts">
import { computed, defineProps, defineEmits  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFilterStore } from '../../../stores/filterStore/filterStaffStore';

const props = defineProps<{
    totalPages: number,
}>();

const emits = defineEmits(['update-page']);

const route = useRoute();
const router = useRouter();
const filterStore = useFilterStore(); 

const currentPage = computed({
    get: () => filterStore.currentPage, 
    set: (value) => filterStore.currentPage = value,
});

const goToPage = (page: number) => {
    filterStore.currentPage = page;
};

const changePage = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
        goToPage(page);
    }
};

const middlePages = computed(() => {

    const pages = [];
    if (props.totalPages <= 5) {
        for (let i = 2; i <= props.totalPages - 1; i++) {
            pages.push(i);
        }
    } else {
        const start = Math.max(2, currentPage.value - 2);
        const end = Math.min(props.totalPages - 1, start + 3);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    }
    return pages;
});

const showStartEllipsis = computed(() => {
    return props.totalPages > 5 && currentPage.value > 4;
});

const showEndEllipsis = computed(() => {
    return props.totalPages > 6 && currentPage.value < props.totalPages - 2;
});
</script>

<style scoped>
@import 'index.css';
</style>