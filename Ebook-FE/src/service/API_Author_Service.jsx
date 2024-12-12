import axios from "axios";

// Package_Service.jsx
const AUTHOR_URL = 'http://localhost:8080/rest/author'; // Replace with your actual API URL

export const getAllAuthors = async () => {
    try {
        const response = await axios.get(AUTHOR_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching authors:", error);
        throw error;
    }
};

// Thêm nhà xuất bản mới
export const createAuthor = async (author) => {
    try {
        const response = await axios.post(AUTHOR_URL, author);
        return response.data;
    } catch (error) {
        console.error("Error creating publisher:", error);
        throw error;
    }
};

// Cập nhật nhà xuất bản
export const updateAuthor = async (authorID, author) => {
    try {
        await axios.put(`${AUTHOR_URL}/${authorID}`, author);
    } catch (error) {
        console.error("Error updating publisher:", error);
        throw error;
    }
};

// Xóa nhà xuất bản
export const deleteAuthor = async (authorID) => {
    try {
        await axios.delete(`${AUTHOR_URL}/${authorID}`);
    } catch (error) {
        console.error("Error deleting publisher:", error);
        throw error;
    }

};
