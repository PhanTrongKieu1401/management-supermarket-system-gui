import apiClient from "../index";

export interface ProductInCart {
    productId: string;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    discountSell: number;
    quantityInStock: number;
    quantity: number;
    selected: boolean;
}

export interface Cart {
    productInCartResponses: ProductInCart[];
    totalNumberProducts: number;
}

export interface CartResponse {
    status: number;
    timestamp: string;
    data: Cart;
}

export const fetchCart = async (): Promise<CartResponse> => {
    try {
        const response = await apiClient.get<CartResponse>("/customer/cart");
        return response.data;
    } catch (error: any) {
        if (error.response) {
            if(error.response.status === 401) {
                throw new Error("Hết phiên đăng nhập hoặc không có quyền truy cập!");
            } else {
                throw new Error("Đã xảy ra lỗi khi tải thông tin giỏ hàng!");
            }
        } else {
            throw new Error("Server không phản hồi!");
        }
    }
}


export interface UpdateProductInCartRequest {
    productId: string;
    quantity: number;
}

export interface UpdateProductInCart {
    message: string;
    productInCartResponse: ProductInCart;
}

export interface UpdateProductInCartResponse {
    status: number;
    timestamp: string;
    data: UpdateProductInCart;
}

export const fetchUpdateProductInCart = async (credentials: UpdateProductInCartRequest): Promise<UpdateProductInCartResponse> => {
    try {
        const response = await apiClient.put<UpdateProductInCartResponse>(
            "/customer/product-in-cart", 
            credentials
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            if(error.response.status === 401) {
                throw new Error("Hết phiên đăng nhập hoặc không có quyền truy cập!");
            } else {
                if(error.response.status === 400){
                    throw new Error(error.response.data.message.message);
                } else {
                    throw new Error("Đã xảy ra lỗi khi lấy thông tin giỏ hàng!");
                } 
            }
        } else {
            throw new Error("Có lỗi trong quá trình tải dữ liệu giỏ hàng!");
        }
    }
};

export interface RemoveProductInCartResponse {
    status: number;
    timestamp: string;
    data: string;
}

export const fetchRemoveProductInCart = async (productId: string): Promise<RemoveProductInCartResponse> => {
    try {
        const response = await apiClient.delete(`/customer/product-in-cart/${productId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            if(error.response.status === 401) {
                throw new Error("Hết phiên đăng nhập hoặc không có quyền truy cập!");
            } else {
                throw new Error("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng!");
            }
        } else {
            throw new Error("Có lỗi trong quá trình tải dữ liệu giỏ hàng!");
        }
    }
}

export interface UpdateCartResponse {
    status: number;
    timestamp: string;
    data: string;
}

export const fetchUpdateCartForCustomer = async (credentials: UpdateProductInCartRequest[]) => {
    try {
        const response = await apiClient.put<UpdateCartResponse>(
            "/customer/cart", 
            credentials
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            if(error.response.status === 401) {
                throw new Error("Hết phiên đăng nhập hoặc không có quyền truy cập!");
            } else {
                throw new Error("Đã xảy ra lỗi khi lấy thông tin giỏ hàng!");
            }
        } else {
            throw new Error("Server không phản hồi!");
        }
    }
};

