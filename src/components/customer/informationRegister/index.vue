<template>
  <div class="select-none border-2 z-50 shadow-lg bg-white flex flex-col items-center border-gray-300 rounded-lg scale-up">
    <div class="flex flex-col items-center w-full h-full font-apple select-text px-4 py-2">
      <div class="w-full h-10 relative flex items-center justify-center">
        <span @click="goBack" class="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </span>
        <span class="text-gray-800 title-form">
          Thông tin đăng ký
        </span>
      </div>

      <div class="flex flex-col w-full py-3">
        <div class="mb-4">
          <div class="relative w-full">
            <input type="email" id="email" class="input-information" v-model="register.email" placeholder="Địa chỉ email" disabled>
            <label for="email" class="label-information transition-all duration-300 ease-in-out" :class="{
              'transform -translate-y-0 pt-2 text-[12px]': register.email,
              'transform translate-y-5 text-[16px]': !register.email
            }">
              <span>Địa chỉ email</span>
            </label>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="w-2/6 mb-4 pr-2">
            <div class="relative w-full">
              <input type="text" id="username" class="input-information" v-model="register.username"
                :class="{ 'required': isRequired.username }" @focus="setFocused('username')"
                @blur="removeFocused('username', register.username)"
                @input="checkRequired('username', register.username)">
              <label for="username" class="label-information transition-all duration-300 ease-in-out" :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.username || register.username,
                  'transform translate-y-5 text-[16px]': !isFocused.username && !register.username
                }">
                <span>Tài khoản</span>
              </label>
              <div v-if="isRequired.username && !register.username" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
          <div class="w-2/6 mb-4 pr-2">
            <div class="relative w-full">
              <input type="text" id="password" class="input-information" v-model="register.password"
                :class="{ 'required': isRequired.password }" @focus="setFocused('password')"
                @blur="removeFocused('password', register.password)"
                @input="checkRequired('password', register.password)">
              <label for="password" class="label-information transition-all duration-300 ease-in-out" :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.password || register.password,
                  'transform translate-y-5 text-[16px]': !isFocused.password && !register.password
                }">
                <span>Mật khẩu</span>
              </label>
              <div v-if="isRequired.password && !register.password" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
          <div class="w-2/6 mb-4">
            <div class="relative w-full">
              <input type="text" id="confirmPassword" class="input-information" v-model="register.confirmPassword"
                :class="{ 'required': isRequired.confirmPassword }" @focus="setFocused('confirmPassword')"
                @blur="removeFocused('confirmPassword', register.confirmPassword)"
                @input="checkRequired('confirmPassword', register.confirmPassword)">
              <label for="confirmPassword" class="label-information transition-all duration-300 ease-in-out" :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.confirmPassword || register.confirmPassword,
                  'transform translate-y-5 text-[16px]': !isFocused.confirmPassword && !register.confirmPassword
                }">
                <span>Xác nhận mật khẩu</span>
              </label>
              <div v-if="isRequired.confirmPassword && !register.confirmPassword" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
            <div class="w-2/6 mb-4 pr-2">
              <div class="relative w-full">
                <input type="text" id="firstName" class="input-information" v-model="register.firstName"
                  :class="{ 'required': isRequired.firstName }" @focus="setFocused('firstName')"
                  @blur="removeFocused('firstName', register.firstName)"
                  @input="checkRequired('firstName', register.firstName)">
                <label for="firstName" class="label-information transition-all duration-300 ease-in-out" :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.firstName || register.firstName,
                  'transform translate-y-5 text-[16px]': !isFocused.firstName && !register.firstName
                }">
                  <span>Họ</span>
                </label>
                <div v-if="isRequired.firstName && !register.firstName" class="text-red-600 text-sm mt-1">
                  <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                </div>
              </div>
            </div>
            <div class="w-2/6 mb-4 pr-2">
              <div class="relative w-full">
                <input type="text" id="middleName" class="input-information" v-model="register.middleName"
                  :class="{ 'required': isRequired.middleName }" @focus="setFocused('fullNameReceiver')"
                  @blur="removeFocused('middleName', register.middleName)"
                  @input="checkRequired('middleName', register.middleName)">
                <label for="middleName" class="label-information transition-all duration-300 ease-in-out" :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.middleName || register.middleName,
                  'transform translate-y-5 text-[16px]': !isFocused.middleName && !register.middleName
                }">
                  <span>Tên đệm</span>
                </label>
                <div v-if="isRequired.middleName && !register.middleName" class="text-red-600 text-sm mt-1">
                  <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                </div>
              </div>
            </div>
            <div class="w-2/6 mb-4">
              <div class="relative w-full">
                <input type="text" id="lastName" class="input-information" v-model="register.lastName"
                  :class="{ 'required': isRequired.fullNameReceiver }" @focus="setFocused('lastName')"
                  @blur="removeFocused('lastName', register.lastName)"
                  @input="checkRequired('lastName', register.lastName)">
                <label for="lastName" class="label-information transition-all duration-300 ease-in-out" :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.lastName || register.lastName,
                  'transform translate-y-5 text-[16px]': !isFocused.lastName && !register.lastName
                }">
                  <span>Tên</span>
                </label>
                <div v-if="isRequired.lastName && !register.lastName" class="text-red-600 text-sm mt-1">
                  <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                </div>
              </div>
            </div>
        </div>
        <div class="flex justify-between">
          <div class="w-2/6 mb-4 pr-2">
            <div class="relative w-full">
              <input type="text" id="phone" class="input-information" v-model="register.phone"
                :class="{ 'required': isRequired.phone }" @focus="setFocused('phone')"
                @blur="removeFocused('phone', register.phone)"
                @input="checkRequired('phone', register.phone)">
              <label for="phone" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.phone || register.phone,
                'transform translate-y-5 text-[16px]': !isFocused.phone && !register.phone
              }">
                <span>Số điện thoại</span>
              </label>
              <div v-if="isRequired.phone" class="text-red-600 text-sm mt-1">
                <span v-if="!register.phone">
                  <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                </span>
                <span v-else>
                  <font-awesome-icon icon="exclamation-circle" /> Số điện thoại không hợp lệ.
                </span>
              </div>
            </div>
          </div>
          <div class="w-2/6 mb-4 pr-2">
            <div class="relative w-full">
              <input type="text" id="dateOfBirth" class="input-information" v-model="register.dateOfBirth"
                :class="{ 'required': isRequired.dateOfBirth }" @focus="setFocused('dateOfBirth')"
                @blur="removeFocused('dateOfBirth', register.dateOfBirth)"
                @input="checkRequired('dateOfBirth', register.dateOfBirth)">
              <label for="dateOfBirth" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.dateOfBirth || register.dateOfBirth,
                'transform translate-y-5 text-[16px]': !isFocused.dateOfBirth && !register.dateOfBirth
              }">
                <span>Ngày sinh</span>
              </label>
              <div v-if="isRequired.dateOfBirth" class="text-red-600 text-sm mt-1">
                <span v-if="!register.dateOfBirth">
                  <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                </span>
                <span v-else>
                  <font-awesome-icon icon="exclamation-circle" /> Số điện thoại không hợp lệ.
                </span>
              </div>
            </div>
          </div>
          <div class="w-2/6 mb-4">
            <div class="relative w-full">
              <input type="text" id="gender" class="input-information" v-model="register.gender"
                :class="{ 'required': isRequired.gender }" @focus="setFocused('gender')"
                @blur="removeFocused('gender', register.gender)"
                @input="checkRequired('gender', register.gender)">
              <label for="gender" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.gender || register.gender,
                'transform translate-y-5 text-[16px]': !isFocused.gender && !register.gender
              }">
                <span>Giới tính</span>
              </label>
              <div v-if="isRequired.gender" class="text-red-600 text-sm mt-1">
                <span v-if="!register.gender">
                  <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
                </span>
                <span v-else>
                  <font-awesome-icon icon="exclamation-circle" /> Số điện thoại không hợp lệ.
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="flex justify-between">
          <div class="w-3/6 mb-4 pr-2">
            <div class="relative w-full" v-click-outside="closeDropdownProvince">
              <input type="text" id="province" class="input-information drop" v-model="register.province"
                :class="{ 'required': isRequired.province }" @click="toggleDropdown('province')" autocomplete="off">
              <label for="province" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': register.province,
                'transform translate-y-5 text-[16px]': !register.province
              }">
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
                    <input type="text" class="dropdown-search" placeholder="Tìm kiếm..." v-model="searchQuery"
                      @mousedown.stop>
                  </div>
                </div>
                <ul>
                  <li v-for="province in filteredProvinces()" :key="province.provinceID"
                    @click="selectProvince(province)" class="dropdown-item">
                    {{ province.provinceName }}
                  </li>
                </ul>
              </div>
              <div v-if="isRequired.province && !register.province" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
          <div class="w-3/6 mb-4">
            <div class="relative w-full" v-click-outside="closeDropdownDistrict">
              <input type="text" id="district" class="input-information drop" v-model="register.district"
                :class="{ 'required': isRequired.district }" :disabled="!register.province"
                @click="toggleDropdown('district')" autocomplete="off">
              <label for="district" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': register.district,
                'transform translate-y-5 text-[16px]': !register.district
              }">
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
                    <input type="text" class="dropdown-search" placeholder="Tìm kiếm..." v-model="searchQuery"
                      @mousedown.stop>
                  </div>
                </div>
                <ul>
                  <li v-for="district in filteredDistricts()" :key="district.districtID"
                    @click="selectDistrict(district)" class="dropdown-item">
                    {{ district.districtName }}
                  </li>
                </ul>
              </div>
              <div v-if="isRequired.district && !register.district" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="w-3/6 mb-4 pr-2">
            <div class="relative w-full" v-click-outside="closeDropdownWard">
              <input type="text" id="ward" class="input-information drop" v-model="register.ward"
                :class="{ 'required': isRequired.ward }" :disabled="!register.district" @click="toggleDropdown('ward')"
                autocomplete="off">
              <label for="ward" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': register.ward,
                'transform translate-y-5 text-[16px]': !register.ward
              }">
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
                    <input type="text" class="dropdown-search" placeholder="Tìm kiếm..." v-model="searchQuery"
                      @mousedown.stop>
                  </div>
                </div>
                <ul>
                  <li v-for="ward in filteredWards()" :key="ward.wardID" @click="selectWard(ward)"
                    class="dropdown-item">
                    {{ ward.wardName }}
                  </li>
                </ul>
              </div>
              <div v-if="isRequired.ward && !register.ward" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
          <div class="w-3/6">
            <div class="relative w-full">
              <input type="text" id="addressDetail" class="input-information" v-model="register.addressDetail"
                :class="{ 'required': isRequired.addressDetail }" @focus="setFocused('addressDetail')"
                @blur="removeFocused('addressDetail', register.addressDetail)"
                @input="checkRequired('addressDetail', register.addressDetail)">
              <label for="addressDetail" class="label-information transition-all duration-300 ease-in-out"
                :class="{
                  'transform -translate-y-0 pt-2 text-[12px]': isFocused.addressDetail || register.addressDetail,
                  'transform translate-y-5 text-[16px]': !isFocused.addressDetail && !register.addressDetail
                }">
                <span>Địa chỉ cụ thể</span>
              </label>
              <div v-if="isRequired.addressDetail && !register.addressDetail" class="text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegisterInformation',
});
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import LoadingModal from '../modal/modalLoading/index.vue';

import { useRegisterStore } from '../../../stores/authStore/registerStore.ts';

import { ProvinceResponse, fetchProvinces, DistrictResponse, fetchDistricts, WardResponse, fetchWards
} from '../../../api/apiAddress.ts';

import { ACCENT_REGEX } from '../../../utils/constants/unicode.ts';

type Register = {
  registerKey: string,
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string,
  middleName: string,
  lastName: string;
  phone: string;
  dateOfBirth: string,
  gender: string;
  role: string;
  addressDetail: string;
  ward: string;
  district: string;
  province: string;
}

const router = useRouter();
const registerStore = useRegisterStore();

const register: Register = {
  registerKey: registerStore.registerKey,
  // email: registerStore.email,
  email: 'phantrongkieu',
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  role: '',
  addressDetail: '',
  ward: '',
  district: '',
  province: '',
};

const isFocused = ref<Record<string, boolean>>({
  username: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  middleName: false,
  lastName: false,
  phone: false,
  dateOfBirth: false,
  gender: false,
  addressDetail: false,
  ward: false,
  district: false,
  province: false
});
const isRequired = ref<Record<string, boolean>>({
  username: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
  phone: false,
  dateOfBirth: false,
  gender: false,
  addressDetail: false,
  ward: false,
  district: false,
  province: false
});
const isFilled = ref<Record<string, boolean>>({
  username: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
  phone: false,
  dateOfBirth: false,
  gender: false,
  addressDetail: false,
  ward: false,
  district: false,
  province: false
});

const validators: Record<string, (value: string) => boolean> = {
  username: (value: string) => /^[A-Za-z][A-Za-z0-9]{7,19}$/.test(value),
  password: (value: string) => /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(value),
  confirmPassword: (value: string) => /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(value),
  firstName: (value: string) => /^(?!.* {2})[A-Za-zÀ-ÿ]{1,50}(?: [A-Za-zÀ-ÿ]{1,50})*$/u.test(value),
  middleName: (value: string) => /^(?!.* {2})[A-Za-zÀ-ÿ]{1,50}(?: [A-Za-zÀ-ÿ]{1,50})*$/u.test(value),
  lastName: (value: string) => /^(?!.* {2})[A-Za-zÀ-ÿ]{1,50}(?: [A-Za-zÀ-ÿ]{1,50})*$/u.test(value),
  phone: (value: string) => /^\d{10,15}$/.test(value),
  // dateOfBirth: (value: string) => /^;
  gender: (value: string) => /^Nam|Nữ|Khác$/.test(value),
  addressDetail: (value: string) => /^[\p{L}\d\s.,\-\/#()]{2,400}$/u.test(value),
  ward: (value: string) => /^[\p{L}\d\s]{2,100}$/u.test(value),
  district: (value: string) => /^[\p{L}\d\s]{2,100}$/u.test(value),
  province: (value: string) => /^[\p{L}\s]{2,100}$/u.test(value),
};

const provinces = ref<ProvinceResponse[]>([]);
const districts = ref<DistrictResponse[]>([]);
const wards = ref<WardResponse[]>([]);

onMounted( async () => {
  provinces.value = await fetchProvinces();
});

const goBack = () => {
  router.push("/login");
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
    checkRequired('province', register.province);
  }
};
const closeDropdownDistrict = () => {
  if (dropdownState.value.district === true) {
    dropdownState.value.district = false;
    searchQuery.value = '';
    checkRequired('district', register.district);
  }
};
const closeDropdownWard = () => {
  if (dropdownState.value.ward === true) {
    dropdownState.value.ward = false;
    searchQuery.value = '';
    checkRequired('ward', register.ward);
  }
};

const selectProvince = async (province: any) => {
  register.province = province.provinceName;
  dropdownState.value.province = false;
  searchQuery.value = '';
  checkRequired('province', register.province);
  districts.value = await fetchDistricts(province.provinceID);
};
const selectDistrict = async (district: any) => {
  register.district = district.districtName;
  dropdownState.value.district = false;
  searchQuery.value = '';
  checkRequired('district', register.district);
  wards.value = await fetchWards(district.districtID);
};
const selectWard = async (ward: any) => {
  register.ward = ward.wardName;
  dropdownState.value.ward = false;
  searchQuery.value = '';
  checkRequired('ward', register.ward);
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
</script>

<style scoped>
@import "index.css";
</style>