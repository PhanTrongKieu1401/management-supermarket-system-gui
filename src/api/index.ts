import axios from "axios";
// import { useRouter } from "vue-router";
// @ts-ignore
import router from "../router";
import { useAuthStore } from "../stores/authStore/loginStore";

const apiClient = axios.create({
  // baseURL: "http://localhost:8080/api/v1",
  baseURL: "https://adapted-ox-suitably.ngrok-free.app/api/v1",
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
});

// Request interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (request) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log("Starting Request", request);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Error Response:", error.response);
    // const router = useRouter();
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default apiClient;