import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalViewOrderDetail from "../../components/ModalViewOrderDetail"; // Import the modal component

const Oder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [activeTab, setActiveTab] = useState("Chờ xác nhận");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [currentOrder, setCurrentOrder] = useState(null); // State for current order
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/rest/order");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get("http://localhost:8080/rest/paymentMethod");
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchOrders();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    const fetchAddresses = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:8080/rest/address/user/${userId}`);
        setAddresses((prevAddresses) => ({
          ...prevAddresses,
          [userId]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    orders.forEach((order) => {
      if (!addresses[order.userId]) {
        fetchAddresses(order.userId);
      }
    });
  }, [orders]);

  useEffect(() => {
    const filtered = orders.filter((order) => order.orderStatus === activeTab);
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, activeTab]);

  const getPaymentMethodName = (paymentMethodId) => {
    const method = paymentMethods.find((method) => method.id === paymentMethodId);
    return method ? method.methodName : "Unknown";
  };

  const handleStatusChange = async (orderID, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/rest/order/${orderID}/status`, newStatus, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      setOrders((prevOrders) => prevOrders.map((order) => (order.orderID === orderID ? { ...order, orderStatus: newStatus } : order)));
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
        backdrop: "rgba(0, 0, 0, 0.5)",
      });

      if (result.isConfirmed) {
        await handleStatusChange(orderID, "Đơn hàng đã hủy");
        Swal.fire({
          title: "Đã hủy!",
          text: "Đơn hàng đã được hủy.",
          icon: "success",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#ffffff",
          backdrop: "rgba(0, 0, 0, 0.5)",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể hủy đơn hàng. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });
    }
  };

  const handleViewDetails = (orderID) => {
    const order = orders.find((order) => order.orderID === orderID);
    setCurrentOrder(order);
    setShowModal(true);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getItemProps = (index) => ({
      variant: currentPage === index ? "filled" : "text",
      color: "gray",
      onClick: () => onPageChange(index),
    });

    const next = () => {
      if (currentPage === totalPages) return;
      onPageChange(currentPage + 1);
    };

    const prev = () => {
      if (currentPage === 1) return;
      onPageChange(currentPage - 1);
    };

    return (
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="text"
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-500 text-white"
          onClick={prev}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Trước
        </Button>
        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <IconButton
              key={index}
              {...getItemProps(index + 1)}
              className="bg-gray-700 hover:bg-gray-500 text-white"
            >
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="text"
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-500 text-white"
          onClick={next}
          disabled={currentPage === totalPages}
        >
          Tiếp theo
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    );
  };

 return (
   <div>
     <main className="w-5/5 p-6 overflow-y-auto ml-60 mt-6">
       <h2 className="text-xl font-semibold mb-4">Quản lý đơn hàng</h2>
       <div className="flex items-center mb-2">
         {[
           "Chờ xác nhận",
           "Đã xác nhận",
           "Đang giao hàng",
           "Đã giao hàng",
           "Đơn hàng đã hủy",
         ].map((status) => (
           <div
             key={status}
             className={`mr-2 rounded-lg py-1-5 px-4 cursor-pointer border ${
               activeTab === status
                 ? "bg-white-default"
                 : "bg-transparent border-white-overlay"
             }`}
             onClick={() => setActiveTab(status)}
           >
             <span
               className={`text-16-16 ${
                 activeTab === status ? "text-white-900" : "text-white-300"
               }`}
             >
               {status}
             </span>
           </div>
         ))}
       </div>
       {filteredOrders.length === 0 ? (
         <div className="w-full text-center h-[263px] appear flex items-center">
           <div className="w-full flex flex-col items-center">
             <img
               src="https://waka.vn/svgs/icon-empty.svg"
               alt="icon-empty"
               className="cursor-pointer"
             />
             <p className="font-medium text-base text-white-50 pb-2 pt-6">
               Chưa có đơn hàng cần xét duyệt
             </p>
             <p className="font-normal text-[15px] text-white-300">
               Khi có đơn hàng mới, thông tin sẽ được hiển thị tại đây. Vui lòng
               kiểm tra lại sau.
             </p>
           </div>
         </div>
       ) : (
         <>
           {filteredOrders
             .slice(
               (currentPage - 1) * itemsPerPage,
               currentPage * itemsPerPage
             )
             .map((order) => {
               const userAddresses = addresses[order.userId] || [];
               return (
                 <div
                   key={order.orderID}
                   className="bg-gray-800 rounded-lg shadow-md p-6 mb-4"
                 >
                   <div className="grid grid-cols-10 gap-4 text-center items-center">
                     <div className="col-span-1">
                       <p className="font-medium">{order.orderID}</p>
                       <p className="text-sm text-gray-500">Mã đơn hàng</p>
                     </div>
                     <div>
                       <p className="font-medium">
                         {new Date(order.orderDate).toLocaleString()}
                       </p>
                       <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                     </div>
                     <div>
                       <p className="font-medium">
                         {getPaymentMethodName(order.paymentMethodId)}
                       </p>
                       <p className="text-sm text-gray-500">
                         Phương thức thanh toán
                       </p>
                     </div>
                     <div className="col-span-2">
                       <p className="font-medium">Giao hàng nhanh</p>
                       <p className="text-sm text-gray-500">
                         Dịch vụ vận chuyển
                       </p>
                     </div>
                     <div>
                       {new Intl.NumberFormat("vi-VN", {
                         style: "currency",
                         currency: "VND",
                       }).format(order.totalAmount)}
                       <p className="text-sm text-gray-500">Tổng</p>
                     </div>
                     <div className="col-span-4 flex justify-center items-center gap-2">
                       {order.orderStatus !== "Đã giao hàng" &&
                         order.orderStatus !== "Đơn hàng đã hủy" && (
                           <button
                             className={`px-4 py-2 rounded ${
                               order.orderStatus === "Đơn hàng đã hủy"
                                 ? "bg-gray-500 text-white"
                                 : "bg-red-500 text-white"
                             }`}
                             onClick={() => handleCancelOrder(order.orderID)}
                             disabled={order.orderStatus === "Đơn hàng đã hủy"}
                           >
                             {order.orderStatus === "Đơn hàng đã hủy"
                               ? "Đã hủy"
                               : "Hủy đơn hàng"}
                           </button>
                         )}
                       {order.orderStatus !== "Đã giao hàng" && (
                         <select
                           className="bg-cyan-500 text-white px-4 py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-600 hover:bg-cyan-600 transition-colors duration-200 ease-in-out"
                           value={order.orderStatus}
                           onChange={(e) =>
                             handleStatusChange(order.orderID, e.target.value)
                           }
                         >
                           <option value="Chờ xác nhận">Chờ xác nhận</option>
                           <option value="Đã xác nhận">Đã xác nhận</option>
                           <option value="Đang giao hàng">
                             Đang giao hàng
                           </option>
                           <option value="Đã giao hàng">Đã giao hàng</option>
                         </select>
                       )}
                       {order.orderStatus === "Đã giao hàng" && (
                         <button
                           className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                           disabled
                         >
                           Đã giao hàng
                         </button>
                       )}
                       <button
                         className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                         onClick={() => handleViewDetails(order.orderID)}
                       >
                         Xem chi tiết
                       </button>
                     </div>
                   </div>
                 </div>
               );
             })}
           <Pagination
             currentPage={currentPage}
             totalPages={totalPages}
             onPageChange={setCurrentPage}
           />
         </>
       )}
     </main>
     {currentOrder && (
       <ModalViewOrderDetail
         order={currentOrder}
         showModal={showModal}
         setShowModal={setShowModal}
       />
     )}
   </div>
 );

};

export default Oder;