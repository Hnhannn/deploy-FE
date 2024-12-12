import axios from "axios";

const API_URL = "http://localhost:8080/rest/packagePlan";

export const getAllPackagePlan = async () =>{
    const response = await axios.get(API_URL);
    return response.data;
};
export const getPackagePlanID = async (Id) =>{
    const response = await axios.get(`${API_URL}/${Id}`);
    return response.data;
};
