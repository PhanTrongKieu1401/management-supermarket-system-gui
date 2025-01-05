import apiClient from "../index";

export interface Receiver {
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

export interface Product {
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

export interface Order {
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

export interface ReplaceOrderResponse {
    code: string;
    timestamp: number;
    data: string;
}

export const fetchReplaceOrder = async (order: Order): Promise<ReplaceOrderResponse> => {
    try {
        const response = await apiClient.post<ReplaceOrderResponse>('/customer/orders', order);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình đặt hàng!');
    }
};

export const fetchPaymentStatus = async (orderId: string) => {
    try {
        const response = await apiClient.get(`/customer/orders/payment-status/${orderId}`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy trạng thái đơn hàng!');
    }
};

export interface OrderInList {
    orderId: string,
    paymentMethod: string,
    paymentStatus: string,
    paymentDate: string,
    orderStatus: string,
    totalAmount: number,
}

export interface OrderListResponse {
    status: number,
    timestamp: string,
    data: OrderInList[],
}

export const fetchOrderList = async (): Promise<OrderListResponse> => {
    try {
        const response = await apiClient.get('/customer/orders');
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy danh sách đơn hàng!');
    }
}

export interface CashierInOrder {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
};

export interface CustomerInOreder {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
};

export interface VoucherInOrder {
    voucherId: string;
    voucherCode: string;
    value: number;
}

export interface ProductInOrder {
    productId: string;
    name: string;
    image: string;
    priceSell: number;
    discountSell: number;
    priceImport: number;
    quantity: number;
    amount: number;
}

export interface OrderDetail {
    orderId: string;
    paymentMethod: string;
    paymentStatus: string;
    paymentDate: string;
    orderStatus: string;
    totalNumberProducts: number;
    totalPriceReduced: number;
    totalVoucherReduced: number;
    transportFee: number;
    totalAmount: number;
    productInOrderResponses: ProductInOrder[];
    voucherInOrderResponse: VoucherInOrder | null;
    receiverInOrderResponse: Receiver | null;
    cashierInOrderResponse: CashierInOrder | null;
    customerInOrderResponse: CustomerInOreder | null;
};

export interface OrderDetailResponse {
    code: string;
    timestamp: number;
    data: OrderDetail;
}

export const fetchOrderDetail = async (orderId: string): Promise<OrderDetailResponse> => {
    try {
        console.log("ORDERID",orderId)
        const response = await apiClient.get(`/customer/orders/${orderId}`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy đơn hàng!');
    }
};

export const fetchRemoveOrder = async (orderId: string) => {
    try {
        const response = await apiClient.put(`/customer/orders/${orderId}`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình xóa đơn hàng!');
    }
};