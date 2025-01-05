<template>
    <div class="container mx-5 my-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/staff/imports">Quản lý đơn hàng</router-link>
                </li>
                <li class="breadcrumb-item active">
                    <router-link to="#"> {{ importOrderDetail?.importOrderId }}</router-link>
                </li>
            </ol>
        </nav>
        <div class="order-details">
            <h1 class="font-bold text-xl pb-1">Thông tin đơn hàng nhập</h1>
            <div class="w-full p-5">
                <table class="order-info-table">
                    <tbody>
                        <tr>
                            <td><strong>Mã đơn hàng:</strong></td>
                            <td>{{ importOrderDetail?.importOrderId }}</td>
                            <td><strong>Mã nhân viên phụ trách:</strong></td>
                            <td>{{ staff?.staffId }}</td>
                        </tr>
                        <tr>
                            <td><strong>Trạng thái thanh toán:</strong></td>
                            <td>{{ paymentStatus }}</td>
                            <td><strong>Tên nhân viên:</strong></td>
                            <td>{{ fullNameStaff }}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày nhập hàng:</strong></td>
                            <td>{{ importOrderDetail?.importDate }}</td>
                            <td><strong>Số điện thoại nhân viên:</strong></td>
                            <td>{{ staff?.phone }}</td>
                        </tr>
                    </tbody>
                </table>

                <table class="order-info-table">
                    <thead>
                        <tr>
                            <th colspan="6" class="text-left">
                                <h2>Thông tin nhà cung cấp</h2>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width: 16.67%;"><strong>Mã:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.supplierId }}</td>
                            <td style="width: 16.67%;"><strong>Tên:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.name }}</td>
                            <td style="width: 16.67%;"><strong>Số điện thoại:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.phone }}</td>
                        </tr>
                        <tr>
                            <td style="width: 16.67%;"><strong>Email:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.email }}</td>
                            <td style="width: 16.67%;"><strong>Trạng thái:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.activated ? 'Đang hợp tác' : 'Ngừng hợp tác' }}</td>
                            <td style="width: 16.67%;"><strong>Địa chỉ chi tiết:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.addressDetail }}</td>
                        </tr>
                        <tr>
                            <td style="width: 16.67%;"><strong>Phường/xã:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.ward }}</td>
                            <td style="width: 16.67%;"><strong>Quận/huyện:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.district }}</td>
                            <td style="width: 16.67%;"><strong>Tỉnh/thành phố:</strong></td>
                            <td style="width: 16.67%;">{{ supplier?.province }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="w-full pt-5">
                    <div class="flex justify-between items-center h-fit mb-1">
                        <h2 class="">Danh sách sản phẩm: {{ totalNumberProducts }} sản phẩm</h2>
                    </div>
                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/12 text-left">STT</th>
                                <th class="w-2/12 text-left">Mã</th>
                                <th class="w-2/12 text-left">Tên</th>
                                <th class="w-2/12 text-left">Giá nhập</th>
                                <th class="w-2/12 text-left">Số lượng</th>
                                <th class="w-3/12 text-left">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in importOrderDetail?.productInImportOrders" :key="product.productId">
                                <td>{{ index + 1 }}</td>
                                <td>{{ product.productId }}</td>
                                <td>{{ product.name }}</td>
                                <td class="text-right">
                                    {{ product.priceImport.toLocaleString('vi-VN') }} Vnđ
                                </td>
                                <td class="text-right">{{ product.quantity }}</td>
                                <td class="text-right">
                                    {{ product.amount.toLocaleString('vi-VN') }} Vnđ
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" class="font-bold text-right">Tổng tiền:</td>
                                <td class="font-bold text-right">{{ totalAmount.toLocaleString('vi-VN') }} Vnđ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>             
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'ImportOrderDetail',
});
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { Supplier, Staff, ImportOrderDetail, fetchImportOrderDetail } from '../../../../api/staff/apiImportOrder.ts';

import { normalizeName } from '../../../../utils/normalizeName.ts';
import { PaymentStatusDisplay } from '../../../../utils/constants/enum.ts';

const importOrderDetail = ref<ImportOrderDetail>();
const supplier = ref<Supplier>();
const staff = ref<Staff>();
const paymentStatus = ref<string>('');
const fullNameStaff = ref<string>('');
const totalNumberProducts = ref<number>(0);
const totalAmount = ref<number>(0);

const role = localStorage.getItem('role');

onMounted(async () => {
    const importOrderId = getImportOrderIdFromPath();
    fetchImportOrderDetails(importOrderId);
});

const getImportOrderIdFromPath = () => {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
}

const fetchImportOrderDetails = async (importOrderId: string) => {
    try {
        const response = await fetchImportOrderDetail(importOrderId);
        if(response) {
            importOrderDetail.value = response.data;
            supplier.value = importOrderDetail.value.supplier;
            staff.value = importOrderDetail.value.staff;
            fullNameStaff.value = normalizeName(staff.value.firstName, staff.value.middleName, staff.value.lastName);
            paymentStatus.value = PaymentStatusDisplay[importOrderDetail.value.paymentStatus] || importOrderDetail.value.paymentStatus;
            totalNumberProducts.value = importOrderDetail.value.productInImportOrders.reduce((total, product) => total + product.quantity, 0);
            totalAmount.value = importOrderDetail.value.productInImportOrders.reduce((total, product) => total + product.amount, 0);
        } else {
            console.log("Lấy dữ liệu không thành công");
        }
    } catch (error:any) {
        alert(error.message);
    }
};
</script>

<style scoped>
@import "index.css"
</style>