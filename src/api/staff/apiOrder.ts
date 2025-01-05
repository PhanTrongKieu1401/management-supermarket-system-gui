import apiClient from "../index";
import { useFilterStore } from "../../stores/filterStore/filterStaffStore";

export interface OrderInList {
    orderId: string,
    paymentMethod: string,
    paymentStatus: string,
    paymentDate: string,
    orderStatus: string,
    totalAmount: number,
    customerId: string,
    staffId: string
}

export interface OrderListResponse {
    status: number,
    timestamp: string,
    data: OrderInList[],
}

export const fetchOrderList = async (): Promise<OrderListResponse> => {
    const filterStore = useFilterStore();
    try {
        const response = await apiClient.get('/staff/orders', {
            params: {
                orderId: filterStore.orderId,
                customerId: filterStore.customerId,
                staffId: filterStore.staffId,
                startDate: filterStore.startDate,
                endDate: filterStore.endDate,
                orderStatus: filterStore.orderStatus
            }
        });
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy danh sách đơn hàng!');
    }
}

export interface Receiver {
    fullName: string;
    phone: string;
    addressDetail: string;
    ward: string;
    district: string;
    province: string;
};

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
        const response = await apiClient.get(`/staff/orders/${orderId}`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy đơn hàng!');
    }
};

export const fetchAcceptOrder = async (orderId: string) => {
    try {
        const response = await apiClient.put(`/staff/orders/${orderId}/accept`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình phê duyệt đơn hàng!');
    }
};

export const fetchCancelOrder = async (orderId: string) => {
    try {
        const response = await apiClient.put(`/staff/orders/${orderId}/cancel`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình hủy đơn hàng!');
    }
};

export const fetchRefuseOrder = async (orderId: string) => {
    try {
        const response = await apiClient.put(`/staff/orders/${orderId}/refuse`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình từ chối đơn hàng!');
    }
};

export const fetchDeliverOrder = async (orderId: string) => {
    try {
        const response = await apiClient.put(`/staff/orders/${orderId}/deliver`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình cập nhật trạng thái đơn hàng!');
    }
};

export interface ProductCheckToOrder {
    productId: string;
    name: string;
    image: string;
    priceSell: number | null;
    discountSell: number | null;
    priceImport: number | null;
    quantityInStock: number | null;
    quantityInOrdering: number | null;
}

export interface ProductCheckToOrderResponse {
    code: string;
    timestamp: number;
    data: ProductCheckToOrder;
}

export const fetchCheckProductToOrder = async (productId: string) => {
    try {
        const response = await apiClient.get(`/staff/products/${productId}/add-to-order`);
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export const fetchAddProductToOrder = async (orderId:string, productAddToOrder: ProductInOrder[]): Promise<OrderDetailResponse> => {
    try {
        const response = await apiClient.put(`/staff/orders/${orderId}/add-product`, productAddToOrder);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export interface CustomerToAddOrder {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
}

export interface CustomerToAddOrderResponse {
    code: string;
    timestamp: number;
    data: CustomerToAddOrder;
}

export const fetchAddCustomerToOrder = async (customerPhone: string): Promise<CustomerToAddOrderResponse> => {
    try {
        const response = await apiClient.get(`/staff/customer/check-phone`, {
            params: { customerPhone }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export interface ProductToAddOrder {
    productId: string | null;
    name: string | null;
    priceSell: number;
    discountSell: number;
}

export interface ProductToAddOrderResponse {
    code: string;
    timestamp: number;
    data: ProductToAddOrder;
}

export const fetchCheckProductAddToOrder = async (productId: string): Promise<ProductToAddOrderResponse> => {
    try {
        const response = await apiClient.get(`/staff/products/add-to-order-counter`,{
            params: { productId }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export interface ProductToPayment {
    productId: string;
    name: string;
    priceSell: number;
    discountSell: number;
    quantity: number;
    amount: number;
}

export interface OrderToPayment {
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    customerId: string | null;
    staffId: string;
    voucherId: string | null;
    products: ProductToPayment[];
}

export interface OrderPaymentResponse {
    code: string;
    timestamp: number;
    data: string;
}

export const fetchPaymentOrder = async (orderToPayment: OrderToPayment): Promise<OrderPaymentResponse> => {
    try {
        const response = await apiClient.post(`/staff/orders/payment`, orderToPayment);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}