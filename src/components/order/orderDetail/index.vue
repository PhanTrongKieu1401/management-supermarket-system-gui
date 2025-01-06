<template>
    <LoadingCancelModal :isLoading="isLoading" :message="messageLoading"/>
    <div class="container mx-auto my-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/">Trang chủ</router-link>
                </li>
                <li class="breadcrumb-item">
                    <router-link to="/orders">Đơn hàng của tôi</router-link>
                </li>
                <li class="breadcrumb-item active">
                    <router-link to="#"> {{ orderDetail?.orderId }}</router-link>
                </li>
            </ol>
        </nav>
        <div class="order-details">
            <h1 class="font-bold text-xl pb-1">Thông tin đơn hàng</h1>
            <div class="w-full p-5">
                <table class="order-info-table">
                    <tbody>
                        <tr>
                            <td><strong>Mã đơn hàng:</strong></td>
                            <td>{{ orderDetail?.orderId }}</td>
                            <td><strong>Trạng thái đơn:</strong></td>
                            <td>{{ orderStatus }}</td>
                        </tr>
                        <tr>
                            <td><strong>Phương thức thanh toán:</strong></td>
                            <td>{{ paymentMethodDisplay }}</td>
                            <!-- <td><strong>Mã voucher:</strong></td>
                            <td>{{ orderDetail?.voucherInOrderResponse?.voucherId || 'Không' }}</td> -->
                        </tr>
                        <tr>
                            <td><strong>Trạng thái thanh toán:</strong></td>
                            <td>{{ paymentStatus }}</td>
                            <td v-if="orderDetail?.cashierInOrderResponse"><strong>Mã nhân viên:</strong></td>
                            <td v-if="orderDetail?.cashierInOrderResponse">{{ orderDetail.cashierInOrderResponse?.id }}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày tạo đơn:</strong></td>
                            <td>{{ orderDetail?.paymentDate }}</td>
                            <td v-if="orderDetail?.cashierInOrderResponse"><strong>Tên thu ngân:</strong></td>
                            <td v-if="orderDetail?.cashierInOrderResponse">{{ normalizeName(orderDetail.cashierInOrderResponse.firstName,
                                orderDetail.cashierInOrderResponse.middleName, orderDetail.cashierInOrderResponse.lastName) }}</td>
                        </tr>
                    </tbody>
                </table>

                <table class="order-info-table mt-10">
                    <thead>
                        <tr>
                            <th colspan="2" class="text-left">
                                <h2>Thông tin khách hàng</h2>
                            </th>
                            <th colspan="2" class="text-left">
                                <h2 v-if="orderDetail?.receiverInOrderResponse">Thông tin người nhận</h2>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-if="orderDetail?.customerInOrderResponse"><strong>Họ và tên:</strong></td>
                            <td v-if="orderDetail?.customerInOrderResponse">{{ orderDetail.customerInOrderResponse.firstName }} {{
                                orderDetail.customerInOrderResponse.middleName }} {{ orderDetail.customerInOrderResponse.lastName }}</td>
                            <td v-if="orderDetail?.receiverInOrderResponse"><strong>Họ và tên:</strong></td>
                            <td>
                                <span v-if="orderDetail?.receiverInOrderResponse">{{ orderDetail.receiverInOrderResponse.fullName }}</span>
                            </td>
                        </tr>

                        <tr>
                            <td v-if="orderDetail?.customerInOrderResponse"><strong>Số điện thoại:</strong></td>
                            <td v-if="orderDetail?.customerInOrderResponse">{{ orderDetail.customerInOrderResponse.phone }}</td>
                            <td v-if="orderDetail?.receiverInOrderResponse"><strong>Số điện thoại:</strong></td>
                            <td >
                                <span v-if="orderDetail?.receiverInOrderResponse">
                                    {{ orderDetail.receiverInOrderResponse.phone }}
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td v-if="orderDetail?.customerInOrderResponse"><strong>Email:</strong></td>
                            <td v-if="orderDetail?.customerInOrderResponse">{{ orderDetail.customerInOrderResponse.email }}</td>
                            <td v-if="orderDetail?.receiverInOrderResponse"><strong>Địa chỉ:</strong></td>
                            <td >
                                <span v-if="orderDetail?.receiverInOrderResponse">
                                    {{ orderDetail.receiverInOrderResponse.addressDetail }}, {{
                                        orderDetail.receiverInOrderResponse.ward }}, {{ orderDetail.receiverInOrderResponse.district }}, {{
                                        orderDetail.receiverInOrderResponse.province }}
                                </span>
                            </td>
                        </tr>

                        <tr v-if="!orderDetail?.customerInOrderResponse">
                            <td colspan="2" v-if="!orderDetail?.customerInOrderResponse">Khách hàng vãng lai</td>
                        </tr>
                    </tbody>
                </table>

                <div class="w-full pt-10">
                    <h2 class="">Danh sách sản phẩm: {{ orderDetail?.totalNumberProducts }} sản phẩm</h2>
                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/12 text-left">STT</th>
                                <th class="w-2/12 text-left">Ảnh</th>
                                <th class="w-2/12 text-left">Tên</th>
                                <th class="w-2/12 text-left">Giá cả</th>
                                <th class="w-2/12 text-left">Số lượng</th>
                                <th class="w-3/12 text-left">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in orderDetail?.productInOrderResponses" :key="product.productId">
                                <td>{{ index + 1 }}</td>
                                <td><img :src="product.image" alt="Product Image" /></td>
                                <td>{{ product.name }}</td>
                                <td class="text-right">
                                    <span v-if="product.discountSell > 0" style="text-decoration: line-through;">
                                        {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                    <span v-if="product.discountSell > 0">
                                        {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                    <span v-else>
                                        {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                </td>
                                <td class="text-right">{{ product.quantity }}</td>
                                <td class="text-right">
                                    {{ product.amount.toLocaleString('vi-VN') }} Vnđ
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" class="font-bold text-right">Tổng tiền trước giảm:</td>
                                <td class="text-right">{{ (orderDetail?.totalAmount! - orderDetail?.transportFee! + orderDetail?.totalPriceReduced!).toLocaleString('vi-VN') }} Vnđ</td>
                            </tr>
                            <tr>
                                <td colspan="5" class="font-bold text-right">Giảm ưu đãi:</td>
                                <td class="text-right">{{ orderDetail?.totalPriceReduced.toLocaleString('vi-VN') }} Vnđ</td>
                            </tr>
                            <!-- <tr>
                                <td colspan="5" class="font-bold text-right">Giảm voucher:</td>
                                <td class="text-right">{{ orderDetail?.totalVoucherReduced.toLocaleString('vi-VN') }} Vnđ</td>
                            </tr> -->
                            <tr v-if="!orderDetail?.cashierInOrderResponse">
                                <td colspan="5" class="font-bold text-right">Phí vận chuyển:</td>
                                <td class="text-right">{{ orderDetail?.transportFee.toLocaleString('vi-VN') }} Vnđ</td>
                            </tr>
                            <tr>
                                <td colspan="5" class="font-bold text-right">Tổng tiền:</td>
                                <td class="font-bold text-right">{{ orderDetail?.totalAmount.toLocaleString('vi-VN') }} Vnđ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="action-buttons">
                    <button v-if="role === AccountType.CUSTOMER && orderDetail?.orderStatus === OrderStatus.PENDING" @click="showConfirm = true" class="cancel-button">Hủy đơn</button>
                </div>                
            </div>
        </div>
    </div>
    <PopConfirmCancelOrder
        :title="'Bạn có chắc chắn muốn hủy đơn hàng này? Số tiền đã thanh toán sẽ không được hoàn!'"
        :visible="showConfirm === true"
        @confirm="cancelOrder"
        @cancel="showConfirm = false"
        :placement="'top'">
    </PopConfirmCancelOrder>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'OrderDetail',
    components: {
        PopConfirmCancelOrder,
        LoadingCancelModal
    }
});
</script>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useCartStore } from '../../../stores/cartStore/cartStore.ts';
import { fetchUpdateCartForCustomer } from '../../../api/customer/apiCart.ts';
import { OrderDetail, Order, Product, fetchPaymentStatus, fetchOrderDetail, fetchRemoveOrder } from '../../../api/customer/apiOrder.ts';

import LoadingCancelModal from '../../modal/modalLoadingCancel/index.vue';
import PopConfirmCancelOrder from '/src/components/pop/popConfirmCancelOrder/index.vue';
import { ResponseWebSocket, connectWebSocket } from '../../../socket/webSocketService.ts';

import { normalizeName } from '../../../utils/normalizeName.ts';
import { OrderStatus } from '../../../utils/constants/enum.ts';
import { PaymentStatusDisplay, OrderStatusDisplay, AccountType } from '../../../utils/constants/enum';

const router = useRouter();
const cartStore = useCartStore();

const orderDetail = ref<OrderDetail>();
const paymentStatus = ref<string>('');
const orderStatus = ref<string>('');

const role = localStorage.getItem('role');
const showConfirm = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const messageLoading = ref<string>('');

const responseWebSocket = ref<ResponseWebSocket | null>(null);
const resWSCancelOrder = ref<boolean | null>(null);

onMounted(async () => {
    connectWebSocket(responseWebSocket, resWSCancelOrder);
    const orderId = getOrderIdFromPath();
    const orderIdLocal = localStorage.getItem('orderId');

    if (orderId == orderIdLocal) {
        const response = await fetchPaymentStatus(orderId);
        console.log("response", response);
        if (response.data === "SUCCESS") {
            updateCartInLocalStorage();
            localStorage.removeItem('orderId');
            localStorage.removeItem('isLoading');
            localStorage.removeItem('order');
        } else {
            console.error('Error fetching payment status:', response);
            localStorage.removeItem('orderId');
            localStorage.setItem('isLoading', JSON.stringify(false));
            fetchRemoveOrder(orderId);
            router.push('/order');
        }
    } else {
        updateCartInLocalStorage();
        localStorage.removeItem('isLoading');
        localStorage.removeItem('order');
    }
    console.log("Đã thực hiện update cart, next to get order detail ", orderId);
    const response = await fetchOrderDetail(orderId);
    orderDetail.value = response.data;
    paymentStatus.value = PaymentStatusDisplay[orderDetail.value.paymentStatus] || orderDetail.value.paymentStatus;
    orderStatus.value = OrderStatusDisplay[orderDetail.value.orderStatus] || orderDetail.value.orderStatus;
});

watch(resWSCancelOrder,(newResWSCancelOrder) => {
    isLoading.value = false;
    if(resWSCancelOrder) {
        alert("Hủy đơn hàng thành công!")
    } else {
        alert("Hủy đơn hàng thất bại, vui lòng liên hệ với nhân viên cửa hàng!")
    }
    router.push('/orders');
    // window.location.href = '/orders';
})

const paymentMethodDisplay = computed(() => {
  switch (orderDetail?.value?.paymentMethod) {
    case 'COD':
      return 'Thanh toán khi nhận hàng';
    case 'MOMO':
      return 'Thanh toán trực tuyến bằng Momo';
    default:
      return 'Phương thức thanh toán không xác định';
  }
});

const getOrderIdFromPath = () => {
    //dành cho local
    // const pathSegments = window.location.pathname.split('/');
    // return pathSegments[pathSegments.length - 1];

    //dành cho deploy
    const hash = window.location.hash;
    const pathSegments = hash.split('/');
    return pathSegments[pathSegments.length - 1];
}

const updateCartInLocalStorage = async () => {
    const productInCarts = JSON.parse(localStorage.getItem('productInCarts') || '[]') as Product[];
    const order = JSON.parse(localStorage.getItem('order') || '{}') as Order;
    const productInOrders = order.products.map(product => product.productId);


    const updateProductInCartRequest = productInOrders.map(productId => {//nghi vấn đang lỗi đoạn này
        return { productId: productId, quantity: 0};
    });

    const updatedCart: Product[] = [];

    productInCarts.forEach(product => {
        if (productInOrders.includes(product.productId)) {
            cartStore.removeProductInCart(product);
        } else {
            updatedCart.push(product);
        }
    });
    localStorage.setItem('productInCarts', JSON.stringify(updatedCart));
    console.log('Cập nhật giỏ hàng thành công:', updatedCart);

    const response = await fetchUpdateCartForCustomer(updateProductInCartRequest);
}

const cancelOrder = async () => {
    try {
        if(orderDetail.value) {
            if(orderDetail.value.orderStatus != OrderStatus.PENDING) {
                alert('Đơn hàng đã đã được xác nhận, vui lòng liên hệ nhân viên để được giúp đỡ!');
                return;
            }
            
            messageLoading.value = 'Đang xử lý...';
            isLoading.value = true;
            const response = await fetchRemoveOrder(orderDetail.value?.orderId);
            if(response) {
                console.log('Đơn hủy thành công:', response);
            } else {
                console.error('Đơn hủy thất bại:', response);
            }
        }   
    } catch(error: any) {
        alert(error.message);
    }
};
</script>

<style scoped>
@import "index.css"
</style>