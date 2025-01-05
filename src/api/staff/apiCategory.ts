import apiClient from "../index";

export interface CategoryFilter {
    categoryId: string,
    categoryName: string,
}

export interface OrderListResponse {
    status: number,
    timestamp: string,
    data: CategoryFilter[],
}

export const fetchCategoryFilter = async (): Promise<OrderListResponse> => {
    try {
        const response = await apiClient.get(`/staff/categories/filter`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Có lỗi xảy ra trong quá trình lấy danh sách loại sản phẩm!');
    }
}