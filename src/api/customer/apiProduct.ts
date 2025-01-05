import apiClient from "../index";
import { useFilterStore } from "../../stores/filterStore/filterStore";

export interface Product {
    id: string;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    discountSell: number;
    quantityInStock: number;
    description: string;
    rate: number;
    category: string;
}

export interface ProductPage {
    productResponses: Product[];
    totalPages: number;
}

export interface ProductResponse {
    status: number;
    timestamp: string;
    data: ProductPage;
}

export const fetchFindAllForCustomer = async (): Promise<ProductResponse> => {
    const filterStore = useFilterStore();
    try {
        const response = await apiClient.get<ProductResponse>(`/public/customer/products`, {
            params: {
                keySearch: filterStore.keySearch,
                type: filterStore.type,
                sortType: filterStore.sortType,
                keySort: filterStore.keySort,
                page: filterStore.currentPage,
                size: filterStore.pageSize
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {  
            throw new Error(error.message);
        } else {
            throw new Error("Có lỗi trong quá trình lấy dữ liệu sản phẩm!");
        }
    }
}

export const fetchAllPreferentialProducts = async (): Promise<ProductResponse> => {
    const filterStore = useFilterStore();
    try {
        const response = await apiClient.get<ProductResponse>(`/public/customer/products/preferential`, {
            params: {
                page: filterStore.currentPage,
                size: filterStore.pageSize
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {  
            throw new Error(error.message);
        } else {
            throw new Error("Có lỗi trong quá trình lấy dữ liệu sản phẩm!");
        }
    }
}

export const fetchAllSuggetedProducts = async (): Promise<ProductResponse> => {
    const filterStore = useFilterStore();
    try {
        const response = await apiClient.get<ProductResponse>(`/customer/products/suggest`);
        return response.data;
    } catch (error: any) {
        if (error.response) {  
            throw new Error(error.message);
        } else {
            throw new Error("Có lỗi trong quá trình lấy dữ liệu sản phẩm!");
        }
    }
}

export interface ProductDetail {
    id: string;
    sku: string;
    name: string;
    image: string;
    priceSell: number;
    discountSell: number;
    startDate: string;
    endDate: string;
    quantityInStock: number;
    rating: number;
    rateCount: number;
    category: string;
    size: string;
    description: string;
    isActivated: boolean;
}

export interface ProductDetailResponse {
    status: number;
    timestamp: string;
    data: ProductDetail;
}

export const fetchProductDetail = async (productId: string): Promise<ProductDetailResponse> => {
    try {
        const response = await apiClient.get<ProductDetailResponse>(`/public/customer/products/${productId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        } else {
            throw new Error("Server không phản hồi!");
        }
    }
}

export interface ProductCheckQuantityNotEnough {
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

export interface ProductCheckQuantityResponse {
    status: number;
    timestamp: string;
    data: ProductCheckQuantityNotEnough[];
}

export const checkProductQuantity = async (products: ProductCheckQuantityNotEnough[]): Promise<ProductCheckQuantityResponse> => {
    try {
        const response = await apiClient.post<ProductCheckQuantityResponse>(`/customer/products/check-quantity`, products);
        console.log(response)
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        } else {
            throw new Error("Server không phản hồi!");
        }
    }
}