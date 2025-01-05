<template>
  <div class="select-none border-2 z-50 w-96 shadow-lg bg-white flex flex-col items-center border-gray-300 rounded-lg mt-8 bottom-8 pt-2 scale-up">
      
    <div class="flex flex-col items-center w-full font-apple select-text">
      <div class="w-full relative flex items-center justify-center px-4 py-2">
        <span @click="goBack" class="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </span>
        <span class="text-gray-800 title-form">
          Đăng nhập - Siêu thị Kikimoon
        </span>
      </div>
      <form @submit.prevent="handleLogin" class="login-form p-5" autocomplete="off">
        <div class="form-item">
          <label for="username">Tài khoản:</label>
          <input type="text" id="username" v-model="username" class="input-field"
            placeholder="Nhập tài khoản hoặc email"
            :class="{'required': isRequired.username}" 
            @focus="setFocused('username')"
            @blur="removeFocused('username', username)"
            @input="checkRequired('username', username)"/>
          <span v-if="!isRequired.username" class="small-gray-italic text-[rgb(101, 115, 132)]">
            Tài khoản phải từ 8 ký tự!
          </span>
          <span v-else class="small-gray-italic text-red-600">
            Tài khoản phải từ 8 ký tự (không bao gồm ký tự đặc biệt)!
          </span>
        </div>

        <div class="form-item">
          <label for="password">Mật khẩu</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" 
              id="password" v-model="password" class="input-field"
              placeholder="Vui lòng nhập mật khẩu" 
              :class="{'required': isRequired.password}" 
              @focus="setFocused('password')"
              @blur="removeFocused('password', password)"
              @input="checkRequired('password', password)"/>
            <span @click="togglePassword"
              class="icon-show-password absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[rgb(107 114 128)]"
              style="margin-top: 4px">
              <font-awesome-icon :icon="showPassword ? ['far', 'eye'] : ['far', 'eye-slash']"/>
            </span>
          </div>
          
          <span v-if="!isRequired.password" class="small-gray-italic text-[rgb(101, 115, 132)]">
            Mật khẩu gồm ít nhất 8 ký tự, phải bao gồm ký tự in hoa, in thường, chữ số và ký tự đặc
            biệt!
          </span>
          <span v-else class="small-gray-italic" style="color: rgb(255, 0, 0);">
            Mật khẩu gồm ít nhất 8 ký tự, phải bao gồm ký tự in hoa, in thường, chữ số và ký tự đặc
            biệt!
          </span>
        </div>

        <div class="form-item">
          <label>
            <input type="checkbox" v-model="rememberMe" />
            Ghi nhớ tôi
          </label>
        </div>

        <div class="form-item">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <button :disabled="disabled" type="submit" class="login-form-button">
            <span v-if="!isLoading">Đăng nhập</span>
            <span v-else class="text-white">
              Đang xử lý...
            </span>
          </button>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <router-link class="login-form-forgot link-primary-color" to="/verify/email">Quên mật khẩu!</router-link>
          <router-link class="link-primary-color" to="/register/verify/email">Đăng ký ngay!</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore/loginStore';
import { AccountType } from "../../utils/constants/enum";

const router = useRouter();
const authStore = useAuthStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref<Boolean>(true);
const clickLogin = ref(false)
const isLoading = ref(false);
const errorMessage = ref<string>("");

const disabled = computed(() => {
  return !(username.value && password.value);
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const goBack = () => {
  router.push("/");
};

const isFocused = ref<Record<string, boolean>>({
  username: false,
  password: false,
});
const isRequired = ref<Record<string, boolean>>({
  username: false,
  password: false,
});

const validators: Record<string, (value: string) => boolean> = {
  username: (value: string) => /^[A-Za-z][A-Za-z0-9]{7,}$/.test(value) || /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value),
  password: (value: string) => /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(value),
};

const setFocused = (field: string) => {
    isFocused.value[field] = true;
};
const removeFocused = (field: string, value: string | null) => {
    isFocused.value[field] = false;
    checkRequired(field, value);
};

const checkRequired = (field: string, value: string | null) => { 
  errorMessage.value = "";
  if(clickLogin.value){
    if (validators[field]) {
        isRequired.value[field] = !value || !validators[field](value);
    } else {
        isRequired.value[field] = !value;
    }
  }
};

const handleLogin = async () => {
  isLoading.value = true;
  clickLogin.value = true;
  checkRequired('username', username.value);
  checkRequired('password', password.value);

  if (isRequired.value.username || isRequired.value.password) {
    errorMessage.value = "Thông tin đăng nhập không đúng định dạng!";
    isLoading.value = false;
    return;
  }

  errorMessage.value = "";
  try {
    await authStore.login({ username: username.value, password: password.value });

    if (authStore.error) {
      errorMessage.value = authStore.error;
    } else {
      if(authStore.role == AccountType.CUSTOMER) {
        router.push("/");
      } else {
        if(authStore.role == AccountType.STAFF) {
          router.push("/staff/orders");
        }
      }
      
    }
  } catch (error: any) {
    console.error("Login failed:", error);
    errorMessage.value = error;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import "index.css";
</style>
