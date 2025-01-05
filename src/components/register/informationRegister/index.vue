<template>
  <div class="select-none border-2 z-50 shadow-lg bg-white flex flex-col items-center border-gray-300 rounded-lg scale-up max-w-lg max-h-max">
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
        <div class="flex flex-col justify-between mb-5">
          <div class="relative w-full h-full">
            <input type="text" id="username" class="input-information" v-model="register.username"
              :class="{ 'required': isRequired.username }" 
              @focus="setFocused('username')"
              @blur="removeFocused('username', register.username)"
              @input="checkRequired('username', register.username)">
            <label for="username" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.username || register.username,
                'transform translate-y-5 text-[16px]': !isFocused.username && !register.username
              }">
              <span>
                Tài khoản<span class="text-red-500">*</span>
              </span>
            </label>
            <div class="mt-2 small-gray-italic" :class="isRequired.username ? 'text-red-600' : 'text-[#657384]'">
              Tài khoản từ 8 - 20 ký tự!
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between mb-5">
          <div class="flex justify-between">
            <div class="w-3/6 pr-2">
              <div class="relative w-full">
                <input :type="showPassword ? 'text' : 'password'" 
                  id="password" class="input-information" v-model="register.password"
                  :class="{ 'required': isRequired.password }" @focus="setFocused('password')"
                  @blur="removeFocused('password', register.password)"
                  @input="checkRequired('password', register.password)">
                <label for="password" class="label-information transition-all duration-300 ease-in-out" :class="{
                    'transform -translate-y-0 pt-2 text-[12px]': isFocused.password || register.password,
                    'transform translate-y-5 text-[16px]': !isFocused.password && !register.password
                  }">
                  <span>
                    Mật khẩu<span class="text-red-500">*</span>
                  </span>
                </label>
                <span @click="togglePassword"
                  class="icon-show-password absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[rgb(107 114 128)]"
                  style="margin-top: 4px">
                  <font-awesome-icon :icon="showPassword ? ['far', 'eye'] : ['far', 'eye-slash']"/>
                </span>
              </div>
            </div>
            <div class="w-3/6">
              <div class="relative w-full">
                <input :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword" class="input-information" v-model="register.confirmPassword"
                  :class="{ 'required': isRequired.confirmPassword }" @focus="setFocused('confirmPassword')"
                  @blur="removeFocused('confirmPassword', register.confirmPassword)"
                  @input="checkRequired('confirmPassword', register.confirmPassword)">
                <label for="confirmPassword" class="label-information transition-all duration-300 ease-in-out" :class="{
                    'transform -translate-y-0 pt-2 text-[12px]': isFocused.confirmPassword || register.confirmPassword,
                    'transform translate-y-5 text-[16px]': !isFocused.confirmPassword && !register.confirmPassword
                  }">
                  <span>
                    Xác nhận mật khẩu<span class="text-red-500">*</span>
                  </span>
                </label>
                <span @click="toggleConfirmPassword"
                  class="icon-show-password absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[rgb(107 114 128)]"
                  style="margin-top: 4px">
                  <font-awesome-icon :icon="showConfirmPassword ? ['far', 'eye'] : ['far', 'eye-slash']"/>
                </span>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start text-red-600 text-sm mt-2 mb-5">
            <div class="mr-4 small-gray-italic" :class="isRequired.password || isRequired.confirmPassword? 'text-red-600' : 'text-[#657384]'">
                Mật khẩu gồm ít nhất 8 ký tự chữ hoa, chữ thường, chữ số, ký tự đặc biệt!
            </div>
            <div v-if="isRequired.confirmPassword" class="absolute text-red-600 small-gray-italic mt-5">
                Xác nhận mật khẩu phải khớp với mật khẩu đã nhập!
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="w-3/6 mb-10 pr-2">
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
          <div class="w-3/6 mb-10">
            <div class="relative w-full">
              <input type="text" id="phone" class="input-information" v-model="register.phone"
                :class="{ 'required': isRequired.phone }" @focus="setFocused('phone')"
                @blur="removeFocused('phone', register.phone)"
                @input="checkRequired('phone', register.phone)">
              <label for="phone" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.phone || register.phone,
                'transform translate-y-5 text-[16px]': !isFocused.phone && !register.phone
              }">
                <span>
                  Số điện thoại<span class="text-red-500">*</span>
                </span>
              </label>
              <div v-if="isRequired.phone" class="absolute text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> Số điện thoại không hợp lệ.
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <div class="w-2/6 mb-10 pr-2">
            <div class="relative w-full">
              <input type="text" id="firstName" class="input-information" v-model="register.firstName"
                :class="{ 'required': isRequired.firstName }" @focus="setFocused('firstName')"
                @blur="removeFocused('firstName', register.firstName)"
                @input="checkRequired('firstName', register.firstName)">
              <label for="firstName" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.firstName || register.firstName,
                'transform translate-y-5 text-[16px]': !isFocused.firstName && !register.firstName
              }">
                <span>
                  Họ<span class="text-red-500">*</span>
                </span>
              </label>
              <div v-if="isRequired.firstName && !register.firstName" class="absolute text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> {{ errorMessage }}
              </div>
            </div>
          </div>
          <div class="w-2/6 mb-10 pr-2">
            <div class="relative w-full">
              <input type="text" id="middleName" class="input-information" v-model="register.middleName"
                @focus="setFocused('middleName')"
                @blur="removeFocused('middleName', register.middleName)"
                @input="checkRequired('middleName', register.middleName)">
              <label for="middleName" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.middleName || register.middleName,
                'transform translate-y-5 text-[16px]': !isFocused.middleName && !register.middleName
              }">
                <span>Tên đệm</span>
              </label>
            </div>
          </div>
          <div class="w-2/6 mb-10">
            <div class="relative w-full">
              <input type="text" id="lastName" class="input-information" v-model="register.lastName"
                :class="{ 'required': isRequired.lastName }" @focus="setFocused('lastName')"
                @blur="removeFocused('lastName', register.lastName)"
                @input="checkRequired('lastName', register.lastName)">
              <label for="lastName" class="label-information transition-all duration-300 ease-in-out" :class="{
                'transform -translate-y-0 pt-2 text-[12px]': isFocused.lastName || register.lastName,
                'transform translate-y-5 text-[16px]': !isFocused.lastName && !register.lastName
              }">
                <span>
                  Tên<span class="text-red-500">*</span>
                </span>
              </label>
              <div v-if="isRequired.lastName && !register.lastName" class="absolute text-red-600 text-sm mt-1">
                <font-awesome-icon icon="exclamation-circle" /> {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-nav-link">
        <div class="left">
          <a href="/" class="custom-link">Về trang chủ</a>
        </div>
        <div class="right">
          <button @click="handleRegister()"  :disabled="isLoading" type="submit"
            class="select-none bg-[#e44434] text-white rounded px-4 py-1 w-28 hover:bg-[#c54f43] h-10 font-medium flex items-center justify-center">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Đăng ký</span>
          </button>
          <button @click="goToLogin()" class="btn-cancel">Hủy</button>
        </div>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useRegisterStore } from '../../../stores/authStore/registerStore.ts';

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
  role: string,
}

const router = useRouter();
const registerStore = useRegisterStore();

const register: Register = {
  registerKey: localStorage.getItem('registerKey') || registerStore.registerKey,
  email: localStorage.getItem('email') || registerStore.email,
  username: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  role: '',
};

const isLoading = ref<boolean>(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage =ref('Thông tin bắt buộc');

const isFocused = ref<Record<string, boolean>>({
  username: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  middleName: false,
  lastName: false,
  phone: false,
});
const isRequired = ref<Record<string, boolean>>({
  username: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
  phone: false,
});
const isFilled = ref<Record<string, boolean>>({
  username: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
  phone: false,
});

const validators: Record<string, (value: string) => boolean> = {
  username: (value: string) => /^[A-Za-z][A-Za-z0-9]{7,19}$/.test(value),
  password: (value: string) => /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(value),
  confirmPassword: (value: string) => /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(value),
  firstName: (value: string) => /^(?!.* {2})[A-Za-zÀ-ỹđĐ]{1,50}(?: [A-Za-zÀ-ỹđĐ]{1,50})*$/u.test(value),
  middleName: (value: string) => /^(?!.* {2})[A-Za-zÀ-ỹđĐ]{1,50}(?: [A-Za-zÀ-ỹđĐ]{1,50})*$/u.test(value),
  lastName: (value: string) => /^(?!.* {2})[A-Za-zÀ-ỹđĐ]{1,50}(?: [A-Za-zÀ-ỹđĐ]{1,50})*$/u.test(value),
  phone: (value: string) => /^\d{10,15}$/.test(value),
  // dateOfBirth: (value: string) => /^;
  gender: (value: string) => /^Nam|Nữ|Khác$/.test(value),
  addressDetail: (value: string) => /^[\p{L}\d\s.,\-\/#()]{2,400}$/u.test(value),
  ward: (value: string) => /^[\p{L}\d\s]{2,100}$/u.test(value),
  district: (value: string) => /^[\p{L}\d\s]{2,100}$/u.test(value),
  province: (value: string) => /^[\p{L}\s]{2,100}$/u.test(value),
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const goBack = () => {
  router.push("/register/verify/email");
};

const goToLogin = () => {
  router.push("/login");
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

  if(field == "confirmPassword" && register.password != register.confirmPassword) {
    isRequired.value[field] = !value;
  }

  isFilled.value[field] = !isRequired.value[field];
};

const handleRegister = async () => {
  let filledInformation = true;
  for (const [key, value] of Object.entries(isFilled.value)) {
    if (!value) {
      isRequired.value[key] = true;
      filledInformation = false;
    }
  }
  if(!filledInformation) return;

  isLoading.value = true;
  try {
    const response = await registerStore.fetchRegister(register);
    if(response) {
      alert(response);
      router.push("/login");
    }
  } catch(error: any) {
    alert(error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@import "index.css";
</style>