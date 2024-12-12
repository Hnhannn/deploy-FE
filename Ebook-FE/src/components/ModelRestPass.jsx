import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { changePassword } from "../service/AuthService";

export default function ModelResetPass({ onClose, username }) {
  const [passwordVisible, setPasswordVisible] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    let errors = {};

    if (formData.oldPassword.length < 8) {
      errors.oldPassword = "Mật khẩu cũ phải có ít nhất 8 ký tự.";
      valid = false;
    }

    if (formData.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự.";
      valid = false;
    }

    if (formData.confirmPassword.length < 8) {
      errors.confirmPassword = "Xác nhận mật khẩu phải có ít nhất 8 ký tự.";
      valid = false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu mới và xác nhận mật khẩu không khớp.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (validateForm()) {
     try {
       const restPass = {
         username: username,
         oldPassword: formData.oldPassword,
         newPassword: formData.newPassword,
       };
       const response = await changePassword(restPass);
       toast.success("Đổi mật khẩu thành công", {
         autoClose: 1000,
         onClose: () => {
           onClose(); // Close the modal after the toast notification
         },
       });
     } catch (error) {
       console.error("Error changing password:", error);
       if (error.response && error.response.status === 401) {
         setErrors({ ...errors, oldPassword: "Mật khẩu cũ không đúng." });
       } else {
         setErrors({
           ...errors,
           oldPassword: "Đã xảy ra lỗi. Vui lòng thử lại.",
         });
       }
       toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
     }
   }
 };

  return (
    <>
      <div className="v-modal" id="v-modal" />;
      <div id="modal-login" className="fixed inset-0 z-[2001] overflow-auto">
        <div
          className="el-dialog dialog-login"
          style={{ marginTop: "15vh", width: 584 }}
        >
          <div className="el-dialog__body">
            <div className="w-full h-full relative text-center p-[1.875rem]">
              <div className="absolute top-4 right-4" onClick={onClose}>
                <img
                  src="https://waka.vn/svgs/icon-close-white.svg"
                  alt="icon-close-white"
                  className="cursor-pointer"
                />
              </div>
              <div className="px-20">
                <div className="mb-6">
                  <h1 className="text-[1.625rem] leading-[normal] mb-2 text-white-default">
                    Đổi mật khẩu
                  </h1>
                  <p className="text-[.9375rem] leading-none text-white-50">
                    Cập nhật thông tin dưới đây để đổi mật khẩu của bạn!
                  </p>
                </div>
                <div className="mt-6 mb-3">
                  {/* Nhập mật khẩu cũ */}
                  <div className={`${errors.oldPassword ? "mb-6" : "mb-4"}`}>
                    <div className="flex flex-col">
                      <div className="relative w-full h-14 border rounded-xl border-white/30">
                        <input
                          type={
                            passwordVisible.oldPassword ? "text" : "password"
                          }
                          name="oldPassword"
                          value={formData.oldPassword}
                          onChange={(e) => {
                            handleChange(e);
                            setErrors({ ...errors, oldPassword: "" });
                          }}
                          
                          placeholder="Mật khẩu cũ"
                          className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                        />
                        <div
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("oldPassword")
                          }
                        >
                          {!passwordVisible.oldPassword ? (
                            <img
                              src="https://waka.vn/svgs/hidden-eye.svg"
                              alt="Ẩn/hiện mật khẩu"
                            />
                          ) : (
                            <img
                              src="https://waka.vn/svgs/eye.svg"
                              alt="eye"
                              className="cursor-pointer"
                            />
                          )}
                        </div>
                        {errors.oldPassword && (
                          <p className="text-red-500 text-sm">
                            {errors.oldPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nhập mật khẩu mới */}
                  <div className={`${errors.oldPassword ? "mb-3" : "mb-4"}`}>
                    <div className="flex flex-col">
                      <div className="relative w-full h-14 border rounded-xl border-white/30">
                        <input
                          type={
                            passwordVisible.newPassword ? "text" : "password"
                          }
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={(e) => {
                            handleChange(e);
                            setErrors({ ...errors, newPassword: "" });
                          }}
                          placeholder="Mật khẩu mới"
                          className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                        />
                        <div
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                        >
                          {!passwordVisible.newPassword ? (
                            <img
                              src="https://waka.vn/svgs/hidden-eye.svg"
                              alt="Ẩn/hiện mật khẩu"
                            />
                          ) : (
                            <img
                              src="https://waka.vn/svgs/eye.svg"
                              alt="eye"
                              className="cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {errors.newPassword ? (
                      <p className="text-red-500 text-sm">
                        {errors.newPassword}
                      </p>
                    ) : (
                      formData.newPassword.length < 8 && (
                        <p className="text-white text-sm text-13-13 text-left mt-2">
                          Độ dài mật khẩu từ 8-20 ký tự
                        </p>
                      )
                    )}
                  </div>

                  {/* Nhập lại mật khẩu mới */}
                  <div className="mb-3">
                    <div className="flex flex-col">
                      <div className="relative w-full h-14 border rounded-xl border-white/30">
                        <input
                          type={
                            passwordVisible.confirmPassword
                              ? "text"
                              : "password"
                          }
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            handleChange(e);
                            setErrors({ ...errors, confirmPassword: "" });
                          }}
                          placeholder="Nhập lại mật khẩu mới"
                          className="bg-transparent w-full h-14 pt-4-5 px-3 text-white border-none rounded-xl border-white/30 focus:outline-none focus:ring-0"
                        />
                        <div
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                        >
                          {!passwordVisible.confirmPassword ? (
                            <img
                              src="https://waka.vn/svgs/hidden-eye.svg"
                              alt="Ẩn/hiện mật khẩu"
                            />
                          ) : (
                            <img
                              src="https://waka.vn/svgs/eye.svg"
                              alt="eye"
                              className="cursor-pointer"
                            />
                          )}
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={handleSubmit}
                    className="text-white-default text-16-16 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3  bg-waka-500"
                  >
                    <span>Xong</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
}
