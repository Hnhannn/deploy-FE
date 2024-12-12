// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Aside() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownUser, setDropdownUser] = useState(false);
  const [isDropdownStatistical, setDropdownStatistical] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdownUser = () => {
    setDropdownUser(!isDropdownUser);
  };

  return (
    <aside
      id="application-sidebar-brand"
      className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full  transform hidden xl:block xl:translate-x-0 xl:end-auto xl:bottom-0 fixed top-0 with-vertical h-screen z-[999] flex-shrink-0 text-white  bg-gray-800 left-sidebar   transition-all duration-300">
      {/* ---------------------------------- */}
      {/* Start Vertical Layout Sidebar */}
      {/* ---------------------------------- */}
      <div className="p-5 flex justify-center items-center">
        <a
          href="../"
          className="text-nowrap">
          <img
            src="/images/21.png"
            width={100}
            height={100}
            alt="Logo-Dark"
          />
        </a>
      </div>
      <div
        className="scroll-sidebar"
        data-simplebar="">
        <div className="px-6 mt-8">
          <nav className=" w-full flex flex-col sidebar-nav">
            <ul
              id="sidebarnav"
              className="text-white text-sm">
              <li className="text-xs font-bold pb-4">
                <i className="ti ti-dots nav-small-cap-icon text-lg hidden text-center" />
                <span>Trang chủ</span>
              </li>
              <li
                className="sidebar-item"
                onClick={() => setDropdownStatistical(!isDropdownStatistical)}
              >
                <Link
                  to="/admin/dashboard"
                  className="sidebar-link gap-3 py-2 px-3  rounded-md  w-full flex items-center hover:text-black hover:bg-green-800">
                  <i className="ti ti-layout-dashboard  text-xl" /> <span>Bảng điều khiển</span>
                </Link>
              </li>
              {isDropdownStatistical && (
                <ul className="ml-5 mt-2">
                  <li className="sidebar-item">
                    <Link
                      to="/admin/statistics"
                      className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                    >
                      <i className="fa-solid fa-chart-simple"></i>{" "}
                      <span>Thống kê</span>
                    </Link>
                  </li>
                </ul>
              )}
              <li className="text-xs font-bold mb-4 mt-8">
                <i className="ti ti-dots nav-small-cap-icon text-lg hidden text-center" />
                <span>Quản lý</span>
              </li>
              <li className="sidebar-item">
                <span
                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-500"
                  onClick={toggleDropdownUser}>
                  <i className="ti ti-article  text-xl" /> <span>Quản lý người dùng</span>
                </span>
                {isDropdownUser && (
                  <ul className="ml-5 mt-2">
                    <li className="sidebar-item">
                      <Link
                        to="/admin/users-admin"
                        className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-500">
                        <span>Quản lý người quản trị</span>
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link
                        to="/admin/users-client"
                        className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-500">
                        <span>Quản lý người dùng</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="sidebar-item">
                <span
                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-500"
                  onClick={toggleDropdown}>
                  <i className="ti ti-cards  text-xl" /> <span>Quản lý sách</span>
                </span>
                {/* Dropdown content */}
                {isDropdownOpen && (
                  <ul className="ml-5 mt-2">
                    <li className="sidebar-item">
                      <Link
                        to="/admin/book-add"

                        className="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                      >
                        <i className="fa-regular fa-books-medical"></i>
                        <span>Thêm sách</span>
                      </Link>
                    </li>
                    <li className="sidebar-item">
                      <Link
                        to="/admin/story-book"
                        className="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                      >
                        <i className="fa-solid fa-store"></i>
                        <span>Sách đã thêm</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="sidebar-item">
                <Link
                  to="/admin/author"
                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                >
                  <i className="fa-light fa-list"></i>
                  <span>Quản lý tác giả</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link
                  to="/admin/category"
                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                >
                  <i className="fa-light fa-list"></i>
                  <span>Quản lý thể loại</span>
                </Link>
              </li>
              <li className="sidebar-item">
                <Link
                  to="/admin/publisher"

                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                >
                  <i className="fa-light fa-list"></i>
                  <span>Quản lý nhà xuất bản</span>

                </Link>
              </li>
              <li className="sidebar-item">
                <Link
                  to="/admin/oder"

                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                >
                  <i className="fa-solid fa-box"></i>
                  <span>Quản lý đơn hàng</span>

                </Link>
              </li>
              <li className="sidebar-item">
                <Link
                  to="/admin/package"

                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                >
                  <i className="fa-brands fa-slack"></i>
                  <span>Quản lý gói cước</span>
                </Link>
              </li>
               <li className="sidebar-item">
                <Link
                  to="/admin/sliderShow"
                  className="sidebar-link gap-3 py-2 px-3  rounded-md w-full flex items-center hover:text-black hover:bg-green-800"
                >
                  <i className="fa-solid fa-rectangle-vertical-history"></i>
                  <span>Quản lý banner</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* </aside> */}
    </aside>
  );
}

export default Aside;
