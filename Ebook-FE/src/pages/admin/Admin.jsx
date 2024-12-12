import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { login } from "../../service/UserService";
import { jwtDecode } from "jwt-decode";
import ForbiddenModal from "../../components/ForbiddenModal";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { useNavigate } from "react-router-dom";
const Admin = () => {
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
  const navigate = useNavigate();
  const length = 6;
  const emailContact = "vinhntpc07091@fpt.edu.vn";
  const API_SEND_OTP = "http://localhost:8080/api/otp/send";
  const API_VERIFY_OTP = "http://localhost:8080/api/otp/verify";
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const verifyToken = useCallback(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decodedToken.exp < currentTime) {
   
        localStorage.removeItem("token");
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      const scope = decodedToken.scope;
      const status = decodedToken.status;

      if (scope !== "ADMIN") {
        toast.error("Bạn không có quyền truy cập.");
        return;
      }

      switch (status) {
        case "ACTIVE":
  
          navigate("/admin/dashboard");
          break;
        case "BANNED":
        case "SUSPENDED":
          setForbiddenStatus(status);
          setIsForbiddenModalOpen(true);
          break;
        default:
          toast.error("Trạng thái tài khoản không hợp lệ.");
      }
    } catch (error) {
      localStorage.removeItem("token");
      toast.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.");
    }
  }, [navigate]);
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);
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
        const scope = decodedToken.scope;
        switch (scope) {
          case "ADMIN": {
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
                setLoading(true);
                navigate("/admin/dashboard");
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
            break;
          }
          case "CLIENT":
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
    setLoading(true);
    console.log("email when send", email);
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
  const handleClose = async () => {
    setIsOtpModalOpen(false);
    setIsLoginFormOpen(true);
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
        navigate("/admin/dashboard");
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
  }, [isResendDisabled, unverifiedEmail]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  return (
    <>
      {" "}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      <ToastContainer />{" "}
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
                  <div className="absolute top-4 right-4">
                    <button onClick={handleClose}>
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
                            <ErrorMessage
                              name="otp"
                              component="div"
                              className="text-red-500 mt-1"
                            />
                          </div>

                          <span className="text-white-400 text-16-16 cursor-pointer mt-2">Bạn chưa nhận được OTP?</span>
                          <span
                            className={`text-waka-500 text-16-16 cursor-pointer mt-2 ${countdown > 0 || isResendDisabled ? "disabled" : ""}`}
                            onClick={countdown > 0 || isResendDisabled ? null : handleResendOtp}>
                            {countdown > 0 ? `Gửi lại (${countdown}s)` : isResendDisabled ? "Đang gửi..." : "Gửi lại"}
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
      {isLoginFormOpen && (
        <div>
          <section className="bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div className="w-full  rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-center text-xl font-bold leading-tight tracking-tight  md:text-2xl text-white"> Đăng nhập</h1>
                  <Formik
                    initialValues={{ email: "", password: "", remember: false }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}>
                    {({ errors, touched }) => (
                      <Form className="space-y-4 md:space-y-6">
                        <div>
                          <div className="relative w-full h-14 border rounded-xl border-white/30">
                            <Field
                              name="username"
                              type="text"
                              placeholder="Tên đăng nhập"
                              className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                            />
                          </div>{" "}
                          {errors.username && touched.username ? <div className="text-red-500">{errors.username}</div> : null}
                        </div>
                        <div>
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
                        <button
                          type="submit"
                          className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer">
                          Đăng nhập
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}{" "}
      {isForbiddenModalOpen && (
        <ForbiddenModal
          forbiddenStatus={forbiddenStatus}
          emailContact={emailContact}
          onClose={() => setIsForbiddenModalOpen(false)}
        />
      )}
    </>
  );
};

export default Admin;
