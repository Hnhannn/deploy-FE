import { useEffect, useState, useRef } from "react";
import LeftAsider from "../components/LeftAsiderProfile";
import ModelRestPass from "../components/ModelRestPass";
import {
  getUserFromToken,
  getUserByUsername,
  updateProfile,
} from "../service/AuthService";
import { ImportDB } from "../Firebase/UploadConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // Để sinh ID duy nhất
import { message } from "antd";

function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("option1");
  const [imagePath, setImagePath] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [showModel, setShowModel] = useState(false);
  const [errors, setErrors] = useState({});
  const [checkError, setCheckError] = useState(false);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (user) {
      setImageSrc(
        user && user.userImage
          ? user.userImage
          : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
      );
      setGender(
        user.gender === true
          ? "option2"
          : user.gender === false
          ? "option3"
          : "option1"
      );
      setDateOfBirth(user.birthday);
    }
  }, [user]);

  const handleGenderChange = (e) => {
    const { value } = e.target;
    setGender(value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "Thông tin cá nhân";
    const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
    const userFromToken = getUserFromToken(token);
    if (userFromToken) {
      getUserByUsername(userFromToken.sub)
        .then((userData) => {
          setUser(userData);
          console.log("User data:", userData);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    } else {
      console.error("No user found from token");
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFullName(value);
    setCheckError(false);
    setErrors((prevErrors) => ({ ...prevErrors, fullName: "" }));
    if (value.length < 1 || value.length > 55) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Họ và tên phải có độ dài từ 1-55 ký tự",
      }));
      setCheckError(true);
    }
  };

  const handleUpdateProfile = async () => {
    if (user) {
      const userData = {
        userImage: imageSrc,
        fullName: fullName,
        gender: gender !== "option2" ? false : true,
        birthday: dateOfBirth,
      };

      try {
        const updatedUser = await updateProfile(user.userID, userData);
        message.success("Cập nhật thông tin thành công");
        setUser(updatedUser);
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  };

  const maskEmail = (email) => {
    if (!email) return "Loading...";
    const [localPart, domain] = email.split("@");
    const maskedLocalPart =
      localPart.slice(0, 6) + "******" + localPart.slice(-3);
    return `${maskedLocalPart}@${domain}`;
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);

      const uniquePath = `avatar/${uuidv4()}`; // Generate unique path
      const imgRef = ref(ImportDB, uniquePath); // Firebase Storage reference

      try {
        console.log("Uploading image...");
        await uploadBytes(imgRef, file);
        console.log("Image uploaded successfully.");
        const url = await getDownloadURL(imgRef);
        setImageSrc(url);
        setImagePath(uniquePath);
      } catch (error) {
        console.error("Error uploading image:", error.code, error.message);
      }
    }
  };

  const handleCancel = async () => {
    if (imagePath) {
      const imgRef = ref(ImportDB, imagePath); // Firebase Storage reference
      try {
        await deleteObject(imgRef);
        console.log("Image deleted successfully.");
        setImageSrc(
          user && user.userImage
            ? user.userImage
            : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
        );
        setImagePath(null); // Clear the image path
      } catch (error) {
        console.error("Error deleting image:", error.code, error.message);
      }
    }
    // Reset fields to their initial values
    setFullName(user ? user.fullName : "");
    setGender(
      user.gender === true
        ? "option2"
        : user.gender === false
        ? "option3"
        : "option1"
    );
    setDateOfBirth(user ? user.dateOfBirth : "");
  };

  return (
    <div>
      <div className="pt-[6.25rem] w-full mr-auto ml-auto pr-[3.75rem] pl-[3.75rem]">
        <div className="w-full flex relative h-full container">
          <LeftAsider
            fullName={user ? user.fullName : "Loading..."}
            endDate={user?.userSubscription[0]?.endDate || null}
            imgUser={
              user && user.userImage
                ? user.userImage
                : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
            }
          />
          <div className="account-content h-full pt-6">
            <div className="px-5">
              <h1 className="text-white-default text-[1.625rem] leading-[normal] font-medium mb-4">
                Quản lý thông tin
              </h1>
              <div className="mb-8 border-b border-slate-800">
                <div className="flex gap-6 py-3 tabs">
                  <div
                    className={`cursor-pointer flex items-center ${
                      activeTab === "personalInfo"
                        ? "text-waka-500"
                        : "text-white-300"
                    }`}
                    onClick={() => handleTabClick("personalInfo")}
                  >
                    <p className="font-medium text-[19px]">Thông tin cá nhân</p>
                  </div>
                  <div
                    className={`cursor-pointer flex items-center ${
                      activeTab === "accountSecurity"
                        ? "text-waka-500"
                        : "text-white-300"
                    }`}
                    onClick={() => handleTabClick("accountSecurity")}
                  >
                    <p className="font-medium text-[19px]">
                      Tài khoản và bảo mật
                    </p>
                  </div>
                </div>
              </div>
              {activeTab === "personalInfo" && (
                <div className="flex items-start max-w-[678px]">
                  <div className="mr-20 flex-1">
                    <div>
                      <div className="px-4 py-2 border border-slate-800 bg-white bg-opacity-10 rounded-xl mb-4">
                        <p className="text-white-300 text-13-13 mb-1">
                          Tên đăng nhập
                        </p>
                        <p className="text-white-50 text-15-15">
                          {user ? user.username : "Loading..."}
                        </p>
                      </div>
                      <div className="mb-4">
                        <div className="flex flex-col">
                          <div className="relative w-full h-14 border rounded-xl border-white-300">
                            <input
                              id="hs-floating-input-email"
                              className="peer p-4 block w-full rounded-lg text-sm 
  border-slate-800 bg-[rgba(18,18,19,255)] bg-opacity-10 
  [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 
  autofill:pt-6 autofill:pb-2"
                              value={fullName}
                              onChange={handleInputChange}
                            />
                            <label
                              htmlFor="hs-floating-input-email"
                              className="absolute top-0 left-0 p-4 h-full text-sm truncate pointer-events-none 
  transition ease-in-out duration-100 border border-transparent origin-[0_0]
  peer-disabled:opacity-50 peer-disabled:pointer-events-none 
  [&:not(:placeholder-shown)]:scale-90 [&:not(:placeholder-shown)]:translate-x-0.5 
  [&:not(:placeholder-shown)]:-translate-y-1.5 [&:not(:placeholder-shown)]:text-white-300"
                            >
                              Họ và Tên
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4">
                        <div className="col-span-1">
                          <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="bg-[rgba(18,18,19,255)] text-white border border-slate-800 rounded-lg px-3 py-2 w-full focus:outline-none h-[50px]"
                            style={{
                              appearance: "none",
                              backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20"%3E%3Cpath d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" /%3E%3C/svg%3E')`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 1rem center",
                              backgroundSize: "1rem",
                            }}
                          />
                        </div>
                        <div className="col-span-1">
                          <select
                            className="px-4 py-2 border border-slate-800 bg-[rgba(18,18,19,255)] rounded-xl mb-4 w-60 h-[50px]"
                            value={gender}
                            onChange={handleGenderChange}
                          >
                            <option value="option1">Khác</option>
                            <option value="option2">Nam</option>
                            <option value="option3">Nữ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                    <div className="pt-4 border-t border-slate-800 flex">
                      <button
                        onClick={handleUpdateProfile}
                        className={`text-16-16 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-4 py-2 text-16-16 text-white-default button-primary bg-green-500 ${
                          checkError ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={checkError}
                      >
                        <span>Cập nhật</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-white-overlay border border-slate-800 py-2 px-4 rounded-full text-white-default text-16-16 button-secondary whitespace-nowrap ml-4"
                      >
                        <span>Huỷ</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={imageSrc}
                      className="rounded-full w-24 h-24 object-cover"
                    />
                    <button
                      className="bg-white-overlay border border-white-overlay py-2 px-4 rounded-full text-white-default text-16-16 button-secondary whitespace-nowrap mt-4"
                      onClick={handleButtonClick}
                    >
                      <span>Thay ảnh</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              )}
              {activeTab === "accountSecurity" && (
                <>
                  <div className="pb-4 border-b border-white-overlay">
                    <div className="px-4 py-3 border border-white-overlay bg-white-overlay rounded-xl mb-4 max-w-98-5">
                      <p className="text-white-300 text-13-13 mb-1">Email</p>
                      <p className="text-white-50 text-15-15">
                        {user ? maskEmail(user.email) : "Loading..."}
                      </p>
                    </div>
                    <p className="text-waka-500 mt-2 text-13-13">Đã xác thực</p>
                  </div>
                  <div className="py-4 border-b border-white-overlay">
                    <div className="px-4 py-2 border border-white-overlay bg-white-overlay rounded-xl mb-2 max-w-98-5">
                      <p className="text-white-300 text-13-13 mb-1">Mật khẩu</p>
                      <p className="text-white-50 text-15-15">*********</p>
                    </div>
                    <button className="bg-white-overlay border border-white-overlay py-2 px-4 rounded-full text-white-default text-16-16 button-secondary whitespace-nowrap">
                      <span onClick={() => setShowModel(!showModel)}>
                        Đổi mật khẩu
                      </span>
                    </button>
                  </div>
                </>
              )}
              {showModel && (
                <ModelRestPass
                  username={user ? user.username : "Loading..."}
                  onClose={() => setShowModel(!showModel)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
