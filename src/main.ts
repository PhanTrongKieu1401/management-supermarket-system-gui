import { createApp } from 'vue'
import App from './App.vue'
// @ts-ignore
import router from './router'
import pinia from './stores'

import './assets/main.css'; 
import 'ant-design-vue/dist/reset.css'
import Antd from 'ant-design-vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

/* add icons to the library */
library.add(fas, fab, far);

const app = createApp(App);
    app.directive('click-outside', {
        beforeMount(el, binding) {
            el.clickOutsideEvent = function(event: any) {
                // Kiểm tra xem click có nằm bên ngoài element không
                if (!(el === event.target || el.contains(event.target))) {
                    // Gọi hàm bên ngoài directive
                    binding.value(event);
                }
            };
            document.addEventListener('click', el.clickOutsideEvent);
        },
        unmounted(el) {
            document.removeEventListener('click', el.clickOutsideEvent);
        },
    });
    app.use(Antd);
    app.use(router);
    app.use(pinia);
    app.mount('#app');
    app.component('font-awesome-icon', FontAwesomeIcon)




    