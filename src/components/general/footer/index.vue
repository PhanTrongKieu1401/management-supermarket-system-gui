<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>Định vị cửa hàng</h3>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1862.6347593147595!2d105.78701930119938!3d20.981830711115787!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e0!3m2!1svi!2s!4v1735227774114!5m2!1svi!2s"
          width="100%" height="" style="border:0;" allowfullscreen="true" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <!-- Thông tin cửa hàng -->
      <div class="footer-section">
        <h3>Thông tin cửa hàng</h3>
        <p>Tên cửa hàng: Siêu thị Kikimoon</p>
        <p>Địa chỉ: 96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội, Việt Nam</p>
        <p>Số điện thoại: 0869336918</p>
        <p>Email: phantrongkieu1401@gmail.com</p>
      </div>

      <!-- Hỗ trợ khách hàng -->
      <div class="footer-section">
        <h3>Hỗ trợ khách hàng</h3>
        <ul>
          <li><router-link to="/">Trang chủ</router-link></li>
          <li><router-link to="/cart">Giỏ hàng</router-link></li>
          <li><router-link to="/orders">Đơn hàng của tôi</router-link></li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
});
</script>

<style scoped>
@import "index.css";
</style>