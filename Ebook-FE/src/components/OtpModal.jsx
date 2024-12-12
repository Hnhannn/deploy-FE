import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import { sendOtp, verify } from "../util/otpService";
import OtpInput from "react-otp-input";

export default function OtpModal({ otpEmail, onClose, token }) {
  const email = otpEmail;
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (code) => {
    const isVerified = await verify(otpEmail, code);
    if (isVerified) {
      localStorage.setItem("token", token);
    }
  };
  const handleResendOtp = useCallback(async () => {
    try {
      await sendOtp(email);

      setIsResendDisabled(true);
      setCountdown(90);

      const timer = setTimeout(() => {
        setIsResendDisabled(false);
        setCountdown(0);
      }, 90000);

      return () => clearTimeout(timer);
    } catch (error) {
      toast.error("Không thể gửi lại mã OTP, vui lòng thử lại sau!");
      console.log(error);
    }
  }, [email]);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);
  const handleChange = (otp) => {
    setOtp(otp);
    handleSubmit(otp);
  };

  return (
    <>
      <ToastContainer />
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
            style={{ marginTop: "15vh", width: 884 }}>
            <div className="flex justify-center">
              <div className="max-w-md mx-auto text-center px-4 sm:px-8 py-10 rounded-xl shadow">
                <header className="mb-8">
                  <h1 className="text-2xl font-bold mb-1 text-white ">Xác minh tài khoản</h1>
                  <p className="text-[15px] text-slate-500">
                    Nhập mã OTP gồm {length} chữ số đã được gửi tới email: {email}
                  </p>
                </header>
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  separator={<span style={{ width: "8px" }}></span>}
                  isInputNum={true}
                  shouldAutoFocus={true}
                  inputStyle={{
                    border: "1px solid transparent",
                    borderRadius: "8px",
                    width: "54px",
                    height: "54px",
                    fontSize: "12px",
                    color: "#000",
                    fontWeight: "400",
                    caretColor: "blue",
                  }}
                  focusStyle={{
                    border: "1px solid #CFD3DB",
                    outline: "none",
                  }}
                />
                <div className="text-sm text-slate-500 mt-4">
                  Không nhận được mã?
                  <button
                    className="font-medium text-indigo-500 hover:text-indigo-600"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled}>
                    {isResendDisabled ? `Gửi lại sau ${countdown}s` : "Gửi lại"}
                  </button>
                  <button
                    onClick={onClose}
                    className="ms-3 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

OtpModal.propTypes = {
  otpEmail: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
