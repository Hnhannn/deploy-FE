import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import EbookCard from "../components/CardEbook/EbookCard";
import {
  getFreeBook,
  getNewBook,
  getRecommendations,
  getVIPBook,
} from "../service/API_Book_Service";
import { getReadBooksbyUser } from "../service/API_ReadBook_Service";
import { getUserFromToken, getUserByUsername } from "../service/AuthService";
import { getAllSliderShows } from "../service/API_SliderShow_Service";

function Main() {
  const swiperRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showButtonNP, setShowButtonNP] = useState(false);
  const [booksFree, setBooksFree] = useState([]);
  const [booksNew, setBooksNew] = useState([]);
  const [history, setHistory] = useState([]);
  const [VIP, setVIP] = useState([]);
  const [imageSlider, setImageSliders] = useState([]);
  const [recommen, setrecommen] = useState([]);

  useEffect(() => {
    document.title = "YuKi - Đam Mê Đọc Sách, Kết Nối Tri Thức!";
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserAndBooks = async () => {
      const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
      const userFromToken = getUserFromToken(token);
      const data = await getFreeBook();
      setBooksFree(data);
      const dataVIP = await getVIPBook();
      setVIP(dataVIP);
      const dataSlider = await getAllSliderShows();
      setImageSliders(dataSlider);
      const newBookData = await getNewBook();
      setBooksNew(newBookData);

      if (userFromToken) {
        try {
          const userData = await getUserByUsername(userFromToken.sub);
          setUser(userData);
          const historyData = await getReadBooksbyUser(userData.userID);
          setHistory(historyData);
          const recommendations = await getRecommendations(userData.userID);
          setrecommen(recommendations);
        } catch (error) {
          console.error("Error fetching user or books:", error);
        }
      }
    };

    fetchUserAndBooks();
  }, []);

  const handlePrevClick = () => {
    swiperRef.current.activeIndex === 0
      ? swiperRef.current.slideTo(imageSlider.length - 1)
      : swiperRef.current.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current.activeIndex === imageSlider.length - 1
      ? swiperRef.current.slideTo(0)
      : swiperRef.current.slideNext();
  };
  return (
    <div>
      {/* START Slider */}
      <div className="relative">
        <div className="swiper-container w-full">
          <div className="swiper homeSlide swiper-initialized swiper-horizontal swiper-backface-hidden">
            <div
              className="swiper-wrapper"
              aria-live="off"
              style={{
                transitionDuration: "0ms",
                transform: "translate3d(0px, 0px, 0px)",
              }}
            >
              <Swiper
                className="mySwiper"
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Autoplay]} // Thêm module Autoplay
                loop={true}
                autoplay={{
                  delay: 3000, // 3 giây giữa mỗi slide
                  disableOnInteraction: false, // Tiếp tục autoplay sau khi tương tác
                }}
              >
                {imageSlider.map((slide, index) => (
                  <SwiperSlide key={slide.sliderID}>
                    <img
                      onMouseEnter={() => setShowButtonNP(true)}
                      onMouseLeave={() => setShowButtonNP(false)}
                      src={slide.imageUrl}
                      alt={index + 1}
                      className="w-full h-auto" // Để hình ảnh chiếm toàn bộ chiều rộng
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="absolute !bg-[linear-gradient(180deg,_rgba(18,_18,_20,_0),_#121213)] bottom-0 left-0 w-full h-[7.5rem] z-10" />
          </div>
        </div>
        {/* End slider */}
        {/* Start Nút Next Pev */}
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
        {/* End Nút Next Pev */}
      </div>
      {/* End Slider */}

      {history && history.length > 0 && (
        <div className="w-full px-14 mt-[3.75rem]">
          {/* history product */}
          <div className="w-full mt-4">
            {/* Title */}
            <div className="flex items-center mb-6">
              <div className="relative group flex items-center">
                <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                  Tiếp tục cho {user ? user.fullName : "Loading..."}
                </h2>
                <Link to={"/BookcaseProfile"}>
                  <span className="ml-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    xem thêm
                  </span>
                </Link>
              </div>
            </div>
            {/* Product */}
            <div className="w-full overflow-hidden">
              <div className="w-full">
                {/* Phần tử đầu tiên */}
                {loading ? (
                  <div>
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                      breakpoints={{
                        // Configure responsive behavior
                        1024: {
                          slidesPerView: 5,
                        },
                        768: {
                          slidesPerView: 3,
                        },
                        640: {
                          slidesPerView: 2,
                        },
                      }}
                    >
                      {/* Swiper Slides */}
                      {Array.isArray(history) &&
                        history.map((item, index) => (
                          <SwiperSlide key={index} className="mr-[25px]">
                            <EbookCard.LoadingPage />
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>
                ) : (
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                    slidesOffsetAfter={220}
                    breakpoints={{
                      // Configure responsive behavior
                      1024: {
                        slidesPerView: 5,
                      },
                      980: {
                        slidesPerView: 3,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                    }}
                  >
                    {/* Swiper Slides */}
                    {Array.isArray(history) && history.length > 0
                      ? history
                          .sort(
                            (a, b) =>
                              new Date(b.dateRead) - new Date(a.dateRead)
                          ) // Sort by dateRead
                          .slice(0, 10)
                          .map((item, index) => (
                            <SwiperSlide key={index} className="mr-[25px]">
                              <EbookCard
                                title={item.book.title}
                                img={item.book.bookImage}
                                book={item.book.bookID}
                                priceBook={item.book.price}
                                bookStatus={
                                  item.book.bookBookTypes[0]?.accessType || ""
                                }
                                progress={item.progress}
                              />
                            </SwiperSlide>
                          ))
                      : console.log("Không có sách nào để hiển thị.")}
                  </Swiper>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="w-full px-14 container-block bg-background mt-[3.75rem] false">
          <div className="w-full mt-4">
            {/* Title */}
            <div className="flex items-center mb-6">
              <h2 className="text-white text-[1.625rem] font-medium cursor-pointer">
                Mới nhất
              </h2>
            </div>
            {/* Product */}
            <div className="w-full overflow-hidden">
              <div className="w-full">
                {/* Phần tử đầu tiên */}
                {loading ? (
                  <div>
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                      breakpoints={{
                        // Configure responsive behavior
                        1024: {
                          slidesPerView: 5,
                        },
                        768: {
                          slidesPerView: 3,
                        },
                        640: {
                          slidesPerView: 2,
                        },
                      }}
                    >
                      {/* Swiper Slides */}
                      {Array.isArray(booksNew) &&
                        booksNew.map((item, index) => (
                          <SwiperSlide key={index} className="mr-[25px]">
                            <EbookCard.LoadingPage />
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>
                ) : (
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                    slidesOffsetAfter={220}
                    breakpoints={{
                      // Configure responsive behavior
                      1024: {
                        slidesPerView: 5,
                      },
                      980: {
                        slidesPerView: 3,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                    }}
                  >
                    {/* Swiper Slides */}
                    {Array.isArray(booksNew) && booksNew.length > 0
                      ? booksNew.map((item, index) => (
                          <SwiperSlide key={index} className="mr-[25px]">
                            <EbookCard
                              title={item.title}
                              img={item.bookImage}
                              book={item.bookID}
                              priceBook={item.price}
                              bookStatus={
                                item.bookBookTypes[0]?.accessType || ""
                              }
                            />
                          </SwiperSlide>
                        ))
                      : console.log("Không có sách nào để hiển thị.")}
                  </Swiper>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-14 mt-[3.75rem]">
        {/* Start free product */}
        <div className="w-full mt-4">
          {/* Title */}
          <div className="flex items-center mb-6">
            <div className="relative group flex items-center">
              <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                Sách miễn phí
              </h2>
              <span className="ml-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                xem thêm
              </span>
            </div>
          </div>
          {/* Product */}
          <div className="w-full overflow-hidden">
            <div className="w-full">
              {/* Phần tử đầu tiên */}
              {loading ? (
                <div>
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                    breakpoints={{
                      // Configure responsive behavior
                      1024: {
                        slidesPerView: 5,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                    }}
                  >
                    {/* Swiper Slides */}
                    {Array.isArray(booksFree) &&
                      booksFree.map((item, index) => (
                        <SwiperSlide key={index} className="mr-[25px]">
                          <EbookCard.LoadingPage />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                  slidesOffsetAfter={220}
                  breakpoints={{
                    // Configure responsive behavior
                    1024: {
                      slidesPerView: 5,
                    },
                    980: {
                      slidesPerView: 3,
                    },
                    640: {
                      slidesPerView: 2,
                    },
                  }}
                >
                  {/* Swiper Slides */}
                  {Array.isArray(booksFree) && booksFree.length > 0
                    ? booksFree.map((item, index) => (
                        <SwiperSlide key={index} className="mr-[25px]">
                          <EbookCard
                            title={item.title}
                            img={item.bookImage}
                            book={item.bookID}
                            priceBook={item.price}
                            bookStatus={
                              item.bookBookTypes?.find(
                                (bookBookType) =>
                                  bookBookType.accessType === "Miễn phí"
                              )?.accessType || ""
                            }
                          />
                        </SwiperSlide>
                      ))
                    : console.log("Không có sách nào để hiển thị.")}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* // End product */}
      {recommen && recommen.length > 0 && (
        <div className="w-full px-14 mt-[3.75rem]">
          {/* Start free product */}
          <div className="w-full mt-4">
            {/* Title */}
            <div className="flex items-center mb-6">
              <div className="relative group flex items-center">
                <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                  Dành riêng cho bạn
                </h2>
                <span className="ml-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  xem thêm
                </span>
              </div>
            </div>
            {/* Product */}
            <div className="w-full overflow-hidden">
              <div className="w-full">
                {/* Phần tử đầu tiên */}
                {loading ? (
                  <div>
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                      breakpoints={{
                        // Configure responsive behavior
                        1024: {
                          slidesPerView: 5,
                        },
                        768: {
                          slidesPerView: 3,
                        },
                        640: {
                          slidesPerView: 2,
                        },
                      }}
                    >
                      {/* Swiper Slides */}
                      {Array.isArray(recommen) &&
                        recommen.map((item, index) => (
                          <SwiperSlide key={index} className="mr-[25px]">
                            <EbookCard.LoadingPage />
                          </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>
                ) : (
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                    slidesOffsetAfter={220}
                    breakpoints={{
                      // Configure responsive behavior
                      1024: {
                        slidesPerView: 5,
                      },
                      980: {
                        slidesPerView: 3,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                    }}
                  >
                    {/* Swiper Slides */}
                    {Array.isArray(recommen) && recommen.length > 0
                      ? recommen.map((item, index) => (
                          <SwiperSlide key={index} className="mr-[25px]">
                            <EbookCard
                              title={item.title}
                              img={item.bookImage}
                              book={item.bookID}
                              priceBook={item.price}
                              bookStatus={
                                item.bookBookTypes[0]?.accessType || ""
                              }
                            />
                          </SwiperSlide>
                        ))
                      : console.log("Không có sách nào để hiển thị.")}
                  </Swiper>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* // End product */}
      <div className="w-full px-14 mt-[3.75rem]">
        {/* Start free product */}
        <div className="w-full mt-4">
          {/* Title */}
          <div className="flex items-center mb-6">
            <div className="relative group flex items-center">
              <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                Dành cho hội viên
              </h2>
              <span className="ml-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                xem thêm
              </span>
            </div>
          </div>
          {/* Product */}
          <div className="w-full overflow-hidden">
            <div className="w-full">
              {/* Phần tử đầu tiên */}
              {loading ? (
                <div>
                  <Swiper
                    modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                    breakpoints={{
                      // Configure responsive behavior
                      1024: {
                        slidesPerView: 5,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      640: {
                        slidesPerView: 2,
                      },
                    }}
                  >
                    {/* Swiper Slides */}
                    {Array.isArray(VIP) &&
                      VIP.map((item, index) => (
                        <SwiperSlide key={index} className="mr-[25px]">
                          <EbookCard.LoadingPage />
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </div>
              ) : (
                <Swiper
                  modules={[Navigation, Pagination, Scrollbar, A11y]} // Optional Swiper modules
                  slidesOffsetAfter={220}
                  breakpoints={{
                    // Configure responsive behavior
                    1024: {
                      slidesPerView: 5,
                    },
                    980: {
                      slidesPerView: 3,
                    },
                    640: {
                      slidesPerView: 2,
                    },
                  }}
                >
                  {/* Swiper Slides */}
                  {Array.isArray(VIP) && VIP.length > 0
                    ? VIP.map((item, index) => (
                        <SwiperSlide key={index} className="mr-[25px]">
                          <EbookCard
                            title={item.title}
                            img={item.bookImage}
                            book={item.bookID}
                            priceBook={item.price}
                            bookStatus={
                              item.bookBookTypes?.find(
                                (bookBookType) =>
                                  bookBookType.accessType === "Hội viên"
                              )?.accessType || ""
                            }
                          />
                        </SwiperSlide>
                      ))
                    : console.log("Không có sách nào để hiển thị.")}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* // End product */}
    </div>
  );
}

export default Main;
