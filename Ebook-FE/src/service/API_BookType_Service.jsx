import axios from "axios";

const API_URL = "http://localhost:8080/rest/booktypes"; // Thay đổi URL này nếu cần

export const getBookTypes = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching book types:", error);
    throw error;
  }
};
