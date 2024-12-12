// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import "flowbite/dist/flowbite.min.css";
import axiosInstance from "../../config/axiosConfig.js";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const GET_USER = "http://localhost:8080/user/by-role";
  const DELETE_USER_URL = (userID) => `http://localhost:8080/user/deleteUser/${userID}`;
  const SEARCH_USER = (fullname) => `http://localhost:8080/user/search/${fullname}`;  const NOTIFY_ACCOUNT_STATUS_URL = "http://localhost:8080/api/otp/notify-status";

  const debounce = (fn, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debounceFetch(e.target.value);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = searchQuery
        ? await axiosInstance.get(SEARCH_USER(searchQuery))
        : await axiosInstance.get(GET_USER, {
            params: { isAdmin: false },
          });
      console.log("Response data:", response.data);
      const listUsers = response.data.users;
      if (listUsers && Array.isArray(listUsers)) {
        setUsers(listUsers);
        setCurrentPage(0); // Reset lại trang khi có kết quả tìm kiếm
      } else {
        console.warn("API không trả về danh sách người dùng hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi tìm kiếm người dùng.");
    }
  };

  const fetchData = async (query) => {
    try {
      const response = query
        ? await axiosInstance.get(SEARCH_USER(query))
        : await axiosInstance.get(GET_USER, {
            params: { isAdmin: false },
          });
      const listUsers = Array.isArray(response.data.users) ? response.data.users : response.data;
      if (listUsers && Array.isArray(listUsers)) {
        setUsers(listUsers);
        setCurrentPage(0);
      } else {
        console.warn("API không trả về danh sách người dùng hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi tìm kiếm người dùng.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const debounceFetch = useCallback(debounce(fetchData, 500), []);

  const handleDeleteUser = async (userID, userEmail, fullName) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa người dùng này không?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });

      if (result.isConfirmed) {
        // Delete user
        await axiosInstance.put(DELETE_USER_URL(userID));

        // Send email notification
        try {
          await axiosInstance.post(NOTIFY_ACCOUNT_STATUS_URL, null, {
            params: {
              email: userEmail,
              status: "deleted",
              fullName: fullName
            }
          });
        } catch (emailError) {
          console.error("Lỗi khi gửi email thông báo:", emailError);
          toast.warn("Không thể gửi email thông báo. Vui lòng kiểm tra kết nối.");
        }

        // Show success message
        Swal.fire({
          title: "Đã xóa!",
          text: "Người dùng đã được xóa.",
          icon: "success",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#ffffff",
          backdrop: "rgba(0, 0, 0, 0.5)",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        fetchData();
      }
    } catch (error) {
      console.log(error.response?.status);
      if (error.response?.status === 403) {
        Swal.fire({
          title: "Lỗi!",
          text: "Bạn không thể xóa chính mình!!",
          icon: "error",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#ffffff",
          backdrop: "rgba(0, 0, 0, 0.5)",
        });
      }
      console.error("Lỗi khi xóa người dùng:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa người dùng. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });
    }
  };

  const UPDATE_USER_STATUS = (userID) => `http://localhost:8080/user/updateStatus/${userID}`;

  const handleStatusChange = async (userID, newStatus, userEmail, fullName) => {
    if (["SUSPENDED", "BANNED"].includes(newStatus)) {
      // Hiển thị modal xác nhận
      const result = await Swal.fire({
        title: `Bạn có chắc chắn muốn thay đổi trạng thái thành "${newStatus}" không?`,
        text: "Hành động này có thể ảnh hưởng đến quyền truy cập của người dùng.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });

      if (!result.isConfirmed) {
        fetchData();
        return;
      }
    }

    try {
      await axiosInstance.put(UPDATE_USER_STATUS(userID), { status: newStatus });
      const isCriticalStatus = ["SUSPENDED", "BANNED"].includes(newStatus);

      if (isCriticalStatus) {
        const statusMap = {
          SUSPENDED: 'đình chỉ',
          BANNED: 'cấm',
        };
        const statusVietnamese = statusMap[newStatus];

        try {
          await axiosInstance.post(NOTIFY_ACCOUNT_STATUS_URL, null, {
            params: {
              email: userEmail,
              status: statusVietnamese,
              fullName: fullName
            }
          });
        } catch (emailError) {
          console.error("Lỗi khi gửi email thông báo:", emailError);
          toast.warn("Không thể gửi email thông báo. Vui lòng kiểm tra kết nối.");
        }
      }

      toast.success("Trạng thái người dùng đã được cập nhật.");
      fetchData();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.");
    }
  };
  const offset = currentPage * usersPerPage;
  const currentPageData = users.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(users.length / usersPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <div className="flex px-5">
      <div className="w-64"></div>
      <div className="flex-1 mt-6">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
        <h2 className="text-xl font-semibold mb-4">Quản lý người dùng</h2>
        <div className="bg-gray-800 p-6">
          <div className="flex flex-col">
            <div className="bg-gray-800 p-6 mb-8">
              <div className="pb-5">
                <h2 className="text-xl font-semibold">Tìm kiếm người dùng</h2>
                <form
                  onSubmit={handleSearch}
                  className="flex items-center justify-center mt-5">
                  <input
                    type="text"
                    className=" text-black w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
                    placeholder="Tìm kiếm tên người dùng..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="ps-1">
                    <button
                      type="submit"
                      className="max-w-full not-format text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-5 py-0.5">
                      Tìm kiếm
                    </button>
                  </div>
                </form>
              </div>
              <h2 className="text-xl font-semibold mb-4">Danh sách người dùng</h2>
              <table className="w-full table-fixed">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left w-30">Username</th>
                    <th className="px-4 py-2 text-left w-70">Họ và tên</th>
                    <th className="px-4 py-2 text-left w-17">Giới tính</th>
                    <th className="px-4 py-2 text-left">Số điện thoại</th>
                    <th className="px-4 py-2 text-left">Email</th>

                    <th className="px-4 py-2 text-left">Trạng thái</th>
                    <th className="px-4 py-2 text-center w-30"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageData && currentPageData.length > 0 ? (
                    currentPageData.map((user, index) => (
                      <tr
                        key={user.userID || index}
                        className="border-t">
                        <td className="px-4 py-2">{user.username}</td>
                        <td className="px-4 py-2">{user.fullName}</td>
                        <td className="px-4 py-2">{user.gender ? "Nam" : "Nữ"}</td>
                        <td className="px-4 py-2">{user.phoneNumber}</td>
                        <td className="px-4 py-2">{user.email}</td>

                        <td className="px-4 py-2">
                          <select
                            value={user.status}
                            onChange={(e) => 
                              handleStatusChange(
                                user.userID, 
                                e.target.value, 
                                user.email, 
                                user.fullName
                              )}
                            className="bg-cyan-500 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="UNVERIFIED">UNVERIFIED</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="SUSPENDED">SUSPENDED</option>
                            <option value="BANNED">BANNED</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                                handleDeleteUser(user.userID, user.email, user.fullName);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <ReactPaginate
                previousLabel={"Trước"}
                nextLabel={"Sau"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"flex items-center justify-center space-x-1 mt-4"}
                pageLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-white bg-gray-700 border border-gray-500 hover:bg-gray-600"}
                previousLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-white bg-gray-700 border border-gray-500 hover:bg-gray-600"}
                nextLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-white bg-gray-700 border border-gray-500 hover:bg-gray-600"}
                breakLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-white bg-gray-700 border border-gray-500 hover:bg-gray-600"}
                activeClassName={"bg-gray-900"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
