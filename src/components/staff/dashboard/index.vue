<template>
    <div class="sider">
        <div class="staff-info">
            <div class="icon_main-user">
                <LogoUser :fullname="normalizeName(staff.firstName, staff.middleName, staff.lastName)"
                    class="w-12 h-12 rounded-full mr-4" />
            </div>
            <div class="staff-details">
                <div class="staff-name">
                    <span>{{ normalizeName(staff.firstName, staff.middleName, staff.lastName) }}</span>
                </div>
                <div class="staff-id">
                    <span>Mã nhân viên: {{ staff.id }}</span>
                </div>
            </div>
        </div>

        <div class="dashboard">
            <div class="dashboard-item" :class="{ active: activeTab === Tab.HOME }" @click="setActiveTab(Tab.HOME)">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'table-columns']" />
                </div>
                <div class="text">
                    Trang chủ
                </div>
            </div>
            <div class="dashboard-item" :class="{ active: activeTab === Tab.PAYMENT }" @click="setActiveTab(Tab.PAYMENT)">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'money-bill']" />
                </div>
                <div class="text">
                    Thanh toán
                </div>
            </div>
            <div class="dashboard-item" :class="{ active: activeTab === Tab.PRODUCTS }" @click="setActiveTab(Tab.PRODUCTS)">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'cube']" />
                </div>
                <div class="text">
                    Quản lý sản phẩm
                </div>
            </div>
            <!-- <div class="dashboard-item" :class="{ active: activeTab === 'customers' }" @click="setActiveTab('customers')">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'users']" />
                </div>
                <div class="text">
                    Quản lý khách hàng
                </div>
            </div>
            <div class="dashboard-item" :class="{ active: activeTab === 'staffs' }" @click="setActiveTab('staffs')">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'user']" />
                </div>
                <div class="text">
                    Quản lý nhân viên
                </div>
            </div> -->
            <div class="dashboard-item" :class="{ active: activeTab === Tab.ORDERS }" @click="setActiveTab(Tab.ORDERS)">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'file-invoice']" />
                </div>
                <div class="text">
                    Quản lý đơn hàng
                </div>
            </div>
            <div class="dashboard-item" :class="{ active: activeTab === Tab.IMPORTS }" @click="setActiveTab(Tab.IMPORTS)">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'file-import']" />
                </div>
                <div class="text">
                    Nhập hàng
                </div>
            </div>
            <div class="dashboard-item" :class="{ active: activeTab === Tab.STATISTICAL }" @click="setActiveTab(Tab.STATISTICAL)">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'chart-line']" />
                </div>
                <div class="text">
                    Thống kê
                </div>
                <div class="chevron">
                    <font-awesome-icon :icon="isExpanded ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']" />
                </div>
            </div>
            <div v-if="isExpanded" class="sub-dashboard">
                <div class="sub-item" :class="{ active: activeSubTab === SubTab.REVENUE}" @click="setSubTab(SubTab.REVENUE)">
                    <div class="icon">
                        <font-awesome-icon :icon="['fas', 'dollar-sign']"/>
                    </div>
                    <div class="text">
                        Doanh thu
                    </div>
                </div>
                <!-- <div class="sub-item" :class="{ active: activeSubTab === 'product'}" @click="setSubTab('product')">
                    <div class="icon">
                        <font-awesome-icon :icon="['fas', 'cube']"/>
                    </div>
                    <div class="text">
                        Sản phẩm
                    </div>
                </div>
                <div class="sub-item" :class="{ active: activeSubTab === 'customer'}" @click="setSubTab('customer')">
                    <div class="icon">
                        <font-awesome-icon :icon="['fas', 'users']"/>
                    </div>
                    <div class="text">
                        Khách hàng
                    </div>
                </div> -->
            </div>
            <div class="dashboard-item" @click="logout">
                <div class="icon">
                    <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
                </div>
                <div class="text">
                    Đăng xuất
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Dashboard',
    components: {
        LogoUser,
    },
});
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useStaffStore } from '../../../stores/staffStore/staffStore';

import LogoUser from '../../general/logoUser/index.vue';
import { Tab, SubTab } from '../../../utils/constants/enum';
import { normalizeName } from '../../../utils/normalizeName';

type Staff = {
    id: string,
    firstName: string,
    middleName: string,
    lastName: string,
}

const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();

const staff = ref<Staff>({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
});

onMounted(() => {
    const pathSegments = route.path.split('/');
    if (pathSegments.length > 2) {
        activeTab.value = pathSegments[2];
        if (pathSegments.length > 3) {
            toggleExpand();
            activeSubTab.value = pathSegments[3];
        }
    }
    try {
        staffStore.fetchStaffDashboard();
    } catch (error:any) {
        alert(error.message);
    }
    
});

watch(() => staffStore.staffDashboard, (newStaffDashboard) => {
    if (newStaffDashboard) {
        staff.value = {
            id: newStaffDashboard.id,
            firstName: newStaffDashboard.firstName,
            middleName: newStaffDashboard.middleName,
            lastName: newStaffDashboard.lastName,
        };
    }
});

watch(() => route.path, (newPath) => {
    const pathSegments = newPath.split('/');
    if (pathSegments.length > 2) {
        activeTab.value = pathSegments[2];
    }
});

const activeTab = ref('home');
const isExpanded = ref(false);
const activeSubTab = ref('');

const setActiveTab = (tabId: string) => {
    activeTab.value = tabId;
    if (tabId !== Tab.STATISTICAL) {
        isExpanded.value = false;
        activeSubTab.value = '';
        router.push(`/staff/${tabId}`);
    } else {
        toggleExpand();
        // activeSubTab.value = 'revenue';
        // router.push(`/staff/${tabId}/revenue`);
    }
};

const toggleExpand = () => {
    isExpanded.value = !isExpanded.value;
    console.log(isExpanded.value);
};

const setSubTab = (subTabName: string) => {
    activeSubTab.value = subTabName;
    router.push(`/staff/${activeTab.value}/${subTabName}`);
};

const logout = () => {
    localStorage.clear();
    router.push("/login");
};
</script>

<style scoped>
@import "index.css";
</style>