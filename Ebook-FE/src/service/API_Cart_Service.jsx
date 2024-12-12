import axios from "axios";


const CART_URL = "http://localhost:8080/rest/cartdetails";


export const addToCart = async (cart) => {
    try {
        const response = await axios.post(CART_URL, cart);
        return response.data;
    } catch (error) {
        console.error("Error creating publisher:", error);
        throw error;
    }
};
export const getCartByUser = async (userID) => {
    try {
        const response = await axios.get(`${CART_URL}/user/${ userID }`);
        return response.data;
    } catch (error) {
        console.error("Error creating publisher:", error);
        throw error;
    }
};
