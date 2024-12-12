// BookPaymentService.js (Dành riêng cho thanh toán sách)
class BookPaymentService {
    static async handlePayment(productPrice) {
    if (!productPrice) {
      throw new Error("Product price is required");
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/vnpay/pay/${productPrice}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in PaymentService:", error);
      throw error; // throw error để xử lý ở nơi gọi hàm
    }
  }
  }
  
  export default BookPaymentService;
  