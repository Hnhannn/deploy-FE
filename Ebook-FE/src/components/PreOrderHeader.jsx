import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { getUserFromToken, getUserByUsername } from "../service/AuthService";
import LoginModal from './LoginModal';
import ModelSupport from './ModelSupport';

function PreOrderHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopoverProfile, setShowPopoverProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalSupport, setShowModalSupport] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userFromToken = getUserFromToken(token);

    if (userFromToken) {
      getUserByUsername(userFromToken.sub)
        .then((userData) => {
          setUser(userData);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }

    if (token) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <>
      <header className={`flex fixed top-0 left-0 w-full px-14 items-center justify-between pt-[1.125rem] pb-[1.125rem] z-50 bg-[linear-gradient(180deg,_rgba(18,_18,_20,_.68),_transparent)]`}>
        <div className="flex items-center gap-x-6">
          <Link
            to="/"
            className="block py-2.5 nuxt-link-exact-active nuxt-link-active"
          >
            <img
              src="/images/21.png"
              alt="logo"
              className="cursor-pointer h-[36px] min-w-[106px]"
            />
          </Link>
          <div className="w-0.5 h-6 bg-[#d9d9d9]" />
          <h1 className="text-[26px] font-medium text-white-50">Thanh toán</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-row items-center gap-6">
            {/* Profile Avatar and Popover */}
            {!isLoggedIn ? (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="text-white py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-4 bg-green-500"
              >
                Đăng nhập
              </button>
            ) : (
              <div className="flex items-center gap-6 h-[42px]">
                <div className="ml-4">
                  <span>
                    <span className="el-popover__reference-wrapper">
                      <div
                        className="flex items-center gap-1.5 el-popover__reference"
                        aria-describedby="el-popover-5442"
                        tabIndex={0}
                      >
                        {user ? (
                          <Link to="/profile" className="w-[42px] h-[42px] rounded-full min-w-[42px] flex items-center justify-center">
                            <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-red-500 p-[2px]">
                              <div className="w-full h-full rounded-full bg-black p-[2px]">
                                <img
                                  src="https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
                                  alt="Profile"
                                  className="w-full h-full rounded-full object-cover cursor-pointer"
                                  onMouseEnter={() => setShowPopoverProfile(true)}  // Hover to show popover
                                />
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div>Loading...</div>
                        )}
                        <img
                          src="https://waka.vn/svgs/icon-triangle-down.svg"
                          alt="icon-triangle-down"
                          className="cursor-pointer"
                        />
                      </div>
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal đăng nhập */}
        {showModal && createPortal(<LoginModal onClose={() => setShowModal(false)} />, document.body)}

        {/* Popover Profile */}
        {showPopoverProfile && (
          <div
            id="popover_profile"
            onMouseEnter={() => setShowPopoverProfile(true)}
            onMouseLeave={() => setShowPopoverProfile(false)}
            className="absolute z-20 top-16 left-[1199px]"
          >
            <PopoverProfile
              logout={handleLogout}
              fullname={user.fullName}
              userSubscription={user.userSubscription}
              showModalSupport={() => setShowModalSupport(true)}
            />
          </div>
        )}

        {/* Modal hỗ trợ */}
        {showModalSupport && (
          <ModelSupport onClose={() => setShowModalSupport(false)} />
        )}
      </header>
    </>
  );
}

const PopoverProfile = ({
  logout,
  fullname,
  userSubscription,
  showModalSupport,
}) => {
  return (
    <div
      className="absolute z-20 top-16 left-[1199px]"
      style={{ transformOrigin: "center top", position: "fixed" }}
    >
      <div className="py-4 pl-4 pr-2 border-gray-300 rounded-xl bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="max-h-[66vh] pr-2">
          <div className="flex pb-4">
            <div className="flex flex-col pr-10 gap-2">
              <p className="font-medium text-[19px] text-white-default">
                {fullname}
              </p>
              <div className="flex gap-3">
                {userSubscription === null ? (
                  <div className="bg-white bg-opacity-60 rounded-full px-3 py-1 border border-white-overlay">
                    <p className="text-[13px] text-white-default">Gói thường</p>
                  </div>
                ) : (
                  <div className="border-[#FC0] bg-opacity-60 rounded-full px-3 py-1 border border-white-overlay flex items-center gap-2">
                    <p className="text-[13px] text-yellow-400">Hội viên</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden min-w-12">
              <img
                src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.avatar/0/0/34/17838/9133360.jpg?v=11&amp;w=200&amp;h=200"
                alt="Avatar"
                className="w-full h-full object-cover cursor-pointer"
              />
            </div>
          </div>
          {userSubscription === null ? (
            <div className="pb-2">
              <Link to="/package-plans">
                <button className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full  button-primary bg-green-500">
                  <span>Trở thành hội viên</span>
                </button>
              </Link>
            </div>
          ) : (
            <div></div>
          )}
          <div>
            <div className="flex p-2 items-center gap-3 hover:bg-[hsla(0,_0%,_100%,_.1)] rounded-xl cursor-pointer d-block">
              <div className="w-6 h-6">
                <img
                  src="https://waka.vn/svgs/icon-account.svg"
                  alt="icon-account"
                  className="cursor-pointer"
                ></img>
              </div>
              <p className="font-normal text-[15px] text-white-default ">
                Quản lý tài khoản
              </p>
            </div>
            <div className="flex p-2 items-center gap-3 hover:bg-[hsla(0,_0%,_100%,_.1)] rounded-xl cursor-pointer d-block">
              <div className="w-6 h-6">
                <img
                  src="https://waka.vn/svgs/icon-medal.svg"
                  alt="icon-account"
                  className="cursor-pointer"
                ></img>
              </div>
              <p className="font-normal text-[15px] text-white-default ">
                Thứ hạng đọc sách
              </p>
            </div>
            <Link to={`/transaction-histories`}>
              <div className="flex p-2 items-center gap-3 hover:bg-[hsla(0,_0%,_100%,_.1)] rounded-xl cursor-pointer d-block">
                <div className="w-6 h-6">
                  <img
                    src="https://waka.vn/svgs/icon-package-plan.svg"
                    alt="icon-account"
                    className="cursor-pointer"
                  ></img>
                </div>
                <p className="font-normal text-[15px] text-white-default ">
                  Lịch sử giao dịch
                </p>
              </div>
            </Link>
            <div className="flex p-2 items-center gap-3 hover:bg-[hsla(0,_0%,_100%,_.1)] rounded-xl cursor-pointer d-block">
              <div className="w-6 h-6">
                <img
                  src="https://waka.vn/svgs/icon-help.svg"
                  alt="icon-account"
                  className="cursor-pointer"
                ></img>
              </div>
              <p
                className="font-normal text-[15px] text-white-default "
                onClick={showModalSupport}
              >
                Hỗ trợ khách hàng
              </p>
            </div>
            <div className="flex p-2 items-center gap-3 hover:bg-[hsla(0,_0%,_100%,_.1)] rounded-xl cursor-pointer d-block">
              <div className="w-6 h-6">
                <img
                  src="https://waka.vn/svgs/icon-logout.svg"
                  alt="icon-account"
                  className="cursor-pointer"
                ></img>
              </div>
              <p
                className="font-normal text-[15px] text-white-default"
                onClick={logout}
              >
                Đăng xuất
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderHeader;
