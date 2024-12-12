import React from "react";

const Compose = () => {
  return (
    <>
      <div className="header-wrap bg-white cls--container mx-auto">
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
              <span className="text-[0.9375rem] leading-[1.125rem] text-black -m-[0.25rem]">KÊNH CHO TÁC GIẢ</span>

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
                 
                </div>
              </div>
            </div>

            {/* Right Actions (Author, Notification, User Dropdown) */}
            <div className="header-top__right-action ml-16 cursor-pointer flex items-center space-x-6">
              {/* Become Author */}
              <a
                href="/authorChannel"
                className="flex items-center space-x-2 text-[#606266] text-[14px]"
              >
                <img
                  src="https://sangtac.waka.vn/svgs/icon-home-author.svg"
                  alt="Become Author"
                />
                <span>Trang chủ cộng đồng</span>
              </a>

              {/* Notification */}
           

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
      </div>
</div>
    </>
  )
}
export default Compose;