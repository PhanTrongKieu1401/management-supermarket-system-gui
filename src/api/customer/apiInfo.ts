import apiClient from "../index";

export interface Information {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    role: string;
}

export interface InformationResponse {
    status: number;
    timestamp: string;
    data: Information;
}

export const fetchInformation = async (): Promise<InformationResponse> => {
    try {
        const response = await apiClient.get<InformationResponse>(
            "/members/info",
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Có lỗi xảy ra trong quá trình fetch thông tin!");
        }
        
    }
}