<template>
    <LoadingModal :isLoading="isLoading" :message="messageLoading" @cancel-order="cancelOrder"/>
    <ProductsOutOfStockModal :products="outOfStockProducts" :visible="isModalOutOfStockVisible" @close="isModalOutOfStockVisible = false" />
    <div class="container mx-auto my-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link to="/cart">
                    <font-awesome-icon :icon="['fas', 'chevron-left']" class="mr-2"/>Quay lại giỏ hàng
                </router-link></li>
            </ol>
        </nav>
        <div class="flex">
            <div class="w-2/3 pr-6">
                <table class="tbl-products-cart">
                    <thead>
                        <tr>
                            <th class="p-4" style="width: 60%; border-right: 1px solid rgb(255, 255, 255);">Sản phẩm
                            </th>
                            <th class="p-4" style="width: 20%; border-right: 1px solid rgb(255, 255, 255);">Số lượng
                            </th>
                            <th class="p-4" style="width: 20%; border-right: 1px solid rgb(255, 255, 255);">Thành tiền
                                (Vnđ)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products" :key="product.productId">
                            <td class="p-4 items-center">
                                <div style="display: flex; align-items: center;">
                                    <img :src="product.image" alt="Product" class="w-16 h-auto mr-4 object-cover">
                                    <div>{{ product.name }}</div>
                                </div>
                            </td>
                            <td class="p-4 text-center">
                                <div class="quantity-selector">
                                    <span>{{ product.quantity }}</span>
                                </div>
                            </td>
                            <td class="p-4 text-right" style="color: rgb(228,68,52);">
                                <div v-if="product.discountSell && product.priceSell !== product.discountSell" class="flex flex-col items-end text-right">
                                    <span class="text-gray-500 italic line-through mb-1">
                                        {{ (product.priceSell * product.quantity).toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                    <span class="font-bold" style="color: rgb(228, 68, 52); font-size: 18px;">
                                        {{ (product.discountSell * product.quantity).toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                </div>
                                <div v-else class="flex justify-end items-center">
                                    <span class="font-bold" style="color: rgb(228, 68, 52); font-size: 18px;">
                                        {{ (product.priceSell * product.quantity).toLocaleString('vi-VN') }} Vnđ
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="mt-6 p-4 border rounded-lg">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold mb-4" style="color: rgb(228,68,52);">
                            <font-awesome-icon :icon="['fas', 'user']"/> Thông tin người đặt
                        </h3>
                        <div class="flex justify-between">
                            <div class="w-3/6 mb-4 pr-2">
                                <div class="relative w-full">
                                    <input type="text" id="fullNameCustomer" class="input-information" v-model="fullNameCustomer" placeholder="Họ và tên" disabled>
                                    <label for="fullNameCustomer" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'bottom-8 pt-2 text-[12px]': isFocused || fullNameCustomer, 'bottom-[22px] text-[16px]': !isFocused && !fullNameCustomer}">
                                        <span>Họ và tên người đặt</span>
                                    </label>
                                </div>
                            </div>                           
                            <div class="w-3/6 mb-4">
                                <div class="relative w-full">
                                    <input type="text" id="phoneCustomer" class="input-information" v-model="customer.phone" placeholder="Số điện thoại" disabled>
                                    <label for="phoneCustomer" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'bottom-8 pt-2 text-[12px]': isFocused || customer.phone, 
                                        'bottom-[22px] text-[16px]': !isFocused && !customer.phone}">
                                        <span>Số điện thoại</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="relative w-full">
                                <input type="email" id="email" class="input-information" v-model="customer.email" disabled>
                                <label for="email" class="label-information transition-all duration-300 ease-in-out"
                                    :class="{'transform -translate-y-0 pt-2 text-[12px]': isFocused.email || customer.email, 
                                            'transform translate-y-5 text-[16px]': !isFocused.email && !customer.email}">
                                    <span>Địa chỉ email</span>
                                </label>
                            </div>
                        </div>
                    </div> 
                    <div class="">
                        <h3 class="text-lg font-semibold mt-4" style="color: rgb(228,68,52);">
                            <font-awesome-icon :icon="['fas', 'user']"/> Thông tin nhận hàng
                        </h3>
                        <div class="flex justify-between">
                            <div class="w-3/6 mb-4 pr-2">
                                <div class="relative w-full">
                                    <input type="text" id="fullNameReceiver" class="input-information" v-model="receiver.fullName"
                                        :class="{'required': isRequired.fullNameReceiver}" 
                                        @focus="setFocused('fullNameReceiver')"
                                        @blur="removeFocused('fullNameReceiver', receiver.fullName)"
                                        @input="checkRequired('fullNameReceiver', receiver.fullName)">
                                    <label for="fullNameReceiver" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'transform -translate-y-0 pt-2 text-[12px]': isFocused.fullNameReceiver || receiver.fullName, 
                                                'transform translate-y-5 text-[16px]': !isFocused.fullNameReceiver && !receiver.fullName}">
                                        <span>Họ và tên người nhận</span>
                                    </label>
                                    <div v-if="isRequired.fullNameReceiver && !receiver.fullName" class="text-red-600 text-sm mt-1">
                                        <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                                    </div>
                                </div>
                            </div>                           
                            <div class="w-3/6 mb-4">
                                <div class="relative w-full">
                                    <input type="text" id="phoneReceiver" class="input-information" v-model="receiver.phone"
                                        :class="{'required': isRequired.phoneReceiver}" 
                                        @focus="setFocused('phoneReceiver')"
                                        @blur="removeFocused('phoneReceiver', receiver.phone)"
                                        @input="checkRequired('phoneReceiver', receiver.phone)">
                                    <label for="phoneReceiver" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'transform -translate-y-0 pt-2 text-[12px]': isFocused.phoneReceiver || receiver.phone, 
                                                'transform translate-y-5 text-[16px]': !isFocused.phoneReceiver && !receiver.phone}">
                                        <span>Số điện thoại</span>
                                    </label>
                                    <div v-if="isRequired.phoneReceiver" class="text-red-600 text-sm mt-1">
                                        <span v-if="!receiver.phone">
                                            <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                                        </span>
                                        <span v-else>
                                            <font-awesome-icon icon="exclamation-circle"/> Số điện thoại không hợp lệ.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="w-3/6 mb-4 pr-2">
                                <div class="relative w-full" v-click-outside="closeDropdownProvince">
                                    <input type="text" id="province" class="input-information drop" v-model="receiver.province"
                                        :class="{'required': isRequired.province}" 
                                        @click="toggleDropdown('province')"
                                        autocomplete="off">
                                    <label for="province" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'transform -translate-y-0 pt-2 text-[12px]': receiver.province, 
                                                'transform translate-y-5 text-[16px]': !receiver.province}">
                                        <span class="flex w-full justify-between">
                                            Chọn tỉnh/thành phố
                                            <div v-if="dropdownState.province">
                                                <font-awesome-icon :icon="['fas', 'chevron-up']" />
                                            </div>
                                            <div v-else>
                                                <font-awesome-icon :icon="['fas', 'chevron-down']" />
                                            </div>
                                        </span>
                                    </label>
                                    <div v-if="provinces.length && dropdownState.province" class="dropdown" @mousedown.stop>
                                        <div class="dropdown-search-container" @mousedown.stop>
                                            <div class="dropdown-search-content">
                                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
                                                <input type="text" class="dropdown-search" placeholder="Tìm kiếm..." v-model="searchQuery" @mousedown.stop>
                                            </div>
                                        </div>
                                        <ul>
                                            <li v-for="province in filteredProvinces()" :key="province.provinceID" @click="selectProvince(province)" class="dropdown-item">
                                                {{ province.provinceName }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div v-if="isRequired.province && !receiver.province" class="text-red-600 text-sm mt-1">
                                        <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                                    </div>
                                </div>
                            </div>                    
                            <div class="w-3/6 mb-4">
                                <div class="relative w-full" v-click-outside="closeDropdownDistrict">
                                    <input type="text" id="district" class="input-information drop" v-model="receiver.district"
                                        :class="{'required': isRequired.district}" 
                                        :disabled="!receiver.province"
                                        @click="toggleDropdown('district')"
                                        autocomplete="off">
                                    <label for="district" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'transform -translate-y-0 pt-2 text-[12px]': receiver.district, 
                                                'transform translate-y-5 text-[16px]': !receiver.district}">
                                        <span class="flex w-full justify-between">
                                            Chọn quận/huyện
                                            <div v-if="dropdownState.district">
                                                <font-awesome-icon :icon="['fas', 'chevron-up']" />
                                            </div>
                                            <div v-else>
                                                <font-awesome-icon :icon="['fas', 'chevron-down']" />
                                            </div>
                                        </span>
                                    </label>
                                    <div v-if="districts.length && dropdownState.district" class="dropdown" @mousedown.stop>
                                        <div class="dropdown-search-container" @mousedown.stop>
                                            <div class="dropdown-search-content">
                                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
                                                <input type="text" class="dropdown-search" placeholder="Tìm kiếm..." v-model="searchQuery" @mousedown.stop>
                                            </div>
                                        </div>
                                        <ul>
                                            <li v-for="district in filteredDistricts()" :key="district.districtID" @click="selectDistrict(district)" class="dropdown-item">
                                                {{ district.districtName }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div v-if="isRequired.district && !receiver.district" class="text-red-600 text-sm mt-1">
                                        <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="w-3/6 mb-4 pr-2">
                                <div class="relative w-full" v-click-outside="closeDropdownWard">
                                    <input type="text" id="ward" class="input-information drop" v-model="receiver.ward"
                                        :class="{'required': isRequired.ward}" 
                                        :disabled="!receiver.district"
                                        @click="toggleDropdown('ward')"
                                        autocomplete="off">
                                    <label for="ward" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'transform -translate-y-0 pt-2 text-[12px]': receiver.ward, 
                                                'transform translate-y-5 text-[16px]': !receiver.ward}">
                                        <span class="flex w-full justify-between">
                                            Chọn phường/xã
                                            <div v-if="dropdownState.ward">
                                                <font-awesome-icon :icon="['fas', 'chevron-up']" />
                                            </div>
                                            <div v-else>
                                                <font-awesome-icon :icon="['fas', 'chevron-down']" />
                                            </div>
                                        </span>
                                    </label>
                                    <div v-if="wards.length && dropdownState.ward" class="dropdown" @mousedown.stop>
                                        <div class="dropdown-search-container" @mousedown.stop>
                                            <div class="dropdown-search-content">
                                                <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="search-icon" />
                                                <input type="text" class="dropdown-search" placeholder="Tìm kiếm..." v-model="searchQuery" @mousedown.stop>
                                            </div>
                                        </div>
                                        <ul>
                                            <li v-for="ward in filteredWards()" :key="ward.wardID" @click="selectWard(ward)" class="dropdown-item">
                                                {{ ward.wardName }}
                                            </li>
                                        </ul>
                                    </div>
                                    <div v-if="isRequired.ward && !receiver.ward" class="text-red-600 text-sm mt-1">
                                        <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                                    </div>
                                </div>
                            </div>                    
                            <div class="w-3/6">
                                <div class="relative w-full">
                                    <input type="text" id="addressDetail" class="input-information" v-model="receiver.addressDetail"
                                        :class="{'required': isRequired.addressDetail}" 
                                        @focus="setFocused('addressDetail')"
                                        @blur="removeFocused('addressDetail', receiver.addressDetail)"
                                        @input="checkRequired('addressDetail', receiver.addressDetail)">
                                    <label for="addressDetail" class="label-information transition-all duration-300 ease-in-out"
                                        :class="{'transform -translate-y-0 pt-2 text-[12px]': isFocused.addressDetail || receiver.addressDetail, 
                                                'transform translate-y-5 text-[16px]': !isFocused.addressDetail && !receiver.addressDetail}">
                                        <span>Địa chỉ cụ thể</span>
                                    </label>
                                    <div v-if="isRequired.addressDetail && !receiver.addressDetail" class="text-red-600 text-sm mt-1">
                                        <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </div>
                </div>

                <div class="mt-6 payment-box">
                    <h3 class="text-lg font-semibold">Chọn phương thức thanh toán</h3>
                    <div class="payment-options">
                        <div class="payment-option">
                            <input id="cod" type="radio" v-model="selectedPaymentMethod" :value="PaymentMethod.COD" />
                            <label for="cod">
                                <img src="../../../assets/img/cod.png" class="img-payment-method">
                                {{ PaymentMethod.COD }}
                            </label>
                        </div>
                        <!-- <div class="payment-option">
                            <input id="vnpay-atm" type="radio" v-model="selectedPaymentMethod" :value="PaymentMethod.VNPAY_ATM" /> 
                            <label for="cod">
                                <img src="../../assets/img/vnpay_atm.png" class="img-payment-method">
                                {{ PaymentMethod.VNPAY_ATM }}
                            </label>
                        </div> -->
                        <div class="payment-option">
                            <input id="momo" type="radio" v-model="selectedPaymentMethod" :value="PaymentMethod.MOMO" />
                            <label for="momo"> 
                                <img src="../../../assets/img/momo.png" class="img-payment-method">
                                {{ PaymentMethod.MOMO }}
                            </label>
                        </div>
                        <!-- <div class="payment-option">
                            <input id="vnpay" type="radio" v-model="selectedPaymentMethod" :value="PaymentMethod.VNPAY" />
                            <label for="vnpay"> 
                                <img src="../../assets/img/vnpay.png" class="img-payment-method">
                                {{ PaymentMethod.VNPAY }}
                            </label>
                        </div>  -->
                    </div>
                </div>
            </div>
    
            <div class="w-1/3 h-2/5">
                <!-- <div class="mb-4 p-4 rounded-lg" style="background-color: rgb(243 244 246);">
                    <div class="flex flex-row justify-between mb-2 p-2 bg-white text-[rgb(228,68,52)] rounded-lg opacity-90 pointer-events-none" style="border: 1px solid rgb(228,68,52);">
                        <span>{{ voucher?.voucherCode || 'Mã voucher' }}</span>
                    </div>
                    <button @click="openModalSelectVoucher" class="w-full mt-2 py-2 px-4 bg-white text-[rgb(228,68,52)] rounded-lg hover:bg-[rgb(228,68,52)] hover:text-white" style="border: 1px solid rgb(228,68,52);">
                        Áp dụng voucher
                    </button>
                </div> -->
                <div class="mb-4 p-4 rounded-lg text-sm" style="background-color: rgb(243 244 246);">
                    <div class="flex justify-between mb-2">
                        <span>Tổng tiền hàng:</span>
                        <span>{{ order?.amountBeforeReduced.toLocaleString('vi-VN') }} Vnđ</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span>Giá giảm trực tiếp:</span>
                        <span v-if="(order?.totalPriceReduced ?? 0) > 0">-{{ order?.totalPriceReduced.toLocaleString('vi-VN') }} Vnđ</span>
                        <span v-else>0 Vnđ</span>
                    </div>
                    <!-- <div class="flex justify-between mb-2">
                        <span>Giảm voucher:</span>
                        <span v-if="voucher">-{{ voucher.value.toLocaleString('vi-VN') }} Vnđ</span>
                        <span v-else>0 Vnđ</span>
                    </div> -->
                    <div class="flex justify-between mb-2">
                        <span>Phí vận chuyển (GHN):</span>
                        <span v-if="receiver?.ward">{{ feeResponse?.fee.toLocaleString('vi-VN') }} Vnđ</span>
                        <span v-else>0 Vnđ</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="flex font-bold items-end">Thành tiền:</span>
                        <span class="flex flex-col items-end">
                            <span v-if="order?.totalPriceReduced! > 0" class="line-through mb-2" style="color: rgb(124, 119, 119);">{{ (order?.amountBeforeReduced! + order?.transportFee!).toLocaleString('vi-VN') }} Vnđ</span>
                            <span v-if="order?.totalAmountPayable" class="text-base font-bold" style="color: rgb(228,68,52);">{{ (order?.totalAmountPayable).toLocaleString('vi-VN') }} Vnđ</span>
                        </span>
                    </div>
                </div>
                <button @click="completePlaceOrder" class="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    Hoàn tất
                </button>
            </div>
        </div> 
        <SelectVoucherModal :visible="isModalSelectVoucher" @close="isModalSelectVoucher = false" @apply-voucher="handleSelectedVoucher" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent ({
    name: 'Order',
    components: {
        SelectVoucherModal,
        LoadingModal,
        ProductsOutOfStockModal
    }
});
</script>

<script setup lang="ts">
import { ref, computed, onMounted, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

import SelectVoucherModal from '/src/components/modal/modalSelectVoucher/index.vue';
import LoadingModal from '../../modal/modalLoading/index.vue';
import ProductsOutOfStockModal from '../../modal/modalOutOfStockListProduct/index.vue';

import { useReplaceOrderStore } from '../../../stores/orderStore/replaceOrderStore.ts';

import { paymentWithMomo } from '../../../api/payment/momo/apiMomo.ts';

import { ProvinceResponse, fetchProvinces, DistrictResponse, fetchDistricts, WardResponse, fetchWards, 
    AvailableServicesResponse, fetchAvailableServices, FeeResponse, fetchFee
} from '../../../api/apiAddress.ts';
import { Order, fetchReplaceOrder, fetchRemoveOrder } from '../../../api/customer/apiOrder.ts';
import { Information, fetchInformation } from '../../../api/customer/apiInfo.ts';
import { ProductCheckQuantityNotEnough, checkProductQuantity } from '../../../api/customer/apiProduct.ts';
import { ResponseWebSocket, connectWebSocket } from '../../../socket/webSocketService.ts';

import { PaymentMethod, PaymentStatus, OrderStatus } from '../../../utils/constants/enum.ts';
import { normalizeName } from '../../../utils/normalizeName.ts';
import { ACCENT_REGEX } from '../../../utils/constants/unicode.ts';

type Receiver = {
    fullName: string;
    phone: string;
    addressDetail: string;
    ward: string;
    district: string;
    province: string;
};

type Voucher = {
    voucherId: string;
    voucherCode: string;
    value: number;
    conditionsApply: number;
    expiryDate: string;
}

type ProductOutOfStock = {
    productId: string;
    name: string;
    image: string;
    priceSell: number;
    discountSell: number;
    priceImport: number;
    quantity: number;
    amount: number;
    quantityInStock: number;
}

const router = useRouter();
const replaceOrderStore = useReplaceOrderStore();

const order = computed(() => replaceOrderStore.getOrder);
onMounted(() => {
    if (order.value) {
        localStorage.setItem('order', JSON.stringify(order.value));
        localStorage.setItem('isLoading', JSON.stringify(false));
      } else {
        const savedOrder = localStorage.getItem('order');
        if (savedOrder) {
            replaceOrderStore.setOrder(JSON.parse(savedOrder));
            localStorage.setItem('isLoading', JSON.stringify(false));
        } else {
            router.push({ name: 'Cart' });
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


const customer = ref<Information>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: '',
});
const fullNameCustomer = ref<String>('');
onMounted(async() => {
    try {
        const responseInformation = await fetchInformation();
        if(responseInformation) {
            customer.value = responseInformation.data;
            fullNameCustomer.value = normalizeName(customer.value.firstName, customer.value.middleName, customer.value.lastName);
        }
    } catch (error: any) {
        alert(error.message);
    }
    
}) 

const products = computed(() => order.value?.products);
const voucher = computed(() => order.value?.voucher);
const receiver = computed(() => {
    if(!order.value?.receiver) {
        return {
            fullName: '',
            phone: '',
            addressDetail: '',
            ward: '',
            district: '',
            province: ''
        };
    }
    return order.value.receiver;
});
watch(receiver, (newReceiver) => {
}, { deep: true });

const selectedPaymentMethod = ref<string>(PaymentMethod.COD);

const messageLoading = ref<string>('');
const isLoading = ref<boolean>(false);
const storedIsLoading = localStorage.getItem('isLoading');

const isModalOutOfStockVisible = ref<boolean>(false);
const outOfStockProducts = ref<ProductOutOfStock[]>([]);

if (storedIsLoading !== null) {
    isLoading.value = JSON.parse(storedIsLoading);
} else {
    localStorage.setItem('isLoading', JSON.stringify(isLoading.value));
}
window.addEventListener('storage', (event) => {
    if (event.key === 'isLoading') {
        const newIsLoading = JSON.parse(event.newValue as string);
        if (newIsLoading === null) {
            window.location.href = '/cart';
        } else {
            isLoading.value = newIsLoading;
        }
    }
});
const updateLoadingState = (loadingState: boolean | null) => {
    if (loadingState === null) {
        localStorage.removeItem('isLoading');
    } else {
        localStorage.setItem('isLoading', JSON.stringify(loadingState));
    }
};

const isFocused = ref<Record<string, boolean>>({
    fullNameReceiver: false,
    phoneReceiver: false,
    addressDetail: false,
    ward: false,
    district: false,
    province: false
});
const isRequired = ref<Record<string, boolean>>({
    fullNameReceiver: false,
    phoneReceiver: false,    
    addressDetail: false,
    ward: false,
    district: false,
    province: false
});
const isFilled = ref<Record<string, boolean>>({
    fullNameReceiver: false,
    phoneReceiver: false,
    addressDetail: false,
    ward: false,
    district: false,
    province: false
});

const validators: Record<string, (value: string) => boolean> = {
    phone: (value: string) => /^\d{10,15}$/.test(value),
    email: (value: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value),
    fullNameReceiver: (value: string) => /^[\p{L}\s]{2,100}$/u.test(value),
    phoneReceiver: (value: string) => /^\d{10,15}$/.test(value),
    addressDetail: (value: string) => /^[\p{L}\d\s.,\-\/#()]{2,400}$/u.test(value),
    ward: (value: string) => /^[\p{L}\d\s]{2,100}$/u.test(value),
    district: (value: string) => /^[\p{L}\d\s]{2,100}$/u.test(value),
    province: (value: string) => /^[\p{L}\s]{2,100}$/u.test(value),
};

const dropdownState = ref<Record<string, boolean>>({
    province: false,
    district: false,
    ward: false
});
const toggleDropdown = (field: string) => {
    dropdownState.value[field] = !dropdownState.value[field];
};
const closeDropdownProvince = () => {
    if (dropdownState.value.province === true) {
        dropdownState.value.province = false;
        searchQuery.value = '';
        checkRequired('province', receiver.value.province);
    }
};
const closeDropdownDistrict = () => {
    if (dropdownState.value.district === true) {
        dropdownState.value.district = false;
        searchQuery.value = '';
        checkRequired('district', receiver.value.district);
    }
};
const closeDropdownWard = () => {
    if (dropdownState.value.ward === true) {
        dropdownState.value.ward = false;
        searchQuery.value = '';
        checkRequired('ward', receiver.value.ward);
    }
};

const provinces = ref<ProvinceResponse[]>([]);
const districts = ref<DistrictResponse[]>([]);
const wards = ref<WardResponse[]>([]);

const availableServicesResponse = ref<AvailableServicesResponse[]>([]);
const feeResponse = ref<FeeResponse | null>(null);

const responseWebSocket = ref<ResponseWebSocket | null>(null);
const resWSCancelOrder = ref<boolean | null>(null);

onMounted(async () => {
    connectWebSocket(responseWebSocket, resWSCancelOrder);
    provinces.value = await fetchProvinces();
    if(receiver.value.province) {
        const selectedProvince = provinces.value.find(province => province.provinceName === receiver.value.province);
        await selectProvince(selectedProvince);
        if(receiver.value.district) {
            const selectedDistrict = districts.value.find(district => district.districtName === receiver.value.district);
            await selectDistrict(selectedDistrict);
            if(receiver.value.ward) {
                const selectedWard = wards.value.find(ward => ward.wardName === receiver.value.ward);
                await selectWard(selectedWard);

            }
        }
    }
    if (receiver.value.fullName) {
        checkRequired('fullNameReceiver', receiver.value.fullName);
    }
    if (receiver.value.phone) {
        checkRequired('phoneReceiver', receiver.value.phone);
    }
    if (receiver.value.addressDetail) {
        checkRequired('addressDetail', receiver.value.addressDetail);
    }
});
watch(responseWebSocket, async (newResponseWebSocket)=> {
    if(responseWebSocket.value?.status) {
        if(order.value?.paymentMethod === PaymentMethod.COD){
            router.push("/orders/" + responseWebSocket.value.orderId)
        } else {
            localStorage.setItem('orderId', responseWebSocket.value.orderId);
            if(order.value?.paymentMethod === PaymentMethod.MOMO){
                paymentByMomo(order.value);
            }
        }
    } else {
        const response = await checkProductQuantity(order.value?.products!);
        if(response) {
            outOfStockProducts.value = mapProductCheckToOutOfStock(response.data);
            if (outOfStockProducts.value.length > 0) {
                isLoading.value = false;
                isModalOutOfStockVisible.value = true;
                return;
            }
        }
        isLoading.value = false;
        updateLoadingState(false);
    }
}, { deep: true });
watch(resWSCancelOrder,(newResWSCancelOrder) => {
    isLoading.value = false;
    updateLoadingState(false);
    localStorage.removeItem('orderId');
    if(resWSCancelOrder) {
        alert("Hủy đơn hàng thành công!")
    } else {
        alert("Hủy đơn hàng thất bại, vui lòng liên hệ với nhân viên cửa hàng!")
    }
})

const selectProvince = async (province: any) => {
    receiver.value.province = province.provinceName;
    dropdownState.value.province = false;
    searchQuery.value = '';
    checkRequired('province', receiver.value.province);
    districts.value = await fetchDistricts(province.provinceID);
    // console.log(JSON.stringify(districts.value, null, 2)); 
};
const selectDistrict = async (district: any) => {
    receiver.value.district = district.districtName;
    dropdownState.value.district = false;
    searchQuery.value = '';
    checkRequired('district', receiver.value.district);

    wards.value = await fetchWards(district.districtID);
    availableServicesResponse.value = await fetchAvailableServices(district.districtID);
    // console.log(JSON.stringify(wards.value, null, 2)); 
};
const selectWard = async (ward: any) => {
    receiver.value.ward = ward.wardName;
    dropdownState.value.ward = false;
    searchQuery.value = '';
    checkRequired('ward', receiver.value.ward);

    feeResponse.value = await fetchFee(availableServicesResponse.value[0].serviceId, ward.districtID, ward.wardCode);    
    if(feeResponse.value){
        feeResponse.value.fee = Math.round(feeResponse.value.fee / 1000) * 1000;
        replaceOrderStore.updateTransportFee(feeResponse.value.fee);
    }
};

const searchQuery = ref<string>('');
const filterList = (list: any[], query: string, key: string) => {
    if (!query) return list;

    const normalizedQueryNoAccent = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normalizedQueryWithAccent = query.toLowerCase();

    return list.filter(item => {
        const normalizedItem = item[key].toLowerCase();

        const hasAccent = ACCENT_REGEX.test(query);
        if (hasAccent) {
            return normalizedItem.includes(normalizedQueryWithAccent);
        } else {
            const normalizedItemNoAccent = normalizedItem.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return normalizedItemNoAccent.includes(normalizedQueryNoAccent);
        }
    });
};
const filteredProvinces = () => {
    return filterList(provinces.value, searchQuery.value, 'provinceName');
};
const filteredDistricts = () => {
        return filterList(districts.value, searchQuery.value, 'districtName');
};
const filteredWards = () => {
    return filterList(wards.value, searchQuery.value, 'wardName');
};

const setFocused = (field: string) => {
    isFocused.value[field] = true;
};
const removeFocused = (field: string, value: string | null) => {
    isFocused.value[field] = false;
    checkRequired(field, value);
};

const checkRequired = (field: string, value: string | null) => { 
    if (validators[field]) {
        isRequired.value[field] = !value || !validators[field](value);
    } else {
        isRequired.value[field] = !value;
    }
    isFilled.value[field] = !isRequired.value[field];
};

const isModalSelectVoucher = ref(false);
const openModalSelectVoucher = () => {
    isModalSelectVoucher.value = true;
};
const handleSelectedVoucher = (voucher: Voucher) => { 
    replaceOrderStore.updateVoucher(voucher);
    isModalSelectVoucher.value = false;
}

const completePlaceOrder = async () => {

    isLoading.value = true;
    updateLoadingState(true);
    let filledInformation = true;
    for (const [key, value] of Object.entries(isFilled.value)) {
        if (!value) {
            isRequired.value[key] = true;
            filledInformation = false;
        }
    }
    if(!filledInformation){
        isLoading.value = false;
        updateLoadingState(false);
        return;
    }
    if (!order.value) {
        isLoading.value = false;
        updateLoadingState(false);
        return;
    }

    order.value.paymentMethod = selectedPaymentMethod.value;
    order.value.paymentStatus = PaymentStatus.UNPAID;

    // if(order.value.paymentMethod == PaymentMethod.COD)
        order.value.orderStatus = OrderStatus.PENDING;
    // else
    //     order.value.orderStatus = OrderStatus.PAYING;
    
    const response = await fetchReplaceOrder(order.value);
    if(response){
        messageLoading.value = response.data;
    }
};

const cancelOrder = async () => {
    isLoading.value = false;
    updateLoadingState(false);
    try {
        if(responseWebSocket.value){
            const response = await fetchRemoveOrder(responseWebSocket.value.orderId);
            isLoading.value = false;
        } else {
            alert("Đơn hàng chưa lưu thành công!");
            return;
        }
        
    } catch(error: any) {
        alert(error.message);
    }
};

const paymentByMomo = async (order: Order) => {
    if(responseWebSocket.value?.status) {
        const responsePayment = await paymentWithMomo("MOMO", responseWebSocket.value.orderId, order.totalAmountPayable, "");
        if(responsePayment){
            window.open(responsePayment.shortLink, '_blank');
        }
    }
}

function mapProductCheckToOutOfStock(
  products: ProductCheckQuantityNotEnough[]
): ProductOutOfStock[] {
  return products.map((product) => ({
    productId: product.productId,
    name: product.name,
    image: product.image,
    priceSell: product.priceSell,
    discountSell: product.discountSell ?? 0,
    priceImport: 0, 
    quantity: product.quantity ?? 0,
    amount: 0,
    quantityInStock: product.quantityInStock ?? 0,
  }));
}
</script>

<style scoped>
@import "index.css"
</style>
