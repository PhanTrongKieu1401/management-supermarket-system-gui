<template>
    <SearchSupplierModal :showModal="isModalSearchSupplier" @close="isModalSearchSupplier = false" @choose-supplier="handleSupplierChoosed"/>
    <SearchProductToImportOrderModal :showModal="isModalAddProduct" @close="isModalAddProduct = false" @choose-product="handleProductAdded"/>
    <div class="container mx-5 my-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/staff/imports">Quản lý đơn hàng nhập</router-link>
                </li>
                <li class="breadcrumb-item active">
                    <router-link to="#">Tạo đơn hàng</router-link>
                </li>
            </ol>
        </nav>
        <div class="order-details">
            <h1 class="font-bold text-xl pb-1">Thông tin đơn hàng nhập</h1>
            <div class="w-full p-3">
                <table class="order-info-table">
                    <thead>
                        <tr>
                            <th colspan="6" class="text-left">
                                <h2>Thông tin nhân viên phụ trách</h2>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width: 16.67%;"><strong>Mã nhân viên:</strong></td>
                            <td style="width: 16.67%;">{{ staff?.staffId }}</td>
                            <td style="width: 16.67%;"><strong>Tên nhân viên:</strong></td>
                            <td style="width: 16.67%;">{{ normalizeName(staff?.firstName, staff?.middleName, staff?.lastName) }}</td>
                            <td style="width: 16.67%;"><strong>Số điện thoại:</strong></td>
                            <td style="width: 16.67%;">{{ staff?.phone }}</td>
                        </tr>
                    </tbody>
                </table>

                <table class="order-info-table">
                    <thead>
                        <tr>
                            <th colspan="6" class="text-left">
                                <div class="flex justify-between">
                                    <h2>Thông tin nhà cung cấp</h2>
                                    <div class="">
                                        <button class="btn" @click="searchSupplier">Tìm nhà cung cấp</button>
                                    </div>
                                </div>
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
                            <td style="width: 16.67%;">{{ supplier?.activated === true ? 'Đang hợp tác' : (supplier?.activated === false ? 'Ngừng hợp tác' : '') }}</td>
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
                        <div>
                            <button class="btn" :class="{'disabled': !supplier.supplierId}" :disabled="!supplier.supplierId" @click="addProductToImportOrder">Thêm sản phẩm vào đơn hàng nhập</button>
                        </div>
                    </div>
                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/12 text-left">STT</th>
                                <th class="w-2/12 text-left">Mã</th>
                                <th class="w-1/12 text-left">Tên</th>
                                <th class="w-2/12 text-left">Giá nhập</th>
                                <th class="w-3/12 text-left">Số lượng</th>
                                <th class="w-2/12 text-left">Thành tiền</th>
                                <th class="w-1/12"></th>
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
                                <td class="text-right">
                                    <div v-if="editingProductId === product.productId" class="flex justify-between items-center">
                                        <input v-model="editedQuantity" type="number" min="1" class="border px-2 py-1 w-20 text-right flex-grow" />
                                        <button @click="saveQuantity(product.productId)" class="bg-red-500 text-white px-2 py-1 rounded ml-2">
                                            Lưu
                                        </button>
                                        <button @click="cancelEditQuantity" class="bg-gray-500 text-white px-2 py-1 rounded ml-2">
                                            Hủy
                                        </button>
                                    </div>
                                    <div v-else class="flex justify-between items-center">
                                        <input v-model="product.quantity" type="number" min="1" class="border px-2 py-1 w-20 text-right flex-grow" 
                                        :class="{'disabled': editingProductId != product.productId}" :disabled="editingProductId != product.productId"/>
                                        <button @click="editQuantity(product)" class="bg-gray-500 text-white px-2 py-1 rounded ml-2">
                                            Sửa
                                        </button>
                                    </div>
                                </td>
                                <td class="text-right">
                                    {{ product.amount.toLocaleString('vi-VN') }} Vnđ
                                </td>
                                <td class="text-right">
                                    <button @click="showPopConfirm(product.productId)" class="bg-gray-500 text-white px-2 py-1 rounded">
                                        <font-awesome-icon :icon="['far', 'trash-can']" />
                                    </button>
                                    <PopConfirmDeleteProductInOrder
                                        :title="'Bạn có muốn xóa sản phẩm này?'"
                                        :visible="visibleProductId === product.productId"
                                        @confirm="() => removeProduct(product.productId)"
                                        @cancel="cancelDelete"
                                        :placement="'top'"
                                        >
                                    </PopConfirmDeleteProductInOrder>
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
            <div class="flex w-full justify-end items-end p-3">
                <button class="btn mr-2" :class="{'disabled': isDisableCreateButton}" :disabled="isDisableCreateButton" @click="createImportOrder">Tạo đơn hàng nhập</button>
                <button class="btn btn-cancel" @click="cancelImport">Hủy nhập hàng</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'ImportOrderCreatePage',
    components: {
        SearchSupplierModal,
        SearchProductToImportOrderModal,
        PopConfirmDeleteProductInOrder
    }
});
</script>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Supplier, Staff, ImportOrderDetail, ProductInImportOrder } from '../../../../api/staff/apiImportOrder.ts';

import { useImportOrderDetailStore } from '../../../../stores/importOrderStore/importOrderStore.ts';

import SearchSupplierModal from '../importOrderCreatePage/modalSearchSupplier/index.vue';
import SearchProductToImportOrderModal from '../importOrderCreatePage/modalSearchProductToImportOrder/index.vue';
import PopConfirmDeleteProductInOrder from "../../pop/popConfirmDeleteProductInOrder/index.vue";
import { normalizeName } from '../../../../utils/normalizeName.ts';

const router = useRouter();
const importOrderDetailStore = useImportOrderDetailStore();
importOrderDetailStore.initWatch();

const importOrderDetail = computed(() => importOrderDetailStore.importOrderDetail);
const supplier = computed(() => importOrderDetail.value?.supplier ?? null);
const staff = computed(() => importOrderDetail.value?.staff ?? null);

const totalNumberProducts = ref<number>(0);
const totalAmount = ref<number>(0);
const isModalSearchSupplier = ref<boolean>(false);
const isModalAddProduct = ref<boolean>(false);
const editingProductId = ref<string | null>(null);
const editedQuantity = ref<number | null>(null);
const visibleProductId = ref<String | null>(null);

onMounted(() => {
    calculateTotals();
});

const searchSupplier = () => {
    isModalSearchSupplier.value = true;
}

const handleSupplierChoosed = (supplierTmp: Supplier) => {
    isModalSearchSupplier.value = false;
    importOrderDetailStore.importOrderDetail.supplier = supplierTmp;
}

const addProductToImportOrder = () => { 
    isModalAddProduct.value = true;
}

const handleProductAdded = (product: ProductInImportOrder) => {
    isModalAddProduct.value = false;
    const existingProduct = importOrderDetail.value.productInImportOrders.find(p => p.productId === product.productId);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
        existingProduct.amount += product.amount;
    } else {
        importOrderDetail.value.productInImportOrders.push(product);
    }
    calculateTotals();
}

const createImportOrder = async () => {
    if (importOrderDetail.value?.supplier.supplierId === '' || importOrderDetail.value?.supplier.supplierId === null) {
        alert("Vui lòng chọn nhà cung cấp trước khi nhập hàng.");
        return;
    }

    if (!importOrderDetail.value?.productInImportOrders || importOrderDetail.value.productInImportOrders.length === 0) {
        alert("Vui lòng thêm ít nhất một sản phẩm trước khi nhập hàng.");
        return;
    }

    try {
        const response = await importOrderDetailStore.createImportOrder();
        if(response){
            alert(response);
            window.location.href = "/staff/imports";
        } else {
            alert(response);
            return;
        }
    } catch (error:any) {
        alert(error.message);
    }
}

const cancelImport = () => {
    importOrderDetailStore.clearImportOrderDetailFromLocalStorage();
    router.push({name: 'ManageImports'});
}

const showPopConfirm = (productId: string) => {
    visibleProductId.value = productId;
};

const cancelDelete = () => {
    visibleProductId.value = null;
};
const removeProduct = (productId: string) => {
    if (importOrderDetail.value) {
        importOrderDetailStore.importOrderDetail.productInImportOrders = importOrderDetailStore.importOrderDetail.productInImportOrders.filter(
            product => product.productId !== productId
        );
        calculateTotals();
    }
};
const editQuantity = (product: ProductInImportOrder) => {
    editingProductId.value = product.productId;
    editedQuantity.value = product.quantity;
};
const saveQuantity = async (productId: string) => {
    if (!editedQuantity.value) {
        alert("Vui lòng nhập số lượng cho sản phẩm!");
        return;
    }
    importOrderDetailStore.updateProductQuantity(productId, editedQuantity.value);
    calculateTotals();
    editingProductId.value = null;
    editedQuantity.value = null;
};
const cancelEditQuantity = () => {
    editingProductId.value = null;
    editedQuantity.value = null;
}

const calculateTotals = () => {
  totalNumberProducts.value = importOrderDetail.value.productInImportOrders.reduce(
    (total, product) => total + product.quantity, 0
  );
  
  totalAmount.value = importOrderDetail.value.productInImportOrders.reduce(
    (total, product) => total + (product.quantity * product.priceImport), 0
  );
};

const isDisableCreateButton = computed(() => {
    return !supplier.value?.supplierId || importOrderDetail.value.productInImportOrders.length === 0;
});
</script>

<style scoped>
@import "index.css"
</style>