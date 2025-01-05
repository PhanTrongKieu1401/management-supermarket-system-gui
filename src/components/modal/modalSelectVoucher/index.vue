<template>
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20" @click.self="closeModal">
        <div class="bg-white w-[500px] p-6 rounded-lg shadow-lg relative">
            <button @click="closeModal" class="absolute text-xl top-3 right-3 text-gray-500 hover:text-gray-800">
                <font-awesome-icon :icon="['fas', 'xmark']" />
            </button>

            <h2 class="text-xl font-bold text-center mb-2">Ưu đãi cho bạn</h2>

            <div class="mb-4 flex">
                <input type="text" v-model="searchTerm" class="border p-2 flex-grow rounded-l-md outline-none shadow-none focus:ring-[rgb(228,68,52)] focus:border-[rgb(228,68,52)] focus:outline-none focus:shadow-none"
                    placeholder="Nhập mã voucher..." />
                <button @click="searchVoucher" class="bg-[rgb(228,68,52)] text-white p-2 rounded-r-md">
                    Tìm kiếm
                </button>
            </div>

            <div class="voucher-list space-y-4 max-h-[60vh] overflow-y-auto">
                <div v-for="voucher in filteredVouchers" :key="voucher.voucherCode" class="mb-4 p-4 bg-gray-100 rounded-lg">
                    <h3 class="font-bold">Voucher {{ voucher.value / 1000 }}K</h3>
                    <p class="text-sm mb-4">
                        Giảm ngay {{ voucher.value.toLocaleString() }} Vnđ cho đơn hàng từ {{
                            voucher.conditionsApply.toLocaleString() }} Vnđ
                    </p>
    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex flex-col">
                            <span class="mb-1"><strong>HSD:</strong> {{ voucher.expiryDate }}</span>
                            <span style="color: rgb(228,68,52);"><strong>{{ voucher.voucherCode }}</strong></span>
                        </div>
    
                        <div class="flex justify-end h-4/5">
                            <button @click="applyVoucher(voucher)" class="text-[rgb(228,68,52)] hover:bg-[rgb(228,68,52)] hover:text-white px-4 py-1 rounded-md" style="border: 1px solid rgb(228,68,52)">
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SelectVoucherModal',
});
</script>

<script setup lang="ts">
import { ref, computed, defineEmits, defineProps } from 'vue';

type Voucher = {
    id: string;
    voucherCode: string;
    value: number;
    conditionsApply: number;
    expiryDate: string;
}

const props = defineProps<{
    visible: boolean;
}>();

const searchTerm = ref<string>('');

const vouchers = ref<Voucher[]>([
  {
    id: '1',
    voucherCode: 'DISCOUNT50',
    value: 50000,
    conditionsApply: 200000,
    expiryDate: '30/09/2024',
  },
  {
    id: '2',
    voucherCode: 'DISCOUNT100',
    value: 100000,
    conditionsApply: 500000,
    expiryDate: '15/10/2024',
  },
  {
    id: '2',
    voucherCode: 'DISCOUNT100',
    value: 100000,
    conditionsApply: 500000,
    expiryDate: '15/10/2024',
  },
  {
    id: '2',
    voucherCode: 'DISCOUNT100',
    value: 100000,
    conditionsApply: 500000,
    expiryDate: '15/10/2024',
  },
  {
    id: '2',
    voucherCode: 'DISCOUNT100',
    value: 100000,
    conditionsApply: 500000,
    expiryDate: '15/10/2024',
  },
  {
    id: '2',
    voucherCode: 'DISCOUNT100',
    value: 100000,
    conditionsApply: 500000,
    expiryDate: '15/10/2024',
  },
]);

const filteredVouchers = computed(() =>
  searchTerm.value
    ? vouchers.value.filter((voucher) =>
        voucher.voucherCode.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    : vouchers.value
);

const emit = defineEmits(['close', 'apply-voucher']);

const closeModal = () => {
  emit('close');
};

const applyVoucher = (voucher: Voucher) => {
  emit('apply-voucher', voucher);
};

const searchVoucher = () => {
  
};
</script>


<style scoped>

</style>