<template>
    <div class="card">
        <div class="flex items-center justify-center" 
        style="border-radius:200px; height:200px; width:200px; background: rgb(237, 164, 156); margin:0 auto;">
            <i class="checkmark">✓</i>
        </div>
        <h1>Thanh toán thành công</h1>
        <p>Đơn hàng của quý khách đã được thanh toán thành công!</p>
        <p>Quay về trang chủ trong {{ countdown }} giây...</p>
    </div>
</template>

<script>
export default {
    name: "PaymenSuccess",
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
            this.$router.push('/');
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
    color: rgb(228, 68, 52);
    font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
    font-weight: 900;
    font-size: 40px;
    margin-bottom: 10px;
    margin-top: 10px;
}

p {
    color: #404F5E;
    font-family: "Nunito Sans", "Helvetica Neue", sans-serif;
    font-size: 25px;
    margin: 0;
}

i {
    color: rgb(228, 68, 52);
    font-size: 100px;
    line-height: 200px;
    margin-left: -15px;
}

.card {
    background: white;
    padding: 60px;
    border-radius: 4px;
    box-shadow: 0 2px 3px #C8D0D8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: 0 auto;
}
</style>