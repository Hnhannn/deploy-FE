import { Formik, Field, Form } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";

const LoginForm = ({ handleLogin, showPassword, setShowPassword }) => {
  const validationSchema = Yup.object({
    username: Yup.string().required("Vui lòng nhập username"),
    password: Yup.string().min(8, "Mật khẩu phải dài hơn 8 kí tự").required("Mật khẩu không hợp lệ"),
  });
  return (
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
            style={{ marginTop: "15vh", width: 884 }}>
            <div className="w-full h-full relative text-center p-[1.875rem] pb-0">
              <div className="absolute top-4 right-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[.9375rem] leading-[1.1875rem] text-white">Trải nghiệm app WAKA ngay!</h3>
                  <div className="flex items-center justify-center my-8 p-2 border w-52 h-52 rounded-xl mx-auto relative border-green-500">
                    <img
                      alt="qr-code"
                      src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAPUAAAD1AQMAAACyfyEmAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAChElEQVRYhe2YsbGzMBCEjyFQSAnqxDTGDMy4MbsTSiBUwHD/7or34PkvQBeYABs+BUK63buT2ff6Xk2vwd0Pm7Ifw27+xpONW48fX2Jw/Dw46GX9aqM/z38CEfjTy2NYMH88pPc2WcGgFZ8TiNvEpV1yevtu6Rii8WHP+Ntz5LyW7v/va8i1/881ISBzMUaqg3/ER0NO/YCXx/32oa+GvA7CrvvWr+nAIv8ubQjOrafhWLfNRHjs8FjGLQaH1zAgvXSbZUaCF77DoBhc8Ul9w3+yv2jiTpM8LAj3FYZteIsJgyO/UN9QegxuMmxfy+k/fbUjjFxi8NmZVeA60A9HOpa753ALwZH6EJW7ybqhpFlKWpluQnCub11k7v+BQYnxmfxHX4054pPzz3jL1CwRIclc+g7AO6Q+vYAJTZZejAmPwpVapO9Z+kFoQjo3f2/MIRje8EJF2G6SDj4iBjdllSVLOjIhBMFkt/qhLWetStdObE3gRND3yHC46v+2HBuu1kmljZxIdombxeDGqp8ih6rTi3Iafc/uQfhwNiTUN0yIQYpMwyAIwmvD6bIeOTntyO79Z1uuhh1/mPVQKe5sVxZ+UwzOqDRmPbbGWu6aCa/4bcxn1YK5diUdRF50+4ne5pxzZcGq0sZMQWoZldgSgmPWNfWNtT7ca34uXRBOf2QtqK4k8UvE1RNE4NKKikQdcg2f+9+a10Hcf8y/uk6nz9li8Hr+of7prL/q+dY7Cl/YH6s1UX/sOi681Tet+Xk+KGuslZjKxWvpA3C+RVRSSehUjlrOBuI1yUwsYmt+vvr35nzR+SWth00enDKxCf0bny35eX7JF1lTr5W2B+Hf63s1u/4B9LhAieVKXhAAAAAASUVORK5CYII="
                      className="max-w-[190px]"
                    />
                  </div>
                  <div className="px-12">
                    <p className="text-center text-sm text-white mb-6">Bạn vui lòng quét mã QR để thực hiện cài app và trải nghiệm những tính năng dành riêng cho app nhé!</p>
                  </div>
                </div>
                {/* Formik Form */}
                <Formik
                  initialValues={{ username: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}>
                  {({ errors, touched }) => (
                    <Form className="col-span-1 px-8 border-l border-white">
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
                      <p className="text-green-600 text-base text-right cursor-pointer">Quên mật khẩu</p>
                      <div className="mt-5">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-full bg-green-500 text-white cursor-pointer">
                          Đăng nhập
                        </button>
                      </div>
                      <p className="text-sm text-white mt-6">Hoặc đăng nhập với</p>
                      <div className="flex items-center justify-center gap-2 mt-6">
                        <div className="bg-[hsla(0,_0%,_100%,_.1)] py-3 text-white rounded-full px-8 flex items-center cursor-pointer">
                          <img
                            src="https://waka.vn/svgs/icon-facebook.svg"
                            alt="icon-facebook"
                            className="cursor-pointer"
                          />
                          <span className="ml-2">Facebook</span>
                        </div>
                        <div className="bg-[hsla(0,_0%,_100%,_.1)] py-3 text-white rounded-full px-8 flex items-center cursor-pointer">
                          <img
                            src="https://waka.vn/svgs/icon-google.svg"
                            alt="icon-google"
                            className="cursor-pointer"
                          />
                          <span className="ml-2">Google</span>
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
  );
};
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
};
export default LoginForm;
