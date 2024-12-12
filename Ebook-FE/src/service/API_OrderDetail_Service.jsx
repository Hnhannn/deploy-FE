// api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/rest/orderDetail";

// Function to get order details by bookID and userID
export const getOrderDetailsbyBookAndUser = async (bookID, userID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${bookID}/${userID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
