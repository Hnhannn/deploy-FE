import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ModelSupport from "./ModelSupport";
export function LeftAsiderProfile({ fullName, endDate, imgUser }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const location = useLocation();
  const currentUrl = location.pathname;
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <aside className="w-[300px] border-r border-slate-800 py-4 px-4">
      <div className="flex justify-between">
        <div className="profile-container">
          <h3 className="text-white-default text-lg-19-19">{fullName}</h3>
          {endDate ? (
            <p className="text-[.890rem] leading-normal text-white-300 mt-2">
              Hội viên hết hạn {formatDate(endDate)}
            </p>
          ) : (
            <p></p>
          )}
        </div>
        {endDate ? (
          <div className="w-[56px] h-[56px] rounded-full min-w-[56px] overflow-hidden bg-[linear-gradient(90deg,_#ff0,_#fb3a1a)]">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-red-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-black p-[2px]">
                <img
                  src={imgUser}
                  alt="Avatar of Võ Hoàng Nhân"
                  className="w-full h-full rounded-full object-cover cursor-pointer"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full overflow-hidden min-w-12">
            <img
              src={imgUser}
              alt="Avatar of Võ Hoàng Nhân"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        )}
      </div>
      {endDate ? (
        <div className="flex mt-5 space-x-3">
          <button className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full button-primary bg-gray-600 bg-opacity-55">
            <span>Xem gói cước</span>
          </button>
        </div>
      ) : (
        <div className="mt-5 flex items-center">
          <button className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full button-primary bg-green-700">
            <span>Trở thành thành viên</span>
          </button>
        </div>
      )}
      <div className="mt-4">
        <ul>
          <li
            className={
              currentUrl === "/profile"
                ? "p-2 mb-2 text-waka-500 bg-white-overlay rounded-xl"
                : "p-2 mb-2 text-white-50"
            }
          >
            <Link
              to={"/profile"}
              className="flex nuxt-link-active items-center"
            >
              <img
                src={
                  currentUrl === "/profile"
                    ? "https://waka.vn/svgs/icon-user-active.svg"
                    : "https://waka.vn/svgs/icon-user.svg"
                }
                alt="Quản lý tài khoản"
                className="cursor-pointer"
              />
              <span className="ml-3 text-sm-15-19">Quản lý tài khoản</span>
            </Link>
          </li>
          <li
            className={
              currentUrl === "/BookcaseProfile"
                ? "p-2 mb-2 text-waka-500 bg-white-overlay rounded-xl"
                : "p-2 mb-2 text-white-50"
            }
          >
            <Link to={"/BookcaseProfile"} className="flex items-center">
              <img
                src={
                  currentUrl === "/BookcaseProfile"
                    ? "https://waka.vn/svgs/icon-account-white-active.svg"
                    : "https://waka.vn/svgs/icon-account-white.svg"
                }
                alt="Tủ sách cá nhân"
                className="cursor-pointer"
              />
              <span className="ml-3 text-sm-15-19">Tủ sách cá nhân</span>
            </Link>
          </li>
          <li className="p-2 mb-2 text-white-50">
            <a href="/account/bookcase" className="flex items-center">
              <img
                src="https://waka.vn/svgs/icon-achievements-white.svg"
                alt="Thành tích"
                className="cursor-pointer"
              />
              <span className="ml-3 text-sm-15-19">Thành tích</span>
            </a>
          </li>
          <Link to={`/transaction-histories`}>
            <li
              className={
                currentUrl === "/transaction-histories"
                  ? "p-2 mb-2 text-waka-500 bg-white-overlay rounded-xl"
                  : "p-2 mb-2 text-white-50"
              }
            >
              <a href="/account/bookcase" className="flex items-center">
                <img
                  src={
                    currentUrl === "/transaction-histories"
                      ? "https://waka.vn/svgs/icon-history-white-active.svg"
                      : "https://waka.vn/svgs/icon-history-white.svg"
                  }
                  alt="Lịch sử giao dịch"
                  className="cursor-pointer"
                />
                <span className="ml-3 text-sm-15-19">Lịch sử giao dịch</span>
              </a>
            </li>
          </Link>
          <li className="p-2 mb-2 text-white-50">
            <a
              href="#"
              onClick={() => setIsModalVisible(!isModalVisible)}
              className="flex items-center"
            >
              <img
                src="https://waka.vn/svgs/icon-phone-white.svg"
                alt="Hỗ trợ khách hàng"
                className="cursor-pointer"
              />
              <span className="ml-3 text-sm-15-19">Hỗ trợ khách hàng</span>
            </a>
          </li>
        </ul>
      </div>
      {isModalVisible && (
        <ModelSupport onClose={() => setIsModalVisible(!isModalVisible)} />
      )}
    </aside>
  );
}

export default LeftAsiderProfile;
