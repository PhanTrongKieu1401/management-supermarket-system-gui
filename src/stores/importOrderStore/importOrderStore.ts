import { defineStore } from "pinia";
import { useStaffStore } from "../staffStore/staffStore";
import { watch } from "vue";
import { createImportOrder } from "../../api/staff/apiImportOrder";

export interface Supplier {
    supplierId: string,
    name: string,
    phone: string,
    email: string,
    addressDetail: string,
    ward: string,
    district: string,
    province: string,
    activated: boolean | null
}

export interface Staff {
    staffId: string,
    firstName: string,
    middleName: string, 
    lastName: string,
    phone: string
}

export interface ProductInImportOrder {
    productId: string,
    name: string,
    priceImport: number,
    quantity: number,
    amount: number
}

export interface ImportOrderDetailStore {
    importOrderId: string,
    importDate: string,
    paymentStatus: string,
    supplier: Supplier,
    staff: Staff,
    productInImportOrders: ProductInImportOrder[]
}

export const useImportOrderDetailStore = defineStore("importOrderDetail", {
    
    state: () => {
        const staffStore = useStaffStore();
        const savedImportOrderDetail = localStorage.getItem("importOrderDetail");
        const defaultImportOrderDetail = savedImportOrderDetail
            ? JSON.parse(savedImportOrderDetail)
            : {
                importOrderId: "",
                importDate: "",
                paymentStatus: "",
                supplier: {
                    supplierId: "",
                    name: "",
                    phone: "",
                    email: "",
                    addressDetail: "",
                    ward: "",
                    district: "",
                    province: "",
                    activated: null
                },
                staff: {
                    staffId: staffStore.staffDashboard?.id,
                    firstName: staffStore.staffDashboard?.firstName,
                    middleName: staffStore.staffDashboard?.middleName,
                    lastName: staffStore.staffDashboard?.lastName,
                    phone: staffStore.staffDashboard?.phone
                },
                productInImportOrders: []
            };
        return { 
            importOrderDetail: defaultImportOrderDetail as ImportOrderDetailStore
        };
    },
    actions: {
        saveImportOrderDetailToLocalStorage() {
            localStorage.setItem(
                "importOrderDetail",
                JSON.stringify(this.importOrderDetail)
            );
        },

        updateProductQuantity(productId: string, newQuantity: number) {
            const product = this.importOrderDetail.productInImportOrders.find(p => p.productId === productId);
            if (product) {
                product.quantity = newQuantity;
                product.amount = newQuantity * product.priceImport;
            }
        },

        clearImportOrderDetailFromLocalStorage() {
            localStorage.removeItem("importOrderDetail");
            this.$reset(); 
        },
        
        async createImportOrder() {
            try {
                const response = await createImportOrder(this.importOrderDetail);
                if(response) {
                    this.clearImportOrderDetailFromLocalStorage();
                    return response.data;
                } else {
                    return "Thêm đơn nhập hàng thất bại!";
                }
            } catch (error:any) {
                return error.message;
            }
        },

        initWatch() {
            watch(
                () => this.importOrderDetail,
                (newImportOrderDetail) => {
                    this.saveImportOrderDetailToLocalStorage();
                },
                { deep: true }
            );
        }
    },
});