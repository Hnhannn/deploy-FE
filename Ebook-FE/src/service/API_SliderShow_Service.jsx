import axios from "axios";

const API_BASE_URL = "http://localhost:8080/rest/slidershows";

export const getAllSliderShows = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the slider shows!", error);
    throw error;
  }
};
export const PostSliderShows = async (data) => {
  try {
    const response = await axios.post(API_BASE_URL,data);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the slider shows!", error);
    throw error;
  }
};

export const updateSliderOrder = async (sliders) => {
  try {
    await axios.put(`${API_BASE_URL}/updateOrder`, sliders);
  } catch (error) {
    console.error("There was an error updating the slider order!", error);
    throw error;
  }
};


export const updateSliderOrderbyID = async (id, slider) => {
  try {
    await axios.put(`${API_BASE_URL}/updateImage/${id}`, slider);
  } catch (error) {
    console.error("There was an error updating the slider order!", error);
    throw error;
  }
};

export const deleteSliderByID = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("There was an error deleting the slider!", error);
    throw error;
  }
};