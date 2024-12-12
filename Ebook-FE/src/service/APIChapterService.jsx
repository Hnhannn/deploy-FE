import axios from "axios";

const API_URL = "http://localhost:8080/rest/chapter";

export const getChappterById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chappter by id:", error);
    throw error;
  }
};
