<template>
  <div class="container">
    <div class="header">
      <h1>Thanh toán đơn hàng</h1>
    </div>

    <div class="customer-info"> 
      <div class="check-customer w-1/3">
        <input class="flex-grow" v-model="customerPhone" type="text" placeholder="Nhập số điện thoại khách hàng" />
        <button class="btn-check ml-1" @click="checkCustomer">Kiểm tra</button>
      </div>
      <div class="w-2/3">
        <span class="w-[20%] ml-3">Mã khách hàng: </span>
        <span class="w-[30%]" v-if="customer">{{ customer?.id }}</span>
        <span class="w-[20%] ml-3">Tên khách hàng: </span>
        <span class="w-[30%]" v-if="customer">{{ normalizeName(customer?.firstName, customer?.middleName, customer?.lastName) }}</span>
      </div>
    </div>

    <div class="order-details">
      <div class="order-table">
        <h1>Danh sách sản phẩm</h1>
        <table>
          <thead>
            <tr>
              <th style="width: 7%;">STT</th>
              <th style="width: 20%;">Mã sản phẩm</th>
              <th style="width: 20%;">Tên sản phẩm</th>
              <th style="width: 20%;">Đơn Giá</th>
              <th style="width: 13%;">Số Lượng</th>
              <th style="width: 20%;">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="product.productId"  @click="handleEditProduct(product)">
              <td style="width: 7%;">{{ index + 1 }}</td>
              <td style="width: 20%;">{{ product.productId }}</td>
              <td style="width: 20%;">{{ product.name }}</td>
              <td style="width: 20%; text-align: right;">
                <span v-if="product.discountSell">
                  <span class="text-gray-500" style="text-decoration: line-through; margin-right: 5px;">
                    {{ product.priceSell?.toLocaleString('vi-VN') }}
                  </span>
                  <span class="text-black">
                    {{ product.discountSell?.toLocaleString('vi-VN') }}
                  </span>
                </span>
                <span v-else class="text-black">
                  {{ product.priceSell?.toLocaleString('vi-VN') }}
                </span>
              </td>
              <td style="width: 13%; text-align: right;">{{ product.quantity }}</td>
              <td style="width: 20%; text-align: right;">
                <span v-if="product.discountSell">
                  <span class="text-black">
                    {{ (product.discountSell * product.quantity)?.toLocaleString('vi-VN') }}
                  </span>
                </span>
                <span v-else class="text-black">
                  {{ (product.priceSell * product.quantity)?.toLocaleString('vi-VN') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="product-input">
        <h1>Thông tin sản phẩm</h1>
        <div class="flex w-full py-2">
          <input class="flex-grow" v-model="productCode" type="text" placeholder="Nhập mã sản phẩm" />
          <button class="btn-check ml-1" @click="checkProduct">Kiểm tra</button>
        </div>
        <div class="py-2">Tên sản phẩm: {{ productToAddOrder.name }}</div>
        <div class="py-2">Đơn giá (Vnđ): 
          <span v-if="productToAddOrder.productId">
            <span v-if="productToAddOrder.discountSell">
              <span class="text-gray-500" style="text-decoration: line-through; margin-right: 5px;">{{ productToAddOrder.priceSell?.toLocaleString('vi-VN') }}</span> <!-- Giá cũ, gạch ngang -->
              <span class="text-red-500">{{productToAddOrder.discountSell.toLocaleString('vi-VN') }}</span>
            </span>
            <span v-else class="text-red-500">
              {{ productToAddOrder.priceSell?.toLocaleString('vi-VN') }}
            </span>
          </span>
        </div>
        <div class="py-2">
          <span>Số lượng: </span>
          <input class="text-right no-spinner" :class="{'disabled': !productToAddOrder.productId}"
          v-model.number="productQuantity" type="number" :disabled="!productToAddOrder.productId" placeholder="0" />
        </div>
        <div class="py-2">Thành tiền: 
          <span v-if="productQuantity && productQuantity > 0">
            <span v-if="productToAddOrder.discountSell">
              {{ (productToAddOrder.discountSell * productQuantity).toLocaleString('vi-VN') }}
            </span>
            <span v-else>
              {{ ((productToAddOrder.priceSell ? productToAddOrder.priceSell : 0) * productQuantity).toLocaleString('vi-VN') }}
            </span>
          </span>
        </div>
        <div class="flex justify-end py-2">
          <button class="btn-save mr-2" @click="saveProduct">Lưu</button>
          <button class="btn-delete" @click="deleteProduct">Xóa</button>
        </div>
      </div>
    </div>

    <div class="invoice-info">
      <div class="py-1">Tổng số lượng mặt hàng: {{ totalNumberProducts }}</div>
      <div class="py-1">Tổng tiền trước giảm: {{ amountBeforeReduced.toLocaleString('vi-VN') }}</div>
      <div class="py-1">Tổng tiền ưu đãi: {{ totalPriceReduced.toLocaleString('vi-VN') }}</div>
      <div class="py-1">Tổng tiền thanh toán: {{ totalAmountPayable.toLocaleString('vi-VN') }}</div>
      <div class="py-1">
        <input v-model="paymentMethod" type="radio" value="COD" /> Tiền mặt
        <!-- <input v-model="paymentMethod" type="radio" value="MOMO" /> Momo -->
      </div>
      <div v-if="paymentMethod === 'COD'" class="py-1">
        <div class="py-1">
          <span>Tiền khách trả: </span>
          <input class="text-right no-spinner" v-model.number="cashAmount" type="number" placeholder="0" />
        </div>
        <div v-if="cashAmount && cashAmount > 0" class="py-1">Tiền thừa: {{ (cashAmount - totalAmountPayable).toLocaleString('vi-VN') }}</div>
      </div>
    </div>

    <div class="actions">
      <button class="btn-save mr-2" @click="processPayment">Thanh toán</button>
      <button class="btn-delete" @click="cancelOrder">Hủy</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ManagePayment'
});
</script>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { ProductToAddOrder, fetchCheckProductAddToOrder } from '../../../api/staff/apiOrder';
import { Product, usePayCounterStore } from "../../../stores/orderStore/payCounterStore";

import { PaymentMethod, PaymentStatus, OrderStatus } from '../../../utils/constants/enum';
import { normalizeName } from '../../../utils/normalizeName';

const router = useRouter();
const payCounterStore = usePayCounterStore();

const order = computed(() => payCounterStore.getOrder);
onMounted(() => {
  if (order.value) {
    localStorage.setItem('order', JSON.stringify(order.value));
    localStorage.setItem('isLoading', JSON.stringify(false));
  } else {
    const savedOrder = localStorage.getItem('order');
    if (savedOrder) {
      payCounterStore.setOrder(JSON.parse(savedOrder));
      localStorage.setItem('isLoading', JSON.stringify(false));
    }
  }
});
watch(order, (newOrder) => {
  if (newOrder) {
      localStorage.setItem('order', JSON.stringify(newOrder));
  } else {
      localStorage.removeItem('order');
  }
}, { deep: true });

const isEditing = ref(false);
const isLoading = ref(false);
const customerPhone = ref<string | null>(null);
const customer = computed(() => payCounterStore.order?.customer || {});
const paymentMethod = computed({
  get: () => payCounterStore.order.paymentMethod,
  set: (value) => payCounterStore.setPaymentMethod(value)
});
const productCode = ref<string | null>(null);
const productQuantity = ref<number | null>(null);
const cashAmount = ref<number |null>(null);
const productToAddOrder = ref<ProductToAddOrder>({
  productId: null,
  name: null,
  priceSell: 0,
  discountSell: 0
});
watch(productToAddOrder, (newProductToAddOrder) => {
})

const products = computed(() => payCounterStore.order?.products || []);
const totalNumberProducts = computed(() => payCounterStore.order?.totalNumberProducts || 0);
const amountBeforeReduced = computed(() => payCounterStore.order?.amountBeforeReduced || 0);
const totalPriceReduced = computed(() => payCounterStore.order?.totalPriceReduced || 0);
const totalAmountPayable = computed(() => payCounterStore.order?.totalAmountPayable || 0);

const checkCustomer = async () => {
  if(!customerPhone.value){
    alert("Vui lòng nhập số điện thoại khách hàng!");
    return;
  }
  try {
    const response = await payCounterStore.addCustomerToOrder(customerPhone.value);
    alert(response);
    customerPhone.value = '';
  } catch (error: any) {
    alert(error.message);
  }
};

const checkProduct = async () => {
  if(!productCode.value) {
    alert('Vui lòng nhập mã sản phẩm!');
    return;
  }

  isEditing.value = false;

  try {
    const response = await fetchCheckProductAddToOrder(productCode.value);
    if(response){
      productToAddOrder.value = response.data;
    }
  } catch (error:any) {
    alert(error.message);
  }
};

const saveProduct = () => {
  if(!productToAddOrder.value.productId){
    alert('Vui lòng chọn sản phẩm');
    return;
  }

  if(productQuantity.value == 0 || !productQuantity.value){
    alert('Vui lòng nhập số lượng');
    return;
  }

  const existingProduct = products.value.find((p: Product) => p.productId === productToAddOrder.value.productId);
  if (existingProduct) {
    payCounterStore.updateProductQuantity(productToAddOrder.value.productId, productQuantity.value, isEditing.value);
  } else {
    payCounterStore.addProductToOrder({
      productId: productToAddOrder.value.productId,
      name: productToAddOrder.value.name!,
      priceSell: productToAddOrder.value.priceSell!,
      discountSell: productToAddOrder.value.discountSell!,
      quantity: productQuantity.value,
      amount: productToAddOrder.value.discountSell! > 0 
        ? productToAddOrder.value.discountSell! * productQuantity.value 
        : productToAddOrder.value.priceSell! * productQuantity.value
    });
  }
  isEditing.value = false;
  resetProductInput();
};

const deleteProduct = () => {
  if(!productToAddOrder.value.productId){
    alert('Vui lòng nhập mã sản phẩm!');
    return;
  }
  payCounterStore.removeProductFromOrder(productToAddOrder.value.productId)
  isEditing.value = false;
  resetProductInput();
};

const handleEditProduct =(product: Product) => {
  isEditing.value = true;
  productToAddOrder.value = {
    productId: product.productId,
    name: product.name,
    priceSell: product.priceSell,
    discountSell: product.discountSell
  };
  productQuantity.value = product.quantity;
};

const resetProductInput = () => {
  productCode.value = '';
  productQuantity.value = null;
  productToAddOrder.value = {
    productId: null,
    name: null,
    priceSell: 0,
    discountSell: 0
  }
};

const processPayment = async () => {
  if(products.value.length === 0) {
    alert('Vui lòng thêm sản phẩm vào đơn hàng!');
    return;
  }

  if(paymentMethod.value === PaymentMethod.COD){
    if (cashAmount.value && cashAmount.value >= totalAmountPayable.value) {
      try {
        payCounterStore.order.paymentStatus = PaymentStatus.PAID;
        payCounterStore.order.orderStatus = OrderStatus.COMPLETED;
        console.log(payCounterStore.order)
        const response = await payCounterStore.paymentOrder();
        if(response) {
          router.push({ name: 'OrderManagementDetail', params: {orderId: response} });
        }
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      alert('Số tiền không đủ để thanh toán');
    }
  } else {
    if(paymentMethod.value === PaymentMethod.MOMO){
      try {
      
      } catch (error: any) {
        alert(error.message);
      }
    }
  }
};

const cancelOrder = () => {
  payCounterStore.clearOrder();
};
</script>

<style scoped>
@import "index.css"
</style>