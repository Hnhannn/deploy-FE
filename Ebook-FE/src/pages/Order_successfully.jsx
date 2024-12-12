import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

function Order_successfully() {
  const [orderStatus, setOrderStatus] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = localStorage.getItem("orderStatus");
    const fullName = JSON.parse(localStorage.getItem("user"));
    const address = JSON.parse(localStorage.getItem("address"));
    const orderId = localStorage.getItem("orderId");
    if (status === "confirmed") {
      setOrderStatus("Đơn hàng đã được xác nhận");
    } else if (status === "pending") {
      const sendMail = {
        to: fullName.email,
        fullName: fullName.fullName,
        address: address.addressLine,
        phoneNumber: address.phoneNumber,
        orderId: orderId,
      };

      console.log(sendMail);

      // Trì hoãn việc gửi email khoảng 2 giây
      setTimeout(async () => {
        await axios.post(
          "http://localhost:8080/rest/mailorder/SendConformOrder",
          sendMail
        );
      }, 2000); // 2000 milliseconds = 2 seconds
      localStorage.removeItem("orderStatus");
      localStorage.removeItem("user");
      localStorage.removeItem("address");
      localStorage.removeItem("orderId");
      setOrderStatus("Đơn hàng chờ xác nhận");
    }
  }, [searchParams]);

  return (
    <div className="bg-background h-screen w-full">
      <div className="blur-result-layer-1 absolute right-1/2 z-0 h-full" />
      <div className="blur-result-layer-2 absolute left-1/2 z-0 h-full" />
      <div>
        <div className="w-full min-h-screen flex justify-center items-center relative z-[2]">
          <div className="text-center">
            <div className="flex items-center gap-5">
              <img
                src="https://waka.vn/svgs/dot-group.svg"
                alt="dot-group"
                className="cursor-pointer"
              />
              <p className="text-white-50 font-bold text-5xl pt-2 pb-4">
                {orderStatus}
              </p>
              <img
                src="https://waka.vn/svgs/dot-group.svg"
                alt="dot-group"
                className="cursor-pointer rotate-180"
              />
            </div>
            <img
              src="https://waka.vn/svgs/icon-pending.svg"
              alt="icon-pending"
              className="cursor-pointer mx-auto"
            />
            <p className="text-white-50">
              Bạn đã đặt hàng thành công. Đơn hàng của bạn{" "}
              {orderStatus.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order_successfully;
