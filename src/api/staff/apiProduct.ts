import apiClient from "../index";
import { useFilterStore } from "../../stores/filterStore/filterStaffStore";

export interface QuantityInStockResponse {
    status: number;
    timestamp: string;
    data: number;
};

export const fetchQuantityInStock = async (productId: string): Promise<QuantityInStockResponse> => {
    try {
        const response = await apiClient.get(`/staff/products/${productId}/quantity-in-stock`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy tồn kho sản phẩm!');
    }
};

export interface ProductManagement {
    productId: string;
    name: string;
    image: string;
    priceSell: number;
    priceImport: number;
    quantityInStock: number;
    quantityInOrdering: number;
    categoryId: string;
    categoryName: string;
    activated: boolean;
};

export interface ProductManagementResponse {
    status: number;
    timestamp: string;
    data: {
        products: ProductManagement[];
        totalProducts: number;
        totalPages: number;
    }
};

export const fetchProductManagement = async (): Promise<ProductManagementResponse> => {
    const filterStore = useFilterStore();
    try {
        const response = await apiClient.get("/staff/products", {
            params: {
                productId: filterStore.productId,
                name: filterStore.name,
                categoryId: filterStore.categoryId,
                isActivated: filterStore.isActivated,
                page: filterStore.currentPage,
                size: filterStore.pageSize,
            },
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy thông tin sản phẩm!');
    }
};

export interface InsertProductRequest {
    name: string;
    size: string;
    priceSell: number;
    priceImport: number;
    quantityInStock: number;
    description: string | null;
    categoryId: string;
    activated: boolean;
    discount: number | null; 
    startDate: string | null;
    endDate: string | null;
    image: string;
};

export interface InsertProductResponse {
    status: number;
    timestamp: string;
    data: string;
}

export const fetchInsertProduct = async (request: InsertProductRequest): Promise<InsertProductResponse> => {
    try {
        const response = await apiClient.post("/staff/products", request);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
};

export interface Product {
    productId: string;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    priceImport: number;
    quantityInStock: number;
    quantityInOrdering: number;
    description: string | null;
    categoryId: string;
    activated: boolean;
    discount: number | null; 
    startDate: string | null;
    endDate: string | null;
};

export interface ProductResponse {
    status: number;
    timestamp: string;
    data: Product;
}

export interface UpdateProductResponse {
    status: number;
    timestamp: string;
    data: Product;
}

export const fetchProductManagementDetail = async (productId: string): Promise<ProductResponse> => {
    try {
        const response = await apiClient.get(`/staff/products/${productId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
};


export const fetchUpdateProduct = async (request: Product): Promise<UpdateProductResponse> => {
    try {
        const response = await apiClient.put(`/staff/products/${request.productId}`, request);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
}

export interface ProductInImportOrder {
    productId: string,
    name: string,
    priceSell: number | null,
    priceImport: number | null,
    quantityInStock: number | null, 
    activated: boolean | null
}

export interface ProductInImportOrderResponse {
    status: number,
    timestamp: string,
    data: ProductInImportOrder
}

export const fetchSearchProductToImportOrder = async (productId: string): Promise<ProductInImportOrderResponse> => {
    try {
        const response = await apiClient.get("/staff/products/search-add-to-import-order",
            {
                params: {
                    productId
                }
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
};

export const fetchAddProductWhenImport = async (product: ProductInImportOrder): Promise<ProductInImportOrderResponse> => {
    try {
        const response = await apiClient.post<ProductInImportOrderResponse>(
            "/staff/products/add-in-import",
            product
        )
        return response.data;
    } catch (error:any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error("Server không phản hồi");
    }
};

export interface InsertListProductRequest {
    sku: string;
    name: string;
    size: string;
    priceSell: number;
    priceImport: number;
    quantityInStock: number;
    description: string | null;
    categoryId: string;
    isActivated: boolean;
    discountSell: number | null; 
    startDate: string | null;
    endDate: string | null;
    image: string;
};

export interface ProductAdByFile {
    sku: string;
    name: string;
    errorType: string;
};

export interface ProductAdByFileResponse {
    status: number,
    timestamp: string,
    data: ProductAdByFile[]
};

export const fetchAddProductByFile = async (products: InsertListProductRequest[]): Promise<ProductAdByFileResponse> => {
    try {
        const response = await apiClient.post('/staff/products/add-by-file', products);
        return response.data;
    } catch (error:any) {
        if (error.response) {
            throw new Error(error.response.data.message.message);
        }
        throw new Error('Server không phản hồi!');
    }
};