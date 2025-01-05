import apiClient from "../index";

export interface FilterByTime {
    time: string;
    totalOrder: number;
    totalOrderComplete: number;
    totalOrderPending: number;
    totalOrderCancel: number;
    totalOrderOnline: number;
    totalOrderOffline: number;
    totalAmount: number;
}

export interface FilterByTimeRequest {
    timeType: string;
    startDate: string | null;
    endDate: string | null;
    startWeek: number | null;
    endWeek: number | null;
    startMonth: number | null;
    endMonth: number | null;
    quarter: number | null;
    year: number | null;
}

export interface FilterByTimeResponse {
    status: number;
    timestamp: string;
    data: {
        filterByTimes: FilterByTime[];
        totalPages: number;
        revenue: number;
        completedOrders: number;
        pendingOrders: number;
        cancelledOrders: number;
    };
}

export const fetchStatisticalByTime = async (filter: FilterByTimeRequest): Promise<FilterByTimeResponse> => {
    try {
        const response = await apiClient.post(`/staff/statistical/time`, filter);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Server không phản hồi!");
    }
}

export interface FilterByCustomer {
    customerId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
    totalOrder: number;
    totalOrderComplete: number;
    totalOrderPending: number;
    totalOrderCancel: number;
    totalProductPurchase: number;
    totalOutstandingAmount: number;
    totalAmount: number;
}

export interface FilterByCustomerRequest {
    timeType: string;
    startDate: string | null;
    endDate: string | null;
    startWeek: number | null;
    endWeek: number | null;
    startMonth: number | null;
    endMonth: number | null;
    quarter: number | null;
    year: number | null;
    keySearch: string | null,
}

export interface FilterByCustomerResponse {
    status: number;
    timestamp: string;
    data: {
        filterByCustomers: FilterByCustomer[];
        totalPages: number;
        revenue: number;
        completedOrders: number;
        pendingOrders: number;
        cancelledOrders: number;
    };
}

export const fetchStatisticalByCustomer = async (filter: FilterByCustomerRequest): Promise<FilterByCustomerResponse> => {
    try {
        const response = await apiClient.post(`/staff/statistical/customer`, filter);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Server không phản hồi!");
    }
}

export interface FilterByProduct {
    productId: string;
    name: string;
    quantityInStock: number;
    quantityInOrdering: number;
    totalSold: number;
    totalPending: number;
    totalCancel: number;
    totalAmount: number;
}

export interface FilterByProductRequest {
    timeType: string;
    startDate: string | null;
    endDate: string | null;
    startWeek: number | null;
    endWeek: number | null;
    startMonth: number | null;
    endMonth: number | null;
    quarter: number | null;
    year: number | null;
    keySearch: string | null,
}

export interface FilterByProductResponse {
    status: number;
    timestamp: string;
    data: {
        filterByProducts: FilterByProduct[];
        totalPages: number;
        revenue: number;
        totalStock: number;
        totalOrdering: number;
        totalProductsSold: number;
        totalProductsPending: number;
        totalProductsCancel: number;
    };
}

export const fetchStatisticalByProduct = async (filter: FilterByProductRequest): Promise<FilterByProductResponse> => {
    try {
        const response = await apiClient.post(`/staff/statistical/product`, filter);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Server không phản hồi!");
    }
}