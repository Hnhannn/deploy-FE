import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserByUsername, getUserFromToken } from "../service/AuthService";
import Failed_Payment from "./Failed_Payment";
import Successful_Payment from "./Successful_Payment";
import Order_successfully from "./Order_successfully";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("");
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    const responseCode = searchParams.get("vnp_ResponseCode");
    const paymentType = localStorage.getItem("paymentType"); // Lấy loại thanh toán từ localStorage

    setPaymentType(paymentType);

    if (responseCode === "00") {
      // Nếu thanh toán thành công
      setStatus("success");

      // Extract userId from token
      const token = localStorage.getItem("token");
      const userToken = getUserFromToken(token);

      if (userToken) {
        getUserByUsername(userToken.sub) // Xác thực người dùng
          .then((userData) => {
            setUser(userData.userID); // Lấy userID
            setFullName(userData); // Lấy tên người d
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
          });
      }

      // Nếu là thanh toán gói, trạng thái đơn hàng là "Đã được xác nhận"
      if (paymentType === "package") {
        setOrderStatus("Đã được xác nhận");
      } else if (paymentType === "book") {
        setOrderStatus("Đang chờ xác nhận");
      }
    } else {
      setStatus("fail"); // Nếu thanh toán thất bại
    }
  }, [searchParams]);

  // Sau khi thanh toán thành công
  useEffect(() => {
    if (status === "success" && user) {
      const planId = localStorage.getItem("value");
      const tempOrderData = JSON.parse(localStorage.getItem("tempOrderData"));

      if (planId) {
        saveSubscription(user, planId);
        localStorage.removeItem("value"); // Xóa thông tin khi đã lưu
      } else if (tempOrderData) {
        saveBookOrder(user, tempOrderData); // Lưu thông tin đơn hàng sách
        localStorage.removeItem("tempOrderData"); // Xóa thông tin tạm thời
      }
    }
  }, [status, user]);

  const saveSubscription = async (userId, planId) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/rest/userSubscription",
        {
          userId,
          planId,
        }
      );
      console.log("Subscription saved:", response.data);
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  const saveBookOrder = async (userId, orderData) => {
    try {
      const response = await axios.post("http://localhost:8080/rest/order", {
        ...orderData,
        userId,
        orderStatus: "Đã xác nhận",
      });
      const orderId = response.data.orderID; // Extract the order ID from the response
      console.log("Order ID:", orderId);

      // Lấy cartItems từ localStorage
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));
      let address = JSON.parse(localStorage.getItem("address"));

      if (!cartItems) {
        console.log("cartItems không tồn tại, lấy bookIDs từ localStorage");
        // Nếu cartItems không tồn tại, lấy bookIDs từ localStorage
        const bookIDs = JSON.parse(localStorage.getItem("bookIDs"));
        const quantity = JSON.parse(localStorage.getItem("quantity"));
        const price = JSON.parse(localStorage.getItem("price"));
        if (bookIDs) {
          console.log("bookIDs tồn tại, tạo orderDetails từ bookIDs");
          const orderDetails = {
            orderId: orderId,
            bookId: bookIDs,
            quantity: quantity,
            price: price,
          };

          await axios.post(
            "http://localhost:8080/rest/orderDetailOne",
            orderDetails
          );

          const sendMail = {
            to: fullName.email,
            fullName: fullName.fullName,
            address: address.addressLine,
            phoneNumber: address.phoneNumber,
            orderId: orderId,
          };

          // Trì hoãn việc gửi email khoảng 2 giây
          setTimeout(async () => {
            await axios.post(
              "http://localhost:8080/rest/mailorder/SendConformOrder",
              sendMail
            );
          }, 2000); // 2000 milliseconds = 2 seconds
          // Xóa các mục trong localStorage khi thành công
        }
      } else {
        console.log("cartItems tồn tại, tạo orderDetails từ cartItems");
        // Tạo order details
        const orderDetails = cartItems.map((item) => ({
          orderId: orderId,
          bookId: item.book.bookID,
          quantity: item.quantity,
          price: item.book.price,
        }));
        await axios.post(
          "http://localhost:8080/rest/orderDetail",
          orderDetails
        );

        await axios.delete(
          `http://localhost:8080/rest/cartdetails/deleteCart/${userId}`
        );
        const sendMail = {
          to: fullName.email,
          fullName: fullName.fullName,
          address: address.addressLine,
          phoneNumber: address.phoneNumber,
          orderId: orderId,
        };

        // Trì hoãn việc gửi email khoảng 2 giây
        setTimeout(async () => {
          await axios.post(
            "http://localhost:8080/rest/mailorder/SendConformOrder",
            sendMail
          );
        }, 2000); // 2000 milliseconds = 2 seconds
        localStorage.removeItem("cartItems");
      }
      localStorage.removeItem("address");
      localStorage.removeItem("bookIDs");
      localStorage.removeItem("quantity");
      localStorage.removeItem("price");
      localStorage.removeItem("tempOrderData");
      localStorage.removeItem("paymentType");
      localStorage.removeItem("orderStatus");
    } catch (error) {
      console.error("Error saving book order:", error);
    }
  };

  return (
    <div>
      {paymentType === "book" ? (
        status === "success" ? (
          <Order_successfully orderStatus={orderStatus} />
        ) : (
          <Failed_Payment />
        )
      ) : status === "success" ? (
        <Successful_Payment />
      ) : (
        <Failed_Payment />
      )}
    </div>
  );
};

export default PaymentResult;
