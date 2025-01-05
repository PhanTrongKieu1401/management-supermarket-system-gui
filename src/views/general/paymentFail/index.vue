<template>
    <div class="card">
        <div class="flex items-center justify-center"  
        style="border-radius:200px; height:200px; width:200px; background: #F8FAF5; margin:0 auto;">
            <i class="checkmark">X</i>
        </div>
        <h1>Thanh toán thất bại</h1>
        <p>Đơn hàng của quý khách chưa được thanh toán!</p>
        <p>Quay về trang đặt hàng trong {{ countdown }} giây...</p>
    </div>
</template>

<script>
export default {
    name: "PaymentFail",
    data() {
        return {
            countdown: 5
        };
    },
    mounted() {
        const timer = setInterval(() => {
        if (this.countdown > 0) {
            this.countdown--;
        } else {
            clearInterval(timer);
            this.$router.push('/order');
        }
        }, 1000);
    }
};
</script>

<style scoped>
body {
    text-align: center;
    padding: 40px 0;
    background: #EBF0F5;
}

h1 {
    color: #d90a0ab5;
    font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
    font-weight: 900;
    font-size: 40px;
    margin-bottom: 10px;
}

p {
    color: #404F5E;
    font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
    font-size: 20px;
    margin: 0;
}

i {
    color: #d90a0ab5;
    font-size: 100px;
    font-style: normal;
    line-height: 200px;
    margin-left: -15px;
}

.card {
    background: white;
    padding: 60px;
    border-radius: 4px;
    box-shadow: 0 2px 3px #faf5f5c2;
    display: inline-block;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: 0 auto;
}
</style>