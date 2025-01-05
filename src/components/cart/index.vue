<template>
    <div class="container mx-auto my-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
                <li class="breadcrumb-item active"><router-link to="#"></router-link>Giỏ hàng</li>
            </ol>
        </nav>

        <div v-if="products && products.length === 0"
            class="h-80 flex flex-col justify-center items-center bg-[rgb(249,241,241)] p-6 rounded-lg">
            <font-awesome-icon :icon="['fas', 'cart-plus']" class="text-8xl" style="color: rgb(228, 68, 52);" />
            <p class="mt-4">Giỏ hàng chưa có sản phẩm!</p>
            <router-link to="/" class="btn-back-to-home mt-4 inline-block py-2 px-4">
                Quay lại trang chủ
            </router-link>
        </div>

        <div v-else-if="products" class="flex">
            <div class="w-3/4 pr-6">
                <table class="tbl-products-cart">
                    <thead>
                        <tr>
                            <th class="p-4" style="width: 15%; border-right: 1px solid rgb(255, 255, 255);">
                                <input class="checkbox select-all mr-2" type="checkbox" :checked="selectAllChecked" @change="toggleSelectAll">
                                <label for="select-all" class="checkbox-label">Tất cả ({{ products.length }})</label>
                            </th>
                            <th class="p-4" style="width: 28%; border-right: 1px solid rgb(255, 255, 255);">Sản phẩm
                            </th>
                            <th class="p-4" style="width: 15%; border-right: 1px solid rgb(255, 255, 255);">Đơn giá
                                (Vnđ)</th>
                            <th class="p-4" style="width: 17%; border-right: 1px solid rgb(255, 255, 255);">Số lượng
                            </th>
                            <th class="p-4" style="width: 18%; border-right: 1px solid rgb(255, 255, 255);">Thành tiền
                                (Vnđ)</th>
                            <th class="p-4" style="width: 7%; "></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products" :key="product.productId" class="">
                            <td class="p-4 text-center">
                                <input class="checkbox" type="checkbox" v-model="product.selected" @change="(event: Event) => toggleSelect(event, product)">
                            </td>
                            <td class="p-4 items-center">
                                <div style="display: flex; align-items: center;">
                                    <img :src="product.image" alt="Product" class="w-16 h-auto mr-4 object-cover">
                                    <div>{{ product.name }}</div>
                                </div>
                            </td>
                            <td class="p-4 text-right">
                                <div v-if="product.discountSell && product.priceSell !== product.discountSell" class="flex flex-col items-end text-right">
                                    <span class="text-gray-500 italic line-through mb-1">
                                        {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                    <span class="font-bold" style="color: rgb(228, 68, 52); font-size: 18px;">
                                        {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                </div>
                                <div v-else class="flex justify-end items-center">
                                    <span class="font-bold" style="color: rgb(228, 68, 52); font-size: 18px;">{{ product.priceSell.toLocaleString('vi-VN') }} Vnđ</span>
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <div class="quantity-selector">
                                    <button @click="decreaseQuantity(product)"
                                        class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                        :disabled="product.quantity === 1">
                                        <font-awesome-icon :icon="['fas', 'minus']" />
                                    </button>

                                    <input type="text" inputmode="numeric" v-model="product.quantity"
                                        @blur="validateQuantity(product)"
                                        class="input-quantity [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
                                        :min="1" :max="999">

                                    <button @click="increaseQuantity(product)"
                                        class="btn-quantity-selector disabled:cursor-not-allowed disabled:text-gray-300"
                                        :disabled="product.quantity === 999">
                                        <font-awesome-icon :icon="['fas', 'plus']" />
                                    </button>
                                </div>
                            </td>
                            <td class="p-4 text-right" style="color: rgb(228,68,52);">
                                <div v-if="product.discountSell && product.priceSell !== product.discountSell" class="flex flex-col items-end text-right">
                                    <span class="text-gray-500 italic line-through mb-1">
                                        {{ (product.priceSell * product.quantity).toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                    <span class="font-bold" style="color: rgb(228, 68, 52); font-size: 18px;">
                                        {{ (product.discountSell * product.quantity).toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                </div>
                                <div v-else class="flex justify-end items-center">
                                    <span class="font-bold" style="color: rgb(228, 68, 52); font-size: 18px;">
                                        {{ (product.priceSell * product.quantity).toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                </div>
                            </td>
                            <td class="p-4 text-center justify-center">
                                <button @click="showPopConfirm(product.productId)" class="btn-delete-product">
                                    <font-awesome-icon :icon="['far', 'trash-can']" />
                                </button>
                                <PopConfirmDeleteProductInCart
                                    :title="'Bạn không muốn mua sản phẩm này?'"
                                    :visible="visibleProductId === product.productId"
                                    @confirm="() => removeProduct(product)"
                                    @cancel="cancelDelete"
                                    :placement="'top'"
                                    >
                                </PopConfirmDeleteProductInCart>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="w-1/4 h-2/5">
                <!-- <div class="mb-4 p-4 rounded-lg" style="background-color: rgb(243 244 246);">
                    <div class="flex flex-row justify-between mb-2 p-2 bg-white text-[rgb(228,68,52)] rounded-lg opacity-90 pointer-events-none" style="border: 1px solid rgb(228,68,52);">
                        <span>{{ selectedVoucher?.voucherCode || 'Mã voucher' }}</span>
                    </div>
                    <button @click="openModalSelectVoucher" class="w-full mt-2 py-2 px-4 bg-white text-[rgb(228,68,52)] rounded-lg hover:bg-[rgb(228,68,52)] hover:text-white" style="border: 1px solid rgb(228,68,52);">
                        Áp dụng voucher
                    </button>
                </div> -->
                <div class="mb-4 p-4 rounded-lg text-sm" style="background-color: rgb(243 244 246);">
                    <div class="flex justify-between mb-2">
                        <span>Tổng tiền:</span>
                        <span>{{ amountBeforeReduced.toLocaleString('vi-VN') }} Vnđ</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Giá giảm trực tiếp:</span>
                        <span v-if="totalPriceReduced > 0">-{{ totalPriceReduced.toLocaleString('vi-VN') }} Vnđ</span>
                        <span v-else>0 Vnđ</span>
                    </div>
                    <!-- <div class="flex justify-between mb-2">
                        <span>Giảm voucher:</span>
                        <span v-if="selectedVoucher">-{{ selectedVoucher.value.toLocaleString('vi-VN') }} Vnđ</span>
                        <span v-else>0 Vnđ</span>
                    </div> -->
                    <div class="flex justify-between">
                        <span class="flex font-bold items-end">Thành tiền:</span>
                        <span class="flex flex-col items-end">
                            <span v-if="amountBeforeReduced !== totalAmountPayable" class="line-through mb-2" style="color: rgb(124, 119, 119);">{{ amountBeforeReduced.toLocaleString('vi-VN') }} Vnđ</span>
                            <span class="text-base font-bold" style="color: rgb(228,68,52);">{{ totalAmountPayable < 0 ? 0 : totalAmountPayable.toLocaleString('vi-VN') }} Vnđ</span>
                        </span>
                    </div>
                </div>
                <button @click="handlePlaceOrder" class="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Đặt hàng
                </button>
            </div>
        </div>

        <ProductOutOfStockModal :product="selectedProduct" :visible="isModalVisible" @close="isModalVisible = false" />
        <ProductsOutOfStockModal :products="outOfStockProducts" :visible="isModalOutOfStockVisible" @close="isModalOutOfStockVisible = false" />
        <SelectVoucherModal :visible="isModalSelectVoucher" @close="isModalSelectVoucher = false" @apply-voucher="handleSelectedVoucher" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Cart',
    components: {
        ProductOutOfStockModal,
        ProductsOutOfStockModal,
        PopConfirmDeleteProductInCart,
        SelectVoucherModal,
    }
});
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ProductOutOfStockModal from '/src/components/modal/modalOutOfStock/index.vue';
import ProductsOutOfStockModal from '/src/components/modal/modalOutOfStockListProduct/index.vue';
import PopConfirmDeleteProductInCart from '/src/components/pop/popConfirmDeleteProductInCart/index.vue';
import SelectVoucherModal from '/src/components/modal/modalSelectVoucher/index.vue';

import { useCartStore } from '../../stores/cartStore/cartStore';
import { useReplaceOrderStore } from '../../stores/orderStore/replaceOrderStore';

import { checkProductQuantity } from '../../api/customer/apiProduct';
import { fetchUpdateCartForCustomer, fetchRemoveProductInCart } from '../../api/customer/apiCart';

type Product = {
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

type Voucher = {
    voucherId: string;
    voucherCode: string;
    value: number;
    conditionsApply: number;
    expiryDate: string;
}

type OrderTemporary = {
    totalNumberProducts: number;
    amountBeforeReduced: number;
    totalPriceReduced: number;
    totalVoucherReduced: number;
    totalAmountPayable: number;
    products: Product[];
    voucher: Voucher | null;
}

type ProductOutOfStock = {
    productId: string;
    name: string;
    image: string;
    priceSell: number;
    discountSell: number;
    priceImport: number;
    quantity: number;
    amount: number;
    quantityInStock: number;
}

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const replaceOrderStore = useReplaceOrderStore();

const selectAllChecked = ref(false);
const isModalVisible = ref(false);
const isModalSelectVoucher = ref(false);
const visibleProductId = ref<String | null>(null);
const selectedProduct = ref<Product | null>(null);
const selectedVoucher = ref<Voucher | null>(null);

const amountBeforeReduced = ref<number | number>(0);
const totalPriceReduced = ref<number | number>(0);
const totalVoucherReduced = ref<number | number>(0);
const totalAmountPayable = ref<number | number>(0);

const isModalOutOfStockVisible = ref<boolean>(false);
const outOfStockProducts = ref<ProductOutOfStock[]>([]);

const products = computed(() => cartStore.productInCartResponses);

onMounted(async () => {
    await handleProductQuantityCheck();
});

watch(() => route.fullPath, async () => {
    await handleProductQuantityCheck();
});

const handleProductQuantityCheck = async () => {
    const response = await checkProductQuantity(products.value);
    if (response) {
        outOfStockProducts.value = mapProductCheckToOutOfStock(response.data);
        if (outOfStockProducts.value.length > 0) {
            isModalOutOfStockVisible.value = true;

            const updateCartPayload = outOfStockProducts.value.map(product => ({
                productId: product.productId,
                quantity: product.quantity,
            }));

            const response1 = await fetchUpdateCartForCustomer(updateCartPayload);
            if (response1) {
                cartStore.removeListProductInCart(updateCartPayload);
            }
        }
    }
};

watch(products, (newProducts) => {
}, { deep: true });
watch(selectedVoucher, () => {
    calculatePrice.value;
});

const toggleSelectAll = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked;
    products.value.forEach(product => {
        product.selected = checked;
    });
    selectAllChecked.value = checked;
    calculatePrice.value;
};

const toggleSelect = (event: Event, product: Product) => {
    const checked = (event.target as HTMLInputElement).checked;
    product.selected = checked;

    const allSelected = products.value.every(p => p.selected);
    selectAllChecked.value = allSelected;

    calculatePrice.value;
};

const decreaseQuantity = async (product: Product) => {
    if (product.quantity > 1){
        product.quantity--;
        const response = await cartStore.updateProductInCart(product.productId, product.quantity);
        if (product.selected) {
            calculatePrice.value;
        }
    } 
};

const increaseQuantity = async (product: Product) => {
    product.quantity++;
    try {
        const response = await cartStore.updateProductInCart(product.productId, product.quantity);
        if (product.selected) {
            calculatePrice.value;
        }
    } catch(error: any) {
        if (product.quantity > product.quantityInStock) {
            selectedProduct.value = product;
            isModalVisible.value = true;
            product.quantity = product.quantityInStock;
        } 
        if (product.selected) {
            calculatePrice.value;
        }
    }
};

const validateQuantity = async (product: Product) => {
    if (product.quantity < 1) {
        product.quantity = 1;
    } else if (product.quantity > 999) {
        product.quantity = 999;
    } 

    try {
        console.log(product.quantity)
        const response = await cartStore.updateProductInCart(product.productId, product.quantity);
        if (response && product.selected) {
            calculatePrice.value;
        }
    } catch(error: any) {
        if (product.quantity > product.quantityInStock) {
            selectedProduct.value = product;
            isModalVisible.value = true;
            product.quantity = product.quantityInStock;
        } 
        if (product.selected) {
            calculatePrice.value;
        }
    }
};

const showPopConfirm = (productId: string) => {
    visibleProductId.value = productId;
};

const removeProduct = async (product: Product) => {

    const response = await fetchRemoveProductInCart(product.productId);
    if(response) {
        cartStore.removeProductInCart(product);
        if(product.selected){
            calculatePrice.value;
        }    
    }
    visibleProductId.value = null;
};

const cancelDelete = () => {
    visibleProductId.value = null;
};

const openModalSelectVoucher = () => {
    isModalSelectVoucher.value = true;
};
const handleSelectedVoucher = (voucher: Voucher) => { 
    selectedVoucher.value = voucher;
    isModalSelectVoucher.value = false;
}

const handlePlaceOrder = () => {
    const selectedProducts = ref<Product[]>([]);
    selectedProducts.value = products.value.filter(product => product.selected);

    if (!selectedProducts.value.length) {
        alert('Bạn cần chọn ít nhất một sản phẩm.');
        return;
    }

    const order: OrderTemporary = {
        totalNumberProducts: selectedProducts.value.reduce((sum, product) => sum + product.quantity, 0),
        amountBeforeReduced: amountBeforeReduced.value,
        totalPriceReduced: totalPriceReduced.value,
        totalVoucherReduced: totalVoucherReduced.value,
        totalAmountPayable: totalAmountPayable.value,
        products: selectedProducts.value,
        voucher: selectedVoucher?.value || null,
    }

    console.log(replaceOrderStore);
    replaceOrderStore.createOrder(order);
    router.push({name: 'Order'});
}

const calculatePrice = computed(() => {
    amountBeforeReduced.value = products.value.filter(product => product.selected).reduce((sum, product) => sum + (product.priceSell * product.quantity), 0);
    totalPriceReduced.value = products.value.filter(product => product.selected).reduce((sum,product) => {
        if(product.discountSell > 0) {
            return sum + (product.priceSell - product.discountSell) * product.quantity;
        }
        return sum;
    }, 0);
    if(selectedVoucher.value)
        totalVoucherReduced.value = selectedVoucher.value.value;
    totalAmountPayable.value = amountBeforeReduced.value - totalPriceReduced.value - totalVoucherReduced.value;
});

function mapProductCheckToOutOfStock(
  products: Product[]
): ProductOutOfStock[] {
  return products.map((product) => ({
    productId: product.productId,
    name: product.name,
    image: product.image,
    priceSell: product.priceSell,
    discountSell: product.discountSell ?? 0,
    priceImport: 0, 
    quantity: product.quantity ?? 0,
    amount: 0,
    quantityInStock: product.quantityInStock ?? 0,
  }));
}
</script>

<style scoped>
@import "index.css";
</style>