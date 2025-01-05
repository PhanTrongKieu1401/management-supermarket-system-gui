<template>
  <nav class="mx-auto flex items-center justify-between h-full" style="padding: 0 10rem;" aria-label="Global">
    <div class="flex h-full object-cover w-1/6">
      <a href="/" class="flex h-full">
        <img class="h-full object-cover" src="/src/assets/img/Logo.png" alt="" />
      </a>
    </div>
    <div class="flex justify-center items-center w-1/2 h-full">
      <div class="flex justify-center items-center w-full h-full p-5 box-border">
        <form @submit.prevent="onSearch" class="flex w-full max-w-lg h-3/4">
          <input v-model="keySearch" type="text"
            class="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 text-black"
            style="border-color: rgb(197, 79, 67);" placeholder="Tìm kiếm tên sản phẩm" />
          <button type="submit"
            class="flex items-center justify-center btn-search px-4 py-2 font-normal rounded-r-md focus:outline-none focus:ring-2"
            style="min-width: 100px;">
            Tìm kiếm  
          </button>
        </form>
      </div>
    </div>
    <div class="flex lg:flex-1 items-center lg:justify-end w-1/3 h-full space-x-4">
      <div v-if="isLoggedIn" class="text-left h-1/2">
        <a href="/cart" class="btn-cart flex items-center h-full px-4 py-2 rounded text-sm cursor-pointer focus:outline-none">
          <b-button variant="outline-primary" class="flex items-center h-full">
            <font-awesome-icon :icon="['fas', 'cart-shopping']" /> ({{ cartStore.totalNumberProducts }})
          </b-button>
        </a>
      </div>
      <div v-if="isLoggedIn" class="relative text-left h-1/2">
        <button @click="toggleDropdown" class="btn-user flex items-center h-full px-4 py-2 rounded text-sm cursor-pointer focus:outline-none">
          <b-button variant="outline-primary" class="flex items-center h-full">
            <font-awesome-icon :icon="['far', 'user']"/> {{  fullName }}
          </b-button>
        </button>

        <div v-if="isDropdownOpen" class="toggle-user absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
          <ul class="list-none p-0 m-0">
            <li>
              <a href="/profile" class="block px-4 py-2 text-sm" style="border-top-left-radius: 5px; border-top-right-radius: 5px;">Thông tin cá nhân</a>
              <hr/>
            </li>
            <li>
              <a href="/cart" class="block px-4 py-2 text-sm">Giỏ hàng</a>
              <hr/>
            </li>
            <li>
              <a href="/orders" class="block px-4 py-2 text-sm">Đơn hàng của tôi</a>
              <hr/>
            </li>
            <li @click="logOut">
              <a class="block px-4 py-2 text-sm" style="border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;">Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <button @click="goToLoginPage"
          class="btn-to-login flex items-center justify-center h-1/2 px-4 py-2 rounded text-sm font-semibold leading-6 bg-transparent cursor-pointer">
          Đăng nhập 
          <span aria-hidden="true" class="ml-1">
            <font-awesome-icon :icon="['fas', 'arrow-right']" />
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Header',

});
</script>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../../../stores/authStore/loginStore';
import { useCartStore } from '../../../stores/cartStore/cartStore';
import { useFilterStore } from '../../../stores/filterStore/filterStore';

const router = useRouter();

const authStore = useAuthStore();
const cartStore = useCartStore();
const filterStore = useFilterStore();

const isLoggedIn = computed(() => {
  return !!authStore.accessToken;
});

const fullName = computed(() => authStore.fullName);
const keySearch = ref('');

onMounted (async () => {
    await cartStore.getCart();
    await authStore.getInfo();
});

const onSearch = () => {
  filterStore.setKeySearch(keySearch.value); 
};

function goToLoginPage() {
  router.push('/login');
}
function logOut() {
  authStore.logout();
  router.push('/');
}

const isDropdownOpen = ref(false);
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
  const btnUser = document.querySelector('.btn-user');
  if (btnUser) {
    if (isDropdownOpen.value) {
      btnUser.classList.add('active');
      console.log('Button is active:', btnUser.classList.contains('active'));
    } else {
      btnUser.classList.remove('active');
      console.log('Button is not active:', !btnUser.classList.contains('active'));
    }
  }

  setTimeout(() => {
    if(btnUser)
    console.log('After timeout, Button is active:', btnUser.classList.contains('active'));
  }, 1000); 
}
function closeDropdown() {
  isDropdownOpen.value = false;
  const btnUser = document.querySelector('.btn-user');
  if (btnUser) {
    btnUser.classList.remove('active');
  }
}
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const dropdown = document.querySelector('.relative') as HTMLElement;

  if (dropdown && !dropdown.contains(target)) {
    closeDropdown();
  }
});
</script>

<style scoped>
@import 'index.css';
</style>
