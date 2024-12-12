// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import "flowbite/dist/flowbite.min.css";
import axiosInstance from "../../config/axiosConfig.js";

function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 10;
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const GET_USER = "http://localhost:8080/user/by-role";
  const SIGNUP_URL = "http://localhost:8080/user/signup";
  const DELETE_USER_URL = (userID) => `http://localhost:8080/user/deleteUser/${userID}`;
  const GET_EDIT_USER = (username) => ` http://localhost:8080/user/edit/${username}`;
  const UPDATE_USER = (userID) => `http://localhost:8080/user/updateUser/${userID}`;
  const SEARCH_USER = (fullname) => `http://localhost:8080/user/search/${fullname}`;
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
            params: { isAdmin: true },
          });
      console.log("Response data:", response.data);
      const listUsers = response.data.users;
      if (listUsers && Array.isArray(listUsers)) {
        setUsers(listUsers);
        setCurrentPage(0); // Reset lại trang khi có kết quả tìm kiếm
      } else {
        console.warn("API không trả về danh sách người quản trị hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi tìm kiếm người quản trị.");
    }
  };
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (isEditMode) {
        const { data } = await axiosInstance.get(GET_EDIT_USER(values.username));
        const userID = data.userID;
        console.log("User update value: " + userID);
        await axiosInstance.put(UPDATE_USER(userID), values);
        toast.success("Cập nhật thành công!");
      } else {
        await axiosInstance.post(SIGNUP_URL, [values]);
        toast.success("Thêm thành công!");
      }
      await fetchData();
      resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setIsEditMode(false);
      setSubmitting(false);
      setEditingUser(null);
      await fetchData();
    }
  };

  function handleError(error) {
    if ((error.response && error.response.status === 400) || (error.response && error.response.status === 500)) {
      const errorMessage = typeof error.response.data === "string" ? error.response.data.split() : error.response.data;
      console.log("Error message:", errorMessage);
    } else {
      const error = "Lỗi: " + (error.response?.data || error.message);
      toast.error(error);
    }
  }

  const fetchData = async (query) => {
    try {
      const response = query
        ? await axiosInstance.get(SEARCH_USER(query))
        : await axiosInstance.get(GET_USER, {
            params: { isAdmin: true },
          });
      const listUsers = Array.isArray(response.data.users) ? response.data.users : response.data;
      if (listUsers && Array.isArray(listUsers)) {
        setUsers(listUsers);
        setCurrentPage(0);
      } else {
        console.warn("API không trả về danh sách người quản trị hợp lệ.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Lỗi khi tìm kiếm người quản trị.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const debounceFetch = useCallback(debounce(fetchData, 500), []);
  const initialValues = {
    username: "",
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: null,
    birthday: "",
    password: "",
    status: "UNVERIFIED",
  };
  const handleEditUser = async (username) => {
    setIsEditMode(true);
    try {
      const response = await axiosInstance.get(GET_EDIT_USER(username));
      const user = response.data;
      console.log("User edit birthday: " + user.birthday);
      setEditingUser({
        username: user.username,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        password: "",
        gender: user.gender ? "true" : "false",
        status: user.status,
        birthday: user.birthday ? user.birthday.split("T")[0] : "",
      });
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      toast.error("Không thể tải thông tin người quản trị.");
    }
  };
  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập username"),
    fullName: Yup.string()
      .required("Vui lòng nhập họ và tên")
      .matches(/^([A-ZÀ-Ỹ][a-zà-ỹ]*(?:[- ][A-ZÀ-Ỹ][a-zà-ỹ]*)*)$/, "Tên chỉ là các chữ cái, chữ cái đầu tiên được viết hoa. (Ví dụ: Nguyễn Văn A)"),
    phoneNumber: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^\d+$/, "Số điện thoại chỉ có thể là số")
      .matches(/^0[35789]\d{8}$/, "Số điện thoại chỉ có thể là số và có 10 chữ số"),
    password: isEditMode ? Yup.string() : Yup.string().min(8, "Mật khẩu phải dài hơn 8 kí tự").required("Mật khẩu không hợp lệ"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    gender: Yup.string().required("Vui lòng chọn giới tính"),
    birthday: Yup.date().required("Vui lòng chọn ngày sinh").max(new Date(), "Ngày sinh không hợp lệ"),
    status: Yup.string().required("Vui lòng chọn trạng thái"),
  });
  const handleDeleteUser = async (userID) => {
    console.log(userID);
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa người quản trị này không?",
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
        await axiosInstance.put(DELETE_USER_URL(userID));
        Swal.fire({
          title: "Đã xóa!",
          text: "người quản trị đã được xóa.",
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
      console.error("Lỗi khi xóa người quản trị:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa người quản trị. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });
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
        <h2 className="text-xl font-semibold mb-4">Quản lý người quản trị</h2>
        <div className="bg-gray-800 p-6">
          <Formik
            initialValues={editingUser || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize>
            {({ setFieldValue }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white">
                      Username
                      <Field
                        name="username"
                        type="text"
                        placeholder="Nhập username"
                        className={`w-full p-2 border border-gray-300 rounded mt-1 text-white ${isEditMode ? "bg-gray-500" : "bg-gray-700"}`}
                        disabled={isEditMode}
                      />
                    </label>
                    <div className="py-1">
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white">
                      Họ và tên
                      <Field
                        name="fullName"
                        type="text"
                        placeholder="Nhập họ và tên"
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-white bg-gray-700"
                      />
                    </label>
                    <ErrorMessage
                      name="fullName"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white">
                      Số điện thoại
                      <Field
                        name="phoneNumber"
                        type="text"
                        placeholder="Nhập số điện thoại"
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-white bg-gray-700"
                      />
                    </label>
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white">
                      Email
                      <Field
                        name="email"
                        type="text"
                        placeholder="Nhập email"
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-white bg-gray-700"
                      />
                    </label>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <p className="block text-white">Giới tính</p>
                    <div>
                      <label>
                        <Field
                          type="radio"
                          name="gender"
                          value="true"
                          className="mr-2"
                          onChange={() => setFieldValue("gender", "true")}
                        />
                        Nam
                      </label>
                      <label className="ms-4">
                        <Field
                          type="radio"
                          name="gender"
                          value="false"
                          className="mr-2"
                          onChange={() => setFieldValue("gender", "false")}
                        />
                        Nữ
                      </label>
                    </div>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white">
                      Ngày sinh
                      <Field
                        name="birthday"
                        type="date"
                        placeholder="Chọn ngày sinh"
                        className="w-full p-2 border border-gray-300 rounded mt-1 bg-gray-700 text-white"
                        value={editingUser?.birthday || ""} onChange={(e) => {
                          setEditingUser((prev) => ({
                            ...prev,
                            birthday: e.target.value,
                          }));
                        }}
                      />
                    </label>
                    <ErrorMessage
                      name="birthday"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-white">
                      Mật khẩu
                      <Field
                        name="password"
                        type="text"
                        placeholder="Nhập mật khẩu"
                        className="w-full p-2 border border-gray-300 rounded mt-1 text-white bg-gray-700"
                      />
                    </label>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <div>
                      <label className="block text-white">Trạng thái tài khoản:</label>
                      <Field
                        name="status"
                        as="select"
                        className="mt-1 bg-gray-700 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="UNVERIFIED">UNVERIFIED</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="BANNED">BANNED</option>
                        <option value="DELETED">DELETED</option>
                      </Field>
                    </div>
                    <div>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4">
                  {isEditMode ? "Cập nhật người quản trị" : "Thêm người quản trị"}
                </button>
              </Form>
            )}
          </Formik>
          <div id="toast-container"></div>
        </div>
        <div className="flex flex-col px-5">
          <div className="bg-gray-800 p-6 mt-8 mb-8">
            <div className="pb-5">
              <h2 className="text-xl font-semibold">Tìm kiếm người quản trị</h2>
              <form
                onSubmit={handleSearch}
                className="flex items-center justify-center mt-5">
                <input
                  type="text"
                  className=" text-black w-full px-3 py-2 border border-gray-300 rounded-l focus:outline-none"
                  placeholder="Tìm kiếm tên người quản trị..."
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
            <h2 className="text-xl font-semibold mb-4">Danh sách người quản trị</h2>
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left ">Username</th>
                  <th className="px-4 py-2 text-left">Họ và tên</th>
                  <th className="px-4 py-2 text-left">Giới tính</th>
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
                      <td className="px-4 py-2">{user.status}</td>
                      <td>
                        <button
                          onClick={() => handleEditUser(user.username)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">
                          Sửa
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteUser(user.userID);
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
  );
}

export default AdminManagement;
