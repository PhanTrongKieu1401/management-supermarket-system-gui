<template>
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h1 class="title-modal">Thêm sản phẩm</h1>
            <div class="modal-body">
                <table class="form-table">
                    <tr>
                        <td>
                            <label for="name">Tên sản phẩm <span class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="text" id="name" v-model="product.name" 
                            :class="{'required': isRequired.name}" 
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
                            <label for="size">Kích thước <span class="required-star">*</span></label>
                        </td>
                        <td><input type="text" id="size" v-model="product.size" 
                            :class="{'required': isRequired.size}" 
                            @focus="setFocused('size')"
                            @blur="removeFocused('size', product.size)"
                            @input="checkRequired('size', product.size)"
                            placeholder="Kích thước" required />
                            <div v-if="isRequired.size && !product.size" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="priceSell">Giá bán (Vnđ) <span class="required-star">*</span></label>
                        </td>
                        <td><input type="number" id="priceSell" v-model.number="product.priceSell" 
                            placeholder="0"
                            :min="0" :max="1000000000"
                            :class="{'required': isRequired.priceSell}" 
                            @focus="setFocused('priceSell')"
                            @blur="removeFocused('priceSell', product.priceSell); validatePriceSell()"
                            @input="checkRequired('priceSell', product.priceSell)" required />
                            <div v-if="isRequired.priceSell && !product.priceSell" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="priceImport">Giá nhập (Vnđ) <span class="required-star">*</span></label>
                        </td>
                        <td><input type="number" id="priceImport" v-model.number="product.priceImport"
                            placeholder="0"
                            :min="0" :max="1000000000"
                            :class="{'required': isRequired.priceImport}" 
                            @focus="setFocused('priceImport')"
                            @blur="removeFocused('priceImport', product.priceImport); validatePriceImport()"
                            @input="checkRequired('priceImport', product.priceImport)" required/>
                            <div v-if="isRequired.priceImport && !product.priceImport" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="quantityInStock">Số lượng trong kho <span class="required-star">*</span></label>
                        </td>
                        <td><input type="number" id="quantityInStock" v-model.number="product.quantityInStock"
                            placeholder="0"
                            :min="1" :max="9999"
                            :class="{'required': isRequired.quantityInStock}" 
                            @focus="setFocused('quantityInStock')"
                            @blur="removeFocused('quantityInStock', product.quantityInStock); validateQuantityInStock()"
                            @input="checkRequired('quantityInStock', product.quantityInStock)" required />
                            <div v-if="isRequired.quantityInStock && !product.quantityInStock" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="description">Mô tả:</label>
                        </td>
                        <td><textarea id="description" v-model="product.description"></textarea></td>
                    </tr>
                    <tr>
                        <td>
                            <label for="category">Danh mục <span class="required-star">*</span></label>
                        </td>
                        <td>
                            <select id="category" v-model="product.categoryId"
                            :class="{'required': isRequired.category}" 
                            @focus="setFocused('category')"
                            @blur="removeFocused('category', product.categoryId)"
                            @change="checkRequired('category', product.categoryId)">
                                <option value="">Chọn danh mục sản phẩm</option>
                                <option v-for="category in categoryFilter" :key="category.categoryId" :value="category.categoryId">
                                    {{ category.categoryName }}
                                </option>
                            </select>
                            <div v-if="isRequired.category && !product.categoryId" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="activated">Trạng thái <span class="required-star">*</span></label>
                        </td>
                        <td>
                            <select id="activated" v-model="product.activated">
                                <option value="true">Hoạt động</option>
                                <option value="false">Không hoạt động</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div class="right-column">
                    <div class="form-group">
                        <label for="discount">Ưu đãi</label>
                        <input type="number" id="discount" v-model="product.discount" @input="onDiscountInput" 
                        placeholder="0"/>
                    </div>
                    
                    <div class="form-group">
                        <label for="startDate">Ngày bắt đầu ưu đãi <span class="required-star" v-if="showRequireStar">*</span></label>
                        <div class="relative w-full">
                            <input type="date" :disabled="!product.discount" v-model="product.startDate" class="date-input" 
                            :min="currentDate" 
                            :class="{'required': isRequired.startDate}" 
                            @focus="setFocused('startDate')"
                            @blur="removeFocused('startDate', product.startDate)"
                            @change="checkRequired('startDate', product.startDate)"/>
                            <div v-if="isRequired.startDate && !product.startDate" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="endDate">Ngày kết thúc ưu đãi <span class="required-star" v-if="showRequireStar">*</span></label>
                        <div class="relative w-full">
                            <input type="date" :disabled="!product.discount || !product.startDate" v-model="product.endDate" class="date-input" 
                            :min="getMinEndDate()"
                            :class="{'required': isRequired.endDate}" 
                            @focus="setFocused('endDate')"
                            @blur="removeFocused('endDate', product.endDate)"
                            @change="checkRequired('endDate', product.endDate)"/>
                            <div v-if="isRequired.endDate && !product.endDate" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </div>
                    </div>
                    <div class="image-preview">
                        <h3>Chọn hình ảnh <span class="required-star">*</span></h3>
                        <div class="image-upload">
                            <input type="file" @change="onImageSelected" accept="image/*" id="file-input" class="file-input" ref="fileInput" 
                            @focus="setFocused('image')"/>
                            <label for="file-input" class="upload-label" :class="{ 'hidden': imagePreview }">
                                <font-awesome-icon icon="image" class="upload-icon" />
                                <span class="upload-text">Chọn ảnh</span>
                            </label>
                            <img v-if="imagePreview" :src="imagePreview" alt="Hình ảnh sản phẩm" class="image-preview-thumbnail" />
                        </div>
                        <div v-if="isRequired.image && !product.image" class="error">
                            <font-awesome-icon icon="exclamation-circle"/> Vui lòng chọn một hình ảnh!
                        </div>
                    </div>

                    <div class="button-group">
                        <button class="btn btn-save" @click="saveProduct" :disabled="isLoading">
                            <span v-if="isLoading" class="loader"></span>
                            <span v-else>Lưu</span>
                        </button>
                        <button class="btn btn-cancel" @click="closeModal" :disabled="isLoading">Hủy</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'AddProductManualModal',
});
</script>

<script setup lang="ts">
import { ref, onMounted, computed, defineEmits, defineProps } from 'vue';

import { CategoryFilter, fetchCategoryFilter } from '../../../../api/staff/apiCategory';
import { InsertProductRequest, fetchInsertProduct } from '../../../../api/staff/apiProduct';

const props = defineProps<{
    showModal: boolean;
}>();

const categoryFilter = ref<CategoryFilter[]>([]);

const product = ref<InsertProductRequest>({
    name: '',
    size: '',
    priceSell: 0,
    priceImport: 0,
    quantityInStock: 0,
    description: '',
    categoryId: '',
    activated: true,
    discount: 0, 
    startDate: null,
    endDate: null,
    image: ''
});

const currentDate = computed(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});
const isLoading = ref<boolean>(false);

onMounted(async () => {
    try {
        const response = await fetchCategoryFilter();
        if (response) {
            categoryFilter.value = response.data;
        } else {
            console.error('Lấy danh sách loại sản phẩm thất bại');
        }
    } catch (error:any) {
        alert(error.message);
    }
})

const imagePreview = ref<string | null>(null);
const showRequireStar = ref<boolean>(false);

const isFocused = ref<Record<string, boolean>>({
    name: false,
    size: false,    
    priceSell: false,
    priceImport: false,
    quantityInStock: false,
    category: false,
    activated: false,
    discount: false,
    startDate: false,
    endDate: false,
    image: false
});
const isRequired = ref<Record<string, boolean>>({
    name: false,
    size: false,    
    priceSell: false,
    priceImport: false,
    quantityInStock: false,
    category: false,
    activated: false,
    discount: false,
    startDate: false,
    endDate: false,
    image: false
});
const isFilled = ref<Record<string, boolean>>({
    name: false,
    size: false,    
    priceSell: false,
    priceImport: false,
    quantityInStock: false,
    category: false,
    activated: true,
    discount: true, 
    startDate: true,
    endDate: true,
    image: false
});

const validators: Record<string, (value: string | number) => boolean> = {
    name: (value: string | number) => /^[\p{L}\p{N}\s]+$/u.test(String(value)),
    size: (value: string | number) => /^[\p{L}\p{N}\s]+$/u.test(String(value)),
    priceSell: (value: string | number) => /^\d{1,10}$/.test(String(value)),
    priceImport: (value: string | number) => /^\d{1,10}$/.test(String(value)),
    quantityInStocK: (value: string | number) => /^\d+$/.test(String(value)),
    desciption: (value: string | number) => /^[\p{L}\p{N}\s.,!?"'()]+$/u.test(String(value)),
    category: (value: string | number) => /^[\p{L}\s]+$/u.test(String(value)),
    activated: (value: string | number) => /^[\p{L}\s]+$/u.test(String(value)),
    discount: (value: string | number) => /^\d{1,10}$/.test(String(value)),
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
        isRequired.value[field] = !value || !validators[field](value);
    } else {
        isRequired.value[field] = !value;
    }
    isFilled.value[field] = !isRequired.value[field];
};

const emit = defineEmits(['close']);
const closeModal = () => {
    isLoading.value = false;
    resetProduct();
    emit('close');
};
const resetProduct = () => {
    product.value = {
        name: '',
        size: '',
        priceSell: 0,
        priceImport: 0,
        quantityInStock: 0,
        description: '',
        categoryId: '',
        activated: true,
        discount: 0,
        startDate: null,
        endDate: null,
        image: ''
    };
    imagePreview.value = null;
};

const validatePriceSell = () => {
    if (product.value.priceSell <= 0) {
        product.value.priceSell = 0;
        isRequired.value['priceSell'] = false;
    } 
    if (product.value.priceSell > 1000000000) {
        product.value.priceSell = 1000000000;
        isRequired.value['priceSell'] = false;
    }
}

const validatePriceImport = () => {
    if (product.value.priceImport <= 0) {
        product.value.priceImport = 0;
    } 
    if (product.value.priceImport > 1000000000) {
        product.value.priceImport = 1000000000;
    }
}

const validateQuantityInStock = () => {
    if (product.value.quantityInStock <= 0) {
        product.value.quantityInStock = 0;
    } 
    if (product.value.quantityInStock > 9999) {
        product.value.quantityInStock = 9999;
    }
}

const onDiscountInput = (event: Event) => {
    if (product.value.discount) {
        showRequireStar.value = true; 
        isRequired.value["startDate"] = false; 
        isRequired.value["endDate"] = false;   
        isFilled.value["startDate"] = false;    
        isFilled.value["endDate"] = false;  
        
        if (product.value?.discount <= 0) {
            product.value.discount = 0;
        } 
        if (product.value.discount > 1000000000) {
            product.value.discount = 1000000000;
        }
        
    } else {
        showRequireStar.value = false; 
        product.value.startDate = null;
        product.value.endDate = null;
    }
}

const getMinEndDate = () => {
    if (product.value.startDate) {
        const startDate = new Date(product.value.startDate);
        startDate.setDate(startDate.getDate() + 1);
        return startDate.toISOString().split('T')[0];
    }
    return undefined;
}

const onImageSelected = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = e => {
            const base64String = e.target?.result as string;
            product.value.image = base64String;
            imagePreview.value = base64String;
            checkRequired('image', product.value.image);
        };
        reader.readAsDataURL(file);
    } else if (target.files && target.files.length === 0) {
        checkRequired('image', product.value.image);
    }
};

const saveProduct = async () => {

    isLoading.value = true;
    let filledInformation = true;
    for (const [key, value] of Object.entries(isFilled.value)) {
        if (!value) {
            isRequired.value[key] = true;
            filledInformation = false;
        }
    }
    if(!filledInformation){
        isLoading.value = false;
        return;
    }

    try {
        const response = await fetchInsertProduct(product.value);
        if (response) {
            alert('Thêm sản phẩm thành công');
            resetProduct();
            closeModal();
        } else {
            console.error('Thêm sản phẩm thất bại');
            isLoading.value = false;
        }
    } catch (error:any) {
        alert(error.message);
        isLoading.value = false;
    }
};
</script>

<style scoped>
@import "index.css";
</style>