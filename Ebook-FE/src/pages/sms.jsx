import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
import { searchBooks } from "../service/API_Book_Service";

function sms() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Hook để lấy thông tin từ URL
  const location = useLocation();

  // Hàm để trích xuất query string từ URL
  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param); // Trả về giá trị của query parameter
  };

  // Lấy giá trị của 'query' từ URL nếu có
  const searchTerm = getQueryParam("keyword");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const result = await searchBooks(searchTerm);
        setBooks(result);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        // Thêm thời gian chờ trước khi kết thúc quá trình loading
        setTimeout(() => {
          setLoading(false);
        }, 1000); // 2000ms = 2 giây
      }
    };

    if (searchTerm) {
      fetchBooks();
    }
  }, [searchTerm]);

  return (
    <div>
      <div>
        <div className="pt-[80px] w-full pl-[3.75rem]">
          <div className="w-full">
            <div className="flex gap-3 items-center pt-6 pb-3">
              <div className="w-12 min-w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <img
                  src="https://waka.vn/svgs/icon-search.svg"
                  alt="icon-search"
                  className="cursor-pointer w-6 h-6"
                />
              </div>
              <div>
                <p className="text-3xl text-white-default ">
                  Kết quả tìm kiếm cho từ “
                  <span className="text-3xl text-green-400 ">{searchTerm}</span>
                  ”
                </p>
                <p className="font-normal text-[15px] text-white-300 ">
                  {loading
                    ? "Không kết quả nào tìm thấy"
                    : `Tìm được ${books.length} kết quả`}
                </p>
              </div>
            </div>
            <div className="flex gap-6 py-3 tabs">
              <div className="cursor-pointer flex items-center">
                <p className="font-medium text-[19px] text-waka-500 ">Tất cả</p>
              </div>
              <div className="cursor-pointer flex items-center">
                <p className="leading-5 font-normal text-white-300 ">
                  Sách điện tử
                </p>
              </div>
              <div className="cursor-pointer flex items-center">
                <p className="leading-5 font-normal text-white-300 ">
                  Sách nói
                </p>
              </div>

              <div className="cursor-pointer flex items-center">
                <p className="leading-5 font-normal text-white-300 ">
                  Sách giấy
                </p>
              </div>
            </div>
          </div>
          <div className="w-full" style={{ display: "none" }}>
            <div className="appear grid grid-cols-6 gap-8 py-8 pr-[3.75rem]" />
          </div>
          <div className="w-full">
            <div className="w-full mt-4">
              <div className="flex items-center mb-6">
                <div className="relative group flex items-center">
                  <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                    Sách điện tử
                  </h2>
                  <span className="ml-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    xem thêm
                  </span>
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <div className="w-full">
                  {loading ? (
                    <div className="loader-container h-[263px] flex flex-col items-center justify-center gap-y-6">
                      <div className="loader book-loader flex">
                        {/* Hình chữ nhật đầu tiên đứng yên */}
                        <figure className="page w-10 h-[50px] border-2 border-gray-300 border-r-0"></figure>

                        {/* Hình chữ nhật thứ hai có hiệu ứng mở từ phải sang trái */}
                        <figure className="page w-10 h-[50px] border-2 border-gray-300 border-l-0 animate-bookOpen"></figure>
                      </div>
                      <h1 className="text-lg font-semibold text-gray-600">
                        Đang tải
                      </h1>
                    </div>
                  ) : books.length === 0 ? (
                    <div className="w-full text-center h-[263px] appear flex items-center">
                      <div className="w-full flex flex-col items-center">
                        <img
                          src="https://waka.vn/svgs/icon-search-result.svg"
                          alt="icon-search-result"
                          className="cursor-pointer"
                        />
                        <p className="font-medium text-base text-white-50 pb-2 pt-6">
                          Không tìm thấy kết quả nào liên quan
                        </p>
                        <p className="font-normal text-[15px] text-white-300">
                          Bạn vui lòng thay đổi từ khóa, giá trị lọc phù hợp
                        </p>
                      </div>
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
                      {books.map((item, index) => (
                        <SwiperSlide key={index} className="mr-[25px]">
                          <EbookCard
                            title={item.title}
                            img={item.bookImage}
                            book={item.bookID}
                            priceBook={item.price}
                            bookStatus={item.bookBookTypes[0]?.accessType || ""}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default sms;
