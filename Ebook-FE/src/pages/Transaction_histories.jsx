import { useEffect, useState } from "react";
import axios from "axios";
import LeftAsider from "../components/LeftAsiderProfile";
import { getUserFromToken, getUserByUsername } from "../service/AuthService";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";
import ModalViewOrderDetail from "../components/ModalViewOrderDetail";

function Transaction_histories() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Mua gói cước");
  const [bookOrders, setBookOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [bookTitles, setBookTitles] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/rest/order/${orderId}/details`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  };

  const handleViewDetails = async (orderId) => {
    const orderDetails = await fetchOrderDetails(orderId);
    console.log(orderDetails);
    if (orderDetails) {
      setCurrentOrder(orderDetails);
      setShowModal(true);
    }
    console.log("Order details:", orderDetails);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "Lịch sử giao dịch - Yuki";
    const token = localStorage.getItem("token");
    const userFromToken = getUserFromToken(token);
    if (userFromToken) {
      getUserByUsername(userFromToken.sub)
        .then((userData) => {
          setUser(userData);
          console.log("User data:", userData);
  
          // Lấy lịch sử mua lẻ sách
          axios
            .get(`http://localhost:8080/rest/order/user/${userData.userID}/details`)
            .then((response) => {
              const sortedBookOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
              setBookOrders(sortedBookOrders);
            })
            .catch((error) => {
              console.error("Error fetching transaction history:", error);
            });
  
          // Lấy lịch sử mua gói cước
          axios
            .get(`http://localhost:8080/rest/userSubscription/user/${userData.userID}`)
            .then((response) => {
              const sortedSubscriptions = response.data.sort((a, b) => new Date(b.subscriptionDate) - new Date(a.subscriptionDate));
              setSubscriptions(sortedSubscriptions);
            })
            .catch((error) => {
              console.error("Error fetching subscriptions:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    } else {
      console.error("No user found from token");
    }
  }, []);

  useEffect(() => {
    const fetchBookTitles = async () => {
      const titles = {};
      for (const order of bookOrders) {
        if (order.bookID) {
          const title = await fetchBookTitle(order.bookID);
          titles[order.bookID] = title;
        }
      }
      setBookTitles(titles);
    };

    fetchBookTitles();
  }, [bookOrders]);

  console.log("Book orders:", bookOrders);
  console.log("Subscriptions:", subscriptions);

  const transactions =
    selectedTab === "Mua gói cước" ? subscriptions : bookOrders;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

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
      <div className="flex items-center justify-end gap-4 mt-4">
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
    <>
      <div className="pt-[6.25rem] w-full mr-auto ml-auto pr-[3.75rem] pl-[3.75rem]">
        <div className="w-full flex relative h-full container">
          <LeftAsider
            fullName={user ? user.fullName : "Loading..."}
            endDate={user?.userSubscription[0]?.endDate || null}
            imgUser={
              user && user.userImage
                ? user.userImage
                : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
            }
          />
          <div data-v-15d6e969="" className="account-content h-full pt-6">
            <div data-v-15d6e969="" className="px-5">
              <h1
                data-v-15d6e969=""
                className="text-white-50 text-[1.625rem] leading-8 mb-4"
              >
                Lịch sử giao dịch
              </h1>
              <div className="flex gap-6 py-3 tabs" data-v-15d6e969="">
                {/* Tabs */}
                <div className="cursor-pointer flex items-center">
                  <p
                    className={`font-medium text-[19px] ${
                      selectedTab === "Mua gói cước"
                        ? "text-yuki-500"
                        : "text-white-300"
                    }`}
                    onClick={() => setSelectedTab("Mua gói cước")}
                  >
                    Mua gói cước
                  </p>
                </div>
                <div className="cursor-pointer flex items-center">
                  <p
                    className={`leading-5 font-normal ${
                      selectedTab === "Mua nội dung"
                        ? "text-yuki-500"
                        : "text-white-300"
                    }`}
                    onClick={() => setSelectedTab("Mua nội dung")}
                  >
                    Mua nội dung
                  </p>
                </div>
              </div>
              <section data-v-15d6e969="" className="bg-[#121214] transaction">
                <div data-v-15d6e969="" className="flex flex-wrap -mx-4">
                  <div data-v-15d6e969="" className="w-full px-4">
                    <div data-v-15d6e969="">
                      {selectedTab === "Mua gói cước" ? (
                        subscriptions.length > 0 ? (
                          <div className="mb-4">
                            <table data-v-15d6e969="" className="h-full w-full">
                              <thead
                                data-v-15d6e969=""
                                className="py-4 h-[52px]"
                              >
                                <tr data-v-15d6e969="" className="text-left">
                                  <th
                                    data-v-15d6e969=""
                                    className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                  >
                                    Thời gian
                                  </th>
                                  <th
                                    data-v-15d6e969=""
                                    className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                  >
                                    Tên gói
                                  </th>
                                  <th
                                    data-v-15d6e969=""
                                    className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                  >
                                    Giá
                                  </th>
                                  <th
                                    data-v-15d6e969=""
                                    className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                  >
                                    Nội dung giao dịch
                                  </th>
                                </tr>
                              </thead>
                              <tbody data-v-15d6e969="">
                                {subscriptions.map((subscription, index) => {
                                  const orderDate = new Date(
                                    subscription.startDate
                                  );

                                  const hours = orderDate
                                    .getHours()
                                    .toString()
                                    .padStart(2, "0");
                                  const minutes = orderDate
                                    .getMinutes()
                                    .toString()
                                    .padStart(2, "0");
                                  const seconds = orderDate
                                    .getSeconds()
                                    .toString()
                                    .padStart(2, "0");
                                  const formattedTime = `${hours}:${minutes}:${seconds}`;

                                  const day = orderDate
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0");
                                  const month = (orderDate.getMonth() + 1)
                                    .toString()
                                    .padStart(2, "0"); // Months are 0-indexed
                                  const year = orderDate.getFullYear();
                                  const formattedDate = `${day}-${month}-${year}`;
                                  return (
                                    <tr key={index} className="cursor-pointer">
                                      <td
                                        data-v-15d6e969=""
                                        className="text-white-300 text-[.9375rem] leading-none py-4"
                                      >
                                        <span
                                          data-v-15d6e969=""
                                          className="block"
                                        >
                                          {formattedTime}
                                        </span>
                                        <span
                                          data-v-15d6e969=""
                                          className="block mt-1"
                                        >
                                          {formattedDate}
                                        </span>
                                      </td>
                                      <td
                                        data-v-15d6e969=""
                                        className="text-left py-4"
                                      >
                                        <div
                                          data-v-15d6e969=""
                                          className="text-16-16 font-medium text-white-50 mb-1"
                                        >
                                          <div
                                            data-v-15d6e969=""
                                            className="text-[.9375rem] leading-none"
                                          >
                                            <p
                                              data-v-15d6e969=""
                                              className="mb-1"
                                            >
                                              {
                                                subscription.packagePlan
                                                  .planName
                                              }
                                            </p>
                                            <p
                                              data-v-15d6e969=""
                                              className="text-yuki-500"
                                            >
                                              +{" "}
                                              {
                                                subscription.packagePlan
                                                  .duration
                                              }{" "}
                                              ngày hội viên
                                            </p>
                                          </div>
                                        </div>
                                      </td>
                                      <td
                                        data-v-15d6e969=""
                                        className="text-left text-[.9375rem] leading-none text-white-300 py-4"
                                      >
                                        {subscription.packagePlan.price.toLocaleString(
                                          "vi-VN"
                                        )}{" "}
                                        VND
                                      </td>
                                      <td
                                        data-v-15d6e969=""
                                        className="text-left text-[.9375rem] leading-none text-white-300 py-4"
                                      >
                                        <span
                                          data-v-15d6e969=""
                                          className="block mb-2"
                                        >
                                          Tên gói cước:{" "}
                                          {subscription.packagePlan.planName}
                                        </span>
                                        <span
                                          data-v-15d6e969=""
                                          className="block"
                                        >
                                          Thời hạn sử dụng gói Hội viên Yuki
                                          đến:{" "}
                                          {new Date(
                                            subscription.endDate
                                          ).toLocaleDateString("vi-VN")}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div
                            className="w-full text-center h-[263px] appear flex items-center"
                            data-v-15d6e969=""
                          >
                            <div className="w-full flex flex-col items-center">
                              <img
                                src="https://waka.vn/svgs/icon-empty.svg"
                                alt="icon-empty"
                                className="cursor-pointer"
                              />
                              <p className="font-medium text-base text-white-50 pb-2 pt-6 ">
                                Bạn chưa có giao dịch nào
                              </p>
                              <p className="font-normal text-[15px] text-white-300 ">
                                Thông tin giao dịch mua gói hội viên sẽ hiển thị
                                tại đây
                              </p>
                            </div>
                          </div>
                        )
                      ) : bookOrders.length > 0 ? (
                        <div className="">
                          <table data-v-15d6e969="" className="h-full w-full">
                            <thead data-v-15d6e969="" className="py-4 h-[52px]">
                              <tr data-v-15d6e969="" className="text-left">
                                <th
                                  data-v-15d6e969=""
                                  className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                >
                                  Thời gian
                                </th>
                                <th
                                  data-v-15d6e969=""
                                  className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                >
                                  Tên sách
                                </th>
                                <th
                                  data-v-15d6e969=""
                                  className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                >
                                  Tổng tiền hàng
                                </th>
                                <th
                                  data-v-15d6e969=""
                                  className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                >
                                  Nội dung giao dịch
                                </th>
                                <th
                                  data-v-15d6e969=""
                                  className="w-1/6 min-w-[160px] text-white-300 text-[.9375rem] leading-none font-normal"
                                ></th>
                              </tr>
                            </thead>
                            <tbody data-v-15d6e969="">
                              {bookOrders.map((order, index) => {
                                const orderDate = new Date(order.orderDate);

                                const hours = orderDate
                                  .getHours()
                                  .toString()
                                  .padStart(2, "0");
                                const minutes = orderDate
                                  .getMinutes()
                                  .toString()
                                  .padStart(2, "0");
                                const seconds = orderDate
                                  .getSeconds()
                                  .toString()
                                  .padStart(2, "0");
                                const formattedTime = `${hours}:${minutes}:${seconds}`;

                                const day = orderDate
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0");
                                const month = (orderDate.getMonth() + 1)
                                  .toString()
                                  .padStart(2, "0"); // Months are 0-indexed
                                const year = orderDate.getFullYear();
                                const formattedDate = `${day}-${month}-${year}`;

                                return (
                                  <tr key={index} className="cursor-pointer">
                                    <td
                                      data-v-15d6e969=""
                                      className="text-white-300 text-[.9375rem] leading-none py-4"
                                    >
                                      <span
                                        data-v-15d6e969=""
                                        className="block"
                                      >
                                        {formattedTime}
                                      </span>
                                      <span
                                        data-v-15d6e969=""
                                        className="block mt-1"
                                      >
                                        {formattedDate}
                                      </span>
                                    </td>
                                    <td
                                      data-v-15d6e969=""
                                      className="text-left py-4"
                                    >
                                      <div
                                        data-v-15d6e969=""
                                        className="text-16-16 font-medium text-white-50 mb-1"
                                      >
                                        <div
                                          data-v-15d6e969=""
                                          className="text-[.9375rem] leading-none"
                                        >
                                          <p className="mb-1">
                                            {order.orderDetails.length > 0
                                              ? order.orderDetails[0].book.title
                                              : "Tên sách không có"}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td
                                      data-v-15d6e969=""
                                      className="text-left text-[.9375rem] leading-none text-white-300 py-4"
                                    >
                                      <div>
                                        {order.totalAmount.toLocaleString(
                                          "vi-VN"
                                        )}{" "}
                                        VND
                                      </div>
                                    </td>
                                    <td
                                      data-v-15d6e969=""
                                      className="text-left text-[.9375rem] leading-none text-white-300 py-4"
                                    >
                                      <span className="block mb-2">
                                        Tên sách:{" "}
                                        {order.orderDetails.length > 0
                                          ? order.orderDetails[0].book.title
                                          : "Tên sách không có"}
                                      </span>
                                      <span
                                        data-v-15d6e969=""
                                        className="block mb-2"
                                      >
                                        Hình thức thanh toán:{" "}
                                        {order.paymentMethod &&
                                        order.paymentMethod.methodName
                                          ? order.paymentMethod.methodName
                                          : "Chưa xác định"}
                                      </span>
                                      <span
                                        data-v-15d6e969=""
                                        className="block mb-2"
                                      >
                                        Ngày đặt hàng:{" "}
                                        {new Date(
                                          order.orderDate
                                        ).toLocaleDateString("vi-VN")}
                                      </span>
                                      <span
                                        data-v-15d6e969=""
                                        className="block"
                                      >
                                        Trạng thái đơn hàng: {order.orderStatus}
                                      </span>
                                    </td>
                                    <td className="text-left text-[.9375rem] leading-none text-white-300 py-4">
                                      <div>
                                        <button
                                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                          onClick={() =>
                                            handleViewDetails(order.orderID)
                                          }
                                        >
                                          Xem chi tiết
                                        </button>
                                        {currentOrder && (
                                          <ModalViewOrderDetail
                                            order={currentOrder}
                                            showModal={showModal}
                                            setShowModal={setShowModal}
                                          />
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div
                          className="w-full text-center h-[263px] appear flex items-center"
                          data-v-15d6e969=""
                        >
                          <div className="w-full flex flex-col items-center">
                            <img
                              src="https://waka.vn/svgs/icon-empty.svg"
                              alt="icon-empty"
                              className="cursor-pointer"
                            />
                            <p className="font-medium text-base text-white-50 pb-2 pt-6 ">
                              Bạn chưa có giao dịch nào
                            </p>
                            <p className="font-normal text-[15px] text-white-300 ">
                              Thông tin giao dịch mua nội dung sẽ hiển thị tại
                              đây
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default Transaction_histories;
