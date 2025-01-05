import apiClient from "../index";

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
};

export interface SupplierResponse {
    status: number;
    timestamp: string;
    data: Supplier;
};

export const fetchSearchSupplier = async (supplierId: string): Promise<SupplierResponse> => {
    try {
        const response = await apiClient.get<SupplierResponse>(
            "/staff/suppliers/search",
            {
                params: {
                    supplierId
                }
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error("Server không phản hồi");
    }
};

export const fetchAddSupplier = async (supplier: Supplier): Promise<SupplierResponse> => {
    try {
        const response = await apiClient.post<SupplierResponse>(
            "/staff/suppliers",
            supplier
        )
        return response.data;
    } catch (error:any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error("Server không phản hồi");
    }
};