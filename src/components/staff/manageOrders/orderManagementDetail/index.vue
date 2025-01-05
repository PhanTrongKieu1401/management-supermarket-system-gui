<template>
    <LoadingCancelModal :isLoading="isLoading" :message="messageLoading"/>
    <ProductsOutOfStockModal :products="outOfStockProducts" :visible="isModalOutOfStockVisible" @close="isModalOutOfStockVisible = false" />
    <div class="container mx-5 my-10">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/staff/orders">Quản lý đơn hàng</router-link>
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
                            <td>{{ orderDetail?.paymentMethod }}</td>
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
                            <td><strong>Ngày thanh toán/đặt đơn:</strong></td>
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
                        <tr v-if="orderDetail?.customerInOrderResponse">
                            <td v-if="orderDetail?.customerInOrderResponse"><strong>Họ và tên:</strong></td>
                            <td v-if="orderDetail?.customerInOrderResponse">{{ orderDetail.customerInOrderResponse.firstName }} {{
                                orderDetail.customerInOrderResponse.middleName }} {{ orderDetail.customerInOrderResponse.lastName }}</td>
                            <td v-if="orderDetail?.receiverInOrderResponse"><strong>Họ và tên:</strong></td>
                            <td>
                                <span v-if="orderDetail?.receiverInOrderResponse">{{ orderDetail.receiverInOrderResponse.fullName }}</span>
                            </td>
                        </tr>

                        <tr v-if="orderDetail?.customerInOrderResponse">
                            <td v-if="orderDetail?.customerInOrderResponse"><strong>Số điện thoại:</strong></td>
                            <td v-if="orderDetail?.customerInOrderResponse">{{ orderDetail.customerInOrderResponse.phone }}</td>
                            <td v-if="orderDetail?.receiverInOrderResponse"><strong>Số điện thoại:</strong></td>
                            <td >
                                <span v-if="orderDetail?.receiverInOrderResponse">
                                    {{ orderDetail.receiverInOrderResponse.phone }}
                                </span>
                            </td>
                        </tr>

                        <tr v-if="orderDetail?.customerInOrderResponse">
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
                    <div class="flex justify-between items-center h-fit mb-1">
                        <h2 class="">Danh sách sản phẩm: {{ orderDetail?.totalNumberProducts }} sản phẩm</h2>
                        <div v-if="orderDetail?.orderStatus === OrderStatus.PENDING && !isEditing">
                            <button @click="startEditing" class="w-auto h-auto px-2 py-1 bg-[rgb(228,68,52)] text-white rounded">
                                Chỉnh sửa đơn hàng
                            </button>
                        </div>
                        <div v-else-if="isEditing" class="flex">
                            <button @click="saveChanges" class="flex justify-center items-center w-auto h-auto px-2 py-1 mr-1 bg-[rgb(228,68,52)] text-white rounded">
                                <span v-if="isLoadingSaveChange" class="loader"></span>
                                 <span v-else>Lưu và phê duyệt</span>
                            </button>
                            <button @click="cancelEditing" class="w-auto h-auto px-2 py-1 bg-gray-500 text-white rounded">
                                Hủy sửa
                            </button>
                        </div>
                    </div>
                    <table class="table-fixed w-full">
                        <thead>
                            <tr>
                                <th class="w-1/12 text-left">STT</th>
                                <th class="w-1/12 text-left">Ảnh</th>
                                <th class="w-2/12 text-left">Tên</th>
                                <th class="w-3/12 text-left">Giá cả</th>
                                <th class="w-3/12 text-left">Số lượng</th>
                                <th class="w-2/12 text-left">Thành tiền</th>
                                <th v-if="isEditing" class="w-1/12 text-left"></th>
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
                                <td class="text-right">
                                    <div v-if="!isEditing" class="flex justify-between items-center">
                                        <span>{{ product.quantity }}</span>
                                    </div>
                                    <div v-else-if="editingProductId === product.productId" class="flex justify-between items-center">
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
                                        <button v-if="isEditing" @click="editQuantity(product)" class="bg-gray-500 text-white px-2 py-1 rounded ml-2">
                                            Sửa
                                        </button>
                                    </div>
                                </td>
                                <td class="text-right">
                                    {{ product.amount.toLocaleString('vi-VN') }} Vnđ
                                </td>
                                <td v-if="isEditing" class="text-right">
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
                            <tr v-if="isEditing">
                                <td colspan="6" class="text-right">
                                    <button @click="showAddProductModal" class="bg-red-500 text-white px-2 py-1 rounded">Thêm sản phẩm</button>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" class="font-bold text-right">Tổng tiền trước giảm:</td>
                                <td class="text-right">{{ (orderDetail?.totalAmount! + orderDetail?.totalPriceReduced! - orderDetail?.transportFee!).toLocaleString('vi-VN') }} Vnđ</td>
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
                    <button v-if="role === AccountType.STAFF && orderDetail?.orderStatus === OrderStatus.PENDING" 
                        :disabled="isEditing" :class="{'disabled': isEditing}"
                        @click="refuseOrder(orderDetail?.orderId)" class="cancel-button">Từ chối đơn</button>
                    <button v-if="role === AccountType.STAFF && orderDetail?.orderStatus === OrderStatus.PENDING" 
                        :disabled="isEditing" :class="{'disabled': isEditing}"
                        @click="acceptOrder(orderDetail?.orderId)" class="accept-button">Nhận đơn</button>
                    <button v-if="role === AccountType.STAFF && orderDetail?.orderStatus === OrderStatus.APPROVED" 
                        @click="cancelOrder(orderDetail?.orderId)" class="cancel-button">Hủy đơn</button>
                    <button v-if="role === AccountType.STAFF && orderDetail?.orderStatus === OrderStatus.APPROVED" 
                        @click="deliverOrder(orderDetail?.orderId)" class="deliver-button">Giao hàng</button>
                    <!-- <button v-if="role === AccountType.STAFF && orderDetail?.orderStatus === OrderStatus.DELIVERED" 
                        @click="confirmCompletion(orderDetail?.orderId)" class="confirm-button">Hoàn thành</button> -->
                </div>                
            </div>
        </div>
    </div>
    <PopConfirmCancelOrder
        :title="'Bạn có chắc chắn muốn hủy đơn hàng này? Hãy chắc chắn bạn đã xác nhận với khách hàng!'"
        :visible="showConfirm === true"
        @confirm="cancelOrder"
        @cancel="showConfirm = false"
        :placement="'top'">
    </PopConfirmCancelOrder>
    <AddProductInOrderModal :visible="isModalAddProductInOrderVisible" @close="isModalAddProductInOrderVisible = false" @apply-product="handleAddProduct" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'OrderManagementDetail',
    components: {
        PopConfirmCancelOrder,
        LoadingCancelModal,
        AddProductInOrderModal,
        ProductsOutOfStockModal,
        PopConfirmDeleteProductInOrder
    }
});
</script>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { fetchQuantityInStock } from '../../../../api/staff/apiProduct.ts';
import { ProductInOrder, OrderDetail, fetchOrderDetail, fetchAcceptOrder, fetchRefuseOrder, fetchDeliverOrder, fetchCancelOrder, fetchAddProductToOrder } from '../../../../api/staff/apiOrder.ts';

import LoadingCancelModal from '../../../modal/modalLoadingCancel/index.vue';
import ProductsOutOfStockModal from '../../../modal/modalOutOfStockListProduct/index.vue';
import AddProductInOrderModal from '../modalAddProductInOrder/index.vue';
import PopConfirmCancelOrder from '../../../pop/popConfirmCancelOrder/index.vue';
import PopConfirmDeleteProductInOrder from '../../pop/popConfirmDeleteProductInOrder/index.vue';

import { normalizeName } from '../../../../utils/normalizeName.ts';
import { OrderStatus } from '../../../../utils/constants/enum.ts';
import { PaymentStatusDisplay, OrderStatusDisplay, AccountType } from '../../../../utils/constants/enum.ts';

export interface ProductOutOfStock {
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

const orderDetail = ref<OrderDetail>();
const orderDetailTmp = ref<OrderDetail>();
const paymentStatus = ref<string>('');
const orderStatus = ref<string>('');

const role = localStorage.getItem('role');
const showConfirm = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const isLoadingSaveChange = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const messageLoading = ref<string>('');
const isModalOutOfStockVisible = ref<boolean>(false);
const isModalAddProductInOrderVisible = ref<boolean>(false);
const editingProductId = ref<string | null>(null);
const editedQuantity = ref<number | null>(null);
const visibleProductId = ref<String | null>(null);
const outOfStockProducts: ProductOutOfStock[] = [];

onMounted(async () => {
    const orderId = getOrderIdFromPath();
    fetchOrderDetails(orderId);
});

watch(orderDetail, (newOrderDetail) => {

});

const getOrderIdFromPath = () => {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
}

const cancelOrder = async (orderId: string) => {
    try {
        messageLoading.value = 'Đang hủy đơn...';
        isLoading.value = true;
        const response = await fetchCancelOrder(orderId);
        if(response) {
            isLoading.value = false;
            messageLoading.value = '';
            await fetchOrderDetails(orderId);
        } else {
            alert(response.message);
        }
    } catch(error: any) {
        alert(error.message);
    }
};

const refuseOrder = async (orderId: string) => {
    try {
        messageLoading.value = 'Đang từ chối đơn...';
        isLoading.value = true;
        const response = await fetchRefuseOrder(orderId);
        if(response) {
            isLoading.value = false;
            messageLoading.value = '';
            await fetchOrderDetails(orderId);
        } else {
            alert(response.message);
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const acceptOrder = async (orderId: string) => {
    try {
        if (!orderDetail.value) return;
        const products = orderDetail.value.productInOrderResponses;
        
        outOfStockProducts.splice(0, outOfStockProducts.length);

        messageLoading.value = 'Đang kiểm tra tồn kho...';
        isLoading.value = true;
        for (const product of products) {
            try {
                const response = await fetchQuantityInStock(product.productId);
                if(response) {
                    const quantityInStock = response.data;
                    if (product.quantity > quantityInStock) {
                        outOfStockProducts.push({
                            ...product,
                            quantityInStock: quantityInStock
                        });
                    }
                }
            } catch (error: any) {
                alert(error.message);
            }
        }

        if (outOfStockProducts.length > 0) {
            isModalOutOfStockVisible.value = true;
            isLoading.value = false;
            return;
        }

        messageLoading.value = 'Đang phê duyệt đơn...';
        isLoading.value = true;
        const response = await fetchAcceptOrder(orderId);
        if(response) {
            isLoading.value = false;
            messageLoading.value = '';
            await fetchOrderDetails(orderId);
        } else {
            alert(response.message);
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const deliverOrder = async (orderId: string) => {
    try {
        messageLoading.value = 'Đang cập nhật...';
        isLoading.value = true;
        const response = await fetchDeliverOrder(orderId);
        if(response) {
            isLoading.value = false;
            messageLoading.value = '';
            await fetchOrderDetails(orderId);
        } else {
            alert(response.message);
        }
    } catch (error:any) {
        alert(error.message);
    }
};

// const confirmCompletion = async (orderId: string) => {
//     try {
//         messageLoading.value = 'Đang từ chối đơn...';
//         isLoading.value = true;
//         const response = await fetchRefuseOrder(orderId);
//         if(response) {
//             isLoading.value = false;
//             messageLoading.value = '';
//             await fetchOrderDetails(orderId);
//         } else {
//             alert(response.message);
//         }
//     } catch (error:any) {
//         alert(error.message);
//     }
// };

const startEditing = () => {
    isEditing.value = true;
}

const saveChanges = async () => {  
    isLoadingSaveChange.value = true;
    try {
        const response = await fetchAddProductToOrder(orderDetail.value?.orderId!, orderDetail.value?.productInOrderResponses!);
        if(response) {
            orderDetail.value = response.data;
        } else {
            alert("Lưu đơn hàng thất bại");
        }
    } catch (error:any) {
        alert(error.message);
    }  
    isEditing.value = false;
    isLoadingSaveChange.value = false;
}

const cancelEditing = () => {
    if (orderDetailTmp.value) {
        orderDetail.value = JSON.parse(JSON.stringify(orderDetailTmp.value));
    }
    isEditing.value = false;
}

const showPopConfirm = (productId: string) => {
    visibleProductId.value = productId;
};

const cancelDelete = () => {
    visibleProductId.value = null;
};

const removeProduct = (productId: string) => {
    if (orderDetail.value) {
        for (let product of orderDetail.value.productInOrderResponses) {
            if(product.productId == productId) {
                orderDetail.value.totalNumberProducts -= product.quantity;
                if(product.discountSell && product.discountSell > 0) {
                    orderDetail.value.totalPriceReduced -= (product.priceSell - product.discountSell) * product.quantity;
                    orderDetail.value.totalAmount -= product.discountSell * product.quantity;
                } else {
                    orderDetail.value.totalAmount -= product.priceSell * product.quantity;
                }
                break;
            }
        }
        orderDetail.value.productInOrderResponses = orderDetail.value.productInOrderResponses.filter(
            product => product.productId !== productId
        );
    }
};

const editQuantity = (product: ProductInOrder) => {
    editingProductId.value = product.productId;
    editedQuantity.value = product.quantity;
};
const saveQuantity = async (productId: string) => {
    if (!editedQuantity.value) {
        alert("Vui lòng nhập số lượng cho sản phẩm!");
        return;
    }
    try {
        const response = await fetchQuantityInStock(productId);
        if(response) {
            const quantityInStock = response.data;
            if (editedQuantity.value! > quantityInStock) {
                alert("Chỉ còn " + quantityInStock + " sản phẩm trong kho hàng!");
                editedQuantity.value = quantityInStock;
                return;
            }
        }
    } catch (error: any) {
        alert(error.message);
    }
    const product = orderDetail.value?.productInOrderResponses.find(p => p.productId === productId);
    if (product && orderDetail.value) {
        orderDetail.value.totalNumberProducts = orderDetail.value.totalNumberProducts - product.quantity + editedQuantity.value;
        if(product.discountSell && product.discountSell > 0) {
            orderDetail.value.totalPriceReduced = orderDetail.value.totalPriceReduced - (product.priceSell - product.discountSell) * (product.quantity - editedQuantity.value);
            orderDetail.value.totalAmount = orderDetail.value.totalAmount - product.amount + editedQuantity.value * product.discountSell;
            product.amount = editedQuantity.value * product.discountSell;
        } else {
            orderDetail.value.totalAmount = orderDetail.value.totalAmount - product.amount + editedQuantity.value * product.priceSell;
            product.amount = editedQuantity.value * product.priceSell;
        }
        product.quantity = editedQuantity.value;
    }
    editingProductId.value = null;
    editedQuantity.value = null;
};
const cancelEditQuantity = () => {
    editingProductId.value = null;
    editedQuantity.value = null;
}

const showAddProductModal = () => {
    isModalAddProductInOrderVisible.value = true;
}

const handleAddProduct = (product: ProductInOrder) => {
    if(orderDetail.value) {
        const existingProduct = orderDetail.value.productInOrderResponses.find(
            (p) => p.productId === product.productId
        );

        if (existingProduct) {
            existingProduct.quantity += product.quantity;
            if(product.discountSell && product.discountSell > 0) {
                existingProduct.amount = existingProduct.quantity * product.discountSell;
            } else {
                existingProduct.amount = existingProduct.quantity * product.priceSell;
            }
        } else {
            orderDetail.value.productInOrderResponses.push(product);
        }

        orderDetail.value.totalNumberProducts += product.quantity;
        if(product.discountSell && product.discountSell > 0) {
            orderDetail.value.totalPriceReduced += (product.priceSell - product.discountSell) * product.quantity;
            orderDetail.value.totalAmount += product.discountSell * product.quantity;
        } else {
            orderDetail.value.totalAmount += product.priceSell * product.quantity;
        }
    }
    isModalAddProductInOrderVisible.value = false;
}

const fetchOrderDetails = async (orderId: string) => {
    try {
        const response = await fetchOrderDetail(orderId);
        if(response) {
            orderDetail.value = response.data;
            orderDetailTmp.value = JSON.parse(JSON.stringify(orderDetail.value));
            paymentStatus.value = PaymentStatusDisplay[orderDetail.value.paymentStatus] || orderDetail.value.paymentStatus;
            orderStatus.value = OrderStatusDisplay[orderDetail.value.orderStatus] || orderDetail.value.orderStatus;
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