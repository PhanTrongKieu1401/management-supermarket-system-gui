import apiClient from "../index";

export const downloadTemplateAddProduct = async () => {
    try {
        const response = await apiClient.post("/staff/download/file-add-product", {
            responseType: "blob",
        });

        if (response.status === 200 && response.data) {
            const blob = new Blob([response.data], { type: "text/csv; charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "template.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            throw new Error("Không thể tải file, vui lòng thử lại sau!");
        }
    } catch (error:any) {
        if (error.response) {
            if(error.response.status === 401) {
                throw new Error("Hết phiên đăng nhập hoặc không có quyền truy cập!");
            } else {
                throw new Error("Đã xảy ra lỗi khi tải file mẫu!");
            }
        } else {
            throw new Error("Server không phản hồi!");
        }
    }
}