import { defineStore } from "pinia";

type Receiver = {
    fullName: string;
    phone: string;
    addressDetail: string;
    ward: string;
    district: string;
    province: string;

};

type Voucher = {
    voucherId: string;
    voucherCode: string;
    value: number;
    conditionsApply: number;
    expiryDate: string;
};

type Product = {
    productId: string;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    discountSell: number;
    quantityInStock: number;
    quantity: number;
    selected: boolean;
};

type Order = {
    paymentMethod: string | null;
    paymentStatus: string | null;
    orderStatus: string | null;
    totalNumberProducts: number;
    amountBeforeReduced: number;
    totalPriceReduced: number;
    totalVoucherReduced: number;
    transportFee: number;
    totalAmountPayable: number;
    products: Product[];
    voucher: Voucher | null;
    receiver: Receiver | null;
};

export const useReplaceOrderStore = defineStore('replaceOrder',{
    state: () => ({
        order: null as Order | null,
    }),

    actions: {
        createOrder(orderData: Partial<Order>) {
            this.order = {
                paymentMethod: orderData.paymentMethod || null,
                paymentStatus: orderData.paymentStatus || null,
                orderStatus: orderData.orderStatus || null,
                totalNumberProducts: orderData.totalNumberProducts || 0,
                amountBeforeReduced: orderData.amountBeforeReduced || 0,
                totalPriceReduced: orderData.totalPriceReduced || 0,
                totalVoucherReduced: orderData.totalVoucherReduced || 0,
                transportFee: orderData.transportFee || 0,
                totalAmountPayable: orderData.totalAmountPayable || 0,
                products: orderData.products || [],
                voucher: orderData.voucher || null,
                receiver: orderData.receiver || {
                    fullName: '',
                    phone: '',
                    addressDetail: '',
                    ward: '',
                    district: '',
                    province: ''
                },  
            } as Order;
        },

        setOrder(newOrder: Order | null) {
            this.order = newOrder;
        },
        
        updateTransportFee(newTransportFee: number) {
            if(this.order){
                // this.order.amountBeforeReduced = this.order.amountBeforeReduced;
                this.order.totalAmountPayable = this.order.amountBeforeReduced + newTransportFee - this.order.totalPriceReduced - this.order.totalVoucherReduced;
                this.order.transportFee = newTransportFee;
            }
        },

        updateVoucher(newVoucher: Voucher | null) {
            if(this.order && newVoucher){
                this.order.totalAmountPayable = this.order.amountBeforeReduced - this.order.totalPriceReduced - newVoucher.value;
                this.order.voucher = newVoucher;
                this.order.totalVoucherReduced = newVoucher.value;
            }    
        },

        clearOrder() {
            this.order = null;
        }
    },

    getters: {
        getOrder: (state) => state.order,
    }
});