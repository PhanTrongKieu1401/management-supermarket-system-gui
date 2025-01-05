//import các views
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore/loginStore";
import { useImportOrderDetailStore } from "../stores/importOrderStore/importOrderStore";
import { usePayCounterStore } from "../stores/orderStore/payCounterStore";
import { useFilterStore } from "../stores/filterStore/filterStore";

import Author from "../views/author/index.vue";
import Login from "../components/login/index.vue";
import VerifyEmail from "../components/register/verifyEmail/index.vue";
import RegisterInformation from "../components/register/informationRegister/index.vue";

import Home from "../views/home/index.vue";
import Content from "../components/content/index.vue";
import ProductDetail from "../components/products/productDetail/index.vue";

import Cart from "../components/cart/index.vue";
import Order from "../components/order/replaceOrder/index.vue";
import Orders from "../components/order/orders/index.vue";
import OrderDetail from "../components/order/orderDetail/index.vue";
import PaymentSuccess from "../views/general/paymentSuccess/index.vue";
import PaymentFail from "../views/general/paymentFail/index.vue";

import HomeStaff from "../views/homeStaff/index.vue";
import ManagePayment from "../components/staff/managePayment/index.vue";
import ManageProducts from "../components/staff/manageProducts/index.vue";
import ProductManagementDetail from "../components/staff/manageProducts/productManagementDetail/index.vue";
import ManageOrders from "../components/staff/manageOrders/index.vue";
import OrderManagementDetail from "../components/staff/manageOrders/orderManagementDetail/index.vue";
import ManageImports from "../components/staff/manageImports/index.vue";
import ImportOrderDetail from "../components/staff/manageImports/importOrderDetail/index.vue";
import ImportOrderCreatePage from "../components/staff/manageImports/importOrderCreatePage/index.vue";
import StatisticalRevenue from "../components/staff/statistical/revenue/index.vue";
//cấu hình path cho các views
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '',
                name: 'Content',
                component: Content,    
            },
            {
                path: '/profile',
                name: 'Profile',
                component: Login,
            },
            {
                path: '/cart',
                name: 'Cart',
                component: Cart,
            },
            {
                path: '/order',
                name: 'Order',
                props: true,
                component: Order,
            },
            {
                path: '/orders',
                name: 'Orders',
                component: Orders,
            },
            {
                path: '/orders/:orderId',
                name: 'OrderDetail',
                component: OrderDetail,
            },
            {
                path: '/products',
                name: 'Products',
                component: Content,
            },
            {
                path: '/products/:productName',
                name: 'ProductDetail',
                props: true,
                component: ProductDetail,
            },
            {
                path: '/vouchers',
                name: 'Vouchers',
                component: Login,
                children: [
                    {
                        path: ':voucherCode',
                        name: 'VoucherDetail',
                        props: true,
                        component: Login,
                    },
                ],
            },
        ],
    },
    {
        path: '/staff',
        name: 'HomeStaff',
        component: HomeStaff,
        children: [
            {
                path: 'payment',
                name: 'ManagePayment',
                component: ManagePayment,
            },
            {
                path: 'products',
                name: 'ManageProducts',
                component: ManageProducts,
            },
            {
                path: 'products/:productId',
                name: 'ProductManagementDetail',
                component: ProductManagementDetail,
            },
            {
                path: 'orders',
                name: 'ManageOrders',
                component: ManageOrders,
            },
            {
                path: 'orders/:orderId',
                name: 'OrderManagementDetail',
                component: OrderManagementDetail,
            },
            {
                path: 'imports',
                name: 'ManageImports',
                component: ManageImports,
            },
            {
                path: 'imports/:importOrderId',
                name: 'ImportOrderDetail',
                component: ImportOrderDetail,
            },
            {
                path: 'imports/create',
                name: 'ImportOrderCreatePage',
                component: ImportOrderCreatePage,
            },
            {
                path: 'statistical/revenue',
                name: 'StatisticalRevenue',
                component: StatisticalRevenue,
            },
        ]
    },
    {
        path: '/author',
        name: 'Author',
        component: Author,
        beforeEnter: (to, from, next) => {
            const authStore = useAuthStore();
            if (authStore.isLoggedIn()) {
                next({ path: '/' });
            } else {
                next();
            }
        },
        children: [
            {
                path: '/login',
                name: 'Login',
                component: Login,
            },
            {
                path: '/register/verify/email',
                name: 'VerifyEmail',
                component: VerifyEmail,
            },
            {
                path: '/register/information',
                name: 'RegisterInformation',
                component: RegisterInformation,
            }
        ]
    },
    {
        path: '/payment-success',
        name: 'PaymentSuccess',
        component: PaymentSuccess,
    },
    {
        path: '/payment-fail',
        name: 'PaymentFail',
        component: PaymentFail,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    // history: createWebHistory(),
    routes
});

router.beforeEach((to, from) => {
    const importOrderDetailStore = useImportOrderDetailStore();
    const payCounterStore = usePayCounterStore();
    const filterStore = useFilterStore();

    if (from.name === 'ImportOrderCreatePage' && to.name !== 'ImportOrderCreatePage') {
        importOrderDetailStore.clearImportOrderDetailFromLocalStorage();
    }
    if (from.name === 'ManagePayment' && to.name!== 'ManagePayment') {
        payCounterStore.clearOrder();
        // localStorage.removeItem('order');
    }
    if (!to.path.startsWith('/products')) {
        filterStore.keySearch = '';
        filterStore.saveFilterToLocalStorage();
    }
});

export default router;

