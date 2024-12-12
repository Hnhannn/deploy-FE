import React from "react";

const My_story = () => {
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
          <div className="relative border-t-[1px_solid_#e8e9e9] [box-shadow:0_5px_5px_0_rgba(0,_0,_0,_.06)] mt-[20px]">
           
          </div>
        </div>
        <div className="max-w-[1580px] pr-[0rem] pl-[0rem] mt-[3.125rem] mb-11 ml-auto mr-auto" data-v-5fd22e1e="">
  <div
    className="box-border"
    style={{ marginLeft: "-25px", marginRight: "-25px" }}
    data-v-5fd22e1e=""
  >
    <div
      className="el-col el-col-6"
      style={{ paddingLeft: 25, paddingRight: 25 }}
      data-v-5fd22e1e=""
    >
      <div className="bg-[#fff] rounded-xl pt-6" data-v-5fd22e1e="">
        <div className="text-center" data-v-5fd22e1e="">
          <div className="author-avatar w-[12.5rem] h-[12.5rem] ml-auto mr-auto" data-v-5fd22e1e="">
            <img
              src="https://cdn.vegaid.vn/cU0spbfh3B/20241118041337/820/3ba/0a3/8203ba0a33ad2b6382f2f78870a6adb5.jpg"
              className="overflow-hidden w-full h-full rounded-full"
              data-v-5fd22e1e=""
            />
          </div>{" "}
          <div className="author-name pt-3" data-v-5fd22e1e="">
            <a href="/" className="nuxt-link-active" data-v-5fd22e1e="">
              <span className="text-[1.5rem] leading-[1.85rem] text-center text-[rgba(34,34,34,1)] font-bold mt-3" data-v-5fd22e1e="">
                Võ Hoàng Nhân
              </span>
            </a>
          </div>
        </div>{" "}
        <div className="p-[1.875rem]" data-v-5fd22e1e="">
          <div className="mb-4 last:mb-0 text-[rgba(34,34,34,1)]" data-v-5fd22e1e="">
          <div class="flex items-center cursor-pointer">
            <img
              src="https://sangtac.waka.vn/svgs/icon-author-file.svg"
              alt="Icon"
              class="w-6 h-6 mr-3"
            />
            <span class="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold">Hồ sơ tác giả</span>
                </div>
          </div>
          <div className="mb-4 last:mb-0 text-[rgba(34,34,34,1)]" data-v-5fd22e1e="">
            <div
              className="flex align-center justify-between hover:text-cdv"
              data-v-5fd22e1e=""
            >
              <div
                className="flex-row-center cursor-pointer"
                data-v-5fd22e1e=""
              >
                <img
                  src="https://sangtac.waka.vn/svgs/icon-my-story.svg"
                  alt=""
                  className="w-6 h-6 mr-3"
                  data-v-5fd22e1e=""
                />{" "}
                <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold" data-v-5fd22e1e="">
                  Truyện của tôi
                </span>
              </div>{" "}
              <img
                src="https://sangtac.waka.vn/svgs/icon-more.svg"
                alt=""
                className="w-6 h-6 cursor-pointer"
                data-v-5fd22e1e=""
              />
            </div>
          </div>
          <div className="mb-4 last:mb-0 text-[rgba(34,34,34,1)]" data-v-5fd22e1e="">
            <div
              className="flex align-center justify-between hover:text-cdv"
              data-v-5fd22e1e=""
            >
              <div
                className="flex-row-center cursor-pointer"
                data-v-5fd22e1e=""
              >
                <img
                  src="https://sangtac.waka.vn/svgs/icon-logout.svg"
                  alt=""
                  className="w-6 h-6 mr-3"
                  data-v-5fd22e1e=""
                />{" "}
                <span className="text-[0.9375rem] leading-6 cursor-pointer hover:text-cdv hover:font-bold line-clamp-1 text-black font-bold" data-v-5fd22e1e="">
                  Đăng xuất
                </span>
              </div>{" "}
              <img
                src="https://sangtac.waka.vn/svgs/icon-more.svg"
                alt=""
                className="w-6 h-6 cursor-pointer"
                data-v-5fd22e1e=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>{" "}
    <div
      className="el-col el-col-18"
      style={{ paddingLeft: 25, paddingRight: 25 }}
      data-v-5fd22e1e=""
    >
      <div
        data-v-421b3378=""
        data-v-5fd22e1e=""
        className="my-story w-full"
        total-pages={1}
        user-info="[object Object]"
      >
        <div
          data-v-421b3378=""
          className="main-title mb-7-5 pb-1-5 flex justify-between"
        >
          <div data-v-421b3378="" className="flex-row-center">
            <img
              data-v-421b3378=""
              src="https://sangtac.waka.vn/svgs/icon-info-channel.svg"
              alt=""
              className="w-6 h-6 cursor-pointer mr-1.5"
            />{" "}
            <span data-v-421b3378="" className="text-2xl-24-30 font-bold">
              Truyện của tôi
            </span>
          </div>{" "}
          <a
            data-v-421b3378=""
            href="/authorChannel/add-story"
            className="flex justify-center items-center w-48 text-white text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer rounded-[20px] bg-[linear-gradient(94.78deg,_#8cd25a,_#5ea72f)]"
            style={{ padding: "12px 0px" }}
          >
            <img
              data-v-421b3378=""
              src="https://sangtac.waka.vn/svgs/icon-add-chapter.svg"
              alt=""
              className="w-3 h-3 cursor-pointer mr-1.5"
            />{" "}
            <span data-v-421b3378="" className="uppercase">
              Thêm truyện mới
            </span>
          </a>
        </div>{" "}
        <div data-v-421b3378="">
          <div
            data-v-6a310404=""
            data-v-421b3378=""
            className="bg-white p-[1.875rem] rounded-xl gap-4 grid grid-cols-3 mb-[1.875rem]"
          >
            <div data-v-6a310404="" className="col-span-2 flex">
              <div data-v-6a310404="" className="novel-image-box pr-[1.875rem]">
                <a
                  data-v-6a310404=""
                  href="/authorChannel/update-story?novel_id=8791"
                  className=""
                >
                  <img
                    data-v-6a310404=""
                    src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.cdv_novel/0/0/0/8791.jpg?v=1&time=1727406563&w=720&h=720"
                    className="inline-block rounded-md max-w-[6.75rem]"
                  />
                </a>
              </div>{" "}
              <div data-v-6a310404="" className="relative">
                <div data-v-6a310404="" className="w-full flex flex-nowrap">
                  <div data-v-6a310404="" className="flex w-full">
                  <div className="max-w-[75%]">
                      <a
                        href="/authorChannel/update-story?novel_id=8791"
                        className="block text-[1.125rem] leading-6 overflow-hidden text-ellipsis whitespace-nowrap  text-black"
                      >
                        Anh IT may mắn
                      </a>
                  </div>
                     <div data-v-6a310404="">
                      <span
                        data-v-6a310404=""
                        className="text-white text-[0.8125rem] leading-[1rem] py-1 px-2.5 bg-[rgba(109,174,67,1)] bg-opacity-10 rounded-xl ml-[1.125rem]"
                      >
                        Đang ra
                      </span>
                    </div>
                  </div>
                </div>{" "}
                <div data-v-6a310404="" className="mt-2 mb-5">
                  <div
                    data-v-6a310404=""
                    className="text-[rgba(153,153,153,1)] text-[0.875rem] leading-[1rem]"
                  >
                    <span data-v-6a310404="">Cập nhật</span>{" "}
                    <span data-v-6a310404="">10:09 27/09/2024</span>
                  </div>
                </div>{" "}
                <div data-v-6a310404="" className="grid grid-cols-4 gap-4">
                  <div data-v-6a310404="" className="border-r-[1px_solid_#e8e9e9] pr-[10px]">
                    <div data-v-6a310404="" className="flex items-center mb-3">
                      <img
                        data-v-6a310404=""
                        src="https://sangtac.waka.vn/_nuxt/img/IconChapter.f81d1bb.svg"
                      />{" "}
                      <span data-v-6a310404="" className="text-sm leading-5 text-black">
                        Chương
                      </span>
                    </div>{" "}
                    <span
                      data-v-6a310404=""
                      className="text-[1.125rem] leading-[1.3125rem] font-bold pt-3 text-sm  text-black"
                    >
                      5
                    </span>
                  </div>{" "}
                  <div data-v-6a310404="" className="border-r-[1px_solid_#e8e9e9] pr-[10px]">
                    <div data-v-6a310404="" className="flex items-center mb-3">
                      <img
                        data-v-6a310404=""
                        src="https://sangtac.waka.vn/_nuxt/img/IconReads.ac6c7c7.svg"
                      />{" "}
                      <span data-v-6a310404="" className="text-sm leading-5 text-black">
                        Lượt đọc
                      </span>
                    </div>{" "}
                    <span
                      data-v-6a310404=""
                      className="text-[1.125rem] leading-[1.3125rem] font-bold pt-3 text-sm  text-black"
                    >
                      0
                    </span>
                  </div>{" "}
                  <div data-v-6a310404="" className="border-r-[1px_solid_#e8e9e9] pr-[10px]">
                    <div data-v-6a310404="" className="flex items-center mb-3">
                      <img
                        data-v-6a310404=""
                        src="	https://sangtac.waka.vn/_nuxt/img/IconFollow.a8b9209.svg"
                      />{" "}
                      <span data-v-6a310404="" className="text-sm leading-5 text-black">
                        Theo dõi
                      </span>
                    </div>{" "}
                    <span
                      data-v-6a310404=""
                      className="text-[1.125rem] leading-[1.3125rem] font-bold pt-3 text-sm  text-black"
                    >
                      0
                    </span>
                  </div>{" "}
                  <div data-v-6a310404="" className="border-r-[1px_solid_#e8e9e9] pr-[10px]">
                    <div data-v-6a310404="" className="flex items-center mb-3">
                      <img
                        data-v-6a310404=""
                        src="https://sangtac.waka.vn/_nuxt/img/IconNominate.2e5f771.svg"
                      />{" "}
                      <span data-v-6a310404="" className="text-sm leading-5 text-black">
                        Đề cử
                      </span>
                    </div>{" "}
                    <span
                      data-v-6a310404=""
                      className="text-[1.125rem] leading-[1.3125rem] font-bold text-sm text-black"
                    >
                      0
                    </span>
                  </div>
                </div>{" "}
                <div className="w-full mt-5">
                  <span className="text-sm leading-5 text-black">
                    Trạng thái xuất bản
                  </span>{" "}
                  <span
                    className="ml-3 mr-6 text-xs rounded-xl px-2.5 py-1 text-violet-600 bg-violet-600 bg-opacity-10"
                  >
                    Lưu tạm
                  </span>{" "}
                  <span className="text-sm leading-5 text-red-500" />{" "}
                  <span className="text-sm leading-5 text-red-500" />{" "}
                  <span className="text-sm leading-5 text-red-500">
                    Có thể xuất bản
                  </span>
                </div>
                              </div>
            </div>{" "}
            <div data-v-6a310404="" className="col-span-1 border-l-[1px_solid_rgba(0,_0,_0,_.06)] pl-[30px]">
              <a
                data-v-6a310404=""
                href="/authorChannel/list-comment/danh-sach-binh-luan-anh-it-may-man-8791?name=Anh%20IT%20may%20m%E1%BA%AFn"
                className=""
              >
                <div
                  data-v-6a310404=""
                  className="w-full text-[#6dae43] border-[1px] border-[solid] border-[#6dae43] rounded-[15px] pt-[8px] pb-[8px] text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer mb-3"
                >
                  Danh sách bình luận
                </div>
              </a>{" "}
              <div data-v-6a310404="" className="flex text-[#6dae43] w-full">
                <a
                  data-v-6a310404=""
                  href="/authorChannel/update-story?novel_id=8791"
                  className="w-full mr-2.5 [color:inherit] [text-decoration:inherit]"
                >
                  <div
                    data-v-6a310404=""
                    className="text-[#6dae43] border-[1px] border-[solid] border-[#6dae43] rounded-[15px] pt-[8px] pb-[8px] text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer w-full"
                  >
                    Chỉnh sửa
                  </div>
                </a>{" "}
                <div data-v-6a310404="" className="text-[#6dae43] border-[1px] border-[solid] border-[#6dae43] rounded-[15px] pt-[8px] pb-[8px] text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer w-full">
                  Xóa
                </div>{" "}
                <div
                  data-v-6a310404=""
                  className="text-[#fff] text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer pt-[8px] pb-[8px] rounded-[15px] bg-[linear-gradient(96.34deg,_#44bbfe,_#1e78fe)] w-full ml-2-5"
                >
                  Xuất bản
                </div>
              </div>{" "}
              <div data-v-6a310404="" className="border-b-[1px_solid_rgba(0,_0,_0,_.06)] pt-[20px] mb-[20px] cursor-pointer" />{" "}
              <div data-v-6a310404="" className="flex text-[#6dae43] w-full">
                <div
                  data-v-6a310404=""
                  className="text-[#fff] text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer bg-[linear-gradient(94.78deg,_#8cd25a,_#5ea72f)] rounded-[20px] w-2/4 mr-2-5 flex items-center justify-center"
                >
                  <img
                    data-v-6a310404=""
                    src="https://sangtac.waka.vn/svgs/icon-add-chapter.svg"
                    alt=""
                    className="w-2-5 h-2-5 cursor-pointer mr-1.5"
                  />{" "}
                  <span data-v-6a310404="">Thêm chương</span>
                </div>{" "}
                <div data-v-6a310404="" className="w-2/4">
                  <a
                    data-v-6a310404=""
                    href="/authorChannel/list-chapter/danh-sach-chuong-anh-it-may-man-8791?name=Anh%20IT%20may%20m%E1%BA%AFn&novel_id=8791&max_to_publish=5&total_chapter=5"
                    className=""
                  >
                    <div data-v-6a310404="" className="text-[#6dae43] border-[1px] border-[solid] border-[#6dae43] rounded-[15px] pt-[8px] pb-[8px] text-[14px] leading-[16px] text-center whitespace-nowrap cursor-pointer">
                      Danh sách chương
                    </div>
                  </a>
                </div>
              </div>
            </div>{" "}
            <div
              data-v-f9f0cf56=""
              data-v-6a310404=""
              className="el-dialog__wrapper"
              style={{ display: "none" }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog dialog-common dialog-delete max-w-md relative"
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
              data-v-6a310404=""
              className="el-dialog__wrapper"
              style={{ display: "none" }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="dialog"
                className="el-dialog dialogPublish"
                style={{ marginTop: "15vh", width: "30%" }}
              >
                <div className="el-dialog__header">
                  <span className="el-dialog__title" />
                  {/**/}
                </div>
                {/**/}
                {/**/}
              </div>
            </div>
          </div>
        </div>{" "}
        <div
          data-v-421b3378=""
          className="w-full mt-7-5 flex items-center justify-end"
        >
          <div data-v-421b3378="" className="w-max">
            {/**/}
          </div>
        </div>
      </div>
    </div>
  </div>{" "}
  <div
    className="el-dialog__wrapper"
    style={{ display: "none" }}
    data-v-a497e0ba=""
    data-v-5fd22e1e=""
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
    className="fixed top-[0] right-[0] bottom-[0] left-[0] overflow-auto m-0 backdrop-filter backdrop-blur-[15px]"
    style={{ display: "none" }}
    data-v-5fd22e1e=""
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
    className="el-dialog__wrapper"
    style={{ display: "none" }}
    data-v-5fd22e1e=""
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
export default My_story;