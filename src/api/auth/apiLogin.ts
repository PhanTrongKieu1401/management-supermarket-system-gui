import apiClient from '../index';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    code: string;
    timestamp: number;
    data: {
        accessToken: string;
        refreshToken: string;
        accessTokenLifeTime: string;
        refreshTokenLifeTime: string;
        role: string;
    };
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await apiClient.post<LoginResponse>(
            "/public/auth/login",
            credentials
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const errorMessage = error.response.data.message || "An error occurred while trying to log in";
            if (error.response.status === 400) {
                if (error.response.data.message.username) {
                    throw new Error(error.response.data.message.username);
                }
                if (error.response.data.message.password) {
                    throw new Error(error.response.data.message.password);
                }
                throw new Error(errorMessage.message);
            } else if (error.response.status === 404) {
                throw new Error("Tài khoản không tồn tại");
            } else {
                throw new Error("Có lỗi trong quá trình đăng nhập");
            }
        } else {
            throw new Error("Server không phản hồi");
        }
    }
};


