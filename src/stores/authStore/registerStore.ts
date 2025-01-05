import { defineStore } from "pinia";
import { Register, fetchVerifyEmail, fetchVerifyOtp, fetchRegister } from '../../api/auth/apiRegister';

import { AccountType } from '../../utils/constants/enum';

interface RegisterState {
    email: string;
    registerKey: string;
}

export const useRegisterStore = defineStore("register", {
    state: (): RegisterState => ({
        email: '',
        registerKey: '',
    }),
    actions: {
        async verifyEmail(email: string): Promise<string> {
            try {
                this.email = email;
                const response = await fetchVerifyEmail(email);     
                return response.data;         
            } catch (error: any) {
                throw new Error(error.message);
            }
        },

        async verifyOtp(email: string, otp: string): Promise<string> {
            try {
                const response = await fetchVerifyOtp(email, otp);
                console.log(response.data.registerKey)
                this.registerKey = response.data.registerKey;
                localStorage.setItem('registerKey', response.data.registerKey);
                return response.data.registerKey;
            } catch (error: any) {
                throw new Error(error.message);
            }
        },

        async fetchRegister(register: Register): Promise<string> {
            try {
                register.role = AccountType.CUSTOMER;
                const response = await fetchRegister(register);
                console.log("STORE", response);
                return response.data;
            } catch (error: any) {
                throw new Error(error.message);
            }
        }
    },
});