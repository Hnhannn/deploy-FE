import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function Statistics() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [booksAndDetails, setBooksAndDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    // Hàm lấy ngày đầu tiên và ngày cuối cùng của tháng gần nhất
    const getLastMonthRange = () => {
        const now = new Date();
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const formatDate = (date) => date.toISOString().split("T")[0];
        return {
            startDate: formatDate(firstDayOfLastMonth),
            endDate: formatDate(lastDayOfLastMonth),
        };
    };

    // Hàm định dạng ngày (DD/MM/YYYY)
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Hàm gọi API để lấy dữ liệu
    const fetchBooksWithHighestReads = async (startDate, endDate) => {
        setLoading(true);
        try {
            const formattedStartDate = `${startDate}T00:00:00`;
            const formattedEndDate = `${endDate}T23:59:59`;

            const response = await axios.get(
                `http://localhost:8080/rest/readBook/booksAndDetails/${formattedStartDate}/${formattedEndDate}`
            );
            setBooksAndDetails(response.data);
        } catch (error) {
            console.error("Error fetching data", error);
            alert("Đã xảy ra lỗi khi tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    // Khi component được tải, tự động hiển thị dữ liệu tháng gần nhất
    useEffect(() => {
        const { startDate, endDate } = getLastMonthRange();
        setStartDate(startDate);
        setEndDate(endDate);
        fetchBooksWithHighestReads(startDate, endDate);
    }, []);

    // Hàm xử lý khi người dùng nhấn nút "Lọc Dữ Liệu"
    const handleSubmit = (e) => {
        e.preventDefault();
        if (startDate && endDate) {
            fetchBooksWithHighestReads(startDate, endDate);
        } else {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
        }
    };

    // Hàm xuất Excel
    const exportToExcel = () => {
        if (booksAndDetails.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const formattedData = booksAndDetails.map((item) => ({
            "Tên Sách": item[0],
            "Lượt Đọc": item[1],
            "Ngày Đọc": formatDate(item[2]),
            "Loại Hoạt Động": item[3] ? "Đọc" : "Ngừng",
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Books Data");

        XLSX.writeFile(workbook, `BookStatistics_${startDate}_to_${endDate}.xlsx`);
    };

    return (
      <div className="flex px-5">
        {/* Sidebar */}
        <div className="w-64">{/* Nội dung của sidebar */}</div>

        {/* Main content */}
        <div className="flex-1 mt-6">
          <h1 className="text-2xl font-semibold mb-4">
            Thống kê sách có lượt truy cập cao nhất
          </h1>
          <div className="bg-gray-800 p-6">
            <form
              style={{ marginBottom: "20px" }}
              className="flex px-5"
              onSubmit={handleSubmit}
            >
              <div>
                <label>Từ Ngày: </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-black"
                  required
                />
              </div>
              <div>
                <label>Đến Ngày: </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="mb-4 p-2 bg-blue-500 text-white rounded"
                style={{ marginLeft: "20px" }}
              >
                <i className="fa-solid fa-filter mr-2"></i>
                Lọc Dữ Liệu
              </button>
              <button
                onClick={exportToExcel}
                className="mb-4 p-2 bg-green-500 text-white rounded flex items-center"
                style={{ marginLeft: "20px" }}
              >
                <i className="fa-solid fa-file-excel mr-2"></i>
                Xuất Excel
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-4">
              Danh sách sách có lượt đọc cao nhất:
            </h2>
            {loading ? (
              <p className="text-white">Đang tải dữ liệu...</p>
            ) : (
              <table className="min-w-full bg-gray-700 text-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Tên Sách</th>
                    <th className="px-4 py-2 text-left">Lượt Đọc</th>
                    <th className="px-4 py-2 text-left">Ngày Đọc</th>
                    <th className="px-4 py-2 text-left">Loại Hoạt Động</th>
                  </tr>
                </thead>
                <tbody>
                  {booksAndDetails.length > 0 ? (
                    booksAndDetails.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{item[0]}</td>
                        <td className="px-4 py-2">{item[1]}</td>
                        <td className="px-4 py-2">{formatDate(item[2])}</td>
                        <td className="px-4 py-2">
                          {item[3] ? "Đọc" : "Ngừng"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-2 text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
}

export default Statistics;
