import { useEffect, useState, useRef } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import DOMPurify from "dompurify";
import truncate from "html-truncate";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import ModelMusic from "../components/ModelMusic";
import { getBookByType } from "../service/API_Book_Service";


function Audiobook() {
  const [showModal, setShowModal] = useState(false);
   const swiperRef = useRef(null);
   const [books, setBooks] = useState([]);
   const [currentBook, setCurrentBook] = useState(null);
   const [showButtonNP, setShowButtonNP] = useState(false);
   const [bookID, setBookID] = useState(null);

  useEffect(() => {
    // Cuộn lên đầu trang với hiệu ứng mượt mà
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "Yuki - Audiobook Việt Nam";
    const fetchData = async () => {
      try {
        const data = await getBookByType(2);
        setBooks(data);
        setCurrentBook(data[0]);
        console.log(data);
      } catch (error) {
        console.error("Error fetching book by id:", error);
      }
    };
    fetchData();
  }, []);


   const handlePrevClick = () => {
     if (swiperRef.current) {
       swiperRef.current.swiper.slidePrev();
     }
   };

   const handleNextClick = () => {
     if (swiperRef.current) {
       swiperRef.current.swiper.slideNext();
     }
   };

   const handleSlideChange = (swiper) => {
     if (books && books.length > 0) {
       setCurrentBook(books[swiper.realIndex]); // Sử dụng realIndex để tính chính xác với loop
     }
   };

     const handlePlayAudio = () => {
       const bookID = currentBook?.bookID;
       if (bookID) {
         setBookID(bookID);
         setShowModal(true);
       }
     };


  return (
    <>
      {/* Conten */}
      <div>
        <div className="name">
          <div className="w-full">
            <div className="homeSlide relative min-h-[600px]">
              <div
                className="relative filter blur-[25px] !w-full !min-h-[450px]"
                style={{
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right center",
                  backgroundImage: `url(${currentBook?.bookImage})`,
                }}
              >
                <div>
                  <div className="bg-[linear-gradient(180deg,_rgba(18,_18,_20,_0),_#121214)] absolute top-0 left-0 right-0 bottom-0" />
                  <div className="bg-[linear-gradient(90deg,_#121214_14.69%,_rgba(18,_18,_20,_.31)_50.47%),_linear-gradient(90deg,_#121214_14.69%,_rgba(18,_18,_20,_.31)_50.47%)] absolute top-0 left-0 right-0 bottom-0" />
                </div>
              </div>
              <div className="w-full px-14 pt-[5.5rem] absolute top-0 flex gap-x-[42px] min-h-[600px]">
                <div className="w-1/2 z-10 bg-podcast mt-[22px]">
                  <div className="flex items-center">
                    <h1 className="text-[3.125rem] leading-[55px] text-f2f font-bold mr-6">
                      Sách nói
                    </h1>
                    {/*  */}
                    <div className="el-select min-w-[130px] select-banner-category">
                      <div className="el-input el-input--suffix">
                        <input
                          type="text"
                          readOnly="readonly"
                          autoComplete="off"
                          placeholder="Chọn thể loại"
                          className=" !rounded-[5px] !bg-[#2b2b2b] !text-[#f2f2f2] !border-[1px] !border-[hsla(0,0%,100%,.1)] bg-[#fff] bg-none rounded-[4px] border-[1px] border-[solid] border-[#dcdfe6] box-border text-[#606266] inline-block h-[40px] leading-[40px] outline-[0] px-[15px] py-[0] [transition:border-color_.2s_cubic-bezier(.645,.045,.355,1)] w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-[3.75rem]">
                    <div className="text-[13px] not-italic font-normal leading-[normal] rounded-tl-[11px] rounded-br-[11px] rounded-tr-[11px] rounded-bl-[0] bg-[#4d4d4d] px-[8px] py-[3px] w-[114px] text-white">
                      YUKI ĐỀ XUẤT
                    </div>
                    <a href="#">
                      <h2 className="text-[30px] leading-[100%] text-f2f mt-[.375rem]">
                        {currentBook?.title}
                      </h2>
                    </a>
                    <p
                      className="text-[1rem] leading-5 text-f2f t-ellipsis-4 my-6 leading-6 max-h-[96px]"
                      dangerouslySetInnerHTML={{
                        __html: truncate(
                          DOMPurify.sanitize(currentBook?.description),
                          200
                        ),
                      }}
                    ></p>
                  </div>
                  <div className="flex mt-10">
                    <button
                      onClick={handlePlayAudio}
                      type="button"
                      className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer  button-primary bg-green-700"
                    >
                      <img
                        src="https://waka.vn/svgs/icon-play.svg"
                        alt="icon-book-blank"
                        className="cursor-pointer mr-2"
                      />
                      <span>Nghe Audio</span>
                    </button>
                    {showModal && <ModelMusic bookID={bookID} Close={()=> setShowModal(false)}/>}
                    <div
                      className="p-3 btn-icon inline-block ml-3 rounded-full bg-[hsla(0,_0%,_100%,_.1)] "
                      // onclick="musicBar()"
                    >
                      <img
                        src="https://waka.vn/svgs/icon-play.svg"
                        alt="icon-Play"
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <div>
                    <div
                      className="min-h-[1px] w-full relative z-0 overflow-hidden mx-[auto] my-[20px] box-border"
                      style={{ height: 403 }}
                    >
                      <div
                        onMouseEnter={() => setShowButtonNP(true)}
                        onMouseLeave={() => setShowButtonNP(false)}
                      >
                        <Swiper
                          key={books.length} // Để Swiper re-render khi books thay đổi
                          ref={swiperRef}
                          effect={"coverflow"}
                          grabCursor={true}
                          centeredSlides={true}
                          loop={true}
                          slidesPerView={3} // Chỉ hiển thị 3 slide
                          slidesPerGroup={1} // Move one slide at a time
                          coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 300,
                            modifier: 4,
                          }}
                          autoplay={{
                            delay: 3000, // Tự động chuyển slide sau 3 giây
                            disableOnInteraction: false, // Không dừng autoplay khi người dùng tương tác
                          }}
                          modules={[EffectCoverflow, Autoplay]}
                          pagination={{ clickable: true }}
                          navigation={false} // Disable navigation buttons
                          onSlideChange={handleSlideChange}
                        >
                          {books && books.length > 0 ? (
                            books.map((slide) => (
                              <SwiperSlide key={slide.bookID}>
                                <Link to={`/book-details/${slide.bookID}`}>
                                  <img
                                    src={slide.bookImage}
                                    alt={slide.title}
                                    style={{
                                      display: "block",
                                      margin: "0 auto",
                                      maxWidth: "100%",
                                      height: "auto",
                                      borderRadius: "10px",
                                      overflow: "hidden", // Bo góc hình ảnh
                                    }}
                                  />
                                </Link>
                              </SwiperSlide>
                            ))
                          ) : (
                            <p>Loading books...</p>
                          )}
                        </Swiper>
                        {showButtonNP && (
                          <div>
                            {/* Nút Next */}
                            <div
                              className="flex justify-center items-center absolute right-12 top-1/2 z-50 bg-white bg-opacity-55 rounded-full p-2 shadow-lg backdrop-blur-sm"
                              onClick={handleNextClick}
                              onMouseEnter={() => setShowButtonNP(true)}
                            >
                              <img
                                src="https://waka.vn/svgs/icon-next-slide.svg"
                                alt="icon-next-slide"
                                className="cursor-pointer w-6 h-6" // Đặt kích thước cho biểu tượng
                              />
                            </div>

                            {/* Nút Previous */}
                            <div
                              className="flex justify-center items-center absolute left-12 top-1/2 z-50 bg-white bg-opacity-55 rounded-full p-2 shadow-lg backdrop-blur-sm"
                              onClick={handlePrevClick}
                              onMouseEnter={() => setShowButtonNP(true)}
                            >
                              <img
                                src="https://waka.vn/svgs/icon-back.svg"
                                alt="icon-back"
                                className="cursor-pointer w-6 h-6" // Đặt kích thước cho biểu tượng
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-14 mt-[3.75rem]">
            {/* Start product */}
            <div className="w-full mt-4">
              {/* Title */}
              <div className="flex items-center mb-6">
                <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                  Sách miễn phí
                </h2>
              </div>
              {/* Product */}
              <div className="w-full overflow-hidden">
                <div className="w-full">
                  {/* Phần tử đầu tiên */}
                  <div className="inline-block relative lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer mr-[42px] last:mr-[50px]">
                    <div className="relative w-full">
                      <div className="relative w-full overflow-hidden rounded-xl">
                        <img
                          src="https://inthienhang.com/wp-content/uploads/2020/03/mau-bia-sach-dep.jpg"
                          alt="Đập nồi bán sắt đi học"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full book-border" />
                      {/* Thay thế lớp book-border với border tùy chỉnh */}
                      <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                        <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-green-400 text-white rounded-bl-[12px] rounded-tr-[12px]">
                          Miễn phí
                        </p>
                        <img
                          src="https://waka.vn/svgs/icon-free.svg"
                          alt="icon-free"
                          className="cursor-pointer absolute top-0 right-0"
                        />
                      </div>
                    </div>
                    <a
                      href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                      className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-waka-500 block mt-2"
                    >
                      Đập nồi bán sắt đi học
                    </a>
                  </div>
                  {/* Phần tử thứ hai */}
                  <div className="inline-block relative lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer mr-[42px] last:mr-[50px]">
                    <div className="relative w-full">
                      <div className="relative w-full overflow-hidden rounded-xl">
                        <img
                          src="https://inthienhang.com/wp-content/uploads/2020/03/mau-bia-sach-dep.jpg"
                          alt="Đập nồi bán sắt đi học"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full book-border" />
                      {/* Thay thế lớp book-border với border tùy chỉnh */}
                      <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                        <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-green-400 text-white rounded-bl-[12px] rounded-tr-[12px]">
                          Miễn phí
                        </p>
                        <img
                          src="https://waka.vn/svgs/icon-free.svg"
                          alt="icon-free"
                          className="cursor-pointer absolute top-0 right-0"
                        />
                      </div>
                    </div>
                    <a
                      href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                      className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-waka-500 block mt-2"
                    >
                      Đập nồi bán sắt đi học
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* product  */}
          <div className="w-full px-14 container-block bg-background mt-[3.75rem] false">
            <div className="w-full mt-4">
              {/* Title */}
              <div className="flex items-center mb-6">
                <h2 className="text-white-900 text-[1.625rem] font-medium cursor-pointer">
                  Mới nhất
                </h2>
              </div>
              {/* Product */}
              <div className="w-full overflow-hidden">
                <div className="w-full">
                  {/* Phần tử đầu tiên */}
                  <div className="inline-block relative show-tooltip lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer float-left mr-[42px] last:mr-[50px]">
                    <div className="relative w-full">
                      <div className="relative w-full overflow-hidden rounded-xl">
                        <img
                          src="https://inthienhang.com/wp-content/uploads/2020/03/mau-bia-sach-dep.jpg"
                          alt="Đập nồi bán sắt đi học"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full book-border" />
                      {/* Thay thế lớp book-border với border tùy chỉnh */}
                      <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                        <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-pink-500 text-white rounded-bl-[12px] rounded-tr-[12px]">
                          79.000đ
                        </p>
                        <img
                          src="https://waka.vn/svgs/icon-sale.svg"
                          alt="icon-free"
                          className="cursor-pointer absolute top-0 right-0"
                        />
                      </div>
                    </div>
                    <a
                      href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                      className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-waka-500 block mt-2"
                    >
                      Đập nồi bán sắt đi học
                    </a>
                  </div>
                  {/* Phần tử thứ hai */}
                  <div className="inline-block relative show-tooltip lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer float-left mr-[42px] last:mr-[50px]">
                    <div className="relative w-full">
                      <div className="relative w-full overflow-hidden rounded-xl">
                        <img
                          src="https://inthienhang.com/wp-content/uploads/2020/03/mau-bia-sach-dep.jpg"
                          alt="Đập nồi bán sắt đi học"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full book-border" />
                      {/* Thay thế lớp book-border với border tùy chỉnh */}
                      <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                        <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-orange-500 text-white rounded-bl-[12px] rounded-tr-[12px]">
                          HỘI VIÊN
                        </p>
                        <img
                          src="https://waka.vn/svgs/icon-member.svg"
                          alt="icon-free"
                          className="cursor-pointer absolute top-0 right-0"
                        />
                      </div>
                    </div>
                    <a
                      href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                      className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-waka-500 block mt-2"
                    >
                      Đập nồi bán sắt đi học
                    </a>
                  </div>
                  {/* Phần tử thứ hai */}
                  <div className="inline-block relative show-tooltip lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer float-left mr-[42px] last:mr-[50px]">
                    <div className="relative w-full">
                      <div className="relative w-full overflow-hidden rounded-xl">
                        <img
                          src="https://inthienhang.com/wp-content/uploads/2020/03/mau-bia-sach-dep.jpg"
                          alt="Đập nồi bán sắt đi học"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="absolute top-0 left-0 w-full h-full book-border" />
                      {/* Thay thế lớp book-border với border tùy chỉnh */}
                      <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                        <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-orange-500 text-white rounded-bl-[12px] rounded-tr-[12px]">
                          HỘI VIÊN
                        </p>
                        <img
                          src="https://waka.vn/svgs/icon-member.svg"
                          alt="icon-free"
                          className="cursor-pointer absolute top-0 right-0"
                        />
                      </div>
                    </div>
                    <a
                      href="/ebook/dap-noi-ban-sat-di-hoc-hong-thu-bac-bgNYYW.html"
                      className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-waka-500 block mt-2"
                    >
                      Đập nồi bán sắt đi học
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Audiobook