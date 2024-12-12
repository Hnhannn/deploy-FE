import axios from "axios";

const PUBLISHER_URL = "http://localhost:8080/rest/publisher";

// Lấy danh sách nhà xuất bản
export const getAllPublishers = async () => {
    try {
        const response = await axios.get(PUBLISHER_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching publishers:", error);
        throw error;
    }
};

// Thêm nhà xuất bản mới
export const createPublisher = async (publisher) => {
    try {
        const response = await axios.post(PUBLISHER_URL, publisher);
        return response.data;
    } catch (error) {
        console.error("Error creating publisher:", error);
        throw error;
    }
};

// Cập nhật nhà xuất bản
export const updatePublisher = async (publisherID, publisher) => {
    try {
        await axios.put(`${PUBLISHER_URL}/${publisherID}`, publisher);
    } catch (error) {
        console.error("Error updating publisher:", error);
        throw error;
    }
};

// Xóa nhà xuất bản
export const deletePublisher = async (publisherID) => {
    try {
        await axios.delete(`${PUBLISHER_URL}/${publisherID}`);
    } catch (error) {
        console.error("Error deleting publisher:", error);
        throw error;
    }

};
