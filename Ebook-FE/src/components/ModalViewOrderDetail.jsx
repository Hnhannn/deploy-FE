import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { getUserByUsername, getUserFromToken } from '../service/AuthService';

export default function ModalViewOrderDetail({ order, showModal, setShowModal }) {
  const [address, setAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userToken = getUserFromToken(token);

    if (userToken) {
      getUserByUsername(userToken.sub)
        .then((userData) => {
          setUserId(userData.userID);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

  const handleStatusChange = async (orderID, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/rest/order/${orderID}/status`, newStatus, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderID ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelOrder = async (orderID) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Hủy",
        cancelButtonText: "Không",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)"
      });

      if (result.isConfirmed) {
        await handleStatusChange(order.orderID, "Đơn hàng đã hủy");
        Swal.fire({
          title: "Đã hủy!",
          text: "Đơn hàng đã được hủy.",
          icon: "success",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#ffffff",
          backdrop: "rgba(0, 0, 0, 0.5)",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể hủy đơn hàng. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)"
      });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/rest/order");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/rest/address/user/${userId}`);
          if (response.data.length > 0) {
            setAddress(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };

    fetchAddress();
  }, [userId]);

  // Tính tổng tiền của toàn bộ đơn hàng
  const totalAmount = order && order.orderDetails
    ? order.orderDetails.reduce((sum, detail) => sum + detail.price * detail.quantity, 0)
    : 0;

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-[60%] my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-green-100 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font- text-black">Chi tiết đơn hàng</h3>
                  <button className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => setShowModal(false)}>
                    <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <h4 className="text-lg text-black font-semibold mb-2">Thông tin nhận hàng:</h4>
                    {address ? (
                      <div className="mb-4">
                        <p className="font-medium text-black">{address.addressLine} | {address.phoneNumber}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">Đ/c: Lỗi khi lấy địa chỉ</p>
                        <p className="text-sm text-gray-500">SĐT: Lỗi khi lấy số điện thoại</p>
                      </div>
                    )}
                  </div>
                  <table className="min-w-full bg-white text-black">
                    <thead>
                      <tr>
                        <th className="py-2 text-center" style={{ width: "40%" }}>Tên sách</th>
                        <th className="py-2 text-center" style={{ width: "10%" }}>Số lượng</th>
                        <th className="py-2 text-center" style={{ width: "18%" }}>Giá</th>
                        <th className="py-2 text-center" style={{ width: "18%" }}>Thành tiền</th>
                        <th className="py-2 text-center" style={{ width: "14%" }}>Trạng thái đơn hàng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order && order.orderDetails ? (
                        order.orderDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className="border px-4 py-2">{detail.book.title}</td>
                            <td className="border px-4 py-2 text-center">{detail.quantity}</td>
                            <td className="border px-4 py-2 text-right">{detail.price.toLocaleString("vi-VN")} VND</td>
                            <td className="border px-4 py-2 text-right">{(detail.price * detail.quantity).toLocaleString("vi-VN")} VND</td>
                            <td className="border px-4 py-2 text-center">{order.orderStatus}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="border px-4 py-2 text-center">Không có chi tiết đơn hàng</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <div className="text-black font-semibold">
                    Tổng thành tiền: {totalAmount.toLocaleString("vi-VN")} VND
                  </div>
                  <div>
                    {order && order.orderStatus === "Chờ xác nhận" && (
                      <button
                        className="text-black bg-red-500 hover:bg-red-700 font-semibold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border border-gray-300 rounded-lg"
                        type="button"
                        onClick={() => handleCancelOrder(order.orderID)}
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                    <button
                      className="text-black bg-yuki-500 hover:bg-green-500 font-semibold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border border-gray-300 rounded-lg"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}