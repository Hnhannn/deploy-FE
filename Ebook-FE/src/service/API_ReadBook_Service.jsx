// api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/rest/readBook";

export const getReadBooks = async (userId, bookId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}/book/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching read books:", error);
    throw error;
  }
};


export const getReadBooksbyUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching read books:", error);
    throw error;
  }
};


export const addReadBook = async (readBooksDTO) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, readBooksDTO);
    return response.data;
  } catch (error) {
    console.error("Error updating read book:", error);
    throw error;
  }
};



