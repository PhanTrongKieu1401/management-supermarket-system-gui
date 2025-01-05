<template>
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h1 class="title-modal">Chọn file sản phẩm</h1>
  
        <div class="modal-body">
          <div class="upload-section">
            <div class="file-input">
              <label for="file">Chọn file:</label>
              <input id="file" type="file" @change="handleFileUpload" accept=".csv" />
              <button class="btn btn-template" @click="downloadTemplate">Tải file mẫu</button>
            </div>
            <div class="buttons">
              <button class="btn btn-upload" @click="submitFile">Lưu dữ liệu</button>
              <button class="btn btn-cancel" @click="closeModal">Hủy</button>
            </div>
          </div>
  
          <div class="table-section">
            <table>
              <thead>
                <tr>
                  <th style="width: 10%;">Sku</th>
                  <th style="width: 8%;">Ảnh</th>
                  <th style="width: 12%;">Tên</th>
                  <th style="width: 8%;">Giá bán</th>
                  <!-- <th>Price Import</th> -->
                  <th style="width: 8%;">Tồn kho</th>
                  <th style="width: 10%;">Mô tả</th>
                  <th style="width: 10%;">Trạng thái</th>
                  <th style="width: 6%;">Loại</th>
                  <th style="width: 8%;">Ưu đãi</th>
                  <th style="width: 10%;">Ngày bắt đầu</th>
                  <th style="width: 10%;">Ngày kết thúc</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in products" :key="index">
                  <td style="width: 10%;">{{ product.sku }}</td>
                  <td style="width: 8%;">
                    <img :src="product.image" alt="Product Image" class="product-image" />
                  </td>
                  <td style="width: 12%;">{{ product.name }}</td>
                  <td style="width: 8%; text-align: right;">{{ product.priceSell.toLocaleString('vi-VN') }}</td>
                  <!-- <td style="text-align: right;">{{ product.priceImport.toLocaleString('vi-VN') }}</td> -->
                  <td style="width: 8%; text-align: right;">{{ product.quantityInStock }}</td>
                  <td style="width: 10%;">{{ product.description }}</td>
                  <td style="width: 10%;">{{ product.isActivated ? "Đang bán" : "Ngừng bán" }}</td>
                  <td style="width: 6%;">{{ product.categoryId }}</td>
                  <td style="width: 8%; text-align: right;">{{ product.discountSell?.toLocaleString('vi-VN') }}</td>
                  <td style="width: 10%;">{{ product.startDate }}</td>
                  <td style="width: 10%;">{{ product.endDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="fixed w-full h-full inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-1000">
      <div class="bg-white rounded-lg shadow-lg p-5">
          <p class="text-center text-lg">{{ messageLoading }}...</p>
          <div class="mt-3">
              <svg class="animate-spin h-5 w-5 mx-auto text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AddProductByFileModal",
});
</script>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';

import { InsertListProductRequest,fetchAddProductByFile } from "../../../../api/staff/apiProduct";
import { downloadTemplateAddProduct } from '../../../../api/customer/apiTemplate';

import Papa from "papaparse";
import { parse, format, isValid } from "date-fns";

const selectedFile = ref<File | null>(null);

const props = defineProps<{
  showModal: boolean;
}>();

const isLoading = ref<boolean>(false);
const messageLoading = ref<string>('');
const products = ref<InsertListProductRequest[] | null>(null);

const emit = defineEmits(['close','reloadData']);

const closeModal = () => {
  emit('close');
  isLoading.value = false;
  selectedFile.value = null;
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    messageLoading.value = "Đang xử lý dữ liệu";
    isLoading.value = true;
    console.log(isLoading.value);
    Papa.parse(selectedFile.value, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedProducts = results.data.map((item: any) => ({
          sku: item.Sku || "",
          name: item.Name || "",
          image: item.Image || "",
          size: item.Size || '',
          priceSell: parseFloat(item.PriceSell) || 0,
          priceImport: parseFloat(item.PriceImport) || 0,
          quantityInStock: parseInt(item.QuantityInStock, 10) || 0,
          description: item.Description || "",
          isActivated: normalizeActivation(item.IsActivated),
          categoryId: item.CategoryId || "",
          // quantityInOrdering: parseInt(item.QuantityInOrdering) || 0,
          discountSell: parseFloat(item.Discount) || 0,
          startDate: formatDate(item.StartDate || ""),
          endDate: formatDate(item.EndDate || ""),
        }));
        products.value = parsedProducts;
        isLoading.value = false;
      },
      error: (error: any) => {
        alert("Có lỗi xảy ra khi đọc file: " + error.message);
      },
    });
  }
};

const downloadTemplate = async () => {
  try {
    await downloadTemplateAddProduct();
  } catch (error:any) {
    alert(error.message);
  }
}

const submitFile = async () => {
  if (selectedFile.value) {
    isLoading.value = true;
    try {
      const response = await fetchAddProductByFile(products.value!);
      if (response) {
        alert("Thêm sản phẩm thành công!");
        emit('reloadData');
      } else {
        alert("Có lỗi xảy ra khi thêm sản phẩm");
      }
    } catch (error:any) {
      alert(error.message);
    }
    isLoading.value = false;
    products.value = null;
    closeModal();
  } else {
    alert('Vui lòng chọn một file!');
  }
};

function formatDate(inputDate: string): string {
  if (!inputDate) return "";

  const formats = ["yyyy-MM-dd", "yyyy/MM/dd", "MM/dd/yyyy", "MM-dd-yyyy"];

  for (const fmt of formats) {
    const parsedDate = parse(inputDate, fmt, new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, "yyyy-MM-dd");
    }
  }

  return "";
}

function normalizeActivation(value: any): boolean {
  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["1", "true", "đang bán"].includes(normalized);
  }

  if (typeof value === "boolean") {
    return value;
  }

  return false;
}
</script>

<style scoped>
@import "index.css";
</style>
