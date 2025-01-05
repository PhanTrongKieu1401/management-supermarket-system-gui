<template>
    <div class="layout-main">
        <div class="filter-box">
            <div class="title-filter-box">
                <h1>Lọc đơn hàng nhập:</h1>
                <button class="btn-filter" @click="applyFilters">Áp dụng</button>
            </div>
            
            <div class="filter-fields">
                <div class="filter-field">
                    <label for="import-order-code">Mã đơn hàng nhập:</label>
                    <input type="text" id="import-order-code" v-model="importOrderId" />
                </div>
                <div class="filter-field">
                    <label for="supplier-code">Mã nhà cung cấp:</label>
                    <input type="text" id="supplier-code" v-model="supplierId" />
                </div>
                <div class="filter-field">
                    <label for="employee-code">Mã nhân viên:</label>
                    <input type="text" id="employee-code" v-model="staffId" />
                </div>
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
                    <label for="payment-status">Trạng thái thanh toán:</label>
                    <select id="payment-status" v-model="paymentStatus">
                        <option value="ALL">Tất cả</option>
                        <option value="UNPAID">Chưa thanh toán</option>
                        <option value="PAID">Đã thanh toán</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="title-list-box">
                <div class="summary">
                    <h1>Danh sách đơn hàng nhập</h1>
                    <span>Số lượng đơn: {{ importOrders.length }}</span>
                </div>
                <div>
                    <div class="dropdown">
                        <button @click="importOrder()" class="btn btn-add">Tạo đơn hàng nhập</button>
                    </div>
                </div>
            </div>
            <table class="tbl-content">
                <thead>
                    <tr>
                        <th style="width: 5%;">STT</th>
                        <th style="width: 10%;">Mã đơn hàng nhập</th>
                        <th style="width: 10%;">Mã nhà cung cấp</th>
                        <th style="width: 10%;">Tên nhà cung cấp</th>
                        <th style="width: 10%;">Mã nhân viên</th>
                        <th style="width: 12%;">Ngày nhập hàng</th>
                        <th style="width: 12%;">Trạng thái thanh toán</th>
                        <th style="width: 12%;">Tổng tiền</th>
                        <th style="width: 5%;"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="importOrdersDisplay.length === 0">
                        <td colspan="7" class="border p-2 text-center">Không có đơn hàng phù hợp</td>
                    </tr>
                    <tr v-for="(importOrder, index) in importOrdersDisplay" :key="importOrder.importOrderId">
                        <td style="text-align: center;">{{ index + 1 }}</td>
                        <td>{{ importOrder.importOrderId }}</td>
                        <td>{{ importOrder.supplierId }}</td>
                        <td>{{ importOrder.supplierName }}</td>
                        <td>{{ importOrder.staffId }}</td>
                        <td>{{ importOrder.importDate }}</td>
                        <td>{{ importOrder.paymentStatusDisplay }}</td>
                        <td style="text-align: right;">{{ importOrder.totalAmount.toLocaleString('vi-VN') }} Vnđ</td>
                        <td>
                            <button class="btn-view" @click="viewOrder(importOrder.importOrderId)">
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
    name: 'ManageImports'
});
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { useFilterStore } from '../../../stores/filterStore/filterStaffStore';

import { ImportOrderInList, fetchImportOrderList } from '../../../api/staff/apiImportOrder';

import { PaymentStatusDisplay } from "../../../utils/constants/enum";

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
const staffId = ref<string | null>(filterStore.staffId);
const supplierId = ref<string | null>(filterStore.supplierId);
const importOrderId = ref<string | null>(filterStore.importOrderId);
const paymentStatus = ref<string>(filterStore.paymentStatus);

const importOrders = ref<ImportOrderInList[]>([]);

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
    filterStore.staffId = staffId.value?.trim() || null;
    filterStore.supplierId = supplierId.value?.trim() || null;
    filterStore.importOrderId = importOrderId.value?.trim() || null;
    filterStore.paymentStatus = paymentStatus.value;
    try {
        const response = await fetchImportOrderList();
        if (response) {
            importOrders.value = response.data;
        } else {
            console.error('Lấy danh sách đơn hàng nhập thất bại');
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const importOrdersDisplay = computed(() => 
    importOrders.value.map(importOrder => ({
        ...importOrder,
        paymentStatusDisplay: PaymentStatusDisplay[importOrder.paymentStatus as keyof typeof PaymentStatusDisplay] || importOrder.paymentStatus,
    }))
);

const viewOrder = (importOrderId: string) => {
    router.push({ name: 'ImportOrderDetail', params: {importOrderId}});
};

const importOrder = () => {
    router.push({ name: 'ImportOrderCreatePage'});
};
</script>

<style scoped>
@import "index.css";
</style>