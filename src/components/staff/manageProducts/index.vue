<template>
    <div class="layout-main">
        <div class="filter-box">
            <div class="title-filter-box">
                <h1>Lọc sản phẩm:</h1>
                <button class="btn-filter" @click="applyFilters">Áp dụng</button>
            </div>
            
            <div class="filter-fields">
                <div class="filter-field">
                    <label for="product-code">Mã sản phẩm:</label>
                    <input type="text" id="product-code" v-model="productId" />
                </div>
                <div class="filter-field">
                    <label for="product-name">Tên sản phẩm:</label>
                    <input type="text" id="product-name" v-model="name" />
                </div>
                <div class="filter-field">
                    <label for="category">Loại sản phẩm:</label>
                    <select id="category" v-model="categoryId">
                        <option value="ALL">Tất cả</option>
                        <option v-for="category in categoryFilter" :key="category.categoryId" :value="category.categoryId">
                            {{ category.categoryName }}
                        </option>
                    </select>
                </div>
                <div class="filter-field">
                    <label for="status">Trạng thái:</label>
                    <select id="status" v-model="isActivated">
                        <option value="null">Tất cả</option>
                        <option value="true">Hoạt động</option>
                        <option value="false">Không hoạt động</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="title-list-box">
                <div class="summary">
                    <h1>Danh sách sản phẩm</h1>
                
                    <span>Số lượng sản phẩm: {{ totalProducts }}</span>
                </div>
                <div>
                    <div class="dropdown">
                        <button class="btn btn-add">Thêm mới</button>
                        <div class="dropdown-content">
                            <button class="btn option" @click="addManual">Thêm thủ công</button>
                            <button class="btn option" @click="addFromFile">Dùng file csv</button>
                        </div>
                    </div>
                    <!-- <button class="btn btn-lock">Khóa sản phẩm</button> -->
                    <button class="btn btn-cancel-product">Hủy sản phẩm</button>
                </div>
            </div>
            <table class="tbl-content">
                <thead>
                    <tr>
                        <th style="width: 5%;">STT</th>
                        <th style="width: 10%;">Mã sản phẩm</th>
                        <th style="width: 10%;">Ảnh</th>
                        <th style="width: 14%;">Tên sản phẩm</th>
                        <th style="width: 12%;">Giá bán</th>
                        <!-- <th style="width: 12%;">Giá nhập</th> -->
                        <th style="width: 8%;">Tồn kho</th>
                        <th style="width: 8%;">Đang đặt</th>
                        <th style="width: 8%;">Mã loại</th>
                        <th style="width: 12%;">Loại sản phẩm</th>
                        <th style="width: 8%;">Trạng thái</th>
                        <th style="width: 5%;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="products.length === 0">
                        <td colspan="11" class="border p-2 text-center">Không có sản phẩm phù hợp</td>
                    </tr>
                    <tr v-for="(product, index) in products" :key="product.productId">
                        <td style="text-align: center;">{{ index + 1 }}</td>
                        <td>{{ product.productId }}</td>
                        <td>
                            <img :src="product.image" alt="Ảnh {{ product.name }}" style="width: 90%; height: 90%; object-fit: cover;" />
                        </td>
                        <td>{{ product.name }}</td>
                        <td style="text-align: right;">{{ product.priceSell.toLocaleString('vi-VN') }} Vnđ</td>
                        <!-- <td style="text-align: right;">{{ product.priceImport.toLocaleString('vi-VN') }} Vnđ</td> -->
                        <td style="text-align: right;">{{ product.quantityInStock.toLocaleString('vi-VN') }}</td>
                        <td style="text-align: right;">{{ product.quantityInOrdering.toLocaleString('vi-VN') }}</td>
                        <td>{{ product.categoryId }}</td>
                        <td>{{ product.categoryName }}</td>
                        <td>{{ product.activated ? 'Đang bán' : 'Ngừng bán'  }}</td>
                        <td>
                            <button class="btn-view" @click="viewProduct(product.productId)">
                                <font-awesome-icon :icon="['fas', 'eye']" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="products.length > 0" class="flex w-full h-10 justify-center items-center p-5">
                <Pagination v-model="currentPage" :totalPages="totalPages!"/> 
                <!-- @update-page="updatePage" -->
            </div>
        </div>
    </div>
    <AddProductManualModal :showModal="isModalAddProductManual" @close="isModalAddProductManual = false"/>
    <AddProductByFile :showModal="isModalAddProductByFile" @close="isModalAddProductByFile = false" @reloadData="reloadProducts"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ManageProducts',
    components: {
        AddProductManualModal,
        AddProductByFile,
        Pagination
    }
});
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import AddProductManualModal from '../manageProducts/modalAddProductManual/index.vue';
import AddProductByFile from "../manageProducts/modalAddProductByFile/index.vue";
import Pagination from "../pagination/index.vue";

import { useFilterStore } from '../../../stores/filterStore/filterStaffStore';
import { ProductManagement, fetchProductManagement } from '../../../api/staff/apiProduct';
import { CategoryFilter, fetchCategoryFilter } from '../../../api/staff/apiCategory';

const router = useRouter();
const filterStore = useFilterStore();

const productId = ref<string | null>(filterStore.productId);
const name = ref<string | null>(filterStore.name);
const categoryId = ref<string>(filterStore.categoryId);
const isActivated = ref<boolean | null>(filterStore.isActivated);
const currentPage = computed(() => filterStore.currentPage);
const totalPages = ref<number>();
const totalProducts = ref<number>();

const isModalAddProductManual = ref(false);
const isModalAddProductByFile = ref(false);

const categoryFilter = ref<CategoryFilter[]>([]);
const products = ref<ProductManagement[]>([]);

onMounted(async () => {
    applyFilters();
    try {
        const response = await fetchCategoryFilter();
        if (response) {
            categoryFilter.value = response.data;
        } else {
            console.error('Lấy danh sách loại sản phẩm thất bại');
        }
    } catch (error:any) {
        alert(error.message);
    }
})

watch(currentPage, (newCurrentPage) => {
    reloadProducts();
});

watch(products, (newProducts)=>{});

const applyFilters = async () => {
    filterStore.productId = productId.value?.trim() || null;
    filterStore.name = name.value?.trim() || null;
    filterStore.categoryId = categoryId.value;
    filterStore.isActivated = isActivated.value;
    
    try {
        const response = await fetchProductManagement();
        if (response) {
            products.value = response.data.products;
            totalProducts.value = response.data.totalProducts;
            totalPages.value = response.data.totalPages;
        } else {
            console.error('Lấy danh sách sản phẩm thất bại');
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const addManual = () => {
    isModalAddProductManual.value = true;
};

const addFromFile = () => {
    isModalAddProductByFile.value = true;
};

const viewProduct = (productId: string) => {
    router.push({ name: 'ProductManagementDetail', params: {productId}});
};

const reloadProducts = async () => {
  try {
    const response = await fetchProductManagement();
    if (response) {
        products.value = response.data.products;
        totalProducts.value = response.data.totalProducts;
        totalPages.value = response.data.totalPages;
    } else {
        console.error('Lấy danh sách sản phẩm thất bại');
    }
  } catch (error) {
    console.error('Có lỗi khi tải lại sản phẩm:', error);
  }
};
</script>

<style scoped>
@import "index.css";
</style>