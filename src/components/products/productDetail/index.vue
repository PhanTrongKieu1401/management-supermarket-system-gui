<template>
  <div class="product-detail-container mx-auto my-10 w-full">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Trang chủ</router-link></li>
        <li v-if="filterType && filterType !== 'ALL'" class="breadcrumb-item">
          <router-link to="#" @click.prevent="navigateToProducts">{{ getCategoryName(filterType) }}</router-link>
        </li>
        <li class="breadcrumb-item active"><router-link to="#"></router-link>{{ product.name }}</li>
      </ol>
    </nav>

    <div class="product-info flex flex-wrap justify-between bg-white p-6 rounded-lg shadow-lg">
      <div class="product-image w-full md:w-1/2">
        <img :src="product.image" :alt="product.name" class="w-full h-auto object-cover rounded-lg" />
      </div>

      <div class="product-details w-full md:w-1/2 px-6 flex flex-col space-y-4">
        <span class="text-3xl font-bold">{{ product.name }}</span>
        <span class="font-medium">SKU: {{ product.sku }}</span>
        <div class="product-rating flex items-center">
          <span v-for="star in 5" :key="star" style="color: rgb(255, 151, 39)">
            <font-awesome-icon :icon="getStarIcon(star)" />
          </span>
          <span class="ml-2 text-gray-600">({{ product.rateCount }} đánh giá)</span>
        </div>

        <div class="product-price mb-4">
          <p v-if="product.discountSell" class="text-lg line-through text-gray-600 mb-1">
            Giá niêm yết: {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
          </p>
        
          <p v-if="product.discountSell" class="text-xl font-bold text-red-500">
            Giá ưu đãi: {{ product.discountSell.toLocaleString('vi-VN') }} Vnđ
          </p>

          <p v-if="product.discountSell" class="text-black-500">
            Từ ngày: {{ formatDate(product.startDate) }} - {{ formatDate(product.endDate) }}
          </p>

          <p v-else class="text-xl font-bold text-black">
            Giá: {{ product.priceSell.toLocaleString('vi-VN') }} Vnđ
          </p>

          <p class="mt-2 text-black">
            Tình trạng:
            <span :class="{
              'text-green-500': product.quantityInStock > 0,
              'text-gray-500': product.quantityInStock === 0,
              'text-red-500': !product.isActivated
            }">
            {{ product.isActivated ? (product.quantityInStock > 0 ? 'Còn hàng' : 'Hết hàng') : 'Ngừng bán' }}
            </span>
          </p>
        </div>

        <div v-if="product.isActivated" class="quantity-wrapper flex flex-col items-start">
          <div v-if="product.isActivated" class="quantity-selector">
            <button @click="decreaseQuantity"
              class="btn-quantity-selector btn-quantity-decrease w-1/4 h-full px-3 py-2">-</button>
            <input type="text" v-model="quantity" class="w-1/2 h-full text-center px-2 py-1" 
              @blur="validateQuantity()" min="1" max="999"/>
            <button @click="increaseQuantity"
              class="btn-quantity-selector btn-quantity-increase w-1/4 h-full px-3 py-2">+</button>
          </div>
          <div class="estimated-price-wrapper text-gray-700 font-medium">
            Giá ước lượng: 
            <span class="estimated-price">
                {{ estimatedPrice.toLocaleString('vi-VN') }} Vnđ
            </span>
          </div>
        </div>

        <button v-if="product.isActivated" @click="addToCart" class="btn-add-to-cart flex justify-center w-1/2 py-2 px-4 mb-4"
          :disabled="product.quantityInStock === 0" :class="{'disabled': product.quantityInStock === 0}">
          <span v-if="isLoading" class="loader"></span>
          <span v-else>Thêm vào giỏ hàng</span>
        </button>

        <button @click="toggleExpand" class="w-1/2 bg-gray-200 text-gray-600 py-2 px-4 rounded-lg">
          {{ expand ? 'Ẩn thông tin' : 'Xem thông tin đầy đủ' }}
        </button>

        <div v-if="expand" class="expanded-info mt-4">
          <p><strong>Tên sản phẩm:</strong> {{ product.name }}</p>
          <p><strong>Loại sản phẩm:</strong> {{ product.category }}</p>
          <p><strong>Kích thước:</strong> {{ product.size }}</p>
          <p><strong>Mô tả:</strong> {{ product.description }}</p>
        </div>
      </div>
    </div>

    <div class="user-comments mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold">Nhận xét và đánh giá</h1>
      <div class="flex">
        <div class="left-column w-3/4 pr-4">
          <div class="flex justify-between mb-5" style="border-bottom: 1px solid rgb(238, 238, 238);">
            <div class="sort-dropdown flex w-5/12 items-center mb-4">
              <label class="mr-2 whitespace-nowrap">Sắp xếp theo:</label>
              <select class="w-full p-2 border rounded-lg">
                <option value="latest">Thời gian gần nhất</option>
                <option value="highest-rated">Đánh giá cao nhất</option>
                <option value="lowest-rated">Đánh giá thấp nhất</option>
              </select>
            </div>

            <div class="rating-buttons mb-4">
              <button @click="filterByRating('all')" :class="{ 'active': selectedRating === 'all' }"
                class="rating-btn">Tất cả</button>
              <button @click="filterByRating('5')" :class="{ 'active': selectedRating === '5' }" class="rating-btn">
                5 <font-awesome-icon :icon="['fas', 'star']" :class="{ 'active': selectedRating === '5' }"
                  class="star" />
              </button>
              <button @click="filterByRating('4')" :class="{ 'active': selectedRating === '4' }" class="rating-btn">
                4 <font-awesome-icon :icon="['fas', 'star']" :class="{ 'active': selectedRating === '4' }"
                  class="star" />
              </button>
              <button @click="filterByRating('3')" :class="{ 'active': selectedRating === '3' }" class="rating-btn">
                3 <font-awesome-icon :icon="['fas', 'star']" :class="{ 'active': selectedRating === '3' }"
                  class="star" />
              </button>
              <button @click="filterByRating('2')" :class="{ 'active': selectedRating === '2' }" class="rating-btn">
                2 <font-awesome-icon :icon="['fas', 'star']" :class="{ 'active': selectedRating === '2' }"
                  class="star" />
              </button>
              <button @click="filterByRating('1')" :class="{ 'active': selectedRating === '1' }" class="rating-btn">
                1 <font-awesome-icon :icon="['fas', 'star']" :class="{ 'active': selectedRating === '1' }"
                  class="star" />
              </button>
            </div>
          </div>

          <div class="comments">
            <div v-for="comment in comments" :key="comment.id" class="comment mb-4">
              <div class="comment-item flex items-start mb-5">
                <LogoUser :fullname="comment.fullnameUser" class="w-12 h-12 rounded-full mr-4" />
                <div class="comment-content flex-1">
                  <div class="comment-header flex items-center mb-2">
                    <span class="font-bold">{{ comment.fullnameUser }}</span>
                    <span v-if="comment.rating" v-for="star in 5" :key="star" class="ml-2"
                      style="color: rgb(255, 151, 39)">
                      <font-awesome-icon :icon="comment.rating >= star ? 'fas fa-star' : 'far fa-star'" />
                    </span>
                  </div>
                  <p class="mb-2">{{ comment.content }}</p>
                  <div class="text-gray-500 text-sm mb-2">{{ comment.lastUpdatedAt }}</div>
                  <div class="comment-actions flex items-center">
                    <button @click="toggleReply(comment.id)" class="btn-reply">Trả lời</button>
                  </div>

                  <div v-if="showReplyBox === comment.id" class="reply-box mt-4">
                    <textarea v-model="replyContent" placeholder="Nhập bình luận của bạn..."
                      class="w-full p-2 border rounded-lg mb-2"></textarea>

                    <div v-if="selectedImageReply" class="image-preview mb-4 relative">
                      <img :src="selectedImageReply" alt="Selected Image" class="w-full h-auto rounded-lg">
                      <button @click="removeImage(true)" class="btn-remove-image rounded-full">
                        <font-awesome-icon :icon="['fas', 'trash-can']" />
                      </button>
                    </div>

                    <input type="file" ref="fileInput" @change="attachImage($event, true)" class="hidden reply-input"
                      accept="image/*" />

                    <div class="flex space-x-2">
                      <button @click="triggerFileInput(true)" class="btn-attach-image py-2 px-4">Đính kèm ảnh</button>
                      <button @click="submitReply(comment.id)" class="btn-submit-reply py-2 px-4">Bình luận</button>
                    </div>
                  </div>
                </div>
              </div>

              <button v-if="showReplyComments[comment.id]" @click="closeReplyComments(comment.id)"
                class="btn-load-more btn-dropdown-comment">
                Ẩn bớt phản hồi <font-awesome-icon :icon="['fas', 'chevron-up']" />
              </button>
              <div v-if="showReplyComments[comment.id]" v-for="childComment in getVisibleChildComments(comment.id)"
                :key="childComment.id" class="reply-item flex ml-16 items-start mb-5">
                <LogoUser :fullname="childComment.fullnameUser" class="w-12 h-12 rounded-full mr-4" />
                <div class="reply-content flex-1">
                  <div class="comment-header flex items-center mb-2">
                    <span class="font-bold">{{ childComment.fullnameUser }}</span>
                  </div>
                  <p class="mb-2">{{ childComment.content }}</p>
                  <div class="text-gray-500 text-sm mb-2">{{ childComment.lastUpdatedAt }}</div>
                  <div class="comment-actions flex items-center">
                    <button @click="toggleReply(childComment.id)" class="btn-reply">Trả lời</button>
                  </div>
                  <div v-if="showReplyBox === childComment.id" class="reply-box mt-4">
                    <textarea v-model="replyContent" placeholder="Nhập bình luận của bạn..."
                      class="w-full p-2 border rounded-lg mb-2"></textarea>

                    <div v-if="selectedImageReply" class="image-preview mb-4 relative">
                      <img :src="selectedImageReply" alt="Selected Image" class="w-full h-auto rounded-lg">
                      <button @click="removeImage(true)" class="btn-remove-image rounded-full">
                        <font-awesome-icon :icon="['fas', 'trash-can']" />
                      </button>
                    </div>

                    <input type="file" ref="fileInput" @change="attachImage($event, true)" class="hidden reply-input"
                      accept="image/*" />

                    <div class="flex space-x-2">
                      <button @click="triggerFileInput(true)" class="btn-attach-image py-2 px-4">Đính kèm
                        ảnh</button>
                      <button @click="submitReply(comment.id)" class="btn-submit-reply py-2 px-4">Bình luận</button>
                    </div>
                  </div>
                </div>
              </div>
              <button v-show="showReplyComments[comment.id] && hasMoreReplyComments(comment.id)"
                @click="loadMoreReplyComments(comment.id)" class="btn-load-more btn-dropdown-comment">
                Hiện thêm phản hồi <font-awesome-icon :icon="['fas', 'chevron-down']" />
              </button>
              <button v-show="!showReplyComments[comment.id] && hasMoreReplyComments(comment.id)"
                @click="showReplyComments[comment.id] = true" class="btn-show-replies btn-dropdown-comment">
                {{ getReplyButtonText(comment.id) }} <font-awesome-icon :icon="['fas', 'chevron-down']" />
              </button>
            </div>
          </div>
        </div>

        <div class="right-column w-1/4 pl-4 h-auto">
          <template v-if="showRatingSection">
            <h3>Chọn đánh giá của bạn:</h3>
            <div class="rating-selector mb-4 flex items-center" @mouseleave="hoverRating = 0">
              <span v-for="star in 5" :key="star" @click="selectRating(star)" @mouseover="hoverRating = star"
                class="cursor-pointer" style="color: rgb(255, 151, 39); font-size: 24px;"
                v-html="star <= (hoverRating || rating) ? '&#9733;' : '&#9734;'"></span>
              <span class="ml-2">{{ hoverRating ? ratingDesc[hoverRating - 1] : ratingDesc[rating - 1] }}</span>
            </div>

            <textarea v-model="comment" placeholder="Nhập bình luận của bạn..."
              class="w-full p-3 border rounded-lg mb-4"></textarea>

            <div v-if="selectedImageRate" class="image-preview mb-4 relative">
              <img :src="selectedImageRate" alt="Selected Image" class="w-full h-auto rounded-lg">
              <button @click="removeImage(false)" class="btn-remove-image rounded-full">
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </button>
            </div>

            <input type="file" ref="fileInput" @change="attachImage($event, false)" class="hidden rating-input"
              accept="image/*" />

            <div class="actions flex justify-between">
              <button @click="triggerFileInput(false)" class="btn-attach-image">Đính kèm ảnh</button>
              <button @click="submitComment()" class="btn-submit-comment py-2 px-4 rounded-lg">
                Gửi đánh giá
              </button>
            </div>
          </template>
          <template v-else>
            <div class="custom-alert">
              <div class="alert-icon">
                <font-awesome-icon :icon="['fas', 'circle-exclamation']" />
              </div>
              <div class="alert-content">
                <div class="alert-message">Điều kiện đánh giá</div>
                <div class="alert-description">Vui lòng đặt mua sản phẩm, thanh toán và nhận hàng để được đánh giá!</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProductDetail',
  components: {
    LogoUser,
  },
});
</script>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, defineProps } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ProductDetail, fetchProductDetail } from "../../../api/customer/apiProduct";
import { useCartStore } from '../../../stores/cartStore/cartStore';
import { Category, fetchFindAllCategories } from '../../../api/customer/apiCategory';
import { faStar as fullStar, faStarHalfAlt as halfStar, faStar as emptyStar } from '@fortawesome/free-solid-svg-icons';
import LogoUser from '../../general/logoUser/index.vue';

type CommentChild = {
  id: string;
  content: string;
  parentId: string;
  lastUpdatedAt: string;
  rating: number;
  userId: string;
  fullnameUser: string;
};

type Comment = {
  id: string;
  content: string;
  parentId: string;
  lastUpdatedAt: string;
  rating: number;
  userId: string;
  fullnameUser: string;
  commentChildList: CommentChild[];
};

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref<ProductDetail>({
  id: '',
  sku: '',
  name: '',
  image: '',
  priceSell: 0,
  discountSell: 0,
  startDate: '',
  endDate: '',
  quantityInStock: 0,
  rating: 0,
  rateCount: 0,
  category: '',
  size: '',
  description: '',
  isActivated: false
});

const comments = ref([
  {
    id: 'cmt1',
    content: 'Comment 1',
    parentId: '',
    lastUpdatedAt: '30/3/2023 8:28',
    rating: 0,
    userId: 'u1',
    fullnameUser: 'Phan Trong Kieu',
    commentChildList: [
      {
        id: 'cmt3',
        content: 'Comment 3',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt5',
        content: 'Comment 5',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt3',
        content: 'Comment 3',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt5',
        content: 'Comment 5',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt3',
        content: 'Comment 3',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt5',
        content: 'Comment 5',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
    ],
  },
  {
    id: 'cmt2',
    content: 'Comment 2',
    parentId: '',
    lastUpdatedAt: '30/3/2023 9:28',
    rating: 3,
    userId: 'u1',
    fullnameUser: 'Dao Quang Duy',
    commentChildList: [
      {
        id: 'cmt3',
        content: 'Comment 3',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt5',
        content: 'Comment 5',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt3',
        content: 'Comment 3',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
      {
        id: 'cmt5',
        content: 'Comment 5',
        parentId: 'cmt1',
        lastUpdatedAt: '30/3/2023 10:28',
        rating: 2,
        userId: 'u1',
        fullnameUser: 'Nguyen Thi Minh Nguyet',
      },
    ],
  },
  {
    id: 'cmt4',
    content: 'Comment 4',
    parentId: '',
    lastUpdatedAt: '30/3/2023 11:28',
    rating: 4,
    userId: 'u1',
    fullnameUser: 'Phan Trong Kieu',
    commentChildList: [],
  },
  {
    id: 'cmt4',
    content: 'Comment 4',
    parentId: '',
    lastUpdatedAt: '30/3/2023 11:28',
    rating: 4,
    userId: 'u1',
    fullnameUser: 'Phan Trong Kieu',
    commentChildList: [],
  },
]);

const categories = ref<Category[]>([]);

const quantity = ref(1);
const expand = ref(true);
const isLoading = ref<boolean>(false);
const rating = ref(3);
const hoverRating = ref<number>(3);
const ratingDesc = ref<string[]>(['Quá tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời']);
const comment = ref('');
const selectedRating = ref('all');
const showReplyBox = ref<string | null>(null);
const replyContent = ref('');
const showReplyComments = ref<{ [commentId: string]: boolean }>({});
const countReplyComments = ref<{ [commentId: string]: number }>({});
const repliesPerPage = ref(5);
const selectedImageRate = ref<string | null>(null);
const selectedImageReply = ref<string | null>(null);

onMounted(async () => {
  categories.value = (await fetchFindAllCategories()).data;
  const productId = localStorage.getItem("productId")!;
  try {
    const response = await fetchProductDetail(productId);
    if(response) {
      product.value = response.data;
    }
  } catch (error:any) {
    alert(error.message);
    router.push('/');
  }
});

const filterType = computed(() => {
  const filter = localStorage.getItem('filterCustomer');
  if (filter) {
    try {
      const parsedFilter = JSON.parse(filter);
      return parsedFilter.type || null;
    } catch {
      return null;
    }
  }
  return null;
});

const getCategoryName = (type: string) => {
  const category = categories.value.find((cat) => cat.id === type);
  return category ? category.name : 'Danh mục không xác định';
};

const navigateToProducts = () => {
  if (filterType.value) {
    router.push({ name: 'Products', query: { type: filterType.value } });
  }
};

const getStarIcon = (star: number) => {
  const fullStars = Math.floor(product.value.rating);
  const hasHalfStar = product.value.rating - fullStars >= 0.5;

  if (star <= fullStars) {
    return fullStar;
  } else if (star === fullStars + 1 && hasHalfStar) {
    return halfStar;
  } else {
    return emptyStar;
  }
};

const formatDate = (date: string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    };

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('vi-VN', options).format(parsedDate);
  } catch (error) {
    return 'N/A';
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};
const increaseQuantity = () => {
  if(quantity.value == 999) return;
  quantity.value++;
};
const validateQuantity = () => {
    if (quantity.value! <= 0) {
        quantity.value = 1;
    } 
    if (quantity.value! > 999) {
        quantity.value = 999;
    }
}
const estimatedPrice = computed(() => {
  const effectivePrice = product.value.discountSell ?? product.value.priceSell;
  return quantity.value * effectivePrice;
});

const addToCart = async () => {
  isLoading.value = true;
  try {
    const existingProduct = cartStore.productInCartResponses.find(
        (p) => p.productId === product.value.id
    );
    let newQuantity;
    if (existingProduct) {
        newQuantity = existingProduct.quantity + quantity.value;
    } else {
        newQuantity = quantity.value;
    }
    const response = await cartStore.updateProductInCart(product.value.id, newQuantity);
    if(response){
      alert('Sản phẩm đã được thêm vào giỏ hàng!');
    }
  } catch (error:any) {
    alert(error.message);
  }
  isLoading.value = false;
};

const toggleExpand = () => {
  expand.value = !expand.value;
};

const filterByRating = (star: string) => {
  selectedRating.value = star;
};

const getVisibleChildComments = (commentId: string) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment && comment.commentChildList) {
    const visibleCount = countReplyComments.value[commentId] || 5;
    return comment.commentChildList.slice(0, visibleCount);
  } else {
    return [];
  }
};

const loadMoreReplyComments = (commentId: string) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment && comment.commentChildList) {
    const commentChildList = comment.commentChildList;
    const currentVisibleCount = getVisibleChildComments(commentId).length;
    const newVisibleCount = Math.min(currentVisibleCount + repliesPerPage.value, commentChildList.length);
    showReplyComments.value[commentId] = newVisibleCount <= commentChildList.length;

    countReplyComments.value[commentId] = newVisibleCount;
  }
};

const hasMoreReplyComments = (commentId: string) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment && comment.commentChildList) {
    const commentChildList = comment.commentChildList;
    const visibleCount = getVisibleChildComments(commentId).length;
    if (!showReplyComments.value[commentId] && commentChildList.length < 5 && commentChildList.length != 0)
      return true;
    return visibleCount < commentChildList.length;
  }
  return false;
};

const closeReplyComments = (commentId: string) => {
  showReplyComments.value[commentId] = false;
  countReplyComments.value[commentId] = 0;
};

const getReplyButtonText = (commentId: string) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment && comment.commentChildList) {
    const commentChildList = comment.commentChildList;
    return `${commentChildList.length} phản hồi`;
  }
};

const toggleReply = (commentId: string) => {
  if (showReplyBox.value === commentId) {
    showReplyBox.value = null;
  } else {
    showReplyBox.value = commentId;
    replyContent.value = '';
  }
};

const submitReply = (commentId: string) => {

  if (replyContent) {
    console.log('Bình luận:', replyContent.value);

    const payload = {
      parentId: commentId,
      content: replyContent.value,
      image: selectedImageReply.value,
    };

    console.log("submitReply " + JSON.stringify(payload, null, 2));
  } else {
    console.log('Vui lòng điền đầy đủ thông tin');
    return;
  }

  replyContent.value = '';
  selectedImageReply.value = null;
  showReplyBox.value = null;
};

const showRatingSection = computed(() => {
  return route.path.includes('/rating');
});

const selectRating = (star: number) => {
  rating.value = star;
};

const triggerFileInput = (isReply: boolean) => {
  const fileInputSelector = isReply ? 'input[type="file"].reply-input' : 'input[type="file"].rating-input';
  const fileInput = document.querySelector(fileInputSelector) as HTMLInputElement;
  fileInput.click();
};

const attachImage = (event: Event, isReply: boolean) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (isReply) {
        selectedImageReply.value = reader.result as string;
      } else {
        selectedImageRate.value = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
    // selectedImageRate.value = URL.createObjectURL(file);
  }
};

const removeImage = (isReply: boolean) => {
  if (isReply) {
    selectedImageReply.value = null;
  } else {
    selectedImageRate.value = null;
  }
  // (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
};

const submitComment = () => {
  if (comment && rating) {
    console.log('Đánh giá:', rating.value, 'Bình luận:', comment.value);

    const payload = {
      parentId: null,
      rating: rating.value,
      content: comment.value,
      image: selectedImageRate.value,
    };

    console.log("submitComment " + JSON.stringify(payload, null, 2));
  } else {
    console.log('Vui lòng điền đầy đủ thông tin');
    return;
  }

  rating.value = 0;
  comment.value = '';
  selectedImageRate.value = null;
  // (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
};

const handleClickOutsideReplyBox = (event: MouseEvent) => {
  const target = event.target as Node;

  if ((event.target as HTMLElement).classList.contains('btn-reply')) {
    return;
  }

  const replyBoxElement = document.querySelector('.reply-box');
  if (replyBoxElement && replyBoxElement.contains(target)) {
    return;
  }

  replyContent.value = '';
  selectedImageReply.value = null;
  showReplyBox.value = null;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideReplyBox);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideReplyBox);
});
</script>

<style scoped>
@import "index.css";
@import "../../general/breadCrumb/index.css";
</style>
