<template>
    <div class="layout-main">
        <div class="filter-box">
            <div class="title-filter-box">
                <h1>Lọc đơn hàng:</h1>
                <button class="btn-filter" @click="applyFilters">Áp dụng</button>
            </div>
            
            <div class="filter-fields">
                <div class="filter-field">
                    <label for="order-code">Mã đơn hàng:</label>
                    <input type="text" id="order-code" v-model="orderId" />
                </div>
                <div class="filter-field">
                    <label for="customer-code">Mã khách hàng:</label>
                    <input type="text" id="customer-code" v-model="customerId" />
                </div>
                <!-- <div class="filter-field">
                    <label for="employee-code">Mã nhân viên:</label>
                    <input type="text" id="employee-code" v-model="staffId" />
                </div> -->
            </div>
            <div class="filter-fields">
                <div class="filter-field">
                    <label for="start-date">Ngày bắt đầu:</label>
                    <input type="date" id="start-date" v-model="startDate" @click="openDatePicker" @keydown.prevent :max="currentDate ?? ''"/>
                </div>
                <div class="filter-field">
                    <label for="end-date">Ngày kết thúc:</label>
                    <input type="date" id="end-date" v-model="endDate" @click="openDatePicker" @keydown.prevent :min="startDate ?? ''" :max="currentDate ?? ''"/>
                </div>
                <div class="filter-field">
                    <label for="order-status">Trạng thái đơn hàng:</label>
                    <select id="order-status" v-model="orderStatus">
                        <option value="ALL">Tất cả</option>
                        <option v-for="(status, index) in OrderStatus" :key="index" :value="status">
                            {{ OrderStatusDisplay[status] }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="title-list-box">
                <h1>Danh sách đơn hàng</h1>
                <div class="summary">
                    <span>Số lượng đơn: {{ orders.length }}</span>
                </div>
            </div>
            <table class="tbl-content">
                <thead>
                    <tr>
                        <th style="width: 5%;">STT</th>
                        <th style="width: 15%;">Mã đơn hàng</th>
                        <th style="width: 15%;">Mã khách hàng</th>
                        <!-- <th style="width: 10%;">Mã nhân viên</th> -->
                        <th style="width: 12%;">Ngày tạo đơn</th>
                        <th style="width: 12%;">Phương thức thanh toán</th>
                        <th style="width: 12%;">Trạng thái thanh toán</th>
                        <th style="width: 12%;">Trạng thái đơn hàng</th>
                        <th style="width: 12%;">Tổng tiền</th>
                        <th style="width: 5%;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="ordersDisplay.length === 0">
                        <td colspan="7" class="border p-2 text-center">Không có đơn hàng phù hợp</td>
                    </tr>
                    <tr v-for="(order, index) in ordersDisplay" :key="order.orderId">
                        <td style="text-align: center;">{{ index + 1 }}</td>
                        <td>{{ order.orderId }}</td>
                        <td>{{ order.customerId ? order.customerId : '' }}</td>
                        <!-- <td>{{ order.staffId ? order.staffId : '' }}</td> -->
                        <td>{{ order.paymentDate }}</td>
                        <td>{{ order.paymentMethod }}</td>
                        <td>{{ order.paymentStatusDisplay }}</td>
                        <td>{{ order.orderStatusDisplay }}</td>
                        <td style="text-align: right;">{{ order.totalAmount.toLocaleString('vi-VN') }} Vnđ</td>
                        <td>
                            <button class="btn-view" @click="viewOrder(order.orderId)">
                                <font-awesome-icon :icon="['fas', 'eye']" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ManageOrders',
});
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useFilterStore } from '../../../stores/filterStore/filterStaffStore';

import { OrderInList, fetchOrderList } from "../../../api/staff/apiOrder";

import { OrderStatus, PaymentStatus, OrderStatusDisplay, PaymentStatusDisplay } from "../../../utils/constants/enum";

const router = useRouter();
const filterStore = useFilterStore();

const currentDate = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

const startDate = ref<string | null>(filterStore.startDate);
const endDate = ref<string | null>(filterStore.endDate);
const customerId = ref<string | null>(filterStore.customerId);
const staffId = ref<string | null>(filterStore.staffId);
const orderId = ref<string | null>(filterStore.orderId);
const orderStatus = ref<string>(filterStore.orderStatus);

const orders = ref<OrderInList[]>([]);

onMounted(async () => {
    applyFilters();
})

const openDatePicker = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target && typeof target.showPicker === 'function') {
        target.showPicker();
    }
}

const applyFilters = async () => {
    filterStore.startDate = startDate.value;
    filterStore.endDate = endDate.value;
    filterStore.customerId = customerId.value?.trim() || null;
    filterStore.staffId = staffId.value?.trim() || null;
    filterStore.orderId = orderId.value?.trim() || null;
    filterStore.orderStatus = orderStatus.value;
    try {
        const response = await fetchOrderList();
        if (response) {
            orders.value = response.data;
        } else {
            console.error('Lấy danh sách đơn hàng thất bại');
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const ordersDisplay = computed(() => 
    orders.value.map(order => ({
        ...order,
        paymentStatusDisplay: PaymentStatusDisplay[order.paymentStatus as keyof typeof PaymentStatusDisplay] || order.paymentStatus,
        orderStatusDisplay: OrderStatusDisplay[order.orderStatus as keyof typeof OrderStatusDisplay] || order.orderStatus,
    }))
);

const viewOrder = (orderId: string) => {
    console.log("ORDER ID LIST PAGE: ", orderId)
    router.push({ name: 'OrderManagementDetail', params: {orderId}});
};
</script>

<style scoped>
@import "index.css";
</style>