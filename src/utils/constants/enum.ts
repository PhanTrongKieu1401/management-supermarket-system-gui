//khai báo các enum
export const PaymentMethod = {
    COD: 'COD',//'Thanh toán khi nhận hàng',
    MOMO: 'MOMO',//'Thanh toán bằng ví điện tử MoMo',
    VNPAY: 'VNPAY',//'Thanh toán bằng ví điện tử VNPay',
    VNPAY_ATM: 'VNPAY_ATM'//'Thanh toán bằng thẻ ATM nội địa và tài khoản ngân hàng',
};

export const PaymentStatus = {
    PAID: 'PAID',//'Đã thanh toán',
    UNPAID: 'UNPAID'//'Chưa thanh toán',
};

export const PaymentStatusDisplay: Record<string, string> = {
    PAID: 'Đã thanh toán',
    UNPAID: 'Chưa thanh toán',
};

export const OrderStatus = {
    // PAYING: 'PAYING',//'Đang thanh toán',
    PENDING: 'PENDING',//'Đang xử lý',
    REFUSED: 'REFUSED',//Từ chối đơn
    APPROVED: 'APPROVED',//'Đã nhận',
    DELIVERING: 'DELIVERING',//'Đang giao',
    DELIVERED: 'DELIVERED',//'Đã giao',
    COMPLETED: 'COMPLETED',//'Hoàn thành',
    CANCELLED: 'CANCELLED',//'Đã hủy',
}

export const OrderStatusDisplay: Record<string, string> = {
    PAYING: 'Đang thanh toán',
    PENDING: 'Đang xử lý',
    REFUSED: 'Đã từ chối',
    APPROVED: 'Đã nhận',
    DELIVERING: 'Đang giao',
    DELIVERED: 'Đã giao',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
};

export const RegisterStatus = {
    SUCCESS: 'SUCCESS', //'Đăng ký thành công',
    EXISTED: 'EXISTED', //'Tài khoản đã tồn tại',
    ERROR: 'ERROR', //'Lỗi đăng ký',
}

export const Gender = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
}

export const AccountType = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    STAFF: 'STAFF'
}

export const Tab = {
    HOME: 'home',
    PAYMENT: 'payment',
    PRODUCTS: 'products',
    ORDERS: 'orders',
    IMPORTS: 'imports',
    STATISTICAL: 'statistical',
    LOGOUT: 'logout',
}

export const SubTab = {
    REVENUE: 'revenue',
}

export const TimeType = {
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH:'MONTH',
    QUARTER: 'QUARTER',
}