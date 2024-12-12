// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";

const Main = ({ isDarkMode }) => {
  const [startDatePlan, setStartDatePlan] = useState("");
  const [endDatePlan, setEndDatePlan] = useState("");
  const [startDayBook, setStartDayBook] = useState("");
  const [endDayBook, setEndDayBook] = useState("");
  const [bookSaleData, setBookSaleData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [revenueData, setRevenueData] = useState({
    bookRevenue: 0,
    subscriptionRevenue: 0,
    totalRevenue: 0,
  });

  const fetchRevenueData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/revenue/revenue");
      if (response.ok) {
        const data = await response.json();
        setRevenueData(data);
      } else {
        console.error("Failed to fetch revenue data");
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const handleFilterBookSales = async () => {
    try {
      const startDate = startDayBook ? `${startDayBook}T00:00:00` : "2024-01-01T00:00:00";
      const endDate = endDayBook ? `${endDayBook}T23:59:59` : "2024-12-31T23:59:59";
      const response = await fetch(`http://localhost:8080/api/revenue/books/statistics?startDate=${startDate}&endDate=${endDate}`);

      if (response.ok) {
        const data = await response.json();
        setBookSaleData(data);
      } else {
        console.error("Failed to fetch book sales data");
      }
    } catch (error) {
      console.error("Error fetching book sales data:", error);
    }
  };

  const handleFilterSubscriptionPlans = async () => {
    try {
      const startDate = startDatePlan ? `${startDatePlan}T00:00:00` : "2023-01-01T00:00:00";
      const endDate = endDatePlan ? `${endDatePlan}T23:59:59` : "2023-12-31T23:59:59";
      const response = await fetch(`http://localhost:8080/api/revenue/userSubscription/monthly?startDate=${startDate}&endDate=${endDate}`);

      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      } else {
        console.error("Failed to fetch subscription plans data");
      }
    } catch (error) {
      console.error("Error fetching subscription plans data:", error);
    }
  };
  const fetchAllSubscriptionPlans = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/revenue/userSubscription/monthly");
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      } else {
        console.error("Failed to fetch subscription plans data");
      }
    } catch (error) {
      console.error("Error fetching subscription plans data:", error);
    }
  };
  const fetchAllBookSales = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/revenue/books/statistics");
      if (response.ok) {
        const data = await response.json();
        setBookSaleData(data);
      } else {
        console.error("Failed to fetch book sales data");
      }
    } catch (error) {
      console.error("Error fetching book sales data:", error);
    }
  };
  useEffect(() => {
    fetchAllBookSales();
    fetchAllSubscriptionPlans();
  }, []);
  const exportBookSalesToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookSaleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thống Kê Sách");
    XLSX.writeFile(wb, "Thống_Kê_Sách.xlsx");
  };

  const exportSubscriptionPlansToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(subscriptionData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Thống Kê Gói Cước");
    XLSX.writeFile(wb, "Thống_Kê_Gói_Cước.xlsx");
  };

  return (
    <div className="flex px-5">
      <div className="w-64"></div>
      <div className="flex-1 mt-6">
        <h1>Tổng Doanh Thu Cửa Hàng</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Widget
            title="Tổng doanh thu sách đã bán"
            value={revenueData.bookRevenue.toLocaleString("vi-VN")} //
          />
          <Widget
            title="Doanh thu gói cước"
            value={revenueData.subscriptionRevenue.toLocaleString("vi-VN")}
          />
          <Widget
            title="Tổng doanh thu cửa hàng"
            value={revenueData.totalRevenue.toLocaleString("vi-VN")}
          />
        </div>
        <div className="bg-gray-600 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-center text-2xl font-semibold mt-8 text-white">Bảng Thống Kê Sách Chi Tiết</h1>
          <div className="mb-4 flex items-center space-x-4">
            <div>
              <label
                htmlFor="startDayBook"
                className="block mb-1 text-white">
                Từ ngày:
              </label>
              <input
                id="startDayBook"
                type="date"
                value={startDayBook}
                onChange={(e) => setStartDayBook(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-[200px] text-black"
              />
            </div>
            <div>
              <label
                htmlFor="endDayBook"
                className="block mb-1 text-white">
                Đến ngày:
              </label>
              <input
                id="endDayBook"
                type="date"
                value={endDayBook}
                onChange={(e) => setEndDayBook(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-[200px] text-black"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleFilterBookSales}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Lọc dữ liệu
              </button>
              <button
                onClick={exportBookSalesToExcel}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Xuất Excel
              </button>
            </div>
          </div>

          <table className="min-w-full table-auto mt-6 mx-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2 border border-gray-300">STT</th>
                <th className="px-4 py-2 border border-gray-300">Tên Sách</th>
                <th className="px-4 py-2 border border-gray-300">Số Lượng</th>
                <th className="px-4 py-2 border border-gray-300">Doanh Thu</th>
              </tr>
            </thead>
            <tbody>
              {bookSaleData.length > 0 ? (
                bookSaleData.map((data, index) => (
                  <tr
                    key={index}
                    className="bg-gray-400 hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                    <td className="px-4 py-2 border border-gray-300">{data.title}</td>
                    <td className="px-4 py-2 border border-gray-300">{data.totalQuantity}</td>
                    <td className="px-4 py-2 border border-gray-300">{data.totalRevenue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center px-4 py-2 border border-gray-300">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-600 rounded-lg shadow-md p-6">
          <h1 className="text-center text-2xl font-semibold mt-8 text-white">Bảng Thống Kê Gói Cước Chi Tiết</h1>

          <div className="mb-4 flex items-center space-x-4">
            <div>
              <label
                htmlFor="startDatePlan"
                className="block mb-2 text-white">
                Từ ngày:
              </label>
              <input
                id="startDatePlan"
                type="date"
                value={startDatePlan}
                onChange={(e) => setStartDatePlan(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-[200px] text-black"
              />
            </div>
            <div>
              <label
                htmlFor="endDatePlan"
                className="block mb-2 text-white">
                Đến ngày:
              </label>
              <input
                id="endDatePlan"
                type="date"
                value={endDatePlan}
                onChange={(e) => setEndDatePlan(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-[200px] text-black"
              />
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleFilterSubscriptionPlans}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Lọc dữ liệu
              </button>
              <button
                onClick={exportSubscriptionPlansToExcel}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                Xuất Excel
              </button>
            </div>
          </div>

          <table className="min-w-full table-auto mt-6 mx-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2 border border-gray-300">STT</th>
                <th className="px-4 py-2 border border-gray-300">Tên Gói Cước</th>
                <th className="px-4 py-2 border border-gray-300">Số Lượng</th>
                <th className="px-4 py-2 border border-gray-300">Doanh Thu</th>
              </tr>
            </thead>
            <tbody>
              {subscriptionData.length > 0 ? (
                subscriptionData.map((data, index) => (
                  <tr
                    key={index}
                    className="bg-gray-400 hover:bg-gray-100">
                    <td className="px-4 py-2 border border-gray-300">{index + 1}</td>
                    <td className="px-4 py-2 border border-gray-300">{data.planName}</td>
                    <td className="px-4 py-2 border border-gray-300">{data.subscriptionCount}</td>
                    <td className="px-4 py-2 border border-gray-300">{data.totalRevenue}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center px-4 py-2 border border-gray-300">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Widget = ({ title, value }) => (
  <div className="bg-gray-800 shadow p-6 px-3">
    <h3 className="text-sm mb-2">{title}</h3>
    <p className="text-2xl">{value} VND</p>
  </div>
);
Main.propTypes = {
  isDarkMode: PropTypes.bool,
};
Widget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
export default Main;
