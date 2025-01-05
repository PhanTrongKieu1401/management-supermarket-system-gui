<template>
    <div class="p-0 flex text-center items-center justify-center bg-opacity-90 text-opacity-80 font-semibold rounded-full text-sm cursor-pointer" 
    style="background-color: rgb(228, 68, 52); color: rgb(255, 255, 255);">
        {{ getAvatar(fullname)}}
    </div>
</template>


<script lang="ts">
import { defineComponent, defineProps } from 'vue';
export default defineComponent({
    name: 'LogoUser',
});
</script>

<script lang='ts' setup>
const props = defineProps<{
    fullname: string;
}>();

const getAvatar = (fullname: string) => {
  return fullname
    .split(' ')                      
    .map(name => name.charAt(0).toUpperCase()) 
    .join('');                    
};
</script>
