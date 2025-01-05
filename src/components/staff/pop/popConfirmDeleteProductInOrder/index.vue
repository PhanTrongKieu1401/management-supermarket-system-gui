<template>
    <div v-if="visible" class="pop-confirm-overlay" @click.self="cancelAction"> 
        <div class="pop-confirm">
            <p>{{ title }}</p>
            <div class="flex justify-between mt-2">
                <button @click="confirmAction" class="bg-gray-500 text-white px-4 py-2 rounded">Yes</button>
                <button @click="cancelAction" class="bg-red-500 text-white px-4 py-2 rounded">No</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'PopConfirmDeleteProductInOrder',
});
</script>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    title: {
        type: String,
        default: "Bạn không muốn mua sản phẩm này?",
    },
    visible: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits([
    'confirm',
    'cancel'
]);

const confirmAction = () => {
    emit('confirm');
};

const cancelAction = () => {
    emit('cancel');
};
</script>

<style scoped>
.pop-confirm-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 15;
}

.pop-confirm {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}
</style>