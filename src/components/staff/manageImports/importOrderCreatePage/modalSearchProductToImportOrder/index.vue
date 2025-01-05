<template>
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h1 class="title-modal">Lựa chọn sản phẩm</h1>
            <div class="modal-search">
                <input type="text" v-model="searchProductId" placeholder="Nhập mã sản phẩm" 
                    :disabled="isEditing" :class="{'disabled': isEditing}"/>
                <button class="btn btn-search" @click="searchProduct" :disabled="isEditing" :class="{'disabled': isEditing}">Kiểm tra</button>
                <button v-if="!isEditing" class="btn btn-add" @click="allowAddProduct">Thêm mới sản phẩm</button>
                <button v-else class="btn btn-cancel" @click="notAllowAddProduct">Hủy thêm mới sản phẩm</button>
            </div>
            <div class="modal-body">
                <table class="form-table">
                    <tr>
                        <td>
                            <label for="name">Tên sản phẩm <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="text" id="name" class="input-information" v-model="product.name" 
                            :class="{'required': isRequired.name}" 
                            :disabled="!isEditing"
                            @focus="setFocused('name')"
                            @blur="removeFocused('name', product.name)"
                            @input="checkRequired('name', product.name)"
                            placeholder="Tên sản phẩm" required />
                            <div v-if="isRequired.name && !product.name" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="priceSell">Giá bán <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td><input type="number" id="priceSell" class="input-information" v-model="product.priceSell" 
                            :class="{'required': isRequired.priceSell}" 
                            :disabled="!isEditing"
                            @focus="setFocused('priceSell')"
                            @blur="removeFocused('priceSell', product.priceSell); validatePriceSell()"
                            @input="checkRequired('priceSell', product.priceSell)"
                            placeholder="0" :min="1000" :max="1000000000" required />
                            <div v-if="isRequired.priceSell && !product.priceSell" class="error">
                                <span>
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </span>
                            </div>
                        </td>
                    </tr>
                    <!-- <tr>
                        <td>
                            <label for="priceImport">Giá nhập <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="number" id="priceImport" class="input-information" v-model="product.priceImport" 
                            :class="{'required': isRequired.priceImport}" 
                            :disabled="!isEditing"
                            @focus="setFocused('priceImport')"
                            @blur="removeFocused('priceImport', product.priceImport); validatePriceImport()"
                            @input="checkRequired('priceImport', product.priceImport)"
                            placeholder="0" :min="1000" :max="1000000000" required />
                            <div v-if="isRequired.priceImport" class="error">
                                <span v-if="!product.priceImport">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </span>
                            </div>
                        </td>
                    </tr> -->
                    <tr v-if="!isEditing">
                        <td>
                            <label for="quantityInStock">Số lượng tồn kho<span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="number" id="quantityInStock" class="input-information disabled" v-model="product.quantityInStock" 
                                placeholder="0" disabled/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="activated">Trạng thái <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <select id="activated" class="input-information" v-model="product.activated"
                                :class="{'disabled': !isEditing}" :disabled="!isEditing">
                                <option :value="true">Đang bán</option>
                                <option :value="false">Ngừng bán</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="quantity">Số lượng nhập<span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="number" id="quantity" class="input-information" v-model="quantity" 
                            :class="{'required': isRequired.quantity}" 
                            :disabled="!product.productId && !isEditing"
                            @focus="setFocused('quantity')"
                            @blur="removeFocused('quantity', quantity!); validateQuantity()"
                            @input="checkRequired('quantity', quantity!)"
                            placeholder="0" :min="1" :max="9999" required />
                            <div v-if="isRequired.quantity" class="error">
                                <span v-if="!quantity">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </span>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="flex w-full items-end justify-end">
                <button class="btn btn-save" @click="chooseProduct()">
                    <span v-if="isLoading" class="loader"></span>
                    <span v-else>Lựa chọn</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SearchProductToImportOrderModal',
});
</script>

<script setup lang="ts">
import { ref, onMounted, defineEmits, defineProps } from 'vue';

import { ProductInImportOrder, fetchSearchProductToImportOrder, fetchAddProductWhenImport } from '../../../../../api/staff/apiProduct.ts';

const props = defineProps<{
    showModal: boolean;
}>();

const product = ref<ProductInImportOrder>({
    productId: '',
    name: '',
    priceSell: null,
    priceImport: null,
    quantityInStock: null,
    activated: true
});

const isLoading = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const searchProductId = ref<string>('');
const quantity = ref<number | null>(null);

const isFocused = ref<Record<string, boolean>>({
    productId: false,
    name: false,
    priceSell: false,
    priceImport: false,
    activated: false,
    quantity: false
});
const isRequired = ref<Record<string, boolean>>({
    productId: false,
    name: false,
    priceSell: false,
    priceImport: false,
    activated: false,
    quantity: false
});
const isFilled = ref<Record<string, boolean>>({
    productId: false,
    name: false,
    priceSell: false,
    priceImport: true,
    activated: true,
    quantity: false
});

const validators: Record<string, (value: string | number) => boolean> = {
    name: (value: string | number) => /^[\p{L}\p{N}\s]+$/u.test(String(value)),
    priceSell: (value: string | number) => /^\d{1,10}$/.test(String(value)),
    priceImport: (value: string | number) => /^\d{1,10}$/.test(String(value)),
    activated: (value: string | number) => /^[\p{L}\s]+$/u.test(String(value)),
    quantity: (value: string | number) => /^\d{1,10}$/.test(String(value)),
};

const setFocused = (field: string) => {
    isFocused.value[field] = true;
};
const removeFocused = (field: string, value: string | null | number) => {
    isFocused.value[field] = false;
    checkRequired(field, value);
};
const checkRequired = (field: string, value: string | null | number) => { 
    if (validators[field]) {
        isRequired.value[field] = (value === null || value === "" || !validators[field](value));
    } else {
        isRequired.value[field] = (value === null || value === "");
    }
    isFilled.value[field] = !isRequired.value[field];
};

const allowAddProduct = () => {
    isEditing.value = true;
    resetProduct();
};
const notAllowAddProduct = () => {
    isEditing.value = false;
    resetProduct();
    Object.keys(isRequired.value).forEach(key => {
        isRequired.value[key] = false;
    });
};

const searchProduct = async () => {
    try {
        const response = await fetchSearchProductToImportOrder(searchProductId.value);
        if(response) {
            product.value = response.data;
        } else {
            alert('Không tìm thấy sản phẩm!');
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const validatePriceSell = () => {
    if (product.value.priceSell! <= 1000) {
        product.value.priceSell = 1000;
        isRequired.value['priceSell'] = false;
    } 
    if (product.value.priceSell! > 1000000000) {
        product.value.priceSell = 1000000000;
        isRequired.value['priceSell'] = false;
    }
}

const validatePriceImport = () => {
    if (product.value.priceImport! <= 1000) {
        product.value.priceImport = 1000;
    } 
    if (product.value.priceImport! > 1000000000) {
        product.value.priceImport = 1000000000;
    }
}

const validateQuantity = () => {
    if (quantity.value! <= 0) {
        quantity.value = 1;
        isRequired.value['quantity'] = false;
    } 
    if (quantity.value! > 999) {
        quantity.value = 999;
        isRequired.value['quantity'] = false;
    }
}

const emit = defineEmits(['close', 'choose-product']);
const closeModal = () => {
    isEditing.value = false;
    emit('close');
};
const resetProduct = () => {
    product.value = {
        productId: '',
        name: '',
        priceSell: null,
        priceImport: null,
        quantityInStock: null,
        activated: true
    };
    searchProductId.value = '';
    quantity.value = null;
};

const chooseProduct = async () => {
    if(!isEditing.value && product.value.productId === '') {
        alert('Vui lòng chọn sản phẩm!');
        return;
    }

    if(isEditing.value) {
        isFilled.value['productId'] = true;
        isLoading.value = true;
        let filledInformation = true;
        for (const [key, value] of Object.entries(isFilled.value)) {
            if (!value) {
                console.log(key, value)
                isRequired.value[key] = true;
                filledInformation = false;
            }
        }
        if(!filledInformation){
            isLoading.value = false;
            return;
        }

        product.value.quantityInStock = 0;

        try {
            const response = await fetchAddProductWhenImport(product.value);
            if (response) {
                alert('Thêm sản phẩm thành công');
                product.value = response.data;
                closeModal();
            } else {
                console.error('Thêm sản phẩm thất bại!');
                isLoading.value = false;
            }
        } catch (error:any) {
            alert(error.message);
            isLoading.value = false;
        }
    }

    emit('choose-product', {
        productId: product.value.productId,
        name: product.value.name,
        priceImport: product.value.priceImport,
        quantity: quantity.value,
        amount: product.value.priceImport! * quantity.value!,
    });
    resetProduct();
};
</script>

<style scoped>
@import "index.css";
</style>