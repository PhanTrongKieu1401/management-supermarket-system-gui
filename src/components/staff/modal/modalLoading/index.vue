<template>
    <div class="fixed w-full h-full inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-1000" v-if="isLoading">
        <div class="bg-white rounded-lg shadow-lg p-5">
            <p class="text-center text-lg">{{ message }}...</p>
            <div class="mt-3">
                <svg class="animate-spin h-5 w-5 mx-auto text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "LoadingModal"
});
</script>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps< {
    isLoading: boolean,
    message: String,
}>();
</script>