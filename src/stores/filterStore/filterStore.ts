import { defineStore } from "pinia";

export interface Filter {
    keySearch: string | null;
    type: string;
    sortType: string | null;
    keySort: string | null;
    currentPage: number;
    pageSize: number;
}

export const useFilterStore = defineStore('filterCustomer', {
    state: (): Filter => ({
        keySearch: localStorage.getItem('keySearch') || '',
        type: 'ALL',
        sortType: 'DESC',
        keySort: '',
        currentPage: 1,
        pageSize: 20
    }),
    actions: {
        saveFilterToLocalStorage() {
            localStorage.setItem('filterCustomer', JSON.stringify(this.$state));
        },

        loadFilterFromLocalStorage() {
            const savedFilter = localStorage.getItem('filterCustomer');
            if (savedFilter) {
                this.$state = JSON.parse(savedFilter);
            } else {
                this.saveFilterToLocalStorage();
            }
        },

        resetFilter() {
            this.$reset();
            localStorage.removeItem('filterCustomer');
        },

        updatePage(page: number) {
            this.currentPage = page;
        },

        setKeySearch(value: string) {
            this.keySearch = value;
            this.currentPage = 1;
        }

        
    }
});