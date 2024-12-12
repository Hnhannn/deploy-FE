import { jwtDecode } from "jwt-decode";
const isTokenExpired = (token) => {
  if (!token) return true; // Token không tồn tại
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log("isTokenExpired function: ", decodedToken, currentTime);
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
export default isTokenExpired;
