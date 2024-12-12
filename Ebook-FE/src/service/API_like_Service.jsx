import axios from "axios";

const API_URL = "http://localhost:8080/rest/like";

export const getLikeByBook = async (bookID, userID) => {
  try {
    const response = await axios.get(
      `${API_URL}/${bookID}/${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching like by book and user:", error);
    throw error;
  }
};


export const getLikeByUser = async (userID) => {
  try {
    const response = await axios.get(
      `${API_URL}/${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching like by user:", error);
    throw error;
  }
}

export const addLike = async (like) => {
    try {
        const response = await axios.post(`${API_URL}`, like);
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}


export const deleteLike = async (likeID) => {
  try {
    const response = await axios.delete(`${API_URL}/${likeID}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};