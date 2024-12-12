import { useEffect, useState } from "react";
// import LeftAsider from "../components/LeftAsiderProfile";
// import { handleSubmit, handleSubmitLinks, handleSubmitFbName,  } from '/src/service/AuthService.jsx';
import {getUserFromToken,getUserByUsername}from '../../service/AuthService'
const Information = () => {
  
    // State variables to hold form data
    const [user, setUser] = useState({
      username: '',
      website_url: '',
      facebook_link: '',
      note: '',
      cccd: '',
      phone: '',
      email: '',
      profile_image: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  
    // Fetch the profile data from the backend when the component mounts
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch('/api/get-profile');
          const data = await response.json();
  
          if (response.ok) {
            setUser(data);
          } else {
            setError('Failed to load user data');
          }
        } catch (err) {
          setError('Server error');
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);
  
    // Handle input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/api/update-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
  
        if (response.ok) {
          alert('Profile updated successfully');
        } else {
          alert('Failed to update profile');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Error updating profile');
      }
    };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
  return (
    <>
    
      <div className="header-wrap bg-white cls--container mx-auto">
        <from onSubmit={handleSubmit}></from>
        <div className="header-content">
          <div className="header-top w-full max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between w-full pt-[18px]">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="nuxt-link-active">
                  <img
                    src="https://sangtac.waka.vn/_nuxt/Logo_cong-dong-viet.png?v=1715134607306"
                    alt="Logo"
                  />
                </a>
              </div>

              {/* Search Box (Input + Icon) */}
              <div className="search-box flex-grow px-4">
                <div className="header-search-box">
                  <div
                    aria-haspopup="listbox"
                    role="combobox"
                    aria-owns="el-autocomplete-3016"
                    className="el-autocomplete block"
                  >
                    <div className="relative flex items-center w-full">
                      {" "}
                      {/* Use flex to align input and icon */}
                      {/* Input */}
                      <input
                        type="text"
                        autoComplete="off"
                        valuekey="value"
                        popperclass="my-autocomplete"
                        placeholder="Nhập tên sách, tên tác giả"
                        fetchsuggestions="function () { [native code] }"
                        debounce={300}
                        placement="bottom-start"
                        popperappendtobody="true"
                        className="el-input__inner border border-[#e8e9e9] rounded-sm pr-4 flex-grow"
                        role="textbox"
                        aria-autocomplete="list"
                        aria-controls="id"
                        aria-activedescendant="el-autocomplete-3016-item--1"
                      />
                      {/* Search Icon */}
                      <button
                        type="button"
                        className="bg-[#6dae43] text-[#fff] p-0 w-[48px] h-[40px] rounded-tl-none rounded-bl-none flex items-center justify-center text-[18px] font-bold"
                      >
                        <i className="el-icon-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Actions (Author, Notification, User Dropdown) */}
              <div className="header-top__right-action ml-16 cursor-pointer flex items-center space-x-6">
                {/* Become Author */}
                <a
                  href="/"
                  className="flex items-center space-x-2 text-gray-500"
                >
                  <img
                    src="https://sangtac.waka.vn/_nuxt/upgrade-author.png?v=1715134397679"
                    alt="Become Author"
                  />
                  <span>Trở thành tác giả</span>
                </a>

                {/* Notification */}
                <div className="notification-box relative">
                  <span>
                    <div
                      role="tooltip"
                      id="el-popover-988"
                      aria-hidden="true"
                      className="absolute bg-white min-w-[150px] rounded border border-[#ebeef5] p-3 z-[2000] text-[#606266] leading-[1.4] text-justify text-sm shadow-lg break-words"
                      tabIndex={0}
                      style={{ width: 360, display: "none" }}
                    />
                    <span className="el-popover__reference-wrapper">
                      <img
                        src="https://sangtac.waka.vn/_nuxt/icon-noti.png?v=1715134397679"
                        className="icon-notification object-cover lazyLoad el-popover__reference isLoading"
                        aria-describedby="el-popover-988"
                        tabIndex={0}
                      />
                    </span>
                  </span>
                </div>

                {/* User Dropdown */}
                <div className="user-dropdown cursor-pointer">
                  <div className="inline-block relative text-[#606266] text-[14px]">
                    <span
                      className="el-dropdown-link el-dropdown-selfdefine"
                      aria-haspopup="list"
                      aria-controls="dropdown-menu-8446"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="w-max flex items-center space-x-2">
                        <div className="w-9 h-9 mr-2 rounded-full overflow-hidden">
                          <div className="overflow-hidden h-full w-full rounded-full">
                            <img
                              src="https://cdn.vegaid.vn/cU0spbfh3B/20241118041337/820/3ba/0a3/8203ba0a33ad2b6382f2f78870a6adb5.jpg"
                              alt=""
                              className="object-cover h-full w-full lazyLoad isLoaded"
                            />
                          </div>
                        </div>
                        <div className="w-max max-w-30">
                          <p className="text-sm text-black-222 truncate">
                            Võ Hoàng Nhân
                          </p>
                        </div>
                      </div>
                      <i className="el-icon-caret-bottom el-icon--right el-icon-caret-bottom-cdv-color" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative border-t-[1px_solid_#e8e9e9] [box-shadow:0_5px_5px_0_rgba(0,_0,_0,_.06)] mt-[20px]">
            <div className="header-menu__content max-w-screen-xl mx-auto">
              <ul
                role="menubar"
                className="el-menu-demo el-menu--horizontal el-menu flex space-x-6"
              >
                <li
                  role="menuitem"
                  aria-haspopup="true"
                  className="menu-item-category el-submenu"
                  tabIndex={0}
                >
                  <div
                    className="el-submenu__title flex items-center space-x-2"
                    style={{ borderBottomColor: "transparent" }}
                  >
                    <div className="menu-cate-box flex items-center space-x-2">
                      <span className="svg-wrap">
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 12H20M4 6H20M4 18H20"
                            stroke="#585858"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="menu-item-category-title">Thể loại</span>
                    </div>
                    <i className="el-submenu__icon-arrow el-icon-arrow-down" />
                  </div>
                </li>
                <li
                  role="menuitem"
                  tabIndex={0}
                  className="el-menu-item menu-item-all-novel"
                  style={{ borderBottomColor: "transparent" }}
                >
                  <a href="/storybook" className="">
                    Tất cả truyện
                  </a>
                </li>
                <li
                  role="menuitem"
                  tabIndex={0}
                  className="el-menu-item"
                  style={{ borderBottomColor: "transparent" }}
                >
                  <a href="/storybook?type=1" className="">
                    <span>Truyện dài</span>
                  </a>
                </li>
                <li
                  role="menuitem"
                  tabIndex={0}
                  className="el-menu-item"
                  style={{ borderBottomColor: "transparent" }}
                >
                  <a href="/storybook?type=2" className="">
                    <span>Truyện ngắn</span>
                  </a>
                </li>
                <li
                  role="menuitem"
                  tabIndex={0}
                  className="el-menu-item"
                  style={{
                    borderBottomColor: "transparent",
                    paddingTop: "15px",
                  }}
                >
                  <a href="/contest" className="">
                    <div className="bg-[linear-gradient(94.78deg,_#8CD25A_0%,_#5EA72F_100%)] rounded-md flex flex-nowrap pl-4 pr-2 h-7 text-white-default text-sm-15-18 leading-7 font-bold uppercase items-center">
                      <span
                        className="flex items-center"
                        style={{ marginTop: "2px" }}
                      >
                        Cuộc thi
                      </span>{" "}
                      <img
                        src="https://sangtac.waka.vn/images/landing-page/svg/libre-gui-pencil.svg"
                        alt=""
                        className="cursor-pointer ml-1 my-auto"
                        style={{ width: 14, height: 14 }}
                      />
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className=" max-w-screen-xl w-[1580px] py-2.5 mx-auto">
          <div className="w-full flex flex-row items-center">
            <div className="flex flex-row items-center mr-1.5 last:mr-0">
              <a
                href="/"
                className="text-xs-12-14 text-sm leading-4 font-normal nuxt-link-active text-[rgba(153,153,153,1)]"
              >
                Trang chủ
              </a>{" "}
              <img
                src="https://sangtac.waka.vn/svgs/triangle-right.svg"
                alt=""
                className="w-[0.375rem] h-[0.375rem] lg:w-2 lg:h-2 ml-[0.375rem]"
              />
            </div>
            <div className="flex flex-row items-center mr-1.5 last:mr-0">
              <a
                href="/profile/"
                aria-current="page"
                className="text-xs-12-14 lg:text-sm lg:leading-4 font-normal nuxt-link-exact-active nuxt-link-active text-[rgba(109,174,67,1)]"
              >
                Thông tin cá nhân
              </a>{" "}
              {/**/}
            </div>
          </div>{" "}
          <div className="w-full mt-[1.875rem] flex flex-row">
            <div className="w-[390px] bg-white rounded-xl">
              <div className="w-full flex flex-col items-center p-4 2xl:p-6 border-b border border-black/6">
                <div className="w-[12.5rem] h-[12.5rem]">
                  <div className="overflow-hidden w-full h-full rounded-full">
                    <img
                      src="https://cdn.vegaid.vn/cU0spbfh3B/20241118041337/820/3ba/0a3/8203ba0a33ad2b6382f2f78870a6adb5.jpg"
                      alt=""
                      className="object-cover h-full w-full lazyLoad isLoaded"
                    />
                  </div>
                </div>{" "}
                <h1 className="text-[1.5rem] leading-[1.85rem] text-center text-[rgba(34,34,34,1)] font-bold mt-3">
                  Võ Hoàng Nhân
                </h1>{" "}
                <a
                  href="/My_story"
                  className="w-max px-2-5 h-6 bg-cdv-15 grid place-items-center mt-3 text-[rgba(109,174,67,1)] text-[0.8125rem] leading-[1rem] rounded-full"
                >
                  Xem trang cá nhân
                </a>{" "}
                <div className="w-max mt-[1.125rem] justify-center flex flex-row items-center">
                  <div className="w-max mr-6 flex flex-col items-center">
                    <img
                      src="https://sangtac.waka.vn/svgs/icon-stories-read.svg"
                      alt=""
                      className="w-9 h-9 !cursor-default"
                    />{" "}
                    <p
                      className="text-sm leading-5 text-center"
                      style={{
                        color: "rgba(102, 102, 102, 1)",
                        marginTop: "0.5625rem",
                      }}
                    >
                      Số truyện đã đọc
                    </p>
                    <p
                      className="text-lg mt-2-25 font-bold"
                      style={{
                        color: "rgba(34, 34, 34, 1)",
                        fontSize: "1.125rem",
                        lineHeight: "1.3125rem",
                        marginTop: "0.5625rem",
                      }}
                    >
                      3 truyện
                    </p>
                  </div>{" "}
                  <div className="w-max flex flex-col items-center">
                    <img
                      src="https://sangtac.waka.vn/svgs/icon-stories-score.svg"
                      alt=""
                      className="w-9 h-9 !cursor-default"
                    />{" "}
                    <p
                      className="text-sm leading-5 text-center"
                      style={{
                        color: "rgba(102, 102, 102, 1)",
                        marginTop: "0.5625rem",
                      }}
                    >
                      Số điểm khả dụng
                    </p>
                    <p
                      className="text-lg mt-2-25 font-bold"
                      style={{
                        color: "rgba(34, 34, 34, 1)",
                        fontSize: "1.125rem",
                        lineHeight: "1.3125rem",
                        marginTop: "0.5625rem",
                      }}
                    >
                      317 điểm
                    </p>
                  </div>
                </div>
              </div>{" "}
              <div className="w-full flex flex-col px-5 py-4 2xl:px-7-5 2xl:py-6">
                <div className="w-full mb-[1.125rem] last:mb-0 flex flex-row items-center justify-between">
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-info.svg"
                    alt=""
                    className="w-6 h-6 mr-3"
                  />{" "}
                  <div className="flex flex-1">
                    <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold">
                      Thông tin cá nhân
                    </span>
                  </div>
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-view-more-active.svg"
                    alt=""
                    className="w-6 h-6 ml-3"
                  />
                </div>
                <div className="w-full mb-[1.125rem] last:mb-0 flex flex-row items-center justify-between">
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-setting.svg"
                    alt=""
                    className="w-6 h-6 mr-3"
                  />{" "}
                  <div className="flex flex-1">
                    <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold">
                      Cài đặt hiển thị
                    </span>
                  </div>{" "}
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-view-more.svg"
                    alt=""
                    className="w-6 h-6 ml-3"
                  />
                </div>
                <div className="w-full mb-[1.125rem] last:mb-0 flex flex-row items-center justify-between">
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-bookcase.svg"
                    alt=""
                    className="w-6 h-6 mr-3"
                  />{" "}
                  <div className="flex flex-1">
                    <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold">
                      Tủ sách
                    </span>
                  </div>{" "}
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-view-more.svg"
                    alt=""
                    className="w-6 h-6 ml-3"
                  />
                </div>
                <div className="w-full mb-[1.125rem] last:mb-0 flex flex-row items-center justify-between">
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-change-password.svg"
                    alt=""
                    className="w-6 h-6 mr-3"
                  />{" "}
                  <div className="flex flex-1">
                    <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold">
                      Thay đổi mật khẩu
                    </span>
                  </div>{" "}
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-view-more.svg"
                    alt=""
                    className="w-6 h-6 ml-3"
                  />
                </div>
                <div className="w-full mb-[1.125rem] last:mb-0 flex flex-row items-center justify-between">
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-logout.svg"
                    alt=""
                    className="w-6 h-6 mr-3"
                  />{" "}
                  <div className="flex flex-1">
                    <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold">
                      Đăng xuất
                    </span>
                  </div>{" "}
                  {/**/}
                </div>
              </div>
            </div>{" "}
            <div className="ml-10 2xl:ml-14 flex flex-1 flex-col">
              <div>
                <div className="w-full bg-white bg-opacity-100 rounded-xl pl-[1.875rem] pr-[1.875rem] pt-6 pb-6">
                  <div className="w-full">
                    <div className="w-full flex flex-row items-center">
                      <img
                        src="https://sangtac.waka.vn/svgs/icon-cdv.svg"
                        alt=""
                        className="w-6 h-6 mr-1.5"
                      />{" "}
                      <h3 className="text-[rgba(34,34,34,1)] font-bold text-2xl leading-[1.85rem]">
                        Tên tài khoản
                      </h3>
                    </div>{" "}
                    <div className="w-full mt-6 pl-[1.875rem]">
                      <div className="flex flex-row items-center">
                        <p className="text-[0.9375rem] leading-6 text-[rgba(102,102,102,1)]">
                        <b>{user.username}</b> (ID: 9133360)
                        </p>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="w-full mt-10">
                    <div className="w-full flex flex-row items-center">
                      
                      <img
                        src="https://sangtac.waka.vn/svgs/icon-cdv.svg"
                        alt=""
                        className="w-6 h-6 mr-1.5"
                      />{" "}
                                  
          
                      <h3 className="text-[rgba(34,34,34,1)] font-bold text-2xl leading-[1.85rem]">
                        Thông tin cá nhân
                      </h3>
                    </div>{" "}
                    <div className="w-full mt-6 pl-[1.875rem]">
                      <div className="w-full flex flex-row">
                        <div className="flex flex-1 flex-col mr-10 2xl:mr-22-5">
                          <div className="w-full flex flex-row">
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                Tên hiển thị
                              </p>
                              <p>{user.username}</p> 
                            </div>{" "}
                            <div className="flex flex-1 flex-col">
                              <input
                                onChange={handleInputChange}
                                name="username"
                                placeholder="Chưa có thông tin"
                                maxLength={55}
                                className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full w-full h-10"
                                value={user.username}
                              />{" "}
                              {/**/}
                            </div>
                          </div>{" "}
                          <div className="w-full mt-3 flex flex-row" onSubmit={handleSubmit}>
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                Link Website
                              </p>
                              
                            </div>{" "}
                            <div className="flex flex-1 flex-col">
                              <input 
                                value={user.website_url}
                                name="website_url"
                                onChange={handleInputChange}
                               
                                placeholder="Chưa có thông tin"
                                className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full w-full h-10"
                              />{" "}
                              {/**/}
                            </div>
                          </div>{" "}
                          <div className="w-full mt-3 flex flex-row" onSubmit={handleSubmitLinks} >
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                Facebook
                              </p>
                            </div>{" "}
                            <div className="flex flex-1 flex-col">
                              <input
                                name="facebook_link"
                                value={user.facebook_link}
                                onChange={handleInputChange}
                                placeholder="Chưa có thông tin"
                                className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full w-full h-10"
                              />{" "}
                              {/**/}
                            </div>
                          </div>{" "}
                          {/**/}{" "}
                          <div className="w-full mt-3 flex flex-row" onSubmit={handleSubmit}>
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                Giới thiệu
                              </p>
                            </div>{" "}
                            <div className="flex flex-1">
                              <div className="input-content placeholder-black-153 text-black-222 el-textarea">
                                <textarea
                                name="note"
                                value={user.note}
                                onChange={handleInputChange}
                                  
                                  autoComplete="off"
                                  maxLength={100}
                                  placeholder="Nhập lời giới thiệu về bản thân"
                                  className="el-textarea__inner"
                                  style={{ minHeight: 74, height: 74 }}
                                  defaultValue={""}
                                />
                                <span className="el-input__count">0/100</span>
                              </div>
                            </div>
                          </div>{" "}
                          <div className="w-full flex flex-row">
                            <div className="w-[8.75rem]" />{" "}
                            <div className="flex flex-1">{/**/}</div>
                          </div>{" "}
                          <div className="w-full mt-6 flex flex-row">
                            <div className="w-[8.75rem]" />{" "}
                            <div className="flex flex-1">
                              <button className="text-white uppercase text-sm leading-[1rem] bg-gradient-to-r from-[#8CD25A] to-[#5EA72F] rounded-full w-[7.5rem] h-10">
                                Lưu
                                {loading ? 'Loading...' : 'Get Links'}
                              </button>
                              {error && <div className="error">{error}</div>}
                            </div>
                          </div>
                        </div>{" "}
                        <div className="flex px-10 xl:px-12 2xl:px-17-5 flex-col items-center border-l border-black-6">
                          <div className="w-[6.25rem] h-[6.25rem]">
                            <div className="overflow-hidden w-full h-full rounded-full">
                              <img
                                src="https://cdn.vegaid.vn/cU0spbfh3B/20241118041337/820/3ba/0a3/8203ba0a33ad2b6382f2f78870a6adb5.jpg"
                                alt=""
                                className="object-cover wh-full lazyLoad isLoaded"
                              />
                            </div>
                          </div>{" "}
                          <div className="flex items-center 2xl:h-10 border-[rgba(109,174,67,1)] border rounded-full justify-center cursor-pointer w-[8.5rem] h-8 mt-[0.875rem]">
                            <img
                              src="https://sangtac.waka.vn/svgs/icon-add-follow.svg"
                              alt=""
                              className="w-3 h-3 mr-1.5"
                            />{" "}
                            <span className="text-[rgba(109,174,67,1)] uppercase text-sm leading-[1rem]">
                              Chọn ảnh
                            </span>
                          </div>{" "}
                          <p className="text-[rgba(153,153,153,1)] text-sm leading-[1rem] text-center w-44 mt-[0.875rem]">
                            Dung lượng file tối đa 1 MB Định dạng:.JPEG, .PNG
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="w-full mt-10">
                    <div className="w-full flex flex-row items-center">
                      <img
                        src="https://sangtac.waka.vn/svgs/icon-cdv.svg"
                        alt=""
                        className="w-6 h-6 mr-1.5"
                      />{" "}
                      <h3 className="text-[rgba(34,34,34,1)] font-bold text-2xl leading-[1.85rem]">
                        Thông tin khác
                      </h3>
                    </div>{" "}
                    <div className="w-full mt-6 pl-[1.875rem]">
                      <div className="w-full mb-3 flex flex-row">
                        <div className="flex flex-1 mr-10 2xl:mr-22-5 relative">
                          <div className="w-full overflow-hidden flex flex-row">
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                CCCD/Hộ chiếu
                              </p>
                            </div>{" "}
                            <div className="flex flex-1">
                              <input
                                disabled="disabled"
                                placeholder="Chưa có thông tin"
                                className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full w-full h-10"
                              />
                            </div>
                          </div>{" "}
                          <a
                            href="/profile/change-passport"
                            className="grid place-items-center text-white uppercase text-sm leading-[1rem] bg-gradient-to-r from-[#8CD25A] to-[#5EA72F] rounded-full w-[7.5rem] h-10  right-[-9.375rem] absolute"
                          >
                            Thay đổi
                          </a>
                        </div>{" "}
                        <div className="flex px-10 xl:px-12 2xl:px-17-5">
                          <div className="w-44" />
                        </div>
                      </div>
                      <div className="w-full mb-3 flex flex-row">
                        <div className="flex flex-1 mr-10 2xl:mr-22-5 relative">
                          <div className="w-full overflow-hidden flex flex-row">
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                Số điện thoại
                              </p>
                            </div>{" "}
                            <div className="flex flex-1">
                              <input
                                disabled="disabled"
                                placeholder="Chưa có thông tin"
                                className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full w-full h-10"
                              />
                            </div>
                          </div>{" "}
                          <a
                            href="/profile/change-mobile"
                            className="grid place-items-center text-white uppercase text-sm leading-[1rem] bg-gradient-to-r from-[#8CD25A] to-[#5EA72F] rounded-full w-[7.5rem] h-10  right-[-9.375rem] absolute"
                          >
                            Thay đổi
                          </a>
                        </div>{" "}
                        <div className="flex px-10 xl:px-12 2xl:px-17-5">
                          <div className="w-44" />
                        </div>
                      </div>
                      <div className="w-full mb-3 flex flex-row">
                        <div className="flex flex-1 mr-10 2xl:mr-22-5 relative">
                          <div className="w-full overflow-hidden flex flex-row">
                            <div className="w-[8.75rem] flex flex-row items-center h-10">
                              <p className="text-[rgba(102,102,102,1)] text-[0.9375rem] leading-[1.5rem]">
                                Email
                              </p>
                            </div>{" "}
                            <div className="flex flex-1">
                              <input
                                disabled="disabled"
                                placeholder="Chưa có thông tin"
                                className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full w-full h-10"
                              />
                            </div>
                          </div>{" "}
                          <a
                            href="/profile/change-email"
                            className="grid place-items-center text-white uppercase text-sm leading-[1rem] bg-gradient-to-r from-[#8CD25A] to-[#5EA72F] rounded-full w-[7.5rem] h-10  right-[-9.375rem] absolute"
                          >
                            Thay đổi
                          </a>
                        </div>{" "}
                        <div className="flex px-10 xl:px-12 2xl:px-17-5">
                          <div className="w-44" />
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <input
                    name="file"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Information;
