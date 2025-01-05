import { defineStore } from "pinia";

export interface Action {
    productId: string;
}

export const useActionStore = defineStore('filter', {
    state: (): Action => ({
        productId: ''
    }),
    actions: {
        
    }
});