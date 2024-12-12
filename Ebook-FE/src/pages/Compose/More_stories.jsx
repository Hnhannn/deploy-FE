import React from "react";

const More_stories = () => {
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
      <div data-v-5fd22e1e="" className="container mt-12-5 mb-11 mx-auto">
  <div
    data-v-5fd22e1e=""
    className="el-row"
    style={{ marginLeft: "-25px", marginRight: "-25px" }}
  >
    <div
      data-v-5fd22e1e=""
      className="el-col el-col-6"
      style={{ paddingLeft: 25, paddingRight: 25 }}
    >
      <div data-v-5fd22e1e="" className="bg-white rounded-xl pt-6">
        <div data-v-5fd22e1e="" className="text-center">
          <div data-v-5fd22e1e="" className="author-avatar w-50 h-50 mx-auto">
            <img
              data-v-5fd22e1e=""
              src="https://cdn.vegaid.vn/cU0spbfh3B/20241118041337/820/3ba/0a3/8203ba0a33ad2b6382f2f78870a6adb5.jpg"
              className="overflow-hidden w-full h-full rounded-full"
            />
          </div>{" "}
          <div data-v-5fd22e1e="" className="author-name pt-3">
            <a data-v-5fd22e1e="" href="/" className="nuxt-link-active">
              <span data-v-5fd22e1e="" className="text-black font-bold">
                Võ Hoàng Nhân
              </span>
            </a>
          </div>
        </div>{" "}
        <div data-v-5fd22e1e="" className="p-7-5">
          <div data-v-5fd22e1e="" className="mb-4 last:mb-0 text-back-222">
            <div
              data-v-5fd22e1e=""
              className="flex align-center justify-between hover:text-cdv"
            >
              <div
                data-v-5fd22e1e=""
                className="flex-row-center cursor-pointer"
              >
                <img
                  data-v-5fd22e1e=""
                  src="https://sangtac.waka.vn/svgs/icon-author-file.svg"
                  alt=""
                  className="w-6 h-6 mr-3"
                />{" "}
                <span data-v-5fd22e1e="" className="text-[15px] text-black">
                  Hồ sơ tác giả
                </span>
              </div>{" "}
              <img
                data-v-5fd22e1e=""
                src="https://sangtac.waka.vn/svgs/icon-more.svg"
                alt=""
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>
          <div data-v-5fd22e1e="" className="mb-4 last:mb-0 text-cdv">
            <div
              data-v-5fd22e1e=""
              className="flex align-center justify-between hover:text-cdv"
            >
              <div
                data-v-5fd22e1e=""
                className="flex-row-center cursor-pointer"
              >
                <img
                  data-v-5fd22e1e=""
                  src="https://sangtac.waka.vn/svgs/icon-my-story.svg"
                  alt=""
                  className="w-6 h-6 mr-3"
                />{" "}
                <span data-v-5fd22e1e="" className="text-[15px] text-black">
                  Truyện của tôi
                </span>
              </div>{" "}
              <img
                data-v-5fd22e1e=""
                src="https://sangtac.waka.vn/svgs/icon-more.svg"
                alt=""
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>
          <div data-v-5fd22e1e="" className="mb-4 last:mb-0 text-back-222">
            <div
              data-v-5fd22e1e=""
              className="flex align-center justify-between hover:text-cdv"
            >
              <div
                data-v-5fd22e1e=""
                className="flex-row-center cursor-pointer"
              >
                <img
                  data-v-5fd22e1e=""
                  src="https://sangtac.waka.vn/svgs/icon-logout.svg"
                  alt=""
                  className="w-6 h-6 mr-3"
                />{" "}
                <span data-v-5fd22e1e="" className="text-[15px] text-black">
                  Đăng xuất
                </span>
              </div>{" "}
              <img
                data-v-5fd22e1e=""
                src="https://sangtac.waka.vn/svgs/icon-more.svg"
                alt=""
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>{" "}
    <div
      data-v-5fd22e1e=""
      className="float-left box-border w-3/4"
      style={{ paddingLeft: 25, paddingRight: 25 }}
    >
      <div
        data-v-5fd22e1e=""
        className="w-full bg-white bg-opacity-100 rounded-xl pl-[1.875rem] pr-[1.875rem] pt-6 pb-6"
        user-info="[object Object]"
      >
        <div className="w-full">
          <div data-v-79e14ec5="" className="relative h-24">
            <div
              data-v-79e14ec5=""
              className="flex items-center justify-center"
            >
          <div class="flex flex-col items-center">
                <div class="w-[3.75rem] h-[3.75rem] flex items-center justify-center rounded-full border-[3px] text-[1.5rem] leading-8 bg-[rgba(109,174,67,.15)] text-green-600">
                    <span>1</span>
                </div>
                <span class="mt-2 text-gray-500">
                    Thông tin truyện
                </span>
                </div>
                     <div
                data-v-79e14ec5=""
                className="flex items-center justify-center"
              >
                <div data-v-79e14ec5="" className="w-[150px] h-1 bg-[rgba(109,174,67,1)]" />
              </div>{" "}
              <div data-v-79e14ec5="">
                <div
                  data-v-79e14ec5=""
                  className="w-[3.75rem] h-[3.75rem] flex items-center justify-center rounded-full border-[3px] text-[1.5rem] leading-8 text-gray-500 text-[rgba(153,153,153,1)]"
                >
                  <span data-v-79e14ec5="">2</span> {/**/}
                </div>{" "}
                <span
                  data-v-79e14ec5=""
                  className="absolute w-18 left-105 bottom-0  text-gray-500"
                >
                  Nội dung
                </span>
              </div>{" "}
              <div
                data-v-79e14ec5=""
                className="flex items-center justify-center"
              >
                <div data-v-79e14ec5="" className="w-[150px] h-1 bg-[rgba(153,153,153,1)]" />
              </div>{" "}
              <div data-v-79e14ec5="">
                <div
                  data-v-79e14ec5=""
                  className="w-[3.75rem] h-[3.75rem] flex items-center justify-center rounded-full border-[3px] text-[1.5rem] leading-8 text-gray-500 text-[rgba(153,153,153,1)]"
                >
                  <span data-v-79e14ec5="">3</span> {/**/}
                </div>{" "}
                <span
                  data-v-79e14ec5=""
                  className="absolute w-22 left-165 bottom-0 text-gray-500"
                >
                  Đăng truyện
                </span>
              </div>{" "}
              <div
                data-v-79e14ec5=""
                className="flex items-center justify-center"
              >
                <div data-v-79e14ec5="" className="w-[150px] h-1 bg-[rgba(153,153,153,1)]" />
              </div>{" "}
              <div data-v-79e14ec5="">
                <div
                  data-v-79e14ec5=""
                  className="w-[3.75rem] h-[3.75rem] flex items-center justify-center rounded-full border-[3px] text-[1.5rem] leading-8 text-gray-500 text-[rgba(153,153,153,1)]"
                >
                  <span data-v-79e14ec5="">4</span> {/**/}
                </div>{" "}
                <span
                  data-v-79e14ec5=""
                  className="absolute w-25 left-215 bottom-0 text-gray-500"
                >
                  Hoàn Thành
                </span>
              </div>
            </div>
          </div>{" "}
          {/**/}{" "}
          <div className="w-full mt-10">
            <div className="w-full flex flex-row overflow-auto">
              <div className="flex flex-col items-center">
                <div className="w-80 h-[29.25rem] bg-[rgba(241,241,241,1)]">{/**/}</div>{" "}
                <span className="w-full block text-[0.875rem] leading-5 font-medium text-latse-7001 text-[rgba(255,59,48,1)] mt-3 text-left" />{" "}
                <div className="max-w-[10.125rem] w-[10.125rem] mt-4 h-8 [@media(min-width:1580px)]:h-10 border border-[rgba(109,174,67,1)] rounded-full flex flex-row items-center justify-center cursor-pointer">
                  <input
                    name="file"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />{" "}
                  <img
                    src="https://sangtac.waka.vn/svgs/icon-add-follow.svg"
                    alt=""
                    className="w-3 h-3 mr-1-5"
                  />{" "}
                  <span className="text-[0.875rem] leading-[1.125rem] text-[rgba(109,174,67,1)] uppercase">
                    Chọn ảnh bìa
                  </span>
                </div>{" "}
                <p className="w-80 text-[0.875rem] leading-[1.125rem] text-[rgba(153,153,153,1)] text-center mt-5">
                  {" "}
                  Kích thước yêu cầu: 800x1170
                </p>
              </div>{" "}
              <div className="flex flex-col flex-1 ml-10">
                <div className="w-full h-19-5">
                  <label htmlFor="name-story" className="w-full flex-col">
                    <span className="w-full text-[0.875rem] leading-5 ml-1 text-[rgba(102,102,102,1)]">
                      Tên truyện
                      <span className="text-[rgba(102,102,102,1)]"> *</span>
                    </span>
                  </label>{" "}
                  <input
                    id="name-story"
                    placeholder="Nhập tên truyện"
                    className="text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full flex-col w-full h-10 my-3"
                  />{" "}
                  <span className="block text-[0.875rem] leading-5 font-medium text-latse-7001 text-[rgba(255,59,48,1)] mb-5" />
                </div>{" "}
                <div className="w-full h-19-5">
                  <label className="block">
                    <span className="w-full text-[0.875rem] leading-5 ml-1 text-[rgba(102,102,102,1)]">Tác giả</span>
                  </label>{" "}
                  <div className="flex my-3">
                    <input
                      placeholder="Nhập tên tác giả"
                      disabled="disabled"
                      className="w-[350px] text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] px-[1.125rem] bg-[rgba(241,241,241,1)] border-0 rounded-full h-10"
                    />{" "}
                    <div className="tooltip-box">
                      <a>
                        <img
                          src="https://sangtac.waka.vn/svgs/pencil.svg"
                          alt=""
                          className="w-6 h-6 cursor-pointer ml-3 my-2"
                        />
                      </a>{" "}
                      {/**/}
                    </div>
                  </div>
                </div>{" "}
                <div className="w-full h-19-5">
                  <div className="flex">
                    <div className="w-1/2 h-19-5">
                      <div>
                        <label className="block mb-3">
                          <span className="w-full text-[0.875rem] leading-5 ml-1 text-[rgba(102,102,102,1)]">
                            Trạng thái
                          </span>
                        </label>{" "}
                        <div className="flex justify-center">
                          <div className="mb-3 w-96">
                            <div className="w-[350px] inline-block relative text-[rgba(34,34,34,1)] text-[0.9375rem] leading-[1.5rem] pl-[1.125rem] pr-6 bg-[rgba(241,241,241,1)] border-0 rounded-full h-10">
                              {/**/}
                              <div className="relative text-[14px] inline-block w-full  el-input--suffix">
                                {/**/}
                                <input
                                  type="text"
                                  readOnly="readonly"
                                  autoComplete="off"
                                  placeholder="Trạng thái"
                                  className="outline-[none] border-[0] text-[#000] pr-[30px]"
                                />
                                {/**/}
                                <span className="absolute top-[0] h-full text-[#c0c4cc] text-center right-[5px] [transition:all_.3s] pointer-events-none">
                                  <span className="pointer-events-auto">
                                    <i className="text-[#c0c4cc] text-[14px]  rotate-180 cursor-pointer h-full w-[25px] text-center [transition:all_.3s] leading-[40px] el-icon-arrow-up" />
                                    {/**/}
                                    {/**/}
                                    {/**/}
                                    {/**/}
                                    {/**/}
                                  </span>
                                  {/**/}
                                </span>
                                {/**/}
                                {/**/}
                              </div>
                              <div
                                className="absolute border-[1px] border-[solid] border-[#e4e7ed]  bg-[#fff] [box-shadow:0_2px_12px_0_rgba(0,_0,_0,_.1)] box-border mx-[0] my-[5px] bg-[rgba(0,_0,_0,_.9)] rounded-[6px]"
                                style={{ display: "none", minWidth: 350 }}
                              >
                                <div className="overflow-hidden relative" style={{}}>
                                  <div
                                    className="max-h-[274px] overflow-scroll h-full"
                                    style={{
                                      marginBottom: "-6px",
                                      marginRight: "-6px"
                                    }}
                                  >
                                    <ul className="el-scrollbar__view [list-style:none] px-[0] py-[6px] m-0 box-border">
                                      {/**/}
                                      <li className="text-white text-sm px-5 relative truncate h-[34px] leading-[34px] box-border cursor-pointer">
                                        <span className="float-left">
                                          Đang ra
                                        </span>{" "}
                                        <img
                                          src="https://sangtac.waka.vn/svgs/icon-check-success.svg"
                                          alt=""
                                          className="w-4 h-[11px] float-right mt-2.5 ml-2"
                                        />
                                      </li>
                                      <li className="el-select-dropdown__item">
                                        <span className="float-left">
                                          Hoàn thành
                                        </span>{" "}
                                        {/**/}
                                      </li>
                                      <li className="el-select-dropdown__item">
                                        <span className="float-left">
                                          Tạm dừng
                                        </span>{" "}
                                        {/**/}
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="el-scrollbar__bar is-horizontal">
                                    <div
                                      className="el-scrollbar__thumb"
                                      style={{ transform: "translateX(0%)" }}
                                    />
                                  </div>
                                  <div className="el-scrollbar__bar is-vertical">
                                    <div
                                      className="el-scrollbar__thumb"
                                      style={{ transform: "translateY(0%)" }}
                                    />
                                  </div>
                                </div>
                                {/**/}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="w-1/2 h-19-5">
                      <div>
                        <label className="block mb-3">
                          <span className="w-full text-[0.875rem] leading-5 ml-1 text-[rgba(102,102,102,1)]">
                            Thể loại
                          </span>
                        </label>{" "}
                        <div className="el-select w-88 outline-0 h-10 border-0 bg-white-241 rounded-full placeholder-black-153 text-black-222 text-sm-15-24 pl-4-5 pr-6 dr-author">
                          {/**/}
                          <div className="el-input el-input--suffix">
                            {/**/}
                            <input
                              type="text"
                              readOnly="readonly"
                              autoComplete="off"
                              placeholder="Chọn"
                              className="el-input__inner"
                            />
                            {/**/}
                            <span className="el-input__suffix">
                              <span className="el-input__suffix-inner">
                                <i className="el-select__caret el-input__icon el-icon-arrow-up" />
                                {/**/}
                                {/**/}
                                {/**/}
                                {/**/}
                                {/**/}
                              </span>
                              {/**/}
                            </span>
                            {/**/}
                            {/**/}
                          </div>
                          <div
                            className="el-select-dropdown el-popper"
                            style={{ display: "none", minWidth: 350 }}
                          >
                            <div className="el-scrollbar" style={{}}>
                              <div
                                className="el-select-dropdown__wrap el-scrollbar__wrap"
                                style={{
                                  marginBottom: "-6px",
                                  marginRight: "-6px"
                                }}
                              >
                                <ul className="el-scrollbar__view el-select-dropdown__list">
                                  {/**/}
                                  <li className="el-select-dropdown__item selected">
                                    <span className="float-left">
                                      Truyện dài
                                    </span>{" "}
                                    <img
                                      src="https://sangtac.waka.vn/svgs/icon-check-success.svg"
                                      alt=""
                                      className="w-4 h-11-cdv float-right mt-2.5 ml-2"
                                    />
                                  </li>
                                  <li className="el-select-dropdown__item">
                                    <span className="float-left">
                                      Truyện ngắn
                                    </span>{" "}
                                    {/**/}
                                  </li>
                                </ul>
                              </div>
                              <div className="el-scrollbar__bar is-horizontal">
                                <div
                                  className="el-scrollbar__thumb"
                                  style={{ transform: "translateX(0%)" }}
                                />
                              </div>
                              <div className="el-scrollbar__bar is-vertical">
                                <div
                                  className="el-scrollbar__thumb"
                                  style={{ transform: "translateY(0%)" }}
                                />
                              </div>
                            </div>
                            {/**/}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  <div className="flex">
                    <div className="w-1/2 h-19-5">
                      <label className="block mb-3 mt-4-5">
                        <span className="w-full text-[0.875rem] leading-5 ml-1 text-[rgba(102,102,102,1)]">
                          Giới hạn độ tuổi
                        </span>
                      </label>{" "}
                      <div className="el-select w-88 outline-0 h-10 border-0 bg-white-241 rounded-full placeholder-black-153 text-black-222 text-sm-15-24 pl-4-5 pr-6 dr-author">
                        {/**/}
                        <div className="el-input el-input--suffix">
                          {/**/}
                          <input
                            type="text"
                            readOnly="readonly"
                            autoComplete="off"
                            placeholder="Chọn"
                            className="el-input__inner"
                          />
                          {/**/}
                          <span className="el-input__suffix">
                            <span className="el-input__suffix-inner">
                              <i className="el-select__caret el-input__icon el-icon-arrow-up" />
                              {/**/}
                              {/**/}
                              {/**/}
                              {/**/}
                              {/**/}
                            </span>
                            {/**/}
                          </span>
                          {/**/}
                          {/**/}
                        </div>
                        <div
                          className="el-select-dropdown el-popper"
                          style={{ display: "none", minWidth: 350 }}
                        >
                          <div className="el-scrollbar" style={{}}>
                            <div
                              className="el-select-dropdown__wrap el-scrollbar__wrap"
                              style={{
                                marginBottom: "-6px",
                                marginRight: "-6px"
                              }}
                            >
                              <ul className="el-scrollbar__view el-select-dropdown__list">
                                {/**/}
                                <li className="el-select-dropdown__item popover-cdv selected">
                                  <span className="float-left">
                                    Phù hợp mới mọi lứa tuổi
                                  </span>{" "}
                                  <img
                                    src="https://sangtac.waka.vn/svgs/icon-check-success.svg"
                                    alt=""
                                    className="w-4 h-11-cdv float-right mt-2.5 ml-2"
                                  />
                                </li>
                                <li className="el-select-dropdown__item popover-cdv">
                                  <span className="float-left">13+</span> {/**/}
                                </li>
                                <li className="el-select-dropdown__item popover-cdv">
                                  <span className="float-left">16+</span> {/**/}
                                </li>
                                <li className="el-select-dropdown__item popover-cdv">
                                  <span className="float-left">18+</span> {/**/}
                                </li>
                              </ul>
                            </div>
                            <div className="el-scrollbar__bar is-horizontal">
                              <div
                                className="el-scrollbar__thumb"
                                style={{ transform: "translateX(0%)" }}
                              />
                            </div>
                            <div className="el-scrollbar__bar is-vertical">
                              <div
                                className="el-scrollbar__thumb"
                                style={{ transform: "translateY(0%)" }}
                              />
                            </div>
                          </div>
                          {/**/}
                        </div>
                      </div>
                    </div>{" "}
                    {/**/}
                  </div>{" "}
                  <div data-v-b5b0a334="" className="flex">
                    <div data-v-b5b0a334="" className="w-full h-19-5">
                      <label data-v-b5b0a334="" className="block mb-3 mt-4-5">
                        <span
                          data-v-b5b0a334=""
                          className="w-full text-[0.875rem] leading-5 ml-1 text-[rgba(102,102,102,1)]"
                        >
                          Tag
                        </span>
                      </label>{" "}
                      {/**/}{" "}
                      <div data-v-b5b0a334="" className="flex cursor-pointer">
                        <div
                          data-v-b5b0a334=""
                          className="w-24  border-0 rounded-full bg-gray-100 h-6 mt-[1.375rem] flex flex-row items-center justify-center"
                        >
                          <label
                            data-v-b5b0a334=""
                            className="text-[0.8125rem] leading-[0.9375rem] inline-block text-green-500 pl-2.5 pt-1 pb-1 font-normal mr-[0.3125rem]"
                          >
                            Thêm
                          </label>{" "}
                          <img
                            data-v-b5b0a334=""
                            src="https://sangtac.waka.vn/svgs/icon-them-moi.svg"
                            alt=""
                            className="w-3 h-3 inline-block text-cdv"
                          />
                        </div>
                      </div>{" "}
                      {/**/}
                    </div>
                  </div>
                </div>{" "}
                <div className="flex flex-wrap">
                  <label
                    htmlFor="note-story"
                    className="text-gray-600 text-sm block ml-1 mt-4.5"
                  >
                    Ghi chú tác giả
                  </label>{" "}
                  <textarea
                    rows={5}
                    placeholder="Nhập ghi chú"
                    id="note-story"
                    className="text-gray-900 text-sm-15-24 py-2 px-4.5 bg-gray-100 border-0 rounded-lg w-full block my-3"
                    defaultValue={""}
                  />
                </div>{" "}
                <div className="flex flex-wrap">
                  <label
                    htmlFor="des-story"
                    className="text-gray-600 text-sm block ml-1 mt-4.5"
                  >
                    Giới thiệu truyện
                    <span className="text-red-default"> * </span>
                  </label>{" "}
                  <textarea
                    rows={5}
                    placeholder="Nhập giới thiệu truyện"
                    name="description"
                    id="des-story"
                    className="text-gray-900 text-sm-15-24 py-2 px-4.5 bg-gray-100 border-0 rounded-lg w-full block my-3"
                    defaultValue={""}
                  />{" "}
                  <span className="block text-sm font-medium text-latse-7001 text-red-default mt-4-5" />
                </div>{" "}
                <div className="w-full flex">
                  <div className="inline-flex mr-2-5">
                    <a href="/authorChannel/my-story" className="">
                      <div className="flex flex-row items-center border-[rgba(109,174,67,1)] border rounded-full justify-center cursor-pointer max-w-[10.125rem] w-[10.125rem] h-8 mt-10">
                        <span className="text-[rgba(109,174,67,1)] uppercase text-sm leading-[1.125rem]">
                          Hủy
                        </span>
                      </div>
                    </a>
                  </div>{" "}
                  <div className="inline-flex mr-2-5">
                    <div data-v-0f04c550="">
                      <button
                        data-v-0f04c550=""
                        className="bg-[rgba(109,174,67,1)] max-w-[10.125rem] w-40-5 mt-10 h-8 [@media(min-width:1580px)]:h-10 border border-[rgba(109,174,67,1)] rounded-full flex flex-row items-center justify-center cursor-pointer"
                      >
                        <span
                          data-v-0f04c550=""
                          className="text-[0.875rem] leading-[1.125rem] uppercase text-white-default"
                        >
                          Tiếp theo
                        </span>
                      </button>{" "}
                      {/**/} {/**/} {/**/} {/**/} {/**/} {/**/} {/**/} {/**/}{" "}
                      {/**/} {/**/}
                    </div>
                  </div>{" "}
                  <div className="inline-flex mr-2-5">
                    <div className="max-w-40-5 w-40-5 mt-10 h-8 2xl:h-10 rounded-full flex-row-center justify-center cursor-pointer bg-[rgba(175,82,222,0.15)]">
                      <span className="text-sm-14-18 text-[rgba(175,82,222,1)] font-normal uppercase z-10">
                        Lưu tạm
                      </span>
                    </div>
                  </div>{" "}
                  {/**/} {/**/} {/**/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>{" "}
  <div
    data-v-a497e0ba=""
    data-v-5fd22e1e=""
    className="el-dialog__wrapper"
    style={{ display: "none" }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="dialog"
      className="el-dialog dialog-common max-w-225 relative"
      style={{ marginTop: "15vh" }}
    >
      <div className="el-dialog__header">
        <span className="el-dialog__title" />
        {/**/}
      </div>
      {/**/}
      {/**/}
    </div>
  </div>{" "}
  <div
    data-v-5fd22e1e=""
    className="el-dialog__wrapper"
    style={{ display: "none" }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="BẠN MUỐN RỜI KHỎI PHẦN ĐĂNG TRUYỆN ?"
      className="el-dialog el-dialog--center leading-6 dialog-agree fix-dialog"
      style={{ marginTop: "15vh", width: 540 }}
    >
      <div className="el-dialog__header">
        <span className="el-dialog__title">
          BẠN MUỐN RỜI KHỎI PHẦN ĐĂNG TRUYỆN ?
        </span>
        {/**/}
      </div>
      {/**/}
      {/**/}
    </div>
  </div>{" "}
  <div
    data-v-5fd22e1e=""
    className="el-dialog__wrapper"
    style={{ display: "none" }}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="BẠN MUỐN RỜI KHỎI PHẦN ĐĂNG CHƯƠNG ?"
      className="el-dialog el-dialog--center leading-6 dialog-agree fix-dialog"
      style={{ marginTop: "15vh", width: 540 }}
    >
      <div className="el-dialog__header">
        <span className="el-dialog__title">
          BẠN MUỐN RỜI KHỎI PHẦN ĐĂNG CHƯƠNG ?
        </span>
        {/**/}
      </div>
      {/**/}
      {/**/}
    </div>
  </div>
</div>


</div>

   </>
  )
}
export default More_stories;