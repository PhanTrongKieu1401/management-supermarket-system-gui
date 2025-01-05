<template>
  <div class="statistical-report">
    <div class="header">
        <h2>Thống kê doanh thu</h2>
    </div>

    <div class="filter-buttons">
      <h1 class="flex text-base items-center justify-center">Theo: </h1>
      <button class="btn" :class="{ active: filterStore.filterType === 'time' }" 
          @click="setActiveFilter('time')">Thời gian</button>
      <button class="btn" :class="{ active: filterStore.filterType === 'customer' }" 
          @click="setActiveFilter('customer')">Khách hàng</button>
      <button class="btn" :class="{ active: filterStore.filterType === 'product' }" 
          @click="setActiveFilter('product')">Sản phẩm</button>
    </div>

    <div class="filters">
        <div class="row">
            <div class="filter-item w-[30%]" v-if="filterStore.timeType === TimeType.DAY">
              <label for="startDate">Ngày bắt đầu:</label>
              <input type="date" id="startDate" v-model="filterStore.startDate" @change="validateTime()"/>
            </div>
            <div class="filter-item w-[30%]" v-if="filterStore.timeType === TimeType.DAY">
              <label for="endDate">Ngày kết thúc:</label>
              <input type="date" id="endDate" :min="filterStore.startDate!" v-model="filterStore.endDate" />
            </div>

            <div class="filter-item w-[20%]" v-if="filterStore.timeType === TimeType.WEEK">
              <label for="startWeek">Tuần bắt đầu:</label>
              <input type="number" id="startWeek" min="1" max="52" v-model="filterStore.startWeek" @change="validateTime()"/>
            </div>
            <div class="filter-item w-[20%]" v-if="filterStore.timeType === TimeType.WEEK">
              <label for="endWeek">Tuần kết thúc:</label>
              <input type="number" id="endWeek" :min="filterStore.startWeek!" max="52" v-model="filterStore.endWeek" />
            </div>

            <div class="filter-item w-[20%]" v-if="filterStore.timeType === TimeType.MONTH">
              <label for="startMonth">Tháng bắt đầu:</label>
              <input type="number" id="startMonth" min="1" max="12" v-model="filterStore.startMonth" @change="validateTime()"/>
            </div>
            <div class="filter-item w-[20%]" v-if="filterStore.timeType === TimeType.MONTH">
              <label for="endMonth">Tháng kết thúc:</label>
              <input type="number" id="endMonth" :min="filterStore.startMonth!" max="12" v-model="filterStore.endMonth" />
            </div>
            <div class="filter-item w-[20%]" v-if="filterStore.timeType === TimeType.WEEK || filterStore.timeType === TimeType.MONTH">
              <label for="year">Năm:</label>
              <input class="w-1/2" type="number" id="year" min="2000" v-model="filterStore.year" />
            </div>

            <div class="filter-item w-[30%]" v-if="filterStore.timeType === TimeType.QUARTER">
              <label for="quarter">Quý:</label>
              <select id="quarter" v-model="filterStore.quarter">
                <option value="1">Quý 1</option>
                <option value="2">Quý 2</option>
                <option value="3">Quý 3</option>
                <option value="4">Quý 4</option>
              </select>
            </div>
            <div class="filter-item w-[30%]" v-if="filterStore.timeType === TimeType.QUARTER">
              <label for="yearForQuarter">Năm:</label>
              <input type="number" id="yearForQuarter" min="2000" v-model="filterStore.year" />
            </div>

            <div class="filter-item w-[20%]" v-if="activeFilter === 'time'">
                <select v-model="filterStore.timeType">
                    <option v-if="!filterStore.timeType" value="" disabled>Loại thời gian</option>
                    <option value="DAY">Theo ngày</option>
                    <option value="WEEK">Theo tuần</option>
                    <option value="MONTH">Theo tháng</option>
                    <option value="QUARTER">Theo quý</option>
                </select>
            </div>
            <div v-if="activeFilter !== 'time'" class="filter-item w-[20%]">
                <input class="w-full" type="text" :placeholder="placeholder"  v-model="filterStore.keySearch" />
            </div>
        </div>
        <div class="row actions">
            <button class="btn btn-search" @click="search">Tìm kiếm</button>
            <!-- <button class="btn btn-export" @click="exportExcel">Xuất Excel</button> -->
        </div>
    </div>

    <div class="info-boxes">
        <div v-if="activeFilter !== 'product'" class="info-item" v-for="item in timeOrCustomerInfo"
            :key="item.label">
            <div class="icon" :style="{ backgroundColor: item.bgColor }">
                <font-awesome-icon :icon="item.icon" />
            </div>
            <div class="content">
                <p class="value">{{ item.value.toLocaleString('vi-VN') }}</p>
                <p class="label">{{ item.label }}</p>
            </div>
        </div>
        <div v-else class="info-item" v-for="item in productInfo" :key="item.label + '-product'">
            <div class="icon" :style="{ backgroundColor: item.bgColor }">
                <font-awesome-icon :icon="item.icon" />
            </div>
            <div class="content">
                <p class="value">{{ item.value.toLocaleString('vi-VN') }}</p>
                <p class="label">{{ item.label }}</p>
            </div>
        </div>
    </div>

    <div class="data-table">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" :style="{ width: column.width }">{{ column.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredData" :key="index" :class="{ even: index % 2 === 0 }">
            <td v-for="(value, colIndex) in item" 
              :key="colIndex" :style="{ width: columns[colIndex]?.width }"
              :class="{ 'text-right': columns[colIndex]?.type === 'number' }">
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredData.length > 0" class="flex w-full h-10 justify-center items-center p-5">
        <Pagination v-model="currentPage" :totalPages="totalPages!"/> 
        <!-- @update-page="updatePage" -->
      </div>
    </div>
  </div>
  <LoadingModal :isLoading="isLoading" :message="messageLoading"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "StatisticalRevenue",
    components: {
      LoadingModal,
      Pagination
    }
})
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";

import { useFilterStore } from "../../../../stores/filterStore/filterStaffStore";
import { useStatisticalStore } from "../../../../stores/statisticalStore/statisticalStore";

import Pagination from "../../../staff/pagination/index.vue";
import LoadingModal from "../../../staff/modal/modalLoading/index.vue";
import { normalizeName } from "../../../../utils/normalizeName";
import { TimeType } from "../../../../utils/constants/enum";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const statisticalStore = useStatisticalStore();
const filterStore = useFilterStore();

onMounted(() => {
  // filterStore.init();
  filterStore.loadFilterFromLocalStorage();
  const currentFilter = filterStore.filterType;
  if (currentFilter === "time") {
    statisticalStore.filterByTime = JSON.parse(localStorage.getItem("filterByTime") || "[]");
    fetchStatisticalDataByType("time");
  } else if (currentFilter === "customer") {
    statisticalStore.filterByCustomer = JSON.parse(localStorage.getItem("filterByCustomer") || "[]");
    fetchStatisticalDataByType("customer");
  } else if (currentFilter === "product") {
    statisticalStore.filterByProduct = JSON.parse(localStorage.getItem("filterByProduct") || "[]");
    fetchStatisticalDataByType("product");
  }
});

watch(() => filterStore.timeType, (newTimeType) => {
  switch (newTimeType) {
    case 'DAY':
      filterStore.startDate = new Date().toISOString().split('T')[0]; 
      filterStore.endDate = new Date().toISOString().split('T')[0];
      break;

    case 'WEEK':
      const currentWeek = getCurrentWeek(); 
      filterStore.startWeek = currentWeek;
      filterStore.endWeek = currentWeek;
      filterStore.year = new Date().getFullYear();
      break;

    case 'MONTH':
      const currentMonth = new Date().getMonth() + 1; 
      filterStore.startMonth = currentMonth;
      filterStore.endMonth = currentMonth;
      filterStore.year = new Date().getFullYear(); 
      break;

    case 'QUARTER':
      const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3); 
      filterStore.quarter = currentQuarter;
      filterStore.year = new Date().getFullYear();
      break;

    default:
      console.warn('Unknown timeType');
  }
});
type FilterType = "time" | "customer" | "product";
const activeFilter = computed(() => filterStore.filterType as FilterType);
const currentPage = computed(() => filterStore.currentPage);
const totalPages = ref<number>();

const placeholder = computed(() => {
  switch (activeFilter.value) {
    case "customer":
      return "Mã, tên, sđt, email khách hàng";
    case "product":
      return "Mã, tên sản phẩm";
    default:
      return "Nhập từ khóa";
  }
});

const isLoading = ref<boolean>(false);
const messageLoading = ref<string>("");

let timeOrCustomerInfo: Array<{ label: string, icon: string[], bgColor: string, value: number | string }> = [];
let productInfo: Array<{ label: string, icon: string[], bgColor: string, value: number | string }> = [];

// const timeOrCustomerInfo = [
//   { label: "Doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: 500000 },
//   { label: "Tổng đơn hoàn thành", icon: ["fas", "check-circle"], bgColor: "#2196F3", value: 200 },
//   { label: "Tổng đơn hủy", icon: ["fas", "times-circle"], bgColor: "#f44336", value: 5 },
// ];
// const productInfo = [
//   { label: "Doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: 1000000 },
//   { label: "Tổng tồn kho", icon: ["fas", "warehouse"], bgColor: "#FF9800", value: 150 },
//   { label: "Đã bán", icon: ["fas", "shopping-cart"], bgColor: "#2196F3", value: 75 },
//   { label: "Đã hủy", icon: ["fas", "ban"], bgColor: "#f44336", value: "3" },
// ];

const statisticalByTime = computed(() => statisticalStore.filterByTime);
const statisticalByCustomer = computed(() => statisticalStore.filterByCustomer);
const statisticalByProduct = computed(() => statisticalStore.filterByProduct);

const revenue = ref<number>(0);
const completedOrders = ref<number>(0);
const pendingOrders = ref<number>(0);
const canceledOrders = ref<number>(0);
const stock = ref<number>(0);
const sold = ref<number>(0);
const ordering = ref<number>(0);
const pending = ref<number>(0);
const canceled = ref<number>(0);

watch(statisticalByTime, (newStatisticalByTime) => {
  timeOrCustomerInfo = [
    { label: "Tổng doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: revenue.value },
    { label: "Đơn hoàn thành", icon: ["fas", "check-circle"], bgColor: "#2196F3", value: completedOrders.value },
    { label: "Đơn đang xử lý", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: pendingOrders.value },
    { label: "Đơn hủy", icon: ["fas", "times-circle"], bgColor: "#f44336", value: canceledOrders.value },
  ];
});
watch(statisticalByCustomer, (newStatisticalByCustomer) => {
  timeOrCustomerInfo = [
    { label: "Tổng doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: revenue.value },
    { label: "Đơn hoàn thành", icon: ["fas", "check-circle"], bgColor: "#2196F3", value: completedOrders.value },
    { label: "Đơn đang xử lý", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: pendingOrders.value },
    { label: "Đơn hủy", icon: ["fas", "times-circle"], bgColor: "#f44336", value: canceledOrders.value },
  ];
});
watch(statisticalByProduct, (newStatisticalByProduct) => {
  productInfo = [
    { label: "Tổng doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: revenue.value },
    { label: "Tổng tồn kho", icon: ["fas", "warehouse"], bgColor: "#FF9800", value: stock.value },
    { label: "Đã giao", icon: ["fas", "shopping-cart"], bgColor: "#2196F3", value: sold.value },
    { label: "Đang chờ duyệt", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: ordering.value },
    { label: "Xử lý sau duyệt", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: pending.value },
    { label: "Đã hủy", icon: ["fas", "ban"], bgColor: "#f44336", value: canceled.value },
  ];
});
watch([revenue, completedOrders, canceledOrders, stock, sold, canceled], () => {
  if (activeFilter.value !== 'product') {
    timeOrCustomerInfo = [
      { label: "Tổng doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: revenue.value },
    { label: "Đơn hoàn thành", icon: ["fas", "check-circle"], bgColor: "#2196F3", value: completedOrders.value },
    { label: "Đơn đang xử lý", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: pendingOrders.value },
    { label: "Đơn hủy", icon: ["fas", "times-circle"], bgColor: "#f44336", value: canceledOrders.value },
    ];
  } else {
    productInfo = [
      { label: "Tổng doanh thu", icon: ["fas", "dollar-sign"], bgColor: "#4CAF50", value: revenue.value },
      { label: "Tổng tồn kho", icon: ["fas", "warehouse"], bgColor: "#FF9800", value: stock.value },
      { label: "Đã giao", icon: ["fas", "shopping-cart"], bgColor: "#2196F3", value: sold.value },
      { label: "Đang chờ duyệt", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: ordering.value },
      { label: "Xử lý sau duyệt", icon: ["fas", "hourglass-half"], bgColor: "#FFC107", value: pending.value },
      { label: "Đã hủy", icon: ["fas", "ban"], bgColor: "#f44336", value: canceled.value },
    ];
  }
});

// function calculateRevenue(data: any): number {
//   return data.reduce((acc: number, item: any) => acc + item.totalAmount, 0);
// }
// function calculateCompletedOrders(data: any): number {
//   return data.reduce((acc: number, item: any) => acc + item.totalOrderComplete, 0);
// }
// function calculateCancelledOrders(data: any): number {
//   return data.reduce((acc: number, item: any) => acc + item.totalOrderCancel, 0);
// }
// function calculateStock(data: any): number {
//   return data.reduce((acc: number, item: any) => acc + item.quantityInStock, 0);
// }
// function calculateSold(data: any): number {
//   return data.reduce((acc: number, item: any) => acc + item.totalSold, 0);
// }
// function calculateCancelled(data: any): number {
//   return data.reduce((acc: number, item: any) => acc + item.totalCancel, 0);
// }

const columnConfigs = {
  time: [
    { label: 'Thời gian', key: 'time', type: 'text', width: '13%' },
    { label: 'Tổng đơn hàng', key: 'totalOrder', type: 'number', width: '12%' },
    { label: 'Đơn hoàn thành', key: 'totalOrderComplete', type: 'number', width: '12%' },
    { label: 'Đơn đang xử lý', key: 'totalOrderPending', type: 'number', width: '12%' },
    { label: 'Đơn hủy', key: 'totalOrderCancel', type: 'number', width: '12%' },
    { label: 'Đơn trực tuyến', key: 'totalOrderOnline', type: 'number', width: '12%' },
    { label: 'Đơn tại quầy', key: 'totalOrderOffline', type: 'number', width: '12%' },
    { label: 'Tổng tiền (Vnđ)', key: 'totalAmount', type: 'number', width: '15%' },
  ],
  customer: [
    { label: 'Mã khách hàng', key: 'id', type: 'text', width: '15%' },
    { label: 'Tên khách hàng', key: 'name', type: 'text', width: '15%' },
    { label: 'Số điện thoại', key: 'phone', type: 'text', width: '11%' },
    { label: 'Tổng đơn hàng', key: 'totalOrders', type: 'number', width: '11%' },
    { label: 'Đơn hoàn thành', key: 'completedOrders', type: 'number', width: '11%' },
    { label: 'Đơn đang xử lý', key: 'totalOrders', type: 'number', width: '11%' },
    { label: 'Đơn hủy', key: 'cancelledOrders', type: 'number', width: '11%' },
    // { label: 'Tổng tiền hàng chưa thanh toán (Vnđ)', key: 'purchasedItems', type: 'number', width: '13%' },
    { label: 'Doanh thu đơn hoàn thành (Vnđ)', key: 'totalSpent', type: 'number', width: '15%' },
  ],
  product: [
    { label: 'Mã sản phẩm', key: 'id', type: 'text', width: '13%' },
    { label: 'Tên sản phẩm', key: 'name', type: 'text', width: '22%' },
    { label: 'Tồn kho', key: 'stock', type: 'number', width: '10%' },
    { label: 'Đang chờ duyệt', key: 'inOrder', type: 'number', width: '10%' },
    { label: 'Xử lý sau duyệt', key: 'sold', type: 'number', width: '10%' },
    { label: 'Đã giao', key: 'sold', type: 'number', width: '10%' },
    { label: 'Đã hủy do hỏng', key: 'cancelled', type: 'number', width: '10%' },
    { label: 'Tổng doanh thu', key: 'revenue', type: 'number', width: '15%' },
  ],
};
const columns = computed(() => columnConfigs[activeFilter.value] || []);

const filteredData = computed(() => {
  if (activeFilter.value === 'time' && statisticalByTime.value.length > 0) {
    return statisticalByTime.value.map(item => [
      item.time, 
      item.totalOrder, 
      item.totalOrderComplete, 
      item.totalOrderPending,
      item.totalOrderCancel, 
      item.totalOrderOnline, 
      item.totalOrderOffline, 
      item.totalAmount.toLocaleString('vi-VN'), 
    ]);
  } else if (activeFilter.value === 'customer') {
    return statisticalByCustomer.value.map(customer => [
      customer.customerId,
      normalizeName(customer.firstName, customer.middleName, customer.lastName),
      customer.phone,
      // customer.email,
      customer.totalOrder,
      customer.totalOrderComplete,
      customer.totalOrderPending,
      customer.totalOrderCancel,
      customer.totalAmount.toLocaleString('vi-VN'),
    ]);
  } else if (activeFilter.value === 'product') {
    return statisticalByProduct.value.map(product => [
      product.productId,
      product.name,
      product.quantityInStock,
      product.quantityInOrdering,
      product.totalPending,
      product.totalSold,
      product.totalCancel,
      product.totalAmount.toLocaleString('vi-VN'),
    ]);
  }
  return [];
});

const setActiveFilter = (filter: FilterType) => {
  filterStore.filterType = filter;
  filterStore.timeType = TimeType.DAY;
  filterStore.currentPage = 1;
  fetchStatisticalDataByType(filter);
};

const fetchStatisticalDataByType = async (filterType: FilterType) => {
  try {
    if (filterType === "time") {
      const response = await statisticalStore.fetchStatisticalByTimeData();
      totalPages.value = response.totalPages;
      revenue.value = response.revenue ?? 0;
      completedOrders.value = response.completedOrders ?? 0;
      pendingOrders.value = response.pendingOrders ?? 0;
      canceledOrders.value = response.cancelledOrders ?? 0;
    } else if (filterType === "customer") {
      const response = await statisticalStore.fetchStatisticalByCustomerData();
      totalPages.value = response.totalPages;
      revenue.value = response.revenue ?? 0;
      completedOrders.value = response.completedOrders ?? 0;
      pendingOrders.value = response.pendingOrders ?? 0;
      canceledOrders.value = response.cancelledOrders ?? 0;
    } else if (filterType === "product") {
      const response = await statisticalStore.fetchStatisticalByProductData();
      totalPages.value = response.totalPages;
      revenue.value = response.revenue ?? 0;
      stock.value = response.totalStock ?? 0;
      ordering.value = response.totalOrdering ?? 0;
      sold.value = response.totalProductsSold ?? 0;
      pending.value = response.totalProductsPending ?? 0;
      canceled.value = response.totalProductsCancel ?? 0;
    }
  } catch (error: any) {
    alert(error.message);
  } finally {
    isLoading.value = false;
    messageLoading.value = "";
  }
};

watch(currentPage, (newCurrentPage) => {
  search();
});

const search = async () => {
  messageLoading.value = "Đang lọc dữ liệu!";
  isLoading.value = true;
  filterStore.saveFilterToLocalStorage();
  fetchStatisticalDataByType(activeFilter.value);
};

const exportExcel = () => {
  console.log("Xuất Excel");
};

const getCurrentWeek = (): number => {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000);
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const validateTime = () => {
  if (filterStore.startDate && filterStore.endDate) {
    if (filterStore.startDate > filterStore.endDate) {
      filterStore.endDate = filterStore.startDate;
    }
  }

  if (filterStore.startWeek && filterStore.endWeek) {
    if (filterStore.startWeek > filterStore.endWeek) {
      filterStore.endWeek = filterStore.startWeek;
    }
  }

  if (filterStore.startMonth && filterStore.endMonth) {
    if (filterStore.startMonth > filterStore.endMonth) {
      filterStore.endMonth = filterStore.startMonth; 
    }
  }
};
</script>

<style scoped>
@import "index.css";
</style>
