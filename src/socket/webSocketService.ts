import { Ref } from 'vue';
import Stomp from 'stompjs';
import { Client } from 'stompjs';
import { useAuthStore } from "../stores/authStore/loginStore";

export type ResponseWebSocket = {
    status: string,
    orderId: string
};

export type TransactionStatus = {
    partnerCode: string,
    orderId: string,
    resultCode: number
}

let stompClient: Client | null = null;

export function connectWebSocket(responseWebSocket: Ref<ResponseWebSocket | null>, resWSCancelOrder: Ref<boolean | null>) {
    if (stompClient) {
        console.warn('WebSocket connection already established.');
        disconnectWebSocket();
    }

    const authStore = useAuthStore();
    const token = authStore.accessToken;
    // const socket = new WebSocket('ws://localhost:8080/ws');
    const socket = new WebSocket('wss://adapted-ox-suitably.ngrok-free.app/ws');

    stompClient = Stomp.over(socket);
    
    console.log("STOMPCLIENT", stompClient)
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token,
    };
    
    stompClient.connect(headers, (frame) => {

        stompClient?.subscribe(`/user/${token}/topic/order`, (message) => {
            console.log("PUSH ORDER STATUS", message.body)
            const newResponseWebSocket = JSON.parse(message.body);
            responseWebSocket.value = newResponseWebSocket;              
        });

        stompClient?.subscribe(`/user/${token}/topic/cancel-order`, (message) => {
            console.log("CANCEL ORDER", message.body)
            const newResWSCancelOrder = JSON.parse(message.body);
            resWSCancelOrder.value = newResWSCancelOrder;              
        });
    });
}

export function disconnectWebSocket() {
    if (stompClient) {
        stompClient.disconnect(() => {
            // console.log('Disconnected');
        });
        stompClient = null;
    }
}

export function sendOrder(order: any) {
    if (stompClient) {
        stompClient.send('/app/order', {}, JSON.stringify(order));
    } else {
        console.error('WebSocket connection is not established');
    }
}