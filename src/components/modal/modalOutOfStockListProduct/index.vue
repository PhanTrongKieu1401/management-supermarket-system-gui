<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" @click.self="close">
        <div class="bg-white p-6 rounded-lg shadow-lg w-[450px]">
            <h2 class="text-xl mb-4">Cảnh báo!</h2>
            <p>Các mặt hàng sau đã tạm hết hàng:</p>

            <div class="mt-4 space-y-4">
                <div v-for="product in products" :key="product.productId" class="flex items-center">
                    <img :src="product.image" alt="Product Image" class="w-16 h-auto mr-4 object-cover" />
                    <div class="flex-1">
                        <div class="pb-1">
                            {{ product.name }}
                        </div>
                    </div>
                    <div class="w-1/3">
                        <div class="font-bold pb-1" style="color: rgb(228, 68, 52);">
                            Thiếu hàng
                        </div>
                        <div class="">
                            SL còn: {{ product.quantityInStock }}
                        </div>
                    </div>
                </div>
            </div>

            <button @click="close" class="btn-close-modal-out-of-stock mt-6 py-2 px-4 rounded-lg w-full">
                Đóng
            </button>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent ({
    name: 'ProductsOutOfStockModal',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

type Product = {
    productId: string;
    name: string;
    image: string;
    priceSell: number;
    discountSell: number;
    priceImport: number;
    quantity: number;
    amount: number;
    quantityInStock: number;
};

const props = defineProps<{
  products: Product[];
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};
</script>

<style scoped>
@import "index.css";
</style>