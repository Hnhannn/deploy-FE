import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import "./register.css";

Register.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default function Register({ onClose }) {
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  const length = 6;
  const [loading, setLoading] = useState(false);

  const SIGNUP_URL = "http://localhost:8080/user/signup-client";
  const API_SEND_OTP = "http://localhost:8080/api/otp/send";
  const API_VERIFY_OTP = "http://localhost:8080/api/otp/verify";

  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập username"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    password: Yup.string().min(6, "Mật khẩu bao gồm ít nhất 6 ký tự").required("Vui lòng nhập mật khẩu"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
      .required("Vui lòng xác nhận mật khẩu"),
  });
  const otpValidationSchema = Yup.object().shape({
    otp: Yup.string().length(length, `OTP phải gồm ${length} chữ số`).matches(/^\d+$/, "OTP chỉ được chứa chữ số").required("Vui lòng nhập OTP"),
  });

  const handleSubmit = async (values) => {
    const { username, email, password } = values;
    const dataToSubmit = { username, email, password };
    console.log("Form values:", values);

    try {
      await toast.promise(axios.post(SIGNUP_URL, dataToSubmit), {
        pending: "Đang đăng ký tài khoản của bạn...",
        success: "Đăng ký thành công! Đang chuyển tới trang xác minh.",
        error: "Có lỗi xảy ra trong qua trình đăng ký, vui lòng thử lại sau!",
      });
      console.log("email", email);
      setUnverifiedEmail(email);
      handleSendOtp(email);
      setIsRegisterFormOpen(false);
      setIsOtpModalOpen(true);
    } catch (error) {
      console.error("Error during signup:", error);
      handleError(error);
    }
  };

  function handleError(error) {
    if ((error.response && error.response.status === 400) || (error.response && error.response.status === 500)) {
      const errorMessage = typeof error.response.data === "string" ? error.response.data.split() : error.response.data;
      console.log("Error message:", errorMessage);
    } else {
      const errorMessage = "Lỗi: " + (error.response?.data || error.message);
      toast.error(errorMessage);
    }
  }
 
  const handleSendOtp = async (email) => {
    setLoading(true);
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
      const response = await axios.post(API_VERIFY_OTP, { email: unverifiedEmail, otpCode: otpParse });
      if (response.status === 200) {
        toast.success("Xác thực mã thành công!");
        setIsOtpModalOpen(false);
        navigate("/");
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
      setIsResendDisabled(false); // Bật lại nút gửi lại khi đếm ngược kết thúc
    }
  }, [countdown]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />{" "}
      {loading && <LoadingSpinner />}
      {isRegisterFormOpen && (
        <>
          {/* <!--Signup --> */}
          <div
            className="v-modal"
            id="v-modal"
          />
          <div
            data-v-da1ecd7c=""
            className="el-dialog__wrapper"
            style={{ zIndex: 2001 }}>
            <div
              id="popup-signup"
              tabIndex="-1"
              className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full inset-0 max-h-lg">
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog  dialog dialog-login"
                style={{ marginTop: "15vh", width: "584px" }}>
                <div className="el-dialog__header">
                  <span className="el-dialog__title"></span>
                </div>
                <div className="el-dialog__body">
                  <div className="w-full relative text-center p-7-5 pb-0">
                    <button
                      className="absolute top-4 right-4"
                      onClick={onClose}>
                      <img
                        src="https://waka.vn/svgs/icon-close-white.svg"
                        alt="icon-close-white"
                        className="cursor-pointer"
                      />
                    </button>
                    <div className="mb-6">
                      <h1 className="text-2xl-26-26 mb-2 text-white-default">Đăng ký tài khoản</h1>
                      <p className="text-sm-15-19 text-white-50">Đăng ký để mua và theo dõi quá trình đọc sách</p>
                    </div>
                    <div className="px-20">
                      <Formik
                        initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize>
                        {({ isSubmitting }) => (
                          <Form className="mb-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="border rounded-xl border-white/30">
                                  <Field
                                    name="username"
                                    type="text"
                                    placeholder="Tên người dùng"
                                    className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                </div>
                                <ErrorMessage
                                  name="username"
                                  component="div"
                                  className="text-red-500 mt-1"
                                />
                              </div>
                              <div>
                                <div className="border rounded-xl border-white/30">
                                  <Field
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                </div>
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="text-red-500 mt-1"
                                />
                              </div>
                              <div>
                                <div className="border rounded-xl border-white/30">
                                  <Field
                                    name="password"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                </div>
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="text-red-500 mt-1"
                                />
                              </div>

                              <div>
                                <div className="border rounded-xl border-white/30">
                                  <Field
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                                  />
                                </div>

                                <ErrorMessage
                                  name="confirmPassword"
                                  component="div"
                                  className="text-red-500 mt-1"
                                />
                              </div>
                            </div>
                            <div className="mt-5">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer">
                                Đăng ký
                              </button>
                            </div>
                            <p className="text-sm-15-19 text-white-50 mt-6">Hoặc đăng ký với</p>
                            <div className="flex items-center justify-center gap-x-2 mt-6">
                              <div className="bg-[hsla(0,_0%,_100%,_.1)] py-3 text-white rounded-full px-8 flex items-center justify-center cursor-pointer w-full">
                                <img
                                  src="https://waka.vn/svgs/icon-google.svg"
                                  alt="icon-google"
                                  className="cursor-pointer"
                                />
                                <span className="ml-2 text-center">Google</span>
                              </div>
                            </div>
                            <div className="mt-6">
                              <p className="text-white-300 pr-1">
                                Bằng việc nhấn “Đăng ký”, bạn đã đọc và đồng ý với
                                <a
                                  href="https://ebook.waka.vn/thoa-thuan-su-dung-dich-vu-waka"
                                  target="_blank"
                                  className="font-bold px-1">
                                  điều kiện
                                </a>
                                và
                                <a
                                  href="https://ebook.waka.vn/thoa-thuan-su-dung-dich-vu-waka"
                                  target="_blank"
                                  className="font-bold px-1">
                                  điều khoản
                                </a>
                                của Yuki
                              </p>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="py-4 w-full mt-7-5 border-t border-white-overlay text-center rounded-bl-[20px] rounded-br-[20px]">
                      <span className="text-sm-15-19 mr-3 text-white-50">Bạn đã có tài khoản?</span>
                      <span className="text-sm-15-19 text-waka-500 cursor-pointer">Đăng nhập ngay</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--Signup --> */}{" "}
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
    </>
  );
}
