import axios from "axios";

const API_BASE_URL = "http://localhost:8080/rest/reviews";

// Function to create a review
export const createReview = async (reviewDTO) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, reviewDTO);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Function to update a review
export const updateReview = async (reviewID, reviewDTO) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${reviewID}`, reviewDTO);
    return response.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

// Function to get reviews by bookID
export const getReviewsByBookID = async (bookID) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${bookID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};
