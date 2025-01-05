<template>
    <div v-if="showModal" class="modal">
        <div class="modal-content">
            <span class="close" @click="closeModal">&times;</span>
            <h1 class="title-modal">Lựa chọn nhà cung cấp</h1>
            <div class="modal-search">
                <input type="text" v-model="searchSupplierId" placeholder="Nhập mã nhà cung cấp" 
                    :disabled="isEditing" :class="{'disabled': isEditing}"/>
                <button class="btn btn-search" @click="searchSupplier" :disabled="isEditing" :class="{'disabled': isEditing}">Kiểm tra</button>
                <button v-if="!isEditing" class="btn btn-add" @click="allowAddSupplier">Thêm mới nhà cung cấp</button>
                <button v-else class="btn btn-cancel" @click="notAllowAddSupplier">Hủy thêm mới nhà cung cấp</button>
            </div>
            <div class="modal-body">
                <table class="form-table">
                    <tr>
                        <td>
                            <label for="name">Tên nhà cung cấp <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="text" id="name" class="input-information" v-model="supplier.name" 
                            :class="{'required': isRequired.name}" 
                            :disabled="!isEditing"
                            @focus="setFocused('name')"
                            @blur="removeFocused('name', supplier.name)"
                            @input="checkRequired('name', supplier.name)"
                            placeholder="Tên nhà cung cấp" required />
                            <div v-if="isRequired.name && !supplier.name" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="phone">Số điện thoại <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td><input type="text" id="phone" class="input-information" v-model="supplier.phone" 
                            :class="{'required': isRequired.phone}" 
                            :disabled="!isEditing"
                            @focus="setFocused('phone')"
                            @blur="removeFocused('phone', supplier.phone)"
                            @input="checkRequired('phone', supplier.phone)"
                            placeholder="Số điện thoại" required />
                            <div v-if="isRequired.phone" class="error">
                                <span v-if="!supplier.phone">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </span>
                                <span v-else>
                                    <font-awesome-icon icon="exclamation-circle"/> Số điện thoại không hợp lệ.
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="province">Tỉnh/thành phố <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <div class="relative w-full" v-click-outside="closeDropdownProvince">
                                <input type="text" id="province" class="input-information drop" v-model="supplier.province"
                                    :class="{'required': isRequired.province}" 
                                    :disabled="!isEditing"
                                    @click="toggleDropdown('province')"
                                    autocomplete="off">
                                <label for="province" class="label-information transition-all duration-300 ease-in-out"
                                    :class="{'transform translate-y-5 text-[16px]': !supplier.province}">
                                    <span class="flex w-full justify-between">
                                        <span v-if="!supplier.province">Chọn tỉnh/thành phố</span>
                                    </span>
                                </label>
                                <label for="province" class="icon-drop">
                                    <div v-if="dropdownState.province">
                                        <font-awesome-icon :icon="['fas', 'chevron-up']" />
                                    </div>
                                    <div v-else>
                                        <font-awesome-icon :icon="['fas', 'chevron-down']" />
                                    </div>
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
                                <div v-if="isRequired.province && !supplier.province" class="error">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="ward">Phường/xã <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <div class="relative w-full" v-click-outside="closeDropdownWard">
                                <input type="text" id="ward" class="input-information drop" v-model="supplier.ward"
                                    :class="{'required': isRequired.ward}" 
                                    :disabled="!supplier.district || !isEditing"
                                    @click="toggleDropdown('ward')"
                                    autocomplete="off">
                                <label for="ward" class="label-information transition-all duration-300 ease-in-out"
                                    :class="{'transform translate-y-5 text-[16px]': !supplier.ward}">
                                    <span v-if="!supplier.ward" class="flex w-full justify-between">
                                        Chọn phường/xã
                                    </span>
                                </label>
                                <label for="ward" class="icon-drop">
                                    <div v-if="dropdownState.ward">
                                        <font-awesome-icon :icon="['fas', 'chevron-up']" />
                                    </div>
                                    <div v-else>
                                        <font-awesome-icon :icon="['fas', 'chevron-down']" />
                                    </div>
                                </label>
                                <div v-if="wards.length && dropdownState.ward" class="dropdown dropdown-above" @mousedown.stop>
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
                                <div v-if="isRequired.ward && !supplier.ward" class="error">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                </table>
                <table class="form-table">
                    <tr>
                        <td>
                            <label for="email">Email <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <input type="text" id="email" class="input-information" v-model="supplier.email" 
                            :class="{'required': isRequired.email}" 
                            :disabled="!isEditing"
                            @focus="setFocused('email')"
                            @blur="removeFocused('email', supplier.email)"
                            @input="checkRequired('email', supplier.email)"
                            placeholder="Email" required />
                            <div v-if="isRequired.email" class="error">
                                <span v-if="!supplier.email">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </span>
                                <span v-else>
                                    <font-awesome-icon icon="exclamation-circle"/> Email không hợp lệ.
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="activated">Trạng thái <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td><select id="activated" class="input-information" v-model="supplier.activated" 
                            :class="{'required': isRequired.activated}" 
                            :disabled="!isEditing"
                            @focus="setFocused('activated')"
                            @blur="removeFocused('activated', supplier.activated)"
                            @change="checkRequired('activated', supplier.activated)"
                            placeholder="Trạng thái" required>
                            <option :value="true">Hợp tác</option>
                            <option :value="false">Không hợp tác</option>
                            <option :value="null" :hidden="isEditing">Trạng thái hợp tác</option>
                        </select>
                            <div v-if="isRequired.activated && supplier.activated === null" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="district">Quận/huyện <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td>
                            <div class="relative w-full" v-click-outside="closeDropdownDistrict">
                                <input type="text" id="district" class="input-information drop" v-model="supplier.district"
                                    :class="{'required': isRequired.district}" 
                                    :disabled="!supplier.province || !isEditing"
                                    @click="toggleDropdown('district')"
                                    autocomplete="off">
                                <label for="district" class="label-information transition-all duration-300 ease-in-out"
                                    :class="{'transform translate-y-5 text-[16px]': !supplier.district}">
                                    <span v-if="!supplier.district" class="flex w-full justify-between">
                                        Chọn quận/huyện
                                    </span>
                                </label>
                                <label for="district" class="icon-drop">
                                    <div v-if="dropdownState.district">
                                        <font-awesome-icon :icon="['fas', 'chevron-up']" />
                                    </div>
                                    <div v-else>
                                        <font-awesome-icon :icon="['fas', 'chevron-down']" />
                                    </div>
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
                                <div v-if="isRequired.district && !supplier.district" class="error">
                                    <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="addressDetail">Địa chỉ chi tiết <span v-if="isEditing" class="required-star">*</span></label>
                        </td>
                        <td><input type="text" id="addressDetail" class="input-information" v-model.number="supplier.addressDetail" 
                            :class="{'required': isRequired.addressDetail}" 
                            :disabled="!isEditing"
                            @focus="setFocused('addressDetail')"
                            @blur="removeFocused('addressDetail', supplier.addressDetail)"
                            @input="checkRequired('addressDetail', supplier.addressDetail)" 
                            placeholder="Địa chỉ chi tiết" required />
                            <div v-if="isRequired.addressDetail && !supplier.addressDetail" class="error">
                                <font-awesome-icon icon="exclamation-circle"/> Thông tin bắt buộc!
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="flex w-full items-end justify-end">
                <button class="btn btn-save" @click="chooseSupplier()">
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
    name: 'SearchSupplierModal',
});
</script>

<script setup lang="ts">
import { ref, onMounted, defineEmits, defineProps } from 'vue';

import { Supplier, fetchSearchSupplier, fetchAddSupplier } from '../../../../../api/staff/apiSupplier.ts';
import { ProvinceResponse, fetchProvinces, DistrictResponse, fetchDistricts, WardResponse, fetchWards} from '../../../../../api/apiAddress.ts';

import { ACCENT_REGEX } from '../../../../../utils/constants/unicode.ts';

const props = defineProps<{
    showModal: boolean;
}>();

const supplier = ref<Supplier>({
    supplierId: '',
    name: '',
    phone: '',
    email: '',
    addressDetail: '',
    ward: '',
    district: '',
    province: '',
    activated: null
});

const isLoading = ref<boolean>(false);
const isEditing = ref<boolean>(false);
const searchSupplierId = ref<string>('');
const searchQuery = ref<string>('');
const provinces = ref<ProvinceResponse[]>([]);
const districts = ref<DistrictResponse[]>([]);
const wards = ref<WardResponse[]>([]);

const isFocused = ref<Record<string, boolean>>({
    supplierId: false,
    name: false,
    phone: false,
    email: false,
    addressDetail: false,
    ward: false,
    district: false,
    province: false,
    activated: false
});
const isRequired = ref<Record<string, boolean>>({
    supplierId: false,
    name: false,
    phone: false,
    email: false,
    addressDetail: false,
    ward: false,
    district: false,
    province: false,
    activated: false
});
const isFilled = ref<Record<string, boolean>>({
    supplierId: false,
    name: false,
    phone: false,
    email: false,
    addressDetail: false,
    ward: false,
    district: false,
    province: false,
    activated: false
});

const validators: Record<string, (value: string | boolean) => boolean> = {
    name: (value: string | boolean) => /^[\p{L}\p{N}\s]+$/u.test(String(value)),
    phone: (value: string | boolean) => /^\d{10,15}$/.test(String(value)),
    email: (value: string | boolean) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(value)),
    addressDetail: (value: string | boolean) => /^[\p{L}\d\s.,\-\/#()]{2,400}$/u.test(String(value)),
    ward: (value: string | boolean) => /^[\p{L}\d\s]{2,100}$/u.test(String(value)),
    district: (value: string | boolean) => /^[\p{L}\d\s]{2,100}$/u.test(String(value)),
    province: (value: string | boolean) => /^[\p{L}\s]{2,100}$/u.test(String(value)),
    activated: (value: string | boolean) => /^[\p{L}\s]+$/u.test(String(value)),
};

const dropdownState = ref<Record<string, boolean>>({
    province: false,
    district: false,
    ward: false
});

const setFocused = (field: string) => {
    isFocused.value[field] = true;
};
const removeFocused = (field: string, value: string | null | boolean) => {
    isFocused.value[field] = false;
    checkRequired(field, value);
};
const checkRequired = (field: string, value: string | null | boolean) => { 
    if (validators[field]) {
        isRequired.value[field] = (value === null || value === "" || !validators[field](value));
    } else {
        isRequired.value[field] = (value === null || value === "");
    }
    isFilled.value[field] = !isRequired.value[field];
};

const toggleDropdown = (field: string) => {
    dropdownState.value[field] = !dropdownState.value[field];
};
const closeDropdownProvince = () => {
    if (dropdownState.value.province === true) {
        dropdownState.value.province = false;
        searchQuery.value = '';
        checkRequired('province', supplier.value.province);
    }
};
const closeDropdownDistrict = () => {
    if (dropdownState.value.district === true) {
        dropdownState.value.district = false;
        searchQuery.value = '';
        checkRequired('district', supplier.value.district);
    }
};
const closeDropdownWard = () => {
    if (dropdownState.value.ward === true) {
        dropdownState.value.ward = false;
        searchQuery.value = '';
        checkRequired('ward', supplier.value.ward);
    }
};

onMounted(async () => {
    provinces.value = await fetchProvinces();
    if(supplier.value.province) {
        const selectedProvince = provinces.value.find(province => province.provinceName === supplier.value.province);
        await selectProvince(selectedProvince);
        if(supplier.value.district) {
            const selectedDistrict = districts.value.find(district => district.districtName === supplier.value.district);
            await selectDistrict(selectedDistrict);
            if(supplier.value.ward) {
                const selectedWard = wards.value.find(ward => ward.wardName === supplier.value.ward);
                await selectWard(selectedWard);

            }
        }
    }
    if (supplier.value.addressDetail) {
        checkRequired('addressDetail', supplier.value.addressDetail);
    }
});

const selectProvince = async (province: any) => {
    supplier.value.province = province.provinceName;
    supplier.value.district = '';
    supplier.value.ward = '';
    dropdownState.value.province = false;
    searchQuery.value = '';
    checkRequired('province', supplier.value.province);
    districts.value = await fetchDistricts(province.provinceID);
};
const selectDistrict = async (district: any) => {
    supplier.value.district = district.districtName;
    supplier.value.ward = '';
    dropdownState.value.district = false;
    searchQuery.value = '';
    checkRequired('district', supplier.value.district);
    wards.value = await fetchWards(district.districtID);
};
const selectWard = async (ward: any) => {
    supplier.value.ward = ward.wardName;
    dropdownState.value.ward = false;
    searchQuery.value = '';
    checkRequired('ward', supplier.value.ward);
};

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

const allowAddSupplier = () => {
    isEditing.value = true;
    resetSupplier();
};
const notAllowAddSupplier = () => {
    isEditing.value = false;
    resetSupplier();
    Object.keys(isRequired.value).forEach(key => {
        isRequired.value[key] = false;
    });
};

const searchSupplier = async () => {
    try {
        const response = await fetchSearchSupplier(searchSupplierId.value);
        if(response) {
            supplier.value = response.data;
        } else {
            alert('Không tìm thấy nhà cung cấp!');
        }
    } catch (error:any) {
        alert(error.message);
    }
};

const emit = defineEmits(['close', 'choose-supplier']);
const closeModal = () => {
    isEditing.value = false;
    emit('close');
};
const resetSupplier = () => {
    supplier.value = {
        supplierId: '',
        name: '',
        phone: '',
        email: '',
        addressDetail: '',
        ward: '',
        district: '',
        province: '',
        activated: null
    };
};

const chooseSupplier = async () => {
    if(!isEditing.value && supplier.value.supplierId === '') {
        alert('Vui lòng chọn nhà cung cấp');
        return;
    }

    if(isEditing.value) {
        isFilled.value['supplierId'] = true;
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
            const response = await fetchAddSupplier(supplier.value);
            if (response) {
                alert('Thêm nhà cung cấp thành công!');
                supplier.value = response.data;
                closeModal();
            } else {
                console.error('Thêm nhà cung cấp thất bại!');
                isLoading.value = false;
            }
        } catch (error:any) {
            alert(error.message);
            isLoading.value = false;
        }
    }

    emit('choose-supplier', supplier.value);
    resetSupplier();
};
</script>

<style scoped>
@import "index.css";
</style>