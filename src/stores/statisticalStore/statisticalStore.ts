import { defineStore } from "pinia";
import { useFilterStore } from "../filterStore/filterStaffStore";
import { FilterByTime, FilterByCustomer, FilterByProduct, fetchStatisticalByTime, fetchStatisticalByCustomer, fetchStatisticalByProduct } from "../../api/staff/apiStatistical";

export const useStatisticalStore = defineStore("statisticalStore", {
    state: () => ({
        filterByTime: [] as FilterByTime[],     
        filterByCustomer: [] as FilterByCustomer[], 
        filterByProduct: [] as FilterByProduct[],
    }),
    actions: {
        setFilterByTime(data: FilterByTime[]) {
            this.filterByTime = data;
            localStorage.setItem('filterByTime', JSON.stringify(this.filterByTime));
        },
        setFilterByCustomer(data: FilterByCustomer[]) {
            const sortedData = data.sort((a, b) => b.totalAmount - a.totalAmount);
            this.filterByCustomer = sortedData;
            localStorage.setItem('filterByCustomer', JSON.stringify(this.filterByCustomer));
        },
        setFilterByProduct(data: FilterByProduct[]) {
            const sortedData = data.sort((a, b) => b.totalAmount - a.totalAmount);
            this.filterByProduct = sortedData;
            localStorage.setItem('filterByProduct', JSON.stringify(this.filterByProduct));
        },

        resetFilters() {
            this.filterByTime = [];
            this.filterByCustomer = [];
            this.filterByProduct = [];
        },

        async fetchStatisticalByTimeData() {
            const filterStore = useFilterStore();
            const params = {
                timeType: filterStore.timeType,
                startDate: filterStore.startDate,
                endDate: filterStore.endDate,
                startWeek: filterStore.startWeek,
                endWeek: filterStore.endWeek,
                startMonth: filterStore.startMonth,
                endMonth: filterStore.endMonth,
                quarter: filterStore.quarter,
                year: filterStore.year,
                page: filterStore.currentPage,
                size: 50
            };
            try {
                const response = await fetchStatisticalByTime(params);
                this.setFilterByTime(response.data.filterByTimes);
                return response.data;
            } catch (error:any) {
                return error.message;
            }
        },

        async fetchStatisticalByCustomerData() {
            const filterStore = useFilterStore();
            const params = {
                timeType: filterStore.timeType,
                startDate: filterStore.startDate,
                endDate: filterStore.endDate,
                startWeek: filterStore.startWeek,
                endWeek: filterStore.endWeek,
                startMonth: filterStore.startMonth,
                endMonth: filterStore.endMonth,
                quarter: filterStore.quarter,
                year: filterStore.year,
                keySearch: filterStore.keySearch || '',
                page: filterStore.currentPage,
                size: 50
            };

            try {
                const response = await fetchStatisticalByCustomer(params);
                this.setFilterByCustomer(response.data.filterByCustomers); 
                return response.data;
            } catch (error:any) {
                return error.message;
            }
        },

        async fetchStatisticalByProductData() {
            const filterStore = useFilterStore();
            const params = {
                timeType: filterStore.timeType,
                startDate: filterStore.startDate,
                endDate: filterStore.endDate,
                startWeek: filterStore.startWeek,
                endWeek: filterStore.endWeek,
                startMonth: filterStore.startMonth,
                endMonth: filterStore.endMonth,
                quarter: filterStore.quarter,
                year: filterStore.year,
                keySearch: filterStore.keySearch || '',
                page: filterStore.currentPage,
                size: 50
            };

            try {
                const response = await fetchStatisticalByProduct(params);
                this.setFilterByProduct(response.data.filterByProducts);
                console.log("HIHIIIII",response.data.totalPages)
                return response.data;
            } catch (error:any) {
                return error.message;
            }
        },
    },
});