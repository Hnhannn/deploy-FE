import axios from "axios";

const API_URL = "http://localhost:8080/rest/books";

export const getAllBook = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getFreeBook = async () => {
  const response = await axios.get(`${API_URL}/free`);
  return response.data;
};
export const getRandomBook = async () => {
  const response = await axios.get(`${API_URL}/random`);
  return response.data;
};

export const getVIPBook = async () => {
  const response = await axios.get(`${API_URL}/vip`);
  return response.data;
};

export const getBookPrice = async () => {
  const response = await axios.get(`${API_URL}/price/greaterThanZero`);
  return response.data;
};

export const getNewBook = async () => {
  const response = await axios.get(`${API_URL}/new`);
  return response.data;
};

export const getBookById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by id:", error);
    throw error;
  }
};

export const searchBooks = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

// Hàm mới để gọi API tới URL cụ thể
export const getBookAndBookByType = async (bookId, bookTypeId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${bookId}/booktype/${bookTypeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching book by type:", error);
    throw error;
  }
};
// Hàm mới để gọi API tới URL cụ thể
export const getBookByType = async (bookTypeId) => {
  try {
    const response = await axios.get(`${API_URL}/booktype/${bookTypeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by type:", error);
    throw error;
  }
};

export const getBookByAccessType = async (accessType) => {
  try {
    const response = await axios.get(`${API_URL}/accessType/${accessType}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching book by access type:", error);
    throw error;
  }
};

export const getRecommendations = async (userID) => {
  try {
    const response = await axios.get(`${API_URL}/recommendations/${userID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
};
