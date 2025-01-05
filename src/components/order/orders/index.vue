<template>
    <div class="container mx-auto py-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link>
                </li>
                <li class="breadcrumb-item active"><router-link to="#">Đơn hàng của tôi</router-link>
                </li>
            </ol>
        </nav>

        <h1 class="text-2xl font-bold mb-4">Danh sách đơn hàng</h1>

        <div class="flex items-center justify-between h-10 mb-4">
            <span class="mr-2">Số lượng đơn: {{ filteredOrdersWithDisplay.length }} đơn hàng</span>
            <div class="flex items-center h-full">
                <div class="h-full">
                    <label for="startDate">Ngày bắt đầu:</label>
                    <input id="startDate" type="date" v-model="startDate" :max="currentDate" class="border rounded-md p-2 mr-2" />
                </div>
                <div class="h-full">
                    <label for="endDate">Ngày kết thúc:</label>
                    <input id="endDate" type="date" v-model="endDate" :min="startDate" :max="currentDate" class="border rounded-md p-2 mr-2" />
                </div>
                <div class="dropdown">
                    <div class="input-container">
                        <input class="dropdown-button" :value="displayedStatus" placeholder="Trạng thái thanh toán"
                            readonly @click="toggleDropdown" />
                        <font-awesome-icon :icon="['fas', 'chevron-down']" v-if="!isDropdownOpen" class="absolute right-2" @click="toggleDropdown"/>
                        <font-awesome-icon :icon="['fas', 'chevron-up']" v-if="isDropdownOpen" class="absolute right-2" @click="toggleDropdown"/>
                    </div>

                    <div v-if="isDropdownOpen" class="dropdown-menu">
                        <div class="dropdown-item" @click="selectStatusPayment('PAID')">Đã thanh toán</div>
                        <div class="dropdown-item" @click="selectStatusPayment('UNPAID')">Chưa thanh toán</div>
                    </div>
                </div>
            </div>
        </div>

        <table class="tbl-order min-w-full">
            <thead>
                <tr class="bg-rgb(228,68,52) text-white">
                    <th class="border p-2">Mã đơn hàng</th>
                    <th class="border p-2">Ngày thanh toán/đặt đơn</th>
                    <th class="border p-2">Phương thức thanh toán</th>
                    <th class="border p-2">Trạng thái thanh toán</th>
                    <th class="border p-2">Trạng thái đơn hàng</th>
                    <th class="border p-2">Tổng tiền</th>
                    <th class="border p-2"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="filteredOrdersWithDisplay.length === 0">
                    <td colspan="7" class="border p-2 text-center">Không có đơn hàng phù hợp</td>
                </tr>
                <tr v-for="order in filteredOrdersWithDisplay" :key="order.orderId" class="cursor-pointer" @click="viewOrderDetail(order.orderId)">
                    <td class="border p-2">{{ order.orderId }}</td>
                    <td class="border p-2">{{ order.paymentDate }}</td>
                    <td class="border p-2">{{ order.paymentMethod }}</td>
                    <td class="border p-2">{{ order.paymentStatusDisplay }}</td>
                    <td class="border p-2">{{ order.orderStatusDisplay }}</td>
                    <td class="border p-2">{{ order.totalAmount }}</td>
                    <td class="border p-2">
                        <button class="bg-[rgb(228,68,52)] hover:bg-[rgb(197, 79, 67)] text-white rounded-md p-1" >
                            <font-awesome-icon :icon="['fas', 'eye']" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "Orders",
});
</script>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { fetchOrderList } from '../../../api/customer/apiOrder';

import { PaymentStatusDisplay, OrderStatusDisplay } from '../../../utils/constants/enum';

interface Order {
    orderId: string;
    paymentDate: string;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    totalAmount: number;
}

const router = useRouter();

const orders = ref<Order[]>([]);
const currentDate = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});
const startDate = ref<string>('');
const endDate = ref<string>('');
const selectedStatus = ref<string>('');
const displayedStatus = ref<string>('');
const isDropdownOpen = ref(false);
const filteredOrders = ref<Order[]>([]);

onMounted(() => {
    fetchOrders();
});

watch([startDate, endDate, selectedStatus], () => {
    filterOrders();
});

const fetchOrders = async () => {
    try {
        const response = await fetchOrderList();
        orders.value = response.data;
        console.log(JSON.stringify(orders, null, 2));
    } catch (error: any) {
        alert(error.message);
    }
    filterOrders();
};

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const selectStatusPayment = (status: string) => {
    selectedStatus.value = status;
    displayedStatus.value = status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán';
    isDropdownOpen.value = false;
};

const filterOrders = () => {
    filteredOrders.value = orders.value.filter((order) => {
        const isWithinDateRange = (
            (!startDate.value || new Date(order.paymentDate) >= new Date(startDate.value)) &&
            (!endDate.value || new Date(order.paymentDate) <= new Date(endDate.value))
        );

        const isStatusMatch = !selectedStatus.value || order.paymentStatus === selectedStatus.value;

        return isWithinDateRange && isStatusMatch;
    });
};

const filteredOrdersWithDisplay = computed(() =>
    filteredOrders.value.map(order => ({
        ...order,
        paymentStatusDisplay: PaymentStatusDisplay[order.paymentStatus as keyof typeof PaymentStatusDisplay] || order.paymentStatus,
        orderStatusDisplay: OrderStatusDisplay[order.orderStatus as keyof typeof OrderStatusDisplay] || order.orderStatus,
    }))
);

const viewOrderDetail = (orderId: string) => {
    router.push({ name: 'OrderDetail', params: {orderId}});
};
</script>

<style scoped>
@import "index.css";
</style>