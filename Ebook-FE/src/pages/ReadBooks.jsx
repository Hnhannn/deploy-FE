import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import debounce from "lodash.debounce";
import truncate from "html-truncate";
import { getChappterById } from "../service/APIChapterService";
import { getBookById } from "../service/API_Book_Service";
import { addReadBook, getReadBooks } from "../service/API_ReadBook_Service";
import { getUserFromToken, getUserByUsername } from "../service/AuthService";

const splitContentIntoSlidesByHeight = (content, maxHeight, elementRef) => {
  if (typeof content !== "string") {
    return []; // Nếu không phải là chuỗi, trả về mảng rỗng
  }

  // Chia nội dung thành các đoạn (paragraphs)
  const paragraphs = content.split(/\n+/);
  const slides = [];
  let tempContent = "";

  // Tạo phần tử ảo để đo chiều cao
  const testDiv = document.createElement("div");
  testDiv.style.position = "absolute";
  testDiv.style.visibility = "hidden";
  testDiv.style.width = elementRef.current.offsetWidth + "px"; // Đảm bảo phần tử có độ rộng giống như elementRef
  testDiv.className = "text-lg text-white"; // Dùng cùng class để giữ kiểu chữ giống nhau
  document.body.appendChild(testDiv); // Chỉ append một lần

  const appendContentToTestDiv = (contentToTest) => {
    testDiv.innerText = contentToTest;
    return testDiv.offsetHeight;
  };

  // Duyệt qua các đoạn và tạo các slide
  for (let paragraph of paragraphs) {
    const newContent = tempContent + paragraph + "\n"; // Nội dung tạm thời với đoạn mới

    // Kiểm tra chiều cao của nội dung tạm thời
    if (appendContentToTestDiv(newContent) > maxHeight) {
      // Nếu chiều cao vượt quá, tạo một slide mới với nội dung hiện tại
      slides.push(tempContent.trim());
      tempContent = paragraph; // Bắt đầu slide mới từ đoạn hiện tại
    } else {
      // Nếu không, tiếp tục cộng dồn nội dung vào slide hiện tại
      tempContent = newContent;
    }
  }

  // Đừng quên thêm phần còn lại vào slide cuối
  if (tempContent.trim()) {
    slides.push(tempContent.trim());
  }

  // Xóa phần tử đo lường sau khi đã sử dụng
  document.body.removeChild(testDiv);

  return slides;
};

const ReadBooks = () => {
  const [isDataFetched, setIsDataFetched] = useState(false);
  const swiperRef = useRef(null);
  const [chapters, setChapter] = useState([]);
  const [book, setBook] = useState([]);
  const [currentChapterTitle, setCurrentChapterTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef(null);
  const [showModel, setShowModel] = useState(false);
  const [slides, setSlides] = useState([]);
  const [bgColor, setBgColor] = useState(""); // Default background color
  const [fontSize, setFontSize] = useState(16); // Default font size in pixels
  const [textColor, setTextColor] = useState("text-white"); // Default text color
  const [selectedColor, setSelectedColor] = useState(""); // Default selected color

  const handleFontSizeChange = (size) => {
    if (size <= 20 && size >= 12) {
      setFontSize(size);
    }
  };

  const getIdFromUrl = () => {
    const pathArray = window.location.pathname.split("/");
    return pathArray[pathArray.length - 1]; // Giả sử id nằm ở cuối URL
  };

  const handleUpdateReadBook = useCallback(async () => {
    if (!user || !user.userID) {
      console.log("User chưa đăng nhập. Không thể lưu lịch sử đọc sách.");
      return;
    }
    const readBooksDTO = {
      userId: user.userID,
      bookId: getIdFromUrl(),
      progress: progress,
    };

    console.log("Dữ liệu sẽ được lưu:", readBooksDTO);

    try {
      const result = await addReadBook(readBooksDTO);
      console.log("Reading history updated:", result);
    } catch (error) {
      console.error("Error updating read book:", error);
      console.log("Failed to update reading history.");
    }
  }, [user, progress, addReadBook]);

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
      // const nextChapter = chapters[swiperRef.current.swiper.activeIndex];
      // console.log(nextChapter);
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleProgressBarClick = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;
    const swiper = swiperRef.current.swiper;
    const newIndex = Math.round(
      (newProgress / 100) * (swiper.slides.length - 1)
    );
    swiper.slideTo(newIndex);
  };

  const handleSlideChange = () => {
    const swiper = swiperRef.current.swiper;
    const newIndex = swiper.activeIndex;
    updateProgressAndTitle(newIndex);
  };

  const updateProgressAndTitle = useCallback(
    debounce((index) => {
      const swiper = swiperRef.current?.swiper;
      if (!swiper) return;

      const totalSlides = swiper.slides.length;
      const newProgress = (index / (totalSlides - 1)) * 100;
      setProgress(newProgress);

      let currentSlide = index - 1; // Bỏ qua mục lục
      let cumulativeSlides = 0;
      let chapterIndex = -1;

      for (let i = 0; i < chapters.length; i++) {
        const contentChunks = splitContentIntoSlidesByHeight(
          chapters[i].chapterContent,
          500,
          contentRef
        );
        cumulativeSlides += contentChunks.length;

        if (currentSlide < cumulativeSlides) {
          chapterIndex = i;
          break;
        }
      }

      if (chapterIndex !== -1) {
        setCurrentChapterTitle(chapters[chapterIndex].chapterTitle);
      }
    }, 300),
    [chapters]
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleProgressBarClick(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleProgressBarClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !user.userID) {
        console.log("User chưa đăng nhập. Không thể lấy lịch sử đọc sách.");
        return;
      }
      try {
        const bookId = getIdFromUrl();
        const result = await getReadBooks(user.userID, bookId);
        if (result && result.progress) {
          setProgress(result.progress);
        }
      } catch (error) {
        console.error("Error fetching read book progress:", error);
      }
    };

    fetchProgress();
  }, [user, getReadBooks]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
    const userFromToken = token ? getUserFromToken(token) : null;

    const fetchReadBooks = async (userID) => {
      try {
        const data = await getReadBooks(userID, getIdFromUrl());
        console.log("Fetched read book data:", data);

        if (Array.isArray(data) && data.length > 0) {
          const firstItem = data[0];
          console.log("Fetched read book data:", firstItem.progress);

          if (firstItem.progress != null) {
            setProgress(firstItem.progress);
            console.log("Fetched progress:", firstItem.progress);

            // Calculate the initial slide index based on the progress
            const swiper = swiperRef.current?.swiper;
            if (swiper) {
              const totalSlides = swiper.slides.length;
              const initialSlideIndex = Math.round(
                (firstItem.progress / 100) * (totalSlides - 1)
              );
              swiper.slideTo(initialSlideIndex, 0); // Slide to the calculated index without animation
            }
          } else {
            setProgress(0);
            console.log("Progress not found, setting progress to 0");
          }
        } else {
          console.log("Invalid data format, keeping current progress");
          setProgress(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProgress(0);
      }
    };

    const fetchData = async () => {
      const id = getIdFromUrl();
      const [chapterData, bookData] = await Promise.all([
        getChappterById(id),
        getBookById(id),
      ]);
      setChapter(chapterData);
      setBook(bookData);
      setIsDataFetched(true); // Đánh dấu dữ liệu đã được tải
    };

    if (userFromToken) {
      getUserByUsername(userFromToken.sub)
        .then((userData) => {
          setUser(userData); // Lưu user vào state
          fetchReadBooks(userData.userID); // Gọi fetchReadBooks với userID
          setIsLogin(true);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
    const savedBgColor = localStorage.getItem("bgColor");
    const savedTextColor = localStorage.getItem("textColor");
    const savedSelectedColor = localStorage.getItem("selectedColor");

    if (savedBgColor) {
      setBgColor(savedBgColor);
    }
    if (savedTextColor) {
      setTextColor(savedTextColor);
    }
    if (savedSelectedColor) {
      setSelectedColor(savedSelectedColor);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (user && chapters && chapters.length > 0 && isDataFetched) {
      const index = swiperRef.current.swiper.activeIndex; // Lấy index của slide hiện tại
      updateProgressAndTitle(index);
    }
  }, [user, chapters, updateProgressAndTitle, isDataFetched]);

  useEffect(() => {
    if (user && user.userID && progress !== 0) {
      const data = {
        userId: user.userID,
        bookId: getIdFromUrl(),
        progress: progress,
        activityType: false,
      };
      handleUpdateReadBook(data);
    } else if (!user || !user.userID) {
      console.log("Người dùng chưa đăng nhập. Không thể lưu lịch sử đọc sách.");
    }
  }, [progress, handleUpdateReadBook, user]);

  useEffect(() => {
    if (contentRef.current && chapters.length > 0) {
      const maxHeight = 520;
      const allSlides = chapters.flatMap((chap) =>
        splitContentIntoSlidesByHeight(
          chap.chapterContent,
          maxHeight,
          contentRef
        )
      );
      setSlides(allSlides);
    }
  }, [chapters]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleBgColorChange = (color) => {
    setBgColor(color);
    setSelectedColor(color);
    localStorage.setItem("bgColor", color);
    localStorage.setItem("selectedColor", color);

    if (color !== "bg-black") {
      setTextColor("text-black");
      localStorage.setItem("textColor", "text-black");
    } else {
      setTextColor("text-white");
      localStorage.setItem("textColor", "text-white");
    }
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className={`layout-web flex flex-col w-full min-h-screen  ${bgColor}`}>
      {/* Header read book */}
      <header className="flex items-center justify-between bg-[rgba(41,41,43,255)] h-14 text-white px-14">
        {/* Phần icon bên trái */}
        <div className="flex items-center">
          <Link to={`/book-details/${book.bookID}`}>
            <button className="text-white">
              {/* Icon mũi tên trái */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </Link>
        </div>

        {/* Title ở giữa */}
        <div className="flex-grow text-center py-3">
          <span className="font-bold text-xl">{book.title}</span>
        </div>

        {/* Phần icon bên phải */}
        <div className="flex items-center space-x-4">
          {/* Các icon như trong hình */}
          <button className="text-white">
            {/* Icon tai nghe */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8h-8-8"
              />
            </svg>
          </button>
          <div className="flex space-x-2">
            <button
              className="text-white  px-2 py-1 rounded"
              onClick={() => setShowModel(!showModel)}
            >
              <i className="fa-duotone fa-solid fa-font-case"></i>
            </button>
          </div>
          <button className="text-white" onClick={handleFullScreen}>
            <i className="text-lg fa-solid fa-compress-wide"></i>
          </button>
        </div>
      </header>
      {/* End header read book */}

      {/* Content Section */}
      <div
        ref={contentRef}
        className=" flex-grow max-w-4xl mx-auto p-8 shadow-lg rounded-lg"
      >
        {!isLogin && slides.length > 2 ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg">
            <h2 className="text-white text-center text-4xl mb-6 font-extrabold tracking-wide">
              Vui lòng đăng nhập để xem thêm
            </h2>
            <button
              // onClick={handleLogin} // Giả sử bạn có một hàm handleLogin để xử lý việc đăng nhập
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <Swiper
            range
            ref={swiperRef}
            spaceBetween={50}
            slidesPerView={1}
            allowTouchMove={false}
            onSlideChange={handleSlideChange}
          >
            {/* Trang đầu tiên hiển thị mục lục */}
            <SwiperSlide>
              <div className="p-6 rounded-lg shadow-lg">
                <h2 className="text-white text-center text-4xl mb-6 font-extrabold tracking-wide">
                  Mục Lục
                </h2>
                <ul className="text-white list-none pl-8 space-y-4">
                  {chapters.map((chapter, index) => (
                    <li
                      key={index}
                      className="text-lg font-medium hover:text-gray-300 transition-colors duration-200 font-serif"
                      onClick={() => {
                        const swiper = swiperRef.current?.swiper;
                        if (swiper) {
                          swiper.slideTo(index + 1); // Assuming the first slide is the table of contents
                        }
                      }}
                    >
                      {chapter.chapterTitle}
                    </li>
                  ))}
                </ul>
              </div>
            </SwiperSlide>
            {/* Hiển thị tất cả slider nếu đã đăng nhập hoặc có ít hơn 2 slider */}
            {slides.map((slideContent, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center p-4 overflow-visible">
                  <p
                    style={{ fontSize: `${fontSize}px` }}
                    className={`${textColor}`}
                    dangerouslySetInnerHTML={{
                      __html: slideContent,
                    }}
                  ></p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div>
          {/* Nút Previous */}
          <button
            id="prev-btn"
            onClick={handlePrev}
            className=" left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 border border-white border-opacity-15 w-14 h-14 flex fixed items-center justify-center rounded-full"
          >
            <img
              src="https://waka.vn/svgs/icon-back.svg"
              alt="Previous"
              className="w-8 h-8"
            />
          </button>

          {/* Nút Next */}
          <button
            id="next-btn"
            onClick={handleNext}
            className="fixed right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 border border-white border-opacity-15 w-14 h-14 flex items-center justify-center rounded-full"
          >
            <img
              src="https://waka.vn/svgs/icon-next-slide.svg"
              alt="next"
              className="w-8 h-8"
            />
          </button>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="flex items-center justify-between bg-[rgba(41,41,43,255)] h-14 text-white px-14 border-t border-gray-200 border-opacity-15 fixed bottom-0 left-0 right-0 z-50">
        {/* Progress Bar */}
        <div className="w-full px-28">
          <div className="flex justify-between">
            <p id="progress-text" className="text-start text-white-50">
              {currentChapterTitle}
            </p>
            <p id="progress-text" className="text-end text-white-50">
              {(progress || 0).toFixed(0)}%
            </p>
          </div>
          <input
            ref={progressBarRef}
            type="range"
            min="0"
            max="100"
            value={progress}
            className="w-full bg-slate-500 bg-opacity-20 rounded-full h-2"
            onChange={handleSlideChange}
            onMouseDown={handleMouseDown}
          />
          {/* Chấm tròn hiển thị vị trí hiện tại */}
        </div>
      </footer>
      {showModel && (
        <Popover
          down={() => handleFontSizeChange(fontSize - 1)}
          up={() => handleFontSizeChange(fontSize + 2)}
          color={handleBgColorChange}
          selectedColor={selectedColor}
        />
      )}
    </div>
  );
};

const Popover = ({ down, up, color, selectedColor }) => {
  console.log(selectedColor);
  return (
    <div className="absolute right-3 top-10 bg-black text-white p-4 rounded-lg w-64">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Nền</h2>
        <div className="flex space-x-2">
          <div
            className={`w-8 h-8 bg-gray-900 rounded-full ${
              selectedColor === "bg-black" ? "border-2 border-green-500" : ""
            }`}
            onClick={() => color("bg-black")}
          ></div>
          <div
            className={`w-8 h-8 bg-white rounded-full ${
              selectedColor === "bg-white" ? "border-2 border-green-500" : ""
            }`}
            onClick={() => color("bg-white")}
          ></div>
          <div
            className={`w-8 h-8 bg-gray-400 rounded-full ${
              selectedColor === "bg-gray-400" ? "border-2 border-green-500" : ""
            }`}
            onClick={() => color("bg-gray-400")}
          ></div>
          <div
            className={`w-8 h-8 bg-gray-300 rounded-full ${
              selectedColor === "bg-gray-300" ? "border-2 border-green-500" : ""
            }`}
            onClick={() => color("bg-gray-300")}
          ></div>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Cỡ và kiểu chữ</h2>
        <div className="flex space-x-2 mb-2">
          <button
            className="w-8 h-8 bg-gray-700 flex items-center justify-center rounded"
            onClick={down}
          >
            A-
          </button>
          <button
            className="w-8 h-8 bg-gray-700 flex items-center justify-center rounded"
            onClick={up}
          >
            A+
          </button>
        </div>
        <div className="bg-gray-700 p-2 rounded flex items-center justify-between mb-2">
          <span>Mặc định</span>
          <i className="fas fa-check text-green-500"></i>
        </div>
        <div className="space-y-2">
          <div>Netflix Sans</div>
          <div>Arial</div>
          <div>Bookerly</div>
          <div>Minion</div>
          <div>Times New Roman</div>
          <div>Roboto</div>
        </div>
      </div>
    </div>
  );
};

export default ReadBooks;
