<template>
  <div class="select-none border-2 z-50 shadow-lg bg-white flex flex-col items-center border-gray-300 rounded-lg scale-up" style="width: 25%;">
    <div class="flex flex-col items-center w-full h-full font-apple select-text px-4 py-2">
      <div class="w-full h-10 relative flex items-center justify-center">
        <span @click="goBack" class="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </span>
        <span class="text-gray-800 title-form">
          Đăng ký - Siêu thị Kikimoon
        </span>
      </div>

      <div class="flex flex-col w-full h-24 py-3">
        <div class="w-full pb-2">
          <span class="list-none text-sm mb-0 font-apple">Vui lòng nhập email của bạn:</span>
        </div>
        <div class="flex w-full h-full">
          <div class="relative w-4/5 h-full">
            <input type="email" id="email" class="input-information" v-model="email"
              :class="{ 'required': isRequired.email }" @focus="setFocused('email')"
              @blur="removeFocused('email', email)" @input="checkRequired('email', email)">
            <label for="email" class="label-information transition-all duration-300 ease-in-out" :class="{
              'transform -translate-y-0 pt-2 text-[10px]': isFocused.email || email,
              'transform translate-y-4 text-[14px]': !isFocused.email && !email}">
              <span>Địa chỉ email</span>
            </label>
            <div v-show="isRequired.email" class="absolute text-red-600 text-sm mt-1 min-h-[24px]">
              <span v-if="!email">
                <font-awesome-icon icon="exclamation-circle" /> Thông tin bắt buộc, vui lòng nhập đầy đủ.
              </span>
              <span v-else>
                <font-awesome-icon icon="exclamation-circle" /> Email không hợp lệ.
              </span>
            </div>
            <div v-show="isEmailExist" class="absolute text-red-600 mt-1 text-sm min-h-[24px] text-left font-apple flex-1">
              Email đã được đăng ký trước đây!
            </div>
          </div>
          <div class="flex w-1/5 h-full items-center justify-end">
            <button class="btn-send-otp px-2" @click="verifyEmail">
              Gửi OTP
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center w-full px-4 pb-5">
      <form @submit.prevent="verifyOtp" class="flex flex-col mt-4 w-full">
        <span class="list-none text-sm mb-0 font-apple w-3/4">Vui lòng nhập OTP qua mail:</span>
        <div class="flex flex-col items-center">
          <div class="flex flex-wrap justify-between w-4/5 max-w-[300px] mt-4">
            <input v-for="(digit, index) in code" :key="index" type="text" maxlength="1"
              class="code-input flex-1 w-[40px]" @input="moveToNext($event, index)"
              @keydown.backspace="moveToPrev($event, index)" v-model="digit.value" />
          </div>
          <div v-if="errorMessage" class="text-red-500 mt-2 text-xs w-3/4 text-left font-apple flex-1">{{ errorMessage }}
          </div>
          <button :disabled="isLoading" type="submit"
            class="select-none bg-[#e44434] text-white rounded px-4 py-1 mt-4 w-3/4 hover:bg-[#c54f43] h-10 font-medium flex items-center justify-center">
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Xác thực</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VerifyEmail',
});
</script>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useRegisterStore } from '../../../stores/authStore/registerStore';

import { RegisterStatus } from '../../../utils/constants/enum';



const router = useRouter();
const registerStore = useRegisterStore();

const email = ref<string | null>(null);
const code = reactive([
  { value: '' },
  { value: '' },
  { value: '' },
  { value: '' },
  { value: '' },
  { value: '' },
]);

const errorMessage = ref('');
const isLoading = ref<boolean>(false);

const isEmailExist = ref<boolean>(false);
const isFocused = ref<Record<string, boolean>>({
    email: false,
});
const isRequired = ref<Record<string, boolean>>({
    email: false,
});
const validators: Record<string, (value: string) => boolean> = {
    email: (value: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value),
};

const goBack = () => {
  router.push("/login");
};

const setFocused = (field: string) => {
    isFocused.value[field] = true;
    isEmailExist.value = false;
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
};

const verifyEmail = async () => {
  console.log(email.value)
  if(!email.value) {
    isRequired.value.email = true;
    return;
  }

  try {
    const response = await registerStore.verifyEmail(email.value);
    if(response === RegisterStatus.SUCCESS) {
      alert("Gửi OTP thành công, vui lòng kiểm tra email!");
    } else if(response === RegisterStatus.EXISTED) {
      isEmailExist.value = true;
    }
  } catch (error: any){
    alert("Error: " + error);
  }
  
}

const verifyOtp = async () => {
  if(!email.value) {
    isRequired.value.email = true;
    return;
  }

  const isIncomplete = code.some((digit) => !digit.value);

  if (isIncomplete) {
    errorMessage.value = "Vui lòng nhập đầy đủ mã OTP.";
    return; 
  }

  const otp = code.map((digit) => digit.value).join('');
  isLoading.value = true;
  errorMessage.value = '';
  try {
    console.log(email.value, otp);
    const response = await registerStore.verifyOtp(email.value, otp);
    if (!response) {
      errorMessage.value = "Có lỗi trong quá trình xác thực otp, vui lòng nhập lại!";
    } else {
      localStorage.setItem("email", email.value);
      router.push('/register/information');
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const moveToNext = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement;
  if (input.value.length > 1) {
    input.value = input.value.slice(0, 1);
  }
  code[index].value = input.value;

  if(errorMessage) {
    errorMessage.value = '';
  }

  if (input.value.length === 1 && index < code.length - 1) {
    const nextInput = input.nextElementSibling as HTMLInputElement;
    if (nextInput && nextInput.tagName === 'INPUT') {
      nextInput.focus();
    }
  }
};

const moveToPrev = (event: KeyboardEvent, index: number) => {
  const input = event.target as HTMLInputElement;
  if (input.value.length === 0 && event.key === 'Backspace') {
    const prevInput = input.previousElementSibling as HTMLInputElement;
    if(errorMessage) {
      errorMessage.value = '';
    }
    if (prevInput && prevInput.tagName === 'INPUT') {
      code[index].value = '';
      prevInput.focus();
      prevInput.value = '';
    }
  }
};
</script>

<style scoped>
@import "index.css";
</style>
