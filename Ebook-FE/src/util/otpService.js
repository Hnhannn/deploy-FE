import axios from "axios";
import { toast } from "react-toastify";

const API_VERIFY_OTP = "http://localhost:8080/api/otp/verify";
const API_SEND_OTP = "http://localhost:8080/api/otp/send";

/**
 * Gửi mã OTP qua email
 * @param {string} email - Địa chỉ email người nhận
 */
export async function sendOtp(email) {
  try {
    await axios.post(API_SEND_OTP, { email });
    toast.success("Mã OTP đã được gửi, vui lòng kiểm tra email!");
  } catch (error) {
    toast.error("Gửi OTP thất bại! Vui lòng thử lại sau.");
    console.error("Error sending OTP:", error);
  }
}

/**
 * Xác minh mã OTP
 * @param {string} email - Địa chỉ email người dùng
 * @param {string} otp - Mã OTP được nhập
 * @returns {boolean} - Trả về `true` nếu xác minh thành công, ngược lại là `false`
 */
export async function verifyOtp(email, otpCode) {
  try {
    console.log(email, otpCode);
    const response = await axios.post(API_VERIFY_OTP, { email, otpCode });
    if (response.status === 200) {
      toast.success("Xác thực mã thành công!");
      return true;
    } else {
      toast.error("Mã OTP không đúng hoặc đã hết hạn.");
      console.log("Mã OTP không đúng hoặc đã hết hạn.");
      return false;
    }
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      console.log("catch: Mã OTP không đúng hoặc đã hết hạn.");
    }
    console.error(error);
    return false;
  }
}
