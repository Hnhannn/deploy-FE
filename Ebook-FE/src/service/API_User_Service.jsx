import axios from "axios";

const LOGIN_URL = "http://localhost:8080/user/signin";
axios.defaults.withCredentials = true;

export const loginApi = async (username, password) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Thêm dòng này để gửi thông tin cookie với yêu cầu
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};


export const createStudent = async (username, password) => {
  const response = await axios.post(LOGIN_URL, {
    username: username,
    password: password,
  });
  return response.data;
};
