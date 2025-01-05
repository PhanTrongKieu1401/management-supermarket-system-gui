import apiClient from "../index";

export interface StaffDashboard {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
}

export interface StaffDashboardResponse {
    status: number;
    timestamp: string;
    data: StaffDashboard;
}

export const fetchStaffDashboard = async (): Promise<StaffDashboardResponse> => {
    try {
        const response = await apiClient.get<StaffDashboardResponse>(
            "/staff/staff-dashboard",
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Server không phản hồi");
    }
}