import { defineStore } from "pinia";
import { TimeType } from "../../utils/constants/enum";

export interface Filter {
    orderId: string | null;
    importOrderId: string | null;
    customerId: string | null;
    staffId: string | null;
    supplierId: string | null;
    productId: string | null;
    categoryId: string;
    name: string | null;
    orderStatus: string;
    paymentStatus: string;
    isActivated: boolean | null;
    keySearch: string | null;
    filterType: string;
    timeType: string;
    startDate: string | null;
    endDate: string | null;
    startWeek: number | null;
    endWeek: number | null;
    startMonth: number | null;
    endMonth: number | null;
    quarter: number | null;
    year: number | null;
    currentPage: number;
    pageSize: number;
}

export const useFilterStore = defineStore('filter', {
    state: (): Filter => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentQuarter = Math.ceil(currentMonth / 3);

        const startOfYear = new Date(currentYear, 0, 1);
        const startDayOfWeek = startOfYear.getDay();
        const adjustedStartDayOfWeek = startDayOfWeek === 0 ? 7 : startDayOfWeek;
        const daysSinceStartOfYear = Math.ceil((currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.floor((daysSinceStartOfYear + adjustedStartDayOfWeek) / 7);
        return {
            orderId: null,
            importOrderId: null,
            customerId: null,
            staffId: null,
            supplierId: null,
            productId: null,
            categoryId: "ALL",
            name: null,
            orderStatus: "ALL",
            paymentStatus: "ALL",
            isActivated: null,
            keySearch: null,
            filterType: "time",
            timeType: TimeType.DAY,
            startDate: currentDate.toISOString().split('T')[0],
            endDate: currentDate.toISOString().split('T')[0],
            startWeek: currentWeek,
            endWeek: currentWeek,
            startMonth: currentMonth,
            endMonth: currentMonth,
            quarter: currentQuarter,
            year: currentYear,
            currentPage: 1,
            pageSize: 50
        };
        // orderId: null,
        // importOrderId: null,
        // customerId: null,
        // staffId: null,
        // supplierId: null,
        // productId: null,
        // categoryId: "ALL",
        // name: null,
        // orderStatus: "ALL",
        // paymentStatus: "ALL",
        // isActivated: null,
        // keySearch: null,
        // filterType: "time",
        // timeType: TimeType.DAY,
        // startDate: null,
        // endDate: null,
        // startWeek: null, 
        // endWeek: null, 
        // startMonth: null,
        // endMonth: null,
        // quarter: null,
        // year: new Date().getFullYear(),
    },
    actions: {
        init() {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
            const currentQuarter = Math.ceil((currentMonth) / 3);

            const startOfYear = new Date(currentYear, 0, 1);
            const startDayOfWeek = startOfYear.getDay();
            const adjustedStartDayOfWeek = (startDayOfWeek === 0 ? 7 : startDayOfWeek);
            const daysSinceStartOfYear = Math.ceil((currentDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
            const currentWeek = Math.floor((daysSinceStartOfYear + adjustedStartDayOfWeek) / 7);
            
            this.startDate = currentDate.toISOString().split('T')[0];
            this.endDate = currentDate.toISOString().split('T')[0];
            this.startWeek = currentWeek;
            this.endWeek = currentWeek;
            this.startMonth = currentMonth;
            this.endMonth = currentMonth;
            this.quarter = currentQuarter;
            this.year = currentYear;
        },

        saveFilterToLocalStorage() {
            localStorage.setItem('filter', JSON.stringify(this.$state));
        },

        loadFilterFromLocalStorage() {
            const savedFilter = localStorage.getItem('filter');
            if (savedFilter) {
                this.$state = JSON.parse(savedFilter);
            } else {
                this.saveFilterToLocalStorage();
            }
        },

        resetFilter() {
            this.$reset();
            localStorage.removeItem('filter');
        },

        getCurrentWeek() {
            const now = new Date();
            const start = new Date(now.getFullYear(), 0, 1);
            const diff = now.getTime() - start.getTime();
            return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7));
        }
    }
});