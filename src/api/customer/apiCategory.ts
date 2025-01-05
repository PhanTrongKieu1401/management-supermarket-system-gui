import apiClient from "../index";

export interface Category {
    id: string;
    name: string;
    activated: boolean;
    createdAt: string;
    lastUpdatedAt: string
}

export interface CategoryResponse {
    status: number;
    timestamp: string;
    data: Category[];
}

export const fetchFindAllCategories = async (): Promise<CategoryResponse> => {
    try {
        const response = await apiClient.get<CategoryResponse>(`/public/category`);
        return response.data;
    } catch (error: any) {
        if (error.response) {  
            throw new Error("An error occurred while fetching categories");
        } else {
            throw new Error("An error occurred while fetching categories");
        }
    }
};