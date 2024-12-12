import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { Badge } from "antd";
import { getUserFromToken, getUserByUsername } from "../service/AuthService";
import ModelSupport from "./ModelSupport";
import LoginModal from "./LoginModal";
import { MultiStepContext } from "./Form/StepContext";

function PackagePlans() {
  const [showPopoverCart, setShowPopoverCart] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPopoverProfile, setShowPopoverProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalSupport, setShowModalSupport] = useState(false);
  const { cartItems } = useContext(MultiStepContext);
  useEffect(() => {

    const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
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

    //verify the status of your login
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

    // Cleanup the event listener on component unmount
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
        window.location.href = "/";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <>
      <div>
        <div className="blur-layer-1 absolute top-[206px] right-1/2 z-0"></div>
        <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
        {/* header */}
        <header
          className={`w-full py-[11px] fixed top-0 left-0 z-50 bg-gradient-overlay ${
            isScrolled ? "bg-[rgba(18,18,20,0.8)]" : ""
          }`}
        >
          <div className="w-full px-14">
            <div className="flex justify-between gap-8">
              <div className="flex gap-12">
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
                <div className="flex flex-1 gap-x-6 flex-wrap">
                  <div className="">
                    <div className="py-2.5">
                      <span>
                        <span className="el-popover__reference-wrapper">
                          <p
                            className="font-medium text-base text-f2f cursor-pointer whitespace-nowrap hover:text-waka-500 el-popover__reference"
                            aria-describedby="el-popover-950"
                            tabIndex={0}
                          >
                            <a href="#" className="">
                              Gói hội viên
                            </a>
                          </p>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 gap-x-6 flex-wrap">
                  <div className="">
                    <div className="py-2.5">
                      <span>
                        <span className="el-popover__reference-wrapper">
                          <p
                            className="font-medium text-base text-f2f cursor-pointer whitespace-nowrap hover:text-waka-500 el-popover__reference"
                            aria-describedby="el-popover-950"
                            onClick={() => setShowModalSupport(true)}
                          >
                            Hỗ trợ
                          </p>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 h-fit items-center">
                <div className="flex flex-row items-center gap-6">
                  <div className="py-1 px-3">
                    <img
                      src="https://waka.vn/svgs/icon-search.svg"
                      alt="icon-search"
                      className="cursor-pointer min-w-6"
                    />
                  </div>
                  <Link to="/package-plans">
                    <div className="cursor-pointer bg-package border border-[#FC0] rounded-2xl px-2.5 py-[5.25px] bg-[rgba(255,204,0,0.16)] min-w-[92px] flex items-center">
                      <div className="w-4 h-4">
                        <img
                          src="https://waka.vn/svgs/icon-vip.svg"
                          alt="icon-vip"
                          className="cursor-pointer"
                        />
                      </div>
                      <p className="text-[13px] text-[#fc0] pl-[3px] whitespace-nowrap">
                        Mua hội viên
                      </p>
                    </div>
                  </Link>
                  {!isLoggedIn ? (
                    <div className="flex items-center gap-2 h-[42px]">
                      <button className="bg-[hsla(0,_0%,_100%,_.1)] border border-white-overlay py-2 px-4 rounded-full text-white-default text-16-16 button-secondary whitespace-nowrap py-2">
                        <span> Đăng ký</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="text-white py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-4 bg-green-500"
                      >
                        Đăng nhập
                      </button>
                      {showModal &&
                        createPortal(
                          <LoginModal onClose={() => setShowModal(false)} />,
                          document.body
                        )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-6 h-[42px]">
                      <div
                        onClick={() => setShowPopoverCart(!showPopoverCart)}
                        className="ml-2 mr-2"
                      >
                        <span className="el-popover__reference-wrapper">
                          {cartItems.length > 0 ? (
                            <Badge count={cartItems.length} showZero>
                              <i className="fa-solid fa-cart-shopping text-lg text-white"></i>
                            </Badge>
                          ) : (
                            <i className="fa-solid fa-cart-shopping text-lg text-white"></i>
                          )}
                        </span>
                      </div>

                      <div>
                        <span>
                          <span className="el-popover__reference-wrapper">
                            <div
                              className="flex items-center gap-1.5 el-popover__reference"
                              aria-describedby="el-popover-5442"
                            >
                              {user ? (
                                user.userSubscription[0] == null ? (
                                  <Link
                                    to="/profile"
                                    className="w-[42px] h-[42px] rounded-full min-w-[42px] overflow-hidden bg-[linear-gradient(90deg,_#ff0,_#fb3a1a)]"
                                  >
                                    <img
                                      src="https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
                                      alt="Profile Image"
                                      className="w-full h-full object-cover cursor-pointer"
                                      onMouseEnter={() =>
                                        setShowPopoverProfile(true)
                                      } // Hiển thị popover khi hover vào avatar
                                    />
                                  </Link>
                                ) : (
                                  <Link
                                    to="/profile"
                                    className="w-[42px] h-[42px] rounded-full min-w-[42px] flex items-center justify-center relative"
                                  >
                                    <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-red-500 p-[2px]">
                                      <div className="w-full h-full rounded-full bg-black p-[2px] relative">
                                        <img
                                          src={
                                            user.userImage
                                              ? user.userImage
                                              : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
                                          }
                                          alt="Profile Image"
                                          className="w-full h-full rounded-full object-cover cursor-pointer"
                                          onMouseEnter={() =>
                                            setShowPopoverProfile(true)
                                          }
                                        />
                                        <div className="absolute bottom-7 left-7 w-5 h-5 transform rotate-45">
                                          <img
                                            src="https://firebasestorage.googleapis.com/v0/b/ebookpage-836d8.appspot.com/o/file%2F1cc2b9fe-10a2-4148-a7b1-4c5f80ca4f2b?alt=media&token=bd6825e6-0ba7-40de-ac6a-7c1be6e1963f"
                                            alt="Smiley Face"
                                            className="w-full h-full"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                )
                              ) : (
                                // Hiển thị một thành phần khác nếu user là null
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
            </div>
          </div>
          {showPopoverProfile && (
            <div
              id="popover_profile"
              onMouseEnter={() => setShowPopoverProfile(true)} // Giữ popover hiển thị khi di chuột vào popover
              onMouseLeave={() => setShowPopoverProfile(false)} // Ẩn popover khi chuột rời khỏi popover
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
          {showPopoverCart && (
            <div>
              <PopoverCart cartItem={cartItems} />
            </div>
          )}
        </header>
      </div>
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

const PopoverCart = ({ cartItem = [] }) => {
  return (
    <div
      className="absolute z-20 top-14 right-36"
      style={{ transformOrigin: "center top", position: "fixed" }}
    >
      <div className="py-4 pl-4 pr-2 border-gray-300 rounded-xl bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="max-h-[66vh] overflow-hidden">
          <p className="font-semibold text-center text-[20px] text-white mb-4">
            <i className="fa-solid fa-cart-shopping text-lg text-white"></i> Giỏ
            hàng
          </p>
          {cartItem.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-4 overflow-y-auto max-h-[38vh]">
              <table>
                <tbody>
                  {cartItem.map((item, index) => (
                    <tr
                      key={index}
                      className="text-white-50 font-medium border-t border-[hsla(0,_0%,_100%,_.1)]"
                    >
                      <td className="py-4">
                        <Link
                          to={`/book-details/${item.book?.bookID}`}
                          className="flex items-center gap-4 pr-6"
                        >
                          <div className="w-[3rem] min-w-[3rem] h-[4rem] rounded-md bg-explore relative">
                            <img
                              src={
                                item.book?.bookImage ||
                                "/images/default-image.png"
                              }
                              className="absolute inset-0 rounded-md object-contain"
                              alt={item.book?.title}
                            />
                          </div>
                          <div>
                            <p className="t-ellipsis-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-[250px]">
                              {item.book?.title}
                            </p>
                            <p className="text-white-400 font-normal">
                              x {item.quantity}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="text-center pr-6">
                        {item.book?.price.toLocaleString("vi-VN") + " đ"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="w-full text-center h-[263px] appear flex items-center"
              data-v-15d6e969=""
            >
              <div className="w-full flex flex-col items-center">
                <img
                  src="https://waka.vn/svgs/icon-empty.svg"
                  alt="icon-empty"
                  className="cursor-pointer"
                />
                <p className="font-medium text-base text-white-50 pb-2 pt-6 ">
                  Bạn không có sản phẩm nào trong giỏ hàng
                </p>
              </div>
            </div>
          )}
          {/* Footer */}
          <div className="mt-4 flex justify-between items-center border-t border-[hsla(0,_0%,_100%,_.1)] pt-4">
            {cartItem.length < 0 ? (
              <p className="text-gray-500 font-medium">
                {cartItem.reduce((total, item) => total + item.quantity, 0)}{" "}
                Sách đã thêm vào giỏ
              </p>
            ) : (
              <p className="text-gray-500 font-medium"></p>
            )}
            <Link to={`/cart`}>
              <button className="bg-green-500 text-white py-2 px-4 rounded-xl">
                Xem giỏ hàng
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePlans;
