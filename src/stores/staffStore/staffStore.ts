import { defineStore } from "pinia";
import { fetchStaffDashboard } from "../../api/staff/apiStaff";

type StaffDashboard = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
};

export const useStaffStore = defineStore("staff", {
    state: () => ({
        staffDashboard: JSON.parse(localStorage.getItem('staffDashboard') || 'null') as StaffDashboard | null,
    }),

    actions: {
        async fetchStaffDashboard() {
            try {
                const response = await fetchStaffDashboard();
                if(response) {
                    this.staffDashboard = response.data;
                    localStorage.setItem('staffDashboard', JSON.stringify(this.staffDashboard));
                } else {
                    throw new Error("Không tải được thông tin nhân viên!");
                }
            } catch (error: any) {
                throw new Error(error.message);
            }
        },

        clearStaffDashboard() {
            this.staffDashboard = null;
            localStorage.removeItem('staffDashboard');
        }
    }
});

