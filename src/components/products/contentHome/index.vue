<template>
    <div class="flex flex-col w-full layout-container">
        <div v-if="preferentialProducts.length > 0" class="product-section flex flex-col max-w-full mb-5">
            <h2 class="text-xl font-bold p-2 text-black">
                Danh sách sản phẩm ưu đãi
            </h2>
            <button v-if="showLeftArrowPreferential" @click="scrollLeft(preferentialProductContainer)"
                class="btn-scroll absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full">
                ←
            </button>
            <div class="product-container flex overflow-x-auto py-4 space-x-4 max-w-full" ref="preferentialProductContainer"
                @scroll="onScrollPreferential">
                <!-- <div v-for="(voucher, index) in vouchers.slice(0, 6)" :key="voucher.id"
                    class="voucher-item bg-white p-4 rounded-lg shadow-lg flex-shrink-0 w-64">
                    <div class="voucher-header flex justify-between items-center">
                        <h3 class="font-bold text-black">Voucher {{ voucher.value / 1000 }}K</h3>
                    </div>
                    <p class="text-black">Giảm ngay {{ voucher.value }} Vnđ cho đơn hàng từ {{ voucher.conditionsApply
                        }} Vnđ</p>
                    <div class="expire-date rounded-lg py-1 mt-2">
                        HSD {{ voucher.expireDate }}
                    </div>
                    <button class="btn-details rounded-lg px-4 py-2 mt-4 w-full">
                        Xem chi tiết
                    </button>
                </div> -->

                <div v-for="product in preferentialProducts.slice(0, 6)" :key="product.id"
                    class="product-item bg-white p-2 rounded-lg shadow-lg flex-shrink-0 w-56">
                    <router-link :to="{ name: 'ProductDetail', params: { productName: product.name } }"
                        @click.prevent="goToProductDetail(product.id)">
                        <div class="w-full h-3/5">
                            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover"/>
                        </div>

                        <div class="product-info">
                            <h5 class="font-normal text-lg text-black truncate">{{ product.name }}</h5>

                            <div class="stock-info mt-2 mb-2">
                                <span v-if="product.quantityInStock === 0" class="text-gray-500">Hết hàng</span>
                                <!-- <span v-else-if="product.quantityInStock <= 10" class="font-bold"
                                    style="color: rgb(228, 68, 52);">
                                    Còn lại {{ product.quantityInStock }} sản phẩm
                                </span> -->
                                <span v-else class="text-green-500">Sẵn hàng</span>
                            </div>

                            <div v-if="product.discountSell && product.priceSell !== product.discountSell"
                                class="flex justify-between items-center mt-2">
                                <p class="text-gray-500 italic line-through" style="font-size: 15px;">
                                    {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                                </p>
                                <p class="font-bold" style="color: rgb(228, 68, 52); font-size: 15px;">
                                    {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
                                </p>
                            </div>
                            <div v-else class="flex justify-end items-center mt-2">
                                <p class="font-bold" style="color: rgb(228, 68, 52); font-size: 15px;">{{
                                    product.priceSell.toLocaleString('vi-VN') }} Vnđ</p>
                            </div>
                        </div>
                    </router-link>
                    <div v-if="!isInCart(product)" class="w-full flex justify-center items-center mt-4">
                        <button @click="addToCart(product)" class="btn-add-to-cart" :disabled="product.quantityInStock === 0"
                        :class="{'disabled': product.quantityInStock === 0}">
                            <font-awesome-icon :icon="['fas', 'cart-shopping']" class="pr-2" />Thêm vào giỏ hàng
                        </button>
                    </div>
                    <div v-else class="w-full flex justify-center items-center mt-4">
                        <div class="quantity-selector">
                            <button @click="decreaseQuantity(product)"
                                class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                :disabled="getQuantity(product) === 1">
                                <font-awesome-icon :icon="['fas', 'minus']" />
                            </button>
                            <input type="text" inputmode="numeric" :value="getProductInCart(product)?.quantity"
                                @input="(e) => { tempQuantity = parseInt((e.target as HTMLInputElement)?.value, 10) || 1 }"
                                @blur="validateQuantity(product, tempQuantity)"
                                class="input-quantity [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
                                :min="1" :max="999">
                            <button @click="increaseQuantity(product)"
                                class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                :disabled="getQuantity(product) === 999">
                                <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="preferentialProducts.length > 6" class="flex-shrink-0 w-32 flex items-center justify-center">
                    <button @click="viewAllPreferentialProducts" class="btn-view-all-product rounded-full p-2">
                        Xem tất cả →
                    </button>
                </div>
            </div>
            <button v-if="showRightArrowPreferential && preferentialProducts.length > 6" @click="scrollRight(preferentialProductContainer)"
                class="btn-scroll absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full">
                →
            </button>
        </div>

        <div v-if="suggestedProducts.length > 0" class="product-section flex flex-col max-w-full mb-5">
            <h2 class="text-xl font-bold p-2 text-black">
                Sản phẩm bạn có thể thích
            </h2>
            <button v-if="showLeftArrowSuggest" @click="scrollLeft(suggestProductContainer)"
                class="btn-scroll absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full">
                ←
            </button>
            <div class="product-container flex overflow-x-auto py-4 space-x-4 max-w-full" ref="suggestProductContainer"
                @scroll="onScrollSuggest">
                <!-- <div v-for="(voucher, index) in vouchers.slice(0, 6)" :key="voucher.id"
                    class="voucher-item bg-white p-4 rounded-lg shadow-lg flex-shrink-0 w-64">
                    <div class="voucher-header flex justify-between items-center">
                        <h3 class="font-bold text-black">Voucher {{ voucher.value / 1000 }}K</h3>
                    </div>
                    <p class="text-black">Giảm ngay {{ voucher.value }} Vnđ cho đơn hàng từ {{ voucher.conditionsApply
                        }} Vnđ</p>
                    <div class="expire-date rounded-lg py-1 mt-2">
                        HSD {{ voucher.expireDate }}
                    </div>
                    <button class="btn-details rounded-lg px-4 py-2 mt-4 w-full">
                        Xem chi tiết
                    </button>
                </div> -->

                <div v-for="product in suggestedProducts.slice(0, 6)" :key="product.id"
                    class="product-item bg-white p-2 rounded-lg shadow-lg flex-shrink-0 w-56">
                    <router-link :to="{ name: 'ProductDetail', params: { productName: product.name } }"
                        @click.prevent="goToProductDetail(product.id)">
                        <div class="w-full h-3/5">
                            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover"/>
                        </div>

                        <div class="product-info">
                            <h5 class="font-normal text-lg text-black truncate">{{ product.name }}</h5>

                            <div class="stock-info mt-2 mb-2">
                                <span v-if="product.quantityInStock === 0" class="text-gray-500">Hết hàng</span>
                                <!-- <span v-else-if="product.quantityInStock <= 10" class="font-bold"
                                    style="color: rgb(228, 68, 52);">
                                    Còn lại {{ product.quantityInStock }} sản phẩm
                                </span> -->
                                <span v-else class="text-green-500">Sẵn hàng</span>
                            </div>

                            <div v-if="product.discountSell && product.priceSell !== product.discountSell"
                                class="flex justify-between items-center mt-2">
                                <p class="text-gray-500 italic line-through" style="font-size: 15px;">
                                    {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                                </p>
                                <p class="font-bold" style="color: rgb(228, 68, 52); font-size: 15px;">
                                    {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
                                </p>
                            </div>
                            <div v-else class="flex justify-end items-center mt-2">
                                <p class="font-bold" style="color: rgb(228, 68, 52); font-size: 15px;">{{
                                    product.priceSell.toLocaleString('vi-VN') }} Vnđ</p>
                            </div>
                        </div>
                    </router-link>
                    <div v-if="!isInCart(product)" class="w-full flex justify-center items-center mt-4">
                        <button @click="addToCart(product)" class="btn-add-to-cart" :disabled="product.quantityInStock === 0"
                            :class="{'disabled': product.quantityInStock === 0}">
                            <font-awesome-icon :icon="['fas', 'cart-shopping']" class="pr-2" />Thêm vào giỏ hàng
                        </button>
                    </div>
                    <div v-else class="w-full flex justify-center items-center mt-4">
                        <div class="quantity-selector">
                            <button @click="decreaseQuantity(product)"
                                class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                :disabled="getQuantity(product) === 1">
                                <font-awesome-icon :icon="['fas', 'minus']" />
                            </button>
                            <input type="text" inputmode="numeric" :value="getProductInCart(product)?.quantity"
                                @input="(e) => { tempQuantity = parseInt((e.target as HTMLInputElement)?.value, 10) || 1 }"
                                @blur="validateQuantity(product, tempQuantity)"
                                class="input-quantity [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
                                :min="1" :max="999">
                            <button @click="increaseQuantity(product)"
                                class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                :disabled="getQuantity(product) === 999">
                                <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="suggestedProducts.length > 6" class="flex-shrink-0 w-32 flex items-center justify-center">
                    <button @click="viewAllSuggetedProducts" class="btn-view-all-product rounded-full p-2">
                        Xem tất cả →
                    </button>
                </div>
            </div>
            <button v-if="showRightArrowSuggest && suggestedProducts.length > 6" @click="scrollRight(suggestProductContainer)"
                class="btn-scroll absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full">
                →
            </button>
        </div>

        <div class="flex-1">
            <h2 class="text-xl text-black font-bold p-2">Danh sách sản phẩm</h2>
            <div class="sort-filter">
                <label for="sort">Sắp xếp:</label>
                <select id="sort" v-model="selectedSort" @change="handleSortChange($event)" class="w-1/4">
                    <option value="" disabled selected hidden>Sắp xếp theo tiêu chí</option>
                    <option value="ratingLow">Theo đánh giá thấp nhất</option>
                    <option value="ratingHigh">Theo đánh giá cao nhất</option>
                    <option value="alphabet">Theo ký tự ABC</option>
                    <option value="priceLow">Theo giá thấp nhất</option>
                    <option value="priceHigh">Theo giá cao nhất</option>
                </select>
            </div>

            <div class="product-list sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                <div v-if="products.length > 0" class="product-item" v-for="product in products" :key="product.id">
                    <router-link :to="{ name: 'ProductDetail', params: { productName: product.name } }"
                        @click.prevent="goToProductDetail(product.id)">
                        <div class="w-full h-3/5">
                            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                        </div>

                        <div class="product-info">
                            <h5 class="font-normal text-lg text-black truncate">{{ product.name }}</h5>

                            <div class="stock-info mt-2 mb-2">
                                <span v-if="product.quantityInStock === 0" class="text-gray-500">Hết hàng</span>
                                <!-- <span v-else-if="product.quantityInStock <= 10" class="font-bold"
                                    style="color: rgb(228, 68, 52);">
                                    Còn lại {{ product.quantityInStock }} sản phẩm
                                </span> -->
                                <span v-else class="text-green-500">Sẵn hàng</span>
                            </div>

                            <div v-if="product.discountSell && product.priceSell !== product.discountSell"
                                class="flex justify-between items-center mt-2">
                                <p class="text-gray-500 italic line-through" style="font-size: 15px;">
                                    {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                                </p>
                                <p class="font-bold" style="color: rgb(228, 68, 52); font-size: 15px;">
                                    {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
                                </p>
                            </div>
                            <div v-else class="flex justify-end items-center mt-2">
                                <p class="font-bold" style="color: rgb(228, 68, 52); font-size: 15px;">{{
                                    product.priceSell.toLocaleString('vi-VN') }} Vnđ</p>
                            </div>
                        </div>
                    </router-link>
                    <div v-if="!isInCart(product)" class="w-full flex justify-center items-center mt-4">
                        <button @click="addToCart(product)" class="btn-add-to-cart" :disabled="product.quantityInStock === 0"
                            :class="{'disabled': product.quantityInStock === 0}">
                            <font-awesome-icon :icon="['fas', 'cart-shopping']" class="pr-2" />Thêm vào giỏ hàng
                        </button>
                    </div>
                    <div v-else class="w-full flex justify-center items-center mt-4">
                        <div class="quantity-selector">
                            <button @click="decreaseQuantity(product)"
                                class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                :disabled="getQuantity(product) === 1">
                                <font-awesome-icon :icon="['fas', 'minus']" />
                            </button>
                            <input type="text" inputmode="numeric" :value="getProductInCart(product)?.quantity"
                                @input="(e) => { tempQuantity = parseInt((e.target as HTMLInputElement)?.value, 10) || 1 }"
                                @blur="validateQuantity(product, tempQuantity)"
                                class="input-quantity [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
                                :min="1" :max="999">
                            <button @click="increaseQuantity(product)"
                                class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                :disabled="getQuantity(product) === 999">
                                <font-awesome-icon :icon="['fas', 'plus']" />
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="no-products flex flex-col justify-center items-center">
                    <div class="icon-container flex justify-center items-center">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="text-gray-500 text-4xl" />
                    </div>
                    <p class="text-gray-700 text-lg mt-4">Không có sản phẩm!</p>
                </div>
            </div>

            <div v-if="products.length > 0" class="flex w-full h-10 justify-center items-center p-5">
                <Pagination v-model="currentPage" :totalPages="totalPages"/> 
                <!-- @update-page="updatePage" -->
            </div>
        </div>
        <ProductOutOfStockModal :product="selectedProduct" :visible="isModalVisible" @close="isModalVisible = false" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'content_home',
    components: {
        bread_crumb,
        Pagination,
        ProductOutOfStockModal
    },
});
</script>

<script setup lang="ts">
import { ref, Ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import bread_crumb from '/src/components/general/breadCrumb/index.vue';
import Pagination from '/src/components/general/pagination/index.vue';
import ProductOutOfStockModal from '/src/components/modal/modalOutOfStock/index.vue';

import { useCartStore } from '../../../stores/cartStore/cartStore';
import { useFilterStore } from '../../../stores/filterStore/filterStore';
import { useActionStore } from '../../../stores/customerStore/customerStore';
import { Product, fetchFindAllForCustomer, fetchAllPreferentialProducts, fetchAllSuggetedProducts } from '../../../api/customer/apiProduct';

type ProductInCart = {
    productId: string;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    discountSell: number;
    quantityInStock: number;
    quantity: number;
    selected: boolean;
};

const router = useRouter();

const cartStore = useCartStore();
const filterStore = useFilterStore();
const actionStore = useActionStore();

const currentPage = computed(() => filterStore.currentPage);
const keySearch = computed(() => filterStore.keySearch);
const type = computed(() => filterStore.type);
const sortType = computed(() => filterStore.sortType);
const keySort = computed(() => filterStore.keySort);
const selectedSort = computed(() => {
    if (filterStore.keySort === 'rating') {
        return filterStore.sortType === 'ASC' ? 'ratingLow' : 'ratingHigh';
    }
    if (filterStore.keySort === 'price') {
        return filterStore.sortType === 'ASC' ? 'priceLow' : 'priceHigh';
    }
    if (filterStore.keySort === 'alphabet') {
        return 'alphabet';
    }
    return '';
});

const totalPages = ref<number>();
const products = ref<Product[]>([]);
const preferentialProducts = ref<Product[]>([]);
const suggestedProducts = ref<Product[]>([]);

const vouchers = ref([
    {
        id: 1,
        value: 50000,
        conditionsApply: 200000,
        expireDate: '30/09/2024',
        code: 'VOUCHER50K'
    },
    {
        id: 2,
        value: 100000,
        conditionsApply: 500000,
        expireDate: '15/10/2024',
        code: 'VOUCHER100K'
    },
    {
        id: 3,
        value: 200000,
        conditionsApply: 1000000,
        expireDate: '01/11/2024',
        code: 'VOUCHER200K'
    },
    {
        id: 1,
        value: 50000,
        conditionsApply: 200000,
        expireDate: '30/09/2024',
        code: 'VOUCHER50K'
    },
    {
        id: 2,
        value: 100000,
        conditionsApply: 500000,
        expireDate: '15/10/2024',
        code: 'VOUCHER100K'
    },
    {
        id: 3,
        value: 200000,
        conditionsApply: 1000000,
        expireDate: '01/11/2024',
        code: 'VOUCHER200K'
    },
    {
        id: 3,
        value: 200000,
        conditionsApply: 1000000,
        expireDate: '01/11/2024',
        code: 'VOUCHER200K'
    },
    {
        id: 3,
        value: 200000,
        conditionsApply: 1000000,
        expireDate: '01/11/2024',
        code: 'VOUCHER200K'
    },
    {
        id: 3,
        value: 200000,
        conditionsApply: 1000000,
        expireDate: '01/11/2024',
        code: 'VOUCHER200K'
    },
]);

onMounted(async () => {
    filterStore.loadFilterFromLocalStorage();
    handleScroll(preferentialProductContainer.value, showLeftArrowPreferential, showRightArrowPreferential);
    handleScroll(suggestProductContainer.value, showLeftArrowSuggest, showRightArrowSuggest);
    fetchProducts();
    viewAllPreferentialProducts();
    viewAllSuggetedProducts();
});

watch([type, keySearch, sortType, keySort, currentPage], () => {
    updateFilterRouter(type.value, keySearch.value, keySort.value, sortType.value, currentPage.value);
    fetchProducts();
});

const isInCart = computed(() => {
    return (product: Product) => {
        return cartStore.productInCartResponses.some(p => p.productId === product.id);
    };
});

const tempQuantity = ref<number>(1);
const isModalVisible = ref(false);
const selectedProduct = ref<ProductInCart | null>(null);

// const voucherContainer = ref<HTMLElement | null>(null);
// const showLeftArrow = ref(false);
// const showRightArrow = ref(true);
const preferentialProductContainer = ref<HTMLElement | null>(null);
const showLeftArrowPreferential = ref<boolean>(false);
const showRightArrowPreferential = ref<boolean>(true);

const suggestProductContainer = ref<HTMLElement | null>(null);
const showLeftArrowSuggest = ref(false);
const showRightArrowSuggest = ref(true);

const fetchProducts = async () => {
    const response = (await fetchFindAllForCustomer()).data;
    products.value = response.productResponses;
    totalPages.value = response.totalPages;
};
const viewAllPreferentialProducts = async () => {
    const response = (await fetchAllPreferentialProducts()).data;
    preferentialProducts.value = response.productResponses;
};
const viewAllSuggetedProducts = async () => {
    const response = (await fetchAllSuggetedProducts()).data;
    suggestedProducts.value = response.productResponses;
};

const onScrollPreferential = () => {
    handleScroll(preferentialProductContainer.value, showLeftArrowPreferential, showRightArrowPreferential);
};

const onScrollSuggest = () => {
    handleScroll(suggestProductContainer.value, showLeftArrowSuggest, showRightArrowSuggest);
};

const scrollLeft = (container: HTMLElement | null) => {
    if (container) {
        container.scrollBy({
            left: -300,
            behavior: 'smooth',
        });
    }
};
const scrollRight = (container: HTMLElement | null) => {
    if (container) {
        container.scrollBy({
            left: 300,
            behavior: 'smooth',
        });
    }
};
const handleScroll = (container: HTMLElement | null, showLeftArrow: Ref<boolean>, showRightArrow: Ref<boolean>) => {
    if (container) {
        showLeftArrow.value = container.scrollLeft > 0;
        showRightArrow.value = container.scrollLeft + container.clientWidth < container.scrollWidth;

        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 64) {
            showRightArrow.value = false;
        }
    }
};

const addToCart = async (product: Product) => {
    const existingProduct = cartStore.productInCartResponses.find(
        (p) => p.productId === product.id
    );
    let newQuantity;
    if (existingProduct) {
        newQuantity = existingProduct.quantity + 1;
    } else {
        newQuantity = 1;
    }
    const response = await cartStore.updateProductInCart(product.id, newQuantity);
};

const getQuantity = (product: Product) => {
    const cartProduct = cartStore.productInCartResponses.find(p => p.productId === product.id);
    return cartProduct ? cartProduct.quantity : 1;
};
const getProductInCart = (product: Product) => {
    return cartStore.productInCartResponses.find(p => p.productId === product.id);
};

const decreaseQuantity = async (product: Product) => {
    const cartProduct = cartStore.productInCartResponses.find(p => p.productId === product.id);
    if (cartProduct && cartProduct.quantity > 1) {
        cartProduct.quantity--;
        const response = await cartStore.updateProductInCart(cartProduct.productId, cartProduct.quantity);
    }
};
const increaseQuantity = async (product: Product) => {
    const cartProduct = cartStore.productInCartResponses.find(p => p.productId === product.id);
    if (cartProduct) {
        cartProduct.quantity++;
        try {
            const response = await cartStore.updateProductInCart(cartProduct.productId, cartProduct.quantity);
        } catch (error: any) {
            if (cartProduct.quantity > product.quantityInStock) {
                selectedProduct.value = cartProduct;
                isModalVisible.value = true;
                cartProduct.quantity = product.quantityInStock;
            }
        }
    }
};
const validateQuantity = async (product: Product, tempQuantity: number) => {
    const cartProduct = cartStore.productInCartResponses.find(p => p.productId === product.id);
    if (cartProduct) {
        if (tempQuantity < 1) {
            tempQuantity = 1;
        } else if (tempQuantity > 999) {
            tempQuantity = 999;
        }

        try {
            const response = await cartStore.updateProductInCart(cartProduct.productId, tempQuantity);
            console.log(JSON.stringify(cartProduct, null, 2));
        } catch (error: any) {
            if (cartProduct.quantity > product.quantityInStock) {
                selectedProduct.value = cartProduct;
                isModalVisible.value = true;
                cartProduct.quantity = product.quantityInStock;
            }
        }
    }
};

const handleSortChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    switch (selectedValue) {
        case 'ratingLow':
            filterStore.sortType = 'ASC';
            filterStore.keySort = 'rating';
            break;
        case 'ratingHigh':
            filterStore.sortType = 'DESC';
            filterStore.keySort = 'rating';
            break;
        case 'alphabet':
            filterStore.sortType = 'ASC';
            filterStore.keySort = 'name';
            break;
        case 'priceLow':
            filterStore.sortType = 'ASC';
            filterStore.keySort = 'price';
            break;
        case 'priceHigh':
            filterStore.sortType = 'DESC';
            filterStore.keySort = 'price';
            break;
        default:
            filterStore.sortType = '';
            filterStore.keySort = '';
    }
};

const updateFilterRouter = (type: string, keySearch: string | null, keySort: string | null, sortType: string | null, page: number) => {

    const query: { [key: string]: any } = {};
    if (type) {
        query.type = filterStore.type;
    }
    if (keySearch) {
        query.keySearch = keySearch;
    }
    if (keySort) {
        query.keySort = keySort;
    }
    if (sortType) {
        query.sortType = sortType;
    }
    if (page) {
        query.page = filterStore.currentPage;
    }
    filterStore.saveFilterToLocalStorage();
    router.push({ name: 'Products', query });
};

const goToProductDetail = (productId: string) => {
    localStorage.setItem('productId', productId);
};
</script>

<style scoped>
@import 'index.css';
</style>