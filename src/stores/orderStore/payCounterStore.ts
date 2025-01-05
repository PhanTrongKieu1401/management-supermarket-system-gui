import { defineStore } from "pinia";
import { ref, reactive  } from "vue";
import { OrderToPayment, fetchAddCustomerToOrder, fetchPaymentOrder } from "../../api/staff/apiOrder";
import { PaymentMethod, PaymentStatus, OrderStatus } from "../../utils/constants/enum";

export interface Customer {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
};

export interface Voucher  {
    voucherId: string;
    voucherCode: string;
    value: number;
    conditionsApply: number;
    expiryDate: string;
};

export interface Product {
    productId: string;
    name: string;
    priceSell: number;
    discountSell: number;
    quantity: number;
    amount: number;
};

export interface Order {
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    totalNumberProducts: number;
    amountBeforeReduced: number;
    totalPriceReduced: number;
    totalVoucherReduced: number;
    totalAmountPayable: number;
    products: Product[];
    voucher: Voucher | null;
    customer: Customer | null;
    staffId: string;
};

export const usePayCounterStore = defineStore('order',{
    state: () => {
        const savedOrder = localStorage.getItem('order');
        const staff = localStorage.getItem('staffDashboard') ? JSON.parse(localStorage.getItem('staffDashboard')!) : null;
        return {
            order: savedOrder
                ? JSON.parse(savedOrder)
                : {
                      paymentMethod: PaymentMethod.COD,
                      paymentStatus: PaymentStatus.UNPAID,
                      orderStatus: OrderStatus.PENDING,
                      totalNumberProducts: 0,
                      amountBeforeReduced: 0,
                      totalPriceReduced: 0,
                      totalVoucherReduced: 0,
                      totalAmountPayable: 0,
                      products: [],
                      voucher: null,
                      customer: null,
                      staffId: staff?.id,
                  } as Order,
        };
    },

    actions: {
        async addCustomerToOrder(customerPhone: string) {
            try {
                const response = await fetchAddCustomerToOrder(customerPhone);
                if (response) {
                    console.log(response.data)
                    this.order.customer = response.data;
                    return 'Thêm khách hàng vào đơn thành công!';
                }
            } catch (error:any) {
                return error.message;
            }
        },

        setOrder(newOrder: Order | null) {
            this.order = newOrder;
        },
    
        updateVoucher(newVoucher: Voucher | null) {
            if(this.order && newVoucher){
                this.order.totalAmountPayable = this.order.amountBeforeReduced - this.order.totalPriceReduced - newVoucher.value;
                this.order.voucher = newVoucher;
                this.order.totalVoucherReduced = newVoucher.value;
            }    
        },

        setPaymentMethod(newPaymentMethod: string) {
            this.order.paymentMethod = newPaymentMethod;
        },

        addProductToOrder(product: Product) {
            this.order.products.push(product); 
            this.recalculateOrderValues();
        },
    
        removeProductFromOrder(productId: string) {
            const index = this.order.products.findIndex((p: Product) => p.productId === productId);
            if (index !== -1) {
                this.order.products.splice(index, 1);
                this.recalculateOrderValues();
            }
        },
    
        updateProductQuantity(productId: string, newQuantity: number, isEditing: boolean): void {
            const product = this.order.products.find((p: Product) => p.productId === productId);
            if(!isEditing) {
                product.quantity += newQuantity;
              }
              else {
                product.quantity = newQuantity;
              }
              product.amount = product.discountSell > 0 
              ? product.discountSell * product.quantity 
              : product.priceSell * product.quantity;
              this.recalculateOrderValues();
        },

        recalculateOrderValues() {
            this.order.totalNumberProducts = this.totalNumberProducts;
            this.order.amountBeforeReduced = this.amountBeforeReduced;
            this.order.totalPriceReduced = this.totalPriceReduced;
            this.order.totalAmountPayable =
                this.order.amountBeforeReduced - this.order.totalPriceReduced - this.order.totalVoucherReduced;
        },

        async paymentOrder(): Promise<string> {
            const orderTmp = {
                paymentMethod: this.order.paymentMethod,
                paymentStatus: this.order.paymentStatus,
                orderStatus: this.order.orderStatus,
                customerId: this.order.customer?.id,
                staffId: this.order.staffId,
                voucherId: this.order.voucher?.id,
                products: this.order.products,
            } as OrderToPayment;

            try {
                const response = await fetchPaymentOrder(orderTmp);
                if (response) {
                    this.clearOrder();
                    return response.data;
                } else {
                    return "Thanh toán thất bại!";
                }
            } catch (error: any) {
                return error.message;
            }
        },

        clearOrder() {
            const staff = localStorage.getItem('staffDashboard') ? JSON.parse(localStorage.getItem('staffDashboard')!) : null;
            this.order = {
                paymentMethod: PaymentMethod.COD,
                paymentStatus: PaymentStatus.UNPAID,
                orderStatus: OrderStatus.PENDING,
                totalNumberProducts: 0,
                amountBeforeReduced: 0,
                totalPriceReduced: 0,
                totalVoucherReduced: 0,
                totalAmountPayable: 0,
                products: [],
                voucher: null,
                customer: null,
                staffId: staff?.id || null, 
            };
            localStorage.removeItem('order');
        }
    },

    getters: {
        getOrder: (state) => state.order,

        totalNumberProducts: (state) => {
            return state.order.products.reduce((total: number, product: Product) => total + product.quantity, 0);
        },

        amountBeforeReduced: (state) => {
            return state.order.products.reduce((total: number, product: Product) => total + product.priceSell * product.quantity, 0);
        },

        totalPriceReduced: (state) => {
            return state.order.products.reduce((total: number, product: Product) => {
                const discount = product.discountSell > 0 ? (product.priceSell - product.discountSell) : 0;
                return total + discount * product.quantity;
            }, 0);
        },

        totalVoucherReduced: (state) => {
            return state.order.voucher ? state.order.voucher.value : 0;
        },
    
        totalAmountPayable: (state) => {
            return state.order.amountBeforeReduced - state.order.totalPriceReduced - state.order.totalVoucherReduced;
        },
    }
});