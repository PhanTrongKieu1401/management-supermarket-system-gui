import { defineStore } from "pinia";
import { login } from '../../api/auth/apiLogin';
import { fetchInfo } from '../../api/auth/apiUser';
import { normalizeName } from "../../utils/normalizeName";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    accessTokenLifeTime: string | null;
    refreshTokenLifeTime: string | null;
    loginTimestamp: number | null;
    error: string | null;
    fullName: string | null;
    role: string | null;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        accessTokenLifeTime: localStorage.getItem('accessTokenLifeTime') || null,
        refreshTokenLifeTime: localStorage.getItem('refreshTokenLifeTime') || null,
        loginTimestamp: localStorage.getItem('loginTimestamp') ? Number(localStorage.getItem('loginTimestamp')) : null,
        error: null,
        fullName: null,
        role: null,
    }),
    actions: {
        async login(credentials: { username: string; password: string }) {
            try {
                const response = await login(credentials);
                this.loginTimestamp = response.timestamp;
                this.accessToken = response.data.accessToken;
                this.refreshToken = response.data.refreshToken;
                this.accessTokenLifeTime = response.data.accessTokenLifeTime;
                this.refreshTokenLifeTime = response.data.refreshTokenLifeTime;
                this.role = response.data.role;
                this.error = null;

                localStorage.setItem('accessToken', this.accessToken);
                localStorage.setItem('refreshToken', this.refreshToken);
                localStorage.setItem('loginTimestamp', String(this.loginTimestamp));
                localStorage.setItem('accessTokenLifeTime', this.accessTokenLifeTime || '');
                localStorage.setItem('refreshTokenLifeTime', this.refreshTokenLifeTime || '');
                localStorage.setItem('role', this.role || '');
            } catch (error: any) {
                this.error = error.message || "Đăng nhập thất bại";
            }
        },

        async getInfo() {
            try {
                const response = await fetchInfo();
                // localStorage.setItem('role', response.data.role);
                this.fullName = normalizeName(response.data.firstName, response.data.middleName, response.data.lastName);
                localStorage.setItem('fullName', normalizeName(response.data.firstName, response.data.middleName, response.data.lastName));
                return response.data;
            } catch (error: any) {
                this.error = error.message;
            }
        },

        logout() {
            this.loginTimestamp = null;
            this.accessToken = null;
            this.refreshToken = null;
            this.accessTokenLifeTime = null;
            this.refreshTokenLifeTime = null;
            this.fullName = null;
            localStorage.clear();
        },
        
        isLoggedIn(): boolean {
            return !!this.accessToken;
        }
    },
});