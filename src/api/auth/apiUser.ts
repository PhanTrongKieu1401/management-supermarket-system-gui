import apiClient from '../index';

export interface InfoResponse {
    code: string;
    timestamp: number;
    data: {
        firstName: string;
        middleName: string;
        lastName: string;
        role: string;
    };
}

export const fetchInfo = async (): Promise<InfoResponse> => {
    try {
        const response = await apiClient.get<InfoResponse>(
            "/members/info-header",
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data.message || "Có lỗi trong quá trình đăng nhập!";
                throw new Error(errorMessage);
        } else {
            throw new Error("Có lỗi trong quá trình đăng nhập!");
        }
    }
};


