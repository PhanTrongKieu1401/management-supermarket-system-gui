import axios from 'axios';

export interface MomoRequest {
    partnerCode: string;
    orderId: string;
    amount: string;
    ids: string;
}

export interface MomoResponse {
    shortLink: string;
} 

const url = 'http://localhost:3000/api/payment-with-momo'
export const paymentWithMomo = async (partnerCode: String, orderId: string, amount: number, ids: string): Promise<MomoResponse> => {
    try {
        const response = await axios.post(url, {
            partnerCode,
            orderId,
            amount: amount.toString(),
            ids
        })
        console.log('Response from payment API:', response.data);
        return response.data;
    } catch(error: any) {
        return error;
    }
}
