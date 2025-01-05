import apiClient from "../index";
import { useFilterStore } from "../../stores/filterStore/filterStaffStore";

export interface ImportOrderInList {
    importOrderId: string,
    supplierId: string,
    supplierName: string,
    staffId: string,
    importDate: string,
    paymentStatus: string,
    totalAmount: number,
}

export interface ImportOrderListResponse {
    status: number,
    timestamp: string,
    data: ImportOrderInList[],
}

export const fetchImportOrderList = async (): Promise<ImportOrderListResponse> => {
    const filterStore = useFilterStore();
    try {
        const response = await apiClient.get('/staff/import-orders', {
            params: {
                importOrderId: filterStore.importOrderId,
                supplierId: filterStore.supplierId,
                staffId: filterStore.staffId,
                startDate: filterStore.startDate,
                endDate: filterStore.endDate,
                paymentStatus: filterStore.paymentStatus
            }
        });
        console.log(response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export interface Supplier {
    supplierId: string,
    name: string,
    phone: string,
    email: string,
    addressDetail: string,
    ward: string,
    district: string,
    province: string,
    activated: boolean | null
}

export interface Staff {
    staffId: string,
    firstName: string,
    middleName: string, 
    lastName: string,
    phone: string
}

export interface ProductInImportOrder {
    productId: string,
    name: string,
    priceImport: number,
    quantity: number,
    amount: number
}

export interface ImportOrderDetail {
    importOrderId: string,
    importDate: string,
    paymentStatus: string,
    supplier: Supplier,
    staff: Staff,
    productInImportOrders: ProductInImportOrder[]
}

export interface ImportOrderDetailResponse {
    status: number,
    timestamp: string,
    data: ImportOrderDetail,
}

export const fetchImportOrderDetail = async (importOrderId: string): Promise<ImportOrderDetailResponse> => {
    try {
        const response = await apiClient.get(`/staff/import-orders/${importOrderId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export const createImportOrder = async (importOrderDetail: ImportOrderDetail) => {
    try {
        const response = await apiClient.post('/staff/import-orders', {
            paymentStatus: 'UNPAID',
            staffId: importOrderDetail.staff.staffId,
            supplierId: importOrderDetail.supplier.supplierId,
            productInImportOrders: importOrderDetail.productInImportOrders
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}