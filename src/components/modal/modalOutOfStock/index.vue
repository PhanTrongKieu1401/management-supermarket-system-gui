<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" @click.self="viewCart">
        <div class="bg-white p-6 rounded-lg shadow-lg w-[450px]">
            <h2 class="text-xl mb-4">Thành thật xin lỗi!</h2>
            <p>Mặt hàng <span style="color: rgb(228, 68, 52);">{{ product.name }}</span> đã tạm hết hàng.</p>

            <div class="flex items-center mt-4">
                <div class="flex items-center">
                    <img :src="product.image" alt="Product Image" class="w-16 h-auto mr-4 object-cover" />
                    <div>
                        <div class="pb-1">
                            {{ product.name }}
                        </div>
                        <div class="line-through pb-1" style="color: rgb(124, 119, 119);">
                            {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                        </div>
                        <div class="">
                            {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
                        </div>
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

            <button @click="viewCart" class="btn-close-modal-out-of-stock mt-6 py-2 px-4 rounded-lg w-full">
                Xem lại giỏ hàng
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent ({
    name: 'ProductOutOfStockModal',
})
</script>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

type Product = {
    productId: number;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    discountSell: number;
    quantityInStock: number;
    quantity: number;
    selected: boolean;
};

const props = defineProps<{
  product: Product;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const viewCart = () => {
  emit('close');
};
</script>

<style scoped>
@import "index.css";
</style>