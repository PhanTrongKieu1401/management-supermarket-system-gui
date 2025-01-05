<template>
    <div class="product-menu w-4/5 pt-3 pb-1">
        <div class="menu-title m-auto pb-3">Danh mục sản phẩm</div>
        <router-link v-for="category in categories" 
            :key="category.name"
            :to="{ name: 'Products' }" 
            class="menu-item flex justify-between items-center p-1" :class="{ 'selected': isSelectedCategory(category) }"
            @click="selectCategory(category)">
            <span>{{ category.name }}</span>
            <router-link :to="{ name: 'Products' }" class="menu-link">&gt;</router-link>
        </router-link>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Sider',

});
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Category, fetchFindAllCategories } from '../../../api/customer/apiCategory';
import { useFilterStore } from '../../../stores/filterStore/filterStore';

const route = useRoute();
const router = useRouter();
const filterStore = useFilterStore();

const categories = ref<Category[]>([]);
const selectedCategoryId = ref<string | null>(null);

onMounted( async () =>{
    categories.value = (await fetchFindAllCategories()).data;

    const newCategory: Category = {
        id: 'ALL',
        name: 'Tất cả',
        activated: true,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
    };

    categories.value.unshift(newCategory);
    syncSelectedCategory();
});

// watch( selectedCategoryId,(newSelectedCategoryId)  => {
//     syncSelectedCategory();
// });

const syncSelectedCategory = () => {
    const filter = localStorage.getItem("filterCustomer");

    const storedType = filter ? JSON.parse(filter).type : filterStore.type;
    const matchedCategory = categories.value.find(cat => cat.id === storedType);
    if (matchedCategory) {
        selectedCategoryId.value = matchedCategory.id;
        filterStore.type = matchedCategory.id;
    } else {
        selectedCategoryId.value = 'ALL';
        filterStore.type = 'ALL';
    }
};

const selectCategory = (category: Category) => {
    selectedCategoryId.value = category.id;

    filterStore.type = category.id; 
    filterStore.currentPage = 1;
    router.push({ name: 'Products' });
};

const isSelectedCategory = (category: Category) => {
    return selectedCategoryId.value === category.id;
};
</script>

<style scoped>
@import 'index.css';
</style>