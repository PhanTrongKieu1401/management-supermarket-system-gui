import apiClient from '../index';

export interface VerifyEmailResponse {
    status: number;
    timestamp: number;
    data: string;
}

export const fetchVerifyEmail = async (email: string): Promise<VerifyEmailResponse> => {
    try {
        const response = await apiClient.post(`/public/auth/register/email/validate`, {email});
        return response.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export interface VerifyOtpResponse {
    status: number;
    timestamp: number;
    data: {
        registerKey: string;
    };
}

export const fetchVerifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    try {
        const response = await apiClient.post(`/public/auth/register/otp/validate`, {
            email, otp
        });
        return response.data;
    } catch (error: any) {
        if(error.response) {
            throw new Error(error.response.data.message.message);
        } else {
            throw new Error("Có lỗi trong quá trình xác thực OTP!");
        }
        
    }
};

export interface Register {
    registerKey: string,
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string,
    middleName: string | null,
    lastName: string;
    phone: string;
    role: string;
}

export interface RegisterResponse {
    status: number;
    timestamp: number;
    data: string;
}

export const fetchRegister = async (register: Register): Promise<RegisterResponse> => {
    try {
        const response = await apiClient.post(`/public/auth/register`, register);
        console.log("API", response);
        return response.data;
    } catch (error: any) {
        if(error.response) {
            throw new Error(error.response.data.message.message);
        } else {
            throw new Error("Có lỗi trong quá trình xác thực OTP!");
        }
        
    }
};