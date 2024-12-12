// UserService.js
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:8080/user";
const GET_EDIT_USER = (username) => `http://localhost:8080/user/edit/${username}`;
const UPDATE_USER = (userID) => `http://localhost:8080/user/updateUser/${userID}`;
export const fetchData = async (setUsers) => {
  try { 
    const response = await axios.get(`${API_BASE_URL}/getuser`);
    const listUsers = response.data.users;
    if (listUsers && Array.isArray(listUsers)) {
      setUsers(listUsers);
    } else {
      console.warn("API không trả về danh sách người dùng hợp lệ.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};
export const getUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/edit/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user for edit:", error);
    throw error;
  }
};

export const handleSubmit = async (values, isEditMode, resetForm, setSubmitting, setIsEditMode, setEditingUser, fetchData) => {
  try {
    if (isEditMode) {
      const { data } = await axios.get(GET_EDIT_USER(values.username));
      const userID = data.userID;
      await axios.put(UPDATE_USER(userID), values);
      showToast("Cập nhật thành công!", true);
    } else {
      await axios.post(`${API_BASE_URL}/signup`, [values]);
      showToast("Thêm thành công!", true);
    }
    fetchData();
    resetForm();
  } catch (error) {
    handleError(error);
  } finally {
    setIsEditMode(false);
    setSubmitting(false);
    setEditingUser(null);
    fetchData();
  }
};
export const handleEditUser = async (username, setIsEditMode, setEditingUser) => {
  setIsEditMode(true);
  try {
    const response = await axios.get(GET_EDIT_USER(username));
    const user = response.data;
    setEditingUser({
      username: user.username,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: "",
      gender: user.gender ? "true" : "false",
      role: user.role ? "true" : "false",
    });
  } catch (error) {
    console.error("Error fetching user for edit:", error);
    showToast("Không thể tải thông tin người dùng.", false);
  }
};

export const handleDeleteUser = async (userID, fetchData) => {
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
    });
    if (result.isConfirmed) {
      await axios.delete(`${API_BASE_URL}/deleteUser/${userID}`);
      Swal.fire("Đã xóa!", "Người dùng đã được xóa.", "success");
      fetchData();
    }
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    Swal.fire("Lỗi!", "Không thể xóa người dùng. Vui lòng thử lại sau!", "error");
  }
};
export const showToast = (message, isSuccess) => {
  const toast = isSuccess ? document.getElementById("toast-success") : document.getElementById("toast-danger");
  toast.querySelector(".text-sm").textContent = message;
  toast.style.display = "flex";
  setTimeout(() => {
    toast.style.display = "none";
  }, 5000);
};

export const handleError = (error) => {
  if ((error.response && error.response.status === 400) || (error.response && error.response.status === 500)) {
    const errorMessage = typeof error.response.data === "string" ? error.response.data.split() : error.response.data;
    console.log("Error message:", errorMessage);
  } else {
    showToast("Lỗi: " + (error.response?.data || error.message), false);
  }
};
export const login = async (username, password) => {
  const response = await axios.post(`${API_BASE_URL}/signin`, {
    username: username,
    password: password,
  });
  return response.data;
};

export const loginGoogle = async (user) => {
  const response = await axios.post(`http://localhost:8080/api/loginGoogle`, user);
  return response.data;
};
