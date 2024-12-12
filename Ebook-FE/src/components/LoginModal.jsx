import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "flowbite";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import { auth } from "../Firebase/UploadConfig";
import { login, loginGoogle } from "../service/UserService";
import ForbiddenModal from "./ForbiddenModal";
import { jwtDecode } from "jwt-decode";
export default function LoginModal({ onClose }) {
  const length = 6;
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(true);
  const [forbiddenStatus, setForbiddenStatus] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [tokenVerify, setTokenVerify] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isResetPass, setIsResetPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const emailContact = "vinhntpc07091@fpt.edu.vn";
  const API_SEND_OTP = "http://localhost:8080/api/otp/send";
  const API_VERIFY_OTP = "http://localhost:8080/api/otp/verify";
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập username"),
    password: Yup.string().min(8, "Mật khẩu phải dài hơn 8 kí tự").required("Mật khẩu không hợp lệ"),
  });
  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().length(length, `OTP phải gồm ${length} chữ số`).matches(/^\d+$/, "OTP chỉ được chứa chữ số").required("Vui lòng nhập OTP"),
  });
  const handleLogin = async (values) => {
    const { username, password } = values;
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res?.token) {
        const token = res.token;
        const decodedToken = jwtDecode(token);
        const status = decodedToken.status;
        const username = decodedToken.sub;
        console.log(" username: ", username);
        console.log(status);
        switch (status) {
          case "UNVERIFIED": {
            console.log(" username: ", username);
            const emailRes = await axios.get("http://localhost:8080/user/getemailbyusername", {
              params: { username },
            });
            setUnverifiedEmail(emailRes.data);
            setTokenVerify(token);
            await handleSendOtp(emailRes.data);
            delay(100);
            setIsLoginFormOpen(false);
            setIsOtpModalOpen(true);
            break;
          }
          case "ACTIVE":
            localStorage.setItem("token", token);
            window.location.reload();
            break;
          case "BANNED":
          case "SUSPENDED":
            setForbiddenStatus(status);
            setIsForbiddenModalOpen(true);
            break;
          case "DELETED":
            toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
            break;
          default:
            toast.error("Lỗi không xác định, vui lòng thử lại.");
        }
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handleSendOtp = async (email) => {
    setLoading(true);console.log( 
      "email when send",email);
    try {
      await axios.post(API_SEND_OTP, { email });
      toast.success("Mã OTP đã được gửi, vui lòng kiểm tra email!");
    } catch (error) {
      toast.error("Gửi OTP thất bại! Vui lòng thử lại sau.");
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOtp = async (values) => {
    const { otp } = values;
    let otpParse = otp.toString();
    setLoading(true);
    try {
      console.log(unverifiedEmail, otpParse);
      const response = await axios.post(API_VERIFY_OTP, {
        email: unverifiedEmail,
        otpCode: otpParse,
      });
      if (response.status === 200) {
        toast.success("Xác thực mã thành công!");
        localStorage.setItem("token", tokenVerify);
        setIsOtpModalOpen(false);
        window.location.reload();
        return true;
      } else if (response.status === 400) {
        toast.error("Mã OTP không đúng hoặc đã hết hạn.");
        console.log("Mã OTP không đúng hoặc đã hết hạn.");
        return false;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
        console.log("catch: Mã OTP không đúng hoặc đã hết hạn.");
      } else if (error.response?.status === 400) {
        toast.error("Mã OTP không đúng hoặc đã hết hạn.");
        console.log("Mã OTP không đúng hoặc đã hết hạn.");
        return false;
      }
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const handleResendOtp = useCallback(async () => {
    if (isResendDisabled) return;
    const timeCountDown = 60;
    await handleSendOtp(unverifiedEmail);
    setCountdown(timeCountDown);
    setIsResendDisabled(true);
    setTimeout(() => setIsResendDisabled(false), timeCountDown * 10000);
  }, [isResendDisabled,unverifiedEmail]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
  }, [countdown]);


  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      const user1 = result.user;
      const userPayload = {
        displayName: user1.displayName,
        email: user1.email,
        photoURL: user1.photoURL,
        emailVerified: user1.emailVerified,
        phoneNumber: user1.phoneNumber,
      };
      console.log("User Payload:", userPayload);

      const response = await axios.post("http://localhost:8080/api/loginGoogle", userPayload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Google OAuth Token:", response.data.token);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during Google login:", error.response ? error.response.data : error.message);
      alert("Login failed: " + (error.response ? error.response.data.message : error.message));
    }
  };
  const handleForgotPass = async () => {
    setIsLoginFormOpen(false);
    setIsResetPass(false);
    setIsForgotPass(true);
  };
  const handleResetPass = async () => {
    if (isResendLoading) return;
    setIsResendLoading(true);
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Vui lòng nhập email.");
      setLoading(false);
      setIsResendLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email không đúng định dạng. Vui lòng kiểm tra lại.");
      setLoading(false);
      setIsResendLoading(false);
      return;
    }
    try {
      await axios.post("http://localhost:8080/reset/forgot-password", { email });
      toast.success("Mã OTP đã được gửi đến email của bạn.");
      setCountdown(60);
      setIsForgotPass(false);
      setIsResetPass(true);
    } catch (error) {
      const errorMessage = error.response?.data || "Email không tồn tại.";
      toast.error(errorMessage);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    setIsResendLoading(false);
  };
  const handleVerifyOtpResetPass = async () => {
    if (!email || !otp || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/reset/verify-otp", { email, otpCode: otp, newPassword });
      toast.success("Đổi mật khẩu thành công", {
        autoClose: 1000,
        onClose: () => {
          onClose();
        },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 2) + "*".repeat(name.length - 2);
    const [domainName, domainExtension] = domain.split(".");
    const maskedDomainName = domainName === "gmail" ? domainName : domainName.slice(0, 1) + "*".repeat(domainName.length - 1);
    return `${maskedName}@${maskedDomainName}.${domainExtension}`;
  };
  return (
    <>
      {isResetPass && (
        <>
          <div
            className="v-modal"
            id="v-modal"
          />
          <div
            data-v-da1ecd7c=""
            className="el-dialog__wrapper"
            style={{ zIndex: 2001 }}>
            <div
              id="modal-login"
              className="fixed inset-0 z-[2001] overflow-auto">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog dialog-login"
                style={{ marginTop: "15vh", width: 500 }}>
                <div className="w-full h-full relative text-center p-[1.875rem]">
                  <div
                    className="absolute top-4 right-4"
                    onClick={onClose}>
                    <img
                      src="https://waka.vn/svgs/icon-close-white.svg"
                      alt="icon-close-white"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="mb-6">
                    <h1 className="text-2xl-26-26 mb-2 text-white-default">Đặt lại mật khẩu</h1>
                    <p className="text-sm-15-19 text-white-50">Mã xác nhận đã được gửi về email</p>
                    <p className="text-sm-15-19 text-white-50">{maskEmail(email)}</p>
                  </div>
                  <div>
                    <form
                      autoComplete="off"
                      className="px-20">
                      <div className="mt-6 mb-3">
                        <div className="mb-4">
                          <div>
                            <div className="input-otp border rounded-xl border-white-300">
                              <input
                                onChange={(e) => setOtp(e.target.value)}
                                type="text"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="------"
                                autoComplete="off"
                                className="text-center bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex flex-col">
                            <div className="relative w-full h-14 border rounded-xl border-white-300">
                              <input
                                placeholder="Nhập mật khẩu mới"
                                onChange={(e) => setNewPassword(e.target.value)}
                                name="password"
                                type={showNewPassword ? "text" : "password"}
                                className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                              />
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="cursor-pointer">
                                  {showNewPassword ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-eye-fill text-stone-50"
                                      viewBox="0 0 16 16">
                                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-eye-slash-fill text-stone-50"
                                      viewBox="0 0 16 16">
                                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="flex flex-col">
                            <div className="relative w-full h-14 border rounded-xl border-white-300">
                              <input
                                placeholder="Nhập lại mật khẩu mới"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                name="password"
                                type={showConfirmPassword ? "text" : "password"}
                                className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                              />
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="cursor-pointer">
                                  {showConfirmPassword ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-eye-fill text-stone-50"
                                      viewBox="0 0 16 16">
                                      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      fill="currentColor"
                                      className="bi bi-eye-slash-fill text-stone-50"
                                      viewBox="0 0 16 16">
                                      <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                      <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className="text-white-400 text-16-16 cursor-pointer mt-2">Bạn chưa nhận được OTP?</span>
                        <span
                          className={`text-waka-500 text-16-16 cursor-pointer mt-2 ${countdown > 0 || isResendLoading ? "disabled" : ""}`}
                          onClick={countdown > 0 || isResendLoading ? null : handleResetPass}>
                          {countdown > 0 ? `Gửi lại (${countdown}s)` : isResendLoading ? "Đang gửi..." : "Gửi lại"}
                        </span>
                      </div>
                      <div className="mt-5">
                        <button
                          onClick={handleVerifyOtpResetPass}
                          type="button"
                          className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer">
                          Xong
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isForgotPass && (
        <>
          <div
            className="v-modal"
            id="v-modal"
          />
          <div
            data-v-da1ecd7c=""
            className="el-dialog__wrapper"
            style={{ zIndex: 2001 }}>
            <div
              id="modal-login"
              className="fixed inset-0 z-[2001] overflow-auto">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog dialog-login"
                style={{ marginTop: "15vh", width: 500 }}>
                <div className="w-full h-full relative text-center p-[1.875rem]">
                  <div
                    className="absolute top-4 right-4"
                    onClick={onClose}>
                    <img
                      src="https://waka.vn/svgs/icon-close-white.svg"
                      alt="icon-close-white"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="mb-6">
                    <h1 className="text-2xl-26-26 mb-2 text-white-default">Quên mật khẩu</h1>
                    <p className="text-sm-15-19 text-white-50">Vui lòng nhập email để tiếp tục</p>
                  </div>
                  <div>
                    <form>
                      <div className="px-20">
                        <div className="mt-6 mb-3">
                          <div className="mb-3">
                            <div className="flex flex-col">
                              <div className="relative w-full h-14 border rounded-[.75rem] border-black-300 ">
                                <input
                                  onChange={(e) => setEmail(e.target.value)}
                                  type="email"
                                  placeholder={"Nhập email"}
                                  className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                />
                                {/**/}
                              </div>
                              {/*{errors.username && touched.username ? <div className="text-red-500">{errors.username}</div> : null}*/}
                            </div>

                            {/**/}
                          </div>
                        </div>

                        <div className="mt-5">
                          <button
                            onClick={handleResetPass}
                            className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer"
                            disabled={loading}>
                            {/*<span data-v-4e3aa8af="" className="">*/}
                            {/*                          Tiếp tục*/}
                            {/*                      </span>*/}
                            {loading ? (
                              <div className="flex items-center justify-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-3 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </div>
                            ) : (
                              "Tiếp tục"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {loading && <LoadingSpinner />}
      {isLoginFormOpen && (
        <>
          <div
            className="v-modal"
            id="v-modal"
          />
          <div
            data-v-da1ecd7c=""
            className="el-dialog__wrapper"
            style={{ zIndex: 2001 }}>
            <div
              id="modal-login"
              className="fixed inset-0 z-[2001] overflow-auto">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog dialog-login"
                style={{ marginTop: "15vh", width: 500 }}>
                <div className="w-full h-full relative text-center p-[1.875rem] pb-0">
                  <div
                    className="absolute top-4 right-4"
                    onClick={onClose}>
                    <img
                      src="https://waka.vn/svgs/icon-close-white.svg"
                      alt="icon-close-white"
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="mb-6">
                    <h1 className="text-[1.625rem] leading-[normal] mb-2 text-white">Đăng nhập</h1>
                    <p className="text-[.9375rem] leading-[1.1875rem] text-white">Chọn phương thức đăng nhập</p>
                  </div>
                  <div>
                    {/* Formik Form */}
                    <Formik
                      initialValues={{ username: "", password: "" }}
                      validationSchema={validationSchema}
                      onSubmit={handleLogin}>
                      {({ errors, touched }) => (
                        <Form className="col-span-1 px-8 border-white">
                          <h3 className="text-base text-white">Đăng nhập với mật khẩu</h3>
                          <div className="mt-6 mb-3">
                            <div className="mb-3">
                              <div className="flex flex-col mb-3">
                                <div className="relative w-full h-14 border rounded-xl border-white/30">
                                  <Field
                                    name="username"
                                    type="text"
                                    placeholder="Tên đăng nhập"
                                    className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                </div>
                                {errors.username && touched.username ? <div className="text-red-500">{errors.username}</div> : null}
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col">
                                <div className="relative w-full h-14 border rounded-xl border-white/30">
                                  <Field
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="cursor-pointer">
                                      {showPassword ? (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-eye-fill text-stone-50"
                                          viewBox="0 0 16 16">
                                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                                        </svg>
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          fill="currentColor"
                                          className="bi bi-eye-slash-fill text-stone-50"
                                          viewBox="0 0 16 16">
                                          <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                                          <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {errors.password && touched.password ? <div className="text-red-500">{errors.password}</div> : null}
                              </div>
                            </div>
                          </div>
                          <p
                            className="text-green-600 text-base text-right cursor-pointer"
                            onClick={handleForgotPass}>
                            Quên mật khẩu
                          </p>
                          <div className="mt-5">
                            <button
                              type="submit"
                              className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer">
                              Đăng nhập
                            </button>
                          </div>
                          <p className="text-sm text-white mt-6">Hoặc đăng nhập với</p>
                          <div className="flex items-center justify-center mt-6">
                            <div
                              onClick={handleGoogleLogin}
                              className="bg-[hsla(0,_0%,_100%,_.1)] py-3 text-white rounded-full px-8 flex items-center justify-center cursor-pointer w-full">
                              <img
                                src="https://waka.vn/svgs/icon-google.svg"
                                alt="icon-google"
                                className="cursor-pointer"
                              />
                              <span className="ml-2 text-center">Google</span>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="py-4 w-full mt-[1.875rem] border-t border-white/50 text-center">
                    <span className="text-sm text-white/50 pr-1">Bạn chưa có tài khoản?</span>
                    <span className="text-sm text-green-400 cursor-pointer">Đăng ký ngay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
     {isOtpModalOpen && (
        <>
          <div
            className="v-modal"
            id="v-modal"
          />
          <div
            data-v-da1ecd7c=""
            className="el-dialog__wrapper"
            style={{ zIndex: 2001 }}>
            <div
              id="modal-login"
              className="fixed inset-0 z-[2001] overflow-auto">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog dialog-login"
                style={{ marginTop: "15vh", width: 400 }}>
                <div className="flex justify-center">
                  {" "}
                  <div className="absolute top-4 right-4">
                    {" "}
                    <button
                      onClick={onClose}
                      // className="ms-3 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    >
                      <img
                        src="https://waka.vn/svgs/icon-close-white.svg"
                        alt="icon-close-white"
                        className="cursor-pointer"
                      />{" "}
                    </button>
                  </div>
                  <div className="max-w-md mx-auto text-center px-4 sm:px-8 py-10 rounded-xl shadow">
                    <header className="mb-8">
                      <h1 className="text-2xl font-bold mb-1 text-white ">Tài khoản của bạn vẫn chưa được xác thực.</h1>
                      <p className="text-[15px] text-slate-500">
                        Nhập mã OTP gồm {length} chữ số đã được gửi tới email: {unverifiedEmail}
                      </p>
                    </header>
                    <Formik
                      initialValues={{ otp: "" }}
                      validationSchema={otpValidationSchema}
                      onSubmit={handleVerifyOtp}>
                      {({ isSubmitting }) => (
                          <Form>
                            <div className="mb-4">
                              <div>
                                <div className="input-otp border rounded-xl border-white-300">
                                  <Field
                                      name="otp"
                                      type="text"
                                      pattern="[0-9]*"
                                      inputMode="numeric"
                                      maxLength={6}
                                      placeholder="------"
                                      autoComplete="off"
                                      className="text-center bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                </div>
                              </div>
                              <ErrorMessage name="otp" component="div" className="text-red-500 mt-1"/>
                            </div>
                          
                              <span className="text-white-400 text-16-16 cursor-pointer mt-2">
                                Bạn chưa nhận được OTP?
                              </span>
                              <span
                                className={`text-waka-500 text-16-16 cursor-pointer mt-2 ${countdown > 0 || isResendDisabled ? 'disabled' : ''}`}
                                onClick={countdown > 0 || isResendDisabled ? null : handleResendOtp}
                                >
                                {countdown > 0 ? `Gửi lại (${countdown}s)` : isResendDisabled ? 'Đang gửi...' : 'Gửi lại'}
                              </span>
                            
                            <div className="flex justify-between items-center">
                              <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer mt-4">
                                Xác minh
                              </button>
                            </div>
                            
                          </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {isForbiddenModalOpen && (
        <ForbiddenModal
          forbiddenStatus={forbiddenStatus}
          emailContact={emailContact}
          onClose={() => setIsForbiddenModalOpen(false)}
        />
      )}
      <ToastContainer />
    </>
  );
}
LoginModal.propTypes = {
  onClose: PropTypes.func,
};
