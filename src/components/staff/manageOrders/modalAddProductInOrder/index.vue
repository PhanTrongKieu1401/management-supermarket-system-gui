<template>
    <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">

            <h2 class="text-center font-bold text-lg mb-4">Thêm sản phẩm vào đơn hàng</h2>

            <div class="mb-4">
                <label for="productCode" class="block text-sm font-medium">Mã sản phẩm:</label>
                <div class="flex mt-2">
                    <input v-model="productCode" type="text" id="productCode" placeholder="Nhập mã sản phẩm"
                        class="inp-search border rounded-l px-3 py-2 w-2/3" />
                    <button @click="checkProduct" class="bg-red-500 text-white px-4 py-2 rounded-r w-1/3">
                        Kiểm tra
                    </button>
                </div>
            </div>

            <div class="mb-4">
                <div>
                    <p class="font-medium">Tên sản phẩm: {{ productInfo.name }}</p>
                </div>
                <div>
                    <p class="font-medium">Giá bán: {{ productInfo.priceSell }}</p>
                </div>
                <div v-if="productInfo.discountSell && productInfo.discountSell > 0">
                    <p class="font-medium">Giá ưu đãi: {{ productInfo.discountSell }}</p>
                </div>
                <div>
                    <p class="font-medium">Số lượng tồn kho: {{ productInfo.quantityInStock }}</p>
                </div>
                <div>
                    <p class="font-medium">Số lượng đang đặt: {{ productInfo.quantityInOrdering }}</p>
                </div>
                
            </div>

            <div class="mb-4">
                <label for="quantity" class="block text-sm font-medium">Số lượng mua:</label>
                <input v-model="quantity" type="number" id="quantity" min="1" :max="productInfo ? ((productInfo.quantityInStock || 0) - (productInfo.quantityInOrdering || 0)) : 0"
                    :disabled="!productInfo.quantityInStock" :class="{'disabled': !productInfo.quantityInStock}" placeholder="Nhập số lượng" class="border rounded px-3 py-2 w-full mt-2 text-right" />
                <p v-if="quantity > ((productInfo.quantityInStock || 0) - (productInfo.quantityInOrdering || 0))" class="text-red-500 text-sm">
                    Số lượng mua không hợp lệ!
                </p>
            </div>

            <div class="flex justify-end">
                <button @click="addProduct" class="bg-red-500 text-white px-4 py-2 rounded mr-1">
                    Thêm
                </button>
                <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">
                    Hủy
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AddProductInOrderModal'
});
</script>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

import { ProductCheckToOrder, fetchCheckProductToOrder } from '../../../../api/staff/apiOrder';

const emit = defineEmits(['close', 'apply-product']);

const prop = defineProps<{
    visible: boolean;
}>();

const productCode = ref<string>('');
const quantity = ref<number>(0);
const productInfo = ref<ProductCheckToOrder>({
    productId: '',
    name: '',
    image: '',
    priceSell: null,
    discountSell: null,
    priceImport: null,
    quantityInStock: null,
    quantityInOrdering: null,
});

const checkProduct = async () => {
  try {
    const response = await fetchCheckProductToOrder(productCode.value);
    if(response) {
        productInfo.value = response.data;
    } else {
        alert('Mã sản phẩm không tồn tại.');
    }
  } catch (error: any) {
    alert(error.message);
  }
}

const closeModal = () => {
  emit('close');
};

function addProduct() {
  if (!productInfo.value) {
    alert('Vui lòng kiểm tra sản phẩm trước khi thêm.');
    return;
  }

  if (quantity.value < 1 || (productInfo.value && productInfo.value.quantityInStock && 
     productInfo.value.quantityInOrdering && 
     quantity.value > (productInfo.value.quantityInStock - productInfo.value.quantityInOrdering))) {
    alert('Số lượng mua không hợp lệ.');
    return;
  }

  alert(`Thêm ${quantity.value} sản phẩm ${productInfo.value.name} vào đơn hàng thành công.`);

  emit('apply-product', {
    productId: productInfo.value.productId,
    name: productInfo.value.name,
    image: productInfo.value.image,
    priceSell: productInfo.value.priceSell,
    discountSell: productInfo.value.discountSell || 0,
    priceImport: productInfo.value.priceImport,
    quantity: quantity.value,
    amount: productInfo.value.discountSell! > 0 
          ? productInfo.value.discountSell! * quantity.value 
          : productInfo.value.priceSell! * quantity.value,
  });
}
</script>

<style scoped>
@import "index.css";
</style>