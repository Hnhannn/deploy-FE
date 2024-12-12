import React, { useState } from "react";
import PropTypes from "prop-types";
import { login } from "../../service/UserService";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập username"),
    password: Yup.string()
      .min(8, "Mật khẩu phải dài hơn 8 kí tự")
      .required("Mật khẩu không hợp lệ"),
  });

  const handleLogin = async (values) => {
    const { username, password } = values;
    console.log(values);
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res?.token) {
        const token = res.token;
        const decodedToken = jwtDecode(token);
        const status = decodedToken.status;
        const username = decodedToken.sub;
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
  return (
    <>
      <div className="w-full">
        <div
          className="w-full bg-[url(https://sangtac.waka.vn/images/bg-login-author.png)] bg-no-repeat"
          data-v-4849f283=""
        >
          <div
            className="pt-[130px] pb-[266px] flex justify-end"
            data-v-4849f283=""
          >
            <div
              className="bg-[#fff] w-full max-w-[344px] px-[24px] py-[30px] [box-shadow:0_11px_88px_rgba(0,_0,_0,_.11)] rounded-[12px] mr-[340px]"
              data-v-4849f283=""
            >
              <div className="w-full pb-[2.375rem]" data-v-4849f283="">
                <img
                  src="	https://sangtac.waka.vn/_nuxt/Logo_cong-dong-viet.png?v=1715134607306"
                  className="ml-auto mr-auto"
                  data-v-4849f283=""
                />
              </div>
              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ errors, touched, handleChange, handleBlur, values }) => (
                  <Form className="w-full">
                    {/* Username Input */}
                    <div className="flex flex-row items-center h-10 w-full rounded-full bg-gray-200 pl-3 pr-3 mb-3 last:mb-0 sm:pl-[1.125rem] sm:pr-[1.125rem]">
                      <div className="flex flex-1">
                        <input
                          name="username"
                          placeholder="Tên tài khoản / Email / Số điện thoại"
                          maxLength={40}
                          autoComplete="new-password"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.username}
                          className="h-full w-full border-none bg-transparent text-[0.875rem] leading-4 text-black"
                        />
                      </div>
                      {errors.username && touched.username && (
                        <div className="text-red-500">{errors.username}</div>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-row items-center h-10 w-full rounded-full bg-gray-200 pl-3 pr-3 mb-3 last:mb-0 sm:pl-[1.125rem] sm:pr-[1.125rem] relative">
                      <div className="flex flex-1">
                        <input
                          name="password"
                          placeholder="Mật khẩu"
                          maxLength={20}
                          autoComplete="new-password"
                          type={showPassword ? "text" : "password"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                          className="h-full w-full border-none bg-transparent text-black text-[0.875rem] leading-4"
                        />
                      </div>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="cursor-pointer"
                        >
                          {showPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-eye-fill text-stone-50"
                              viewBox="0 0 16 16"
                            >
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
                              viewBox="0 0 16 16"
                            >
                              <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                              <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                            </svg>
                          )}
                        </button>
                      </div>
                  
                      {errors.password && touched.password && (
                        <div className="text-red-500">{errors.password}</div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="bg-[linear-gradient(94.78deg,_#8CD25A_0%,_#5EA72F_100%)] rounded-full grid-center mt-4 opacity-60 cursor-pointer w-30 mx-auto">
                      <button
                        type="submit"
                        className="text-sm-14-16 uppercase text-white font-medium"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="w-full min-h-4 mt-3" data-v-4849f283=""></div>
              <div
                className="w-full mt-[1.125rem] flex flex-row items-center justify-between"
                data-v-4849f283=""
              >
                <span
                  className="text-[rgba(109,174,67,1)] text-sm-14-16 cursor-pointer"
                  data-v-4849f283=""
                >
                  Đăng ký ngay
                </span>
                <span
                  className="text-[rgba(109,174,67,1)] text-sm-14-16 cursor-pointer"
                  data-v-4849f283=""
                >
                  Quên mật khẩu
                </span>
              </div>{" "}
              <div
                className="w-full mt-[1.125rem] flex flex-col items-center"
                data-v-4849f283=""
              >
                <div className="w-full flex flex-row items-center">
                  <div className="flex flex-1 bg-[rgba(0,_0,_0,_0.09)] h-[0.0625rem]" />{" "}
                  <p className="text-[0.875rem] leading-4 ml-2.5 mr-2.5 text-[rgba(153,153,153,1)]">
                    Hoặc đăng nhập nhanh
                  </p>{" "}
                  <div className="flex flex-1 bg-[rgba(0,_0,_0,_0.09)] h-[0.0625rem]" />
                </div>{" "}
                <div className="w-full flex-row-center mt-4-5 justify-center">
                  <div className="w-10 h-10 mr-6">
                    <img
                      src="https://sangtac.waka.vn/svgs/icon-facebook.svg"
                      alt=""
                      className="w-full h-full cursor-pointer"
                    />
                  </div>{" "}
                  <div className="w-10 h-10">
                    <img
                      src="https://sangtac.waka.vn/svgs/icon-google.svg"
                      alt=""
                      className="w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>{" "}
            {/**/} {/**/}
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};
export default Signin;
