import { defineStore } from "pinia";
import { UpdateProductInCartRequest, fetchCart, fetchUpdateProductInCart } from "../../api/customer/apiCart";

export interface ProductInCart {
    productId: string;
    name: string;
    image: string;
    size: string;
    priceSell: number;
    discountSell: number;
    quantityInStock: number;
    quantity: number;
    selected: boolean;
}

export interface Cart {
    productInCartResponses: ProductInCart[];
    totalNumberProducts: number;
}

export const useCartStore = defineStore("cart", {
    state: (): Cart => ({
        productInCartResponses: JSON.parse(localStorage.getItem("productInCarts") || "[]"),
        totalNumberProducts: 0,
    }),
    actions: {
        syncLocalStorage() {
            localStorage.setItem("productInCarts", JSON.stringify(this.productInCartResponses));
        },

        async getCart() {
            try {
                const response = await fetchCart();
                this.productInCartResponses = response.data.productInCartResponses || [];
                this.totalNumberProducts = response.data.totalNumberProducts || 0;

                this.syncLocalStorage();
            } catch(error: any) {
                console.error(error.message);
            }
        },

        async updateProductInCart(productId: string, quantity: number){
            try {
                const response = await fetchUpdateProductInCart({
                    productId: productId,
                    quantity: quantity
                });

                if (response) {
                    const product = response.data.productInCartResponse
                    const existedProduct = this.productInCartResponses.find(
                        (p) => p.productId === productId
                    );
                    
                    if (!existedProduct) {
                        this.productInCartResponses.push(product);
                    } else {
                        existedProduct.quantity = quantity;
                    }                    
                    this.totalNumberProducts = this.productInCartResponses.reduce((total, product) => {
                        return total + Number(product.quantity);
                    }, 0);

                    this.syncLocalStorage();
                    return "Cập nhật sản phẩm trong giỏ hàng thành công!";
                }
            } catch(error: any) {
                throw new Error(error.message);
            }
        },

        removeProductInCart(product: ProductInCart) {
            this.productInCartResponses = this.productInCartResponses.filter(p => p.productId !== product.productId);
            this.totalNumberProducts = this.totalNumberProducts - product.quantity;
            this.syncLocalStorage();
        }, 

        removeListProductInCart(products: UpdateProductInCartRequest[]) {
            products.forEach(product => {
                const index = this.productInCartResponses.findIndex(p => p.productId === product.productId);
                if (index !== -1) {
                    this.totalNumberProducts -= this.productInCartResponses[index].quantity;
                    this.productInCartResponses.splice(index, 1);
                }
            });
            this.syncLocalStorage();
        }, 
    } 
});