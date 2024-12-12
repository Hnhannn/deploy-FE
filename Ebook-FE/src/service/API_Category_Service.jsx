import axios from "axios";

const CATEGORY_URL = "http://localhost:8080/rest/category";

export const getAllCategories = async () => {
    try {
        const response = await axios.get(CATEGORY_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};


export const createCategory = async (category) => {
    try {
        const response = await axios.post(CATEGORY_URL, category);
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategory = async (categoryID, category) => {
    try {
        await axios.put(`${CATEGORY_URL}/${categoryID}`, category);
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategory = async (categoryID) => {
    try {
        await axios.delete(`${CATEGORY_URL}/${categoryID}`);
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};