import { useEffect, useState } from "react";
import LeftAsider from "../components/LeftAsiderProfile";
import ModelRestPass from "../components/ModelRestPass";
import { getUserFromToken, getUserByUsername } from "../service/AuthService";
import { getReadBooksbyUser } from "../service/API_ReadBook_Service";
import { getLikeByUser } from "../service/API_like_Service";
import BookcaseCard from "../components/CardEbook/BookcaseCard";

function Bookcase() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("ebook");
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [currentPageLikes, setCurrentPageLikes] = useState(1);
  const [likes, setLikes] = useState([]);
  const [itemsPerPage] = useState(12);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
        const userFromToken = getUserFromToken(token);

        if (!userFromToken) {
          console.error("No user found from token");
          return;
        }

        const userData = await getUserByUsername(userFromToken.sub);
        setUser(userData);
        console.log("User data:", userData);

        // Chạy các lời gọi API song song nếu không phụ thuộc vào nhau
        const [historyData, likesData] = await Promise.all([
          getReadBooksbyUser(userData.userID),
          getLikeByUser(userData.userID),
        ]);

        setHistory(historyData);
        console.log("History:", historyData);

        setLikes(likesData);
        console.log("Likes:", likesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Calculate pagination for history
  const lastIndexHistory = currentPageHistory * itemsPerPage;
  const firstIndexHistory = lastIndexHistory - itemsPerPage;
  const currentItemsHistory = history.slice(
    firstIndexHistory,
    lastIndexHistory
  );
  const totalPagesHistory = Math.ceil(history.length / itemsPerPage);

  // Calculate pagination for likes
  const lastIndexLikes = currentPageLikes * itemsPerPage;
  const firstIndexLikes = lastIndexLikes - itemsPerPage;
  const currentItemsLikes = likes.slice(firstIndexLikes, lastIndexLikes);
  const totalPagesLikes = Math.ceil(likes.length / itemsPerPage);

  const handleNextPageHistory = () => {
    if (currentPageHistory < totalPagesHistory) {
      setCurrentPageHistory(currentPageHistory + 1);
    }
  };

  const handlePreviousPageHistory = () => {
    if (currentPageHistory > 1) {
      setCurrentPageHistory(currentPageHistory - 1);
    }
  };

  const handleNextPageLikes = () => {
    if (currentPageLikes < totalPagesLikes) {
      setCurrentPageLikes(currentPageLikes + 1);
    }
  };
  const handlePreviousPageLikes = () => {
    if (currentPageLikes > 1) {
      setCurrentPageLikes(currentPageLikes - 1);
    }
  };

  const renderPageNumbers = (totalPages, currentPage, setCurrentPage) => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of pages to show in the middle
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    // Always show the first page
    pageNumbers.push(
      <button
        key="page-1"
        onClick={() => setCurrentPage(1)}
        className={`px-2 py-1.5 h-fit min-w-9 rounded-full text-center border ${
          currentPage === 1
            ? "bg-waka-500 text-white"
            : "hover:bg-gray-200 border-gray-400"
        }`}
      >
        <p>1</p>
      </button>
    );

    // Handle pages near the beginning
    if (currentPage <= maxPagesToShow - 1) {
      for (let i = 2; i <= Math.min(maxPagesToShow, totalPages - 1); i++) {
        pageNumbers.push(
          <button
            key={`page-${i}`}
            onClick={() => setCurrentPage(i)}
            className={`px-2 py-1.5 h-fit min-w-9 rounded-full text-center border ${
              currentPage === i
                ? "bg-waka-500 text-white"
                : "hover:bg-gray-200 border-gray-400"
            }`}
          >
            <p>{i}</p>
          </button>
        );
      }
      if (totalPages > maxPagesToShow) {
        pageNumbers.push(
          <span
            key="start-ellipsis"
            className="px-2 py-1.5 h-fit min-w-9 text-center"
          >
            ...
          </span>
        );
      }
    }

    // Handle pages in the middle
    else if (
      currentPage > maxPagesToShow - 1 &&
      currentPage < totalPages - halfMaxPagesToShow
    ) {
      pageNumbers.push(
        <span
          key="start-ellipsis"
          className="px-2 py-1.5 h-fit min-w-9 text-center"
        >
          ...
        </span>
      );

      for (
        let i = currentPage - halfMaxPagesToShow;
        i <= currentPage + halfMaxPagesToShow;
        i++
      ) {
        if (i > 1 && i < totalPages) {
          pageNumbers.push(
            <button
              key={`page-${i}`}
              onClick={() => setCurrentPage(i)}
              className={`px-2 py-1.5 h-fit min-w-9 rounded-full text-center border ${
                currentPage === i
                  ? "bg-waka-500 text-white"
                  : "hover:bg-gray-200 border-gray-400"
              }`}
            >
              <p>{i}</p>
            </button>
          );
        }
      }

      if (currentPage + halfMaxPagesToShow < totalPages - 1) {
        pageNumbers.push(
          <span
            key="end-ellipsis"
            className="px-2 py-1.5 h-fit min-w-9 text-center"
          >
            ...
          </span>
        );
      }
    }

    // Handle pages near the end
    else if (currentPage >= totalPages - halfMaxPagesToShow) {
      pageNumbers.push(
        <span
          key="start-ellipsis"
          className="px-2 py-1.5 h-fit min-w-9 text-center"
        >
          ...
        </span>
      );

      for (
        let i = Math.max(totalPages - maxPagesToShow + 1, 2);
        i < totalPages;
        i++
      ) {
        pageNumbers.push(
          <button
            key={`page-${i}`}
            onClick={() => setCurrentPage(i)}
            className={`px-2 py-1.5 h-fit min-w-9 rounded-full text-center border ${
              currentPage === i
                ? "bg-waka-500 text-white"
                : "hover:bg-gray-200 border-gray-400"
            }`}
          >
            <p>{i}</p>
          </button>
        );
      }
    }

    // Always show the last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-2 py-1.5 h-fit min-w-9 rounded-full text-center border ${
            currentPage === totalPages
              ? "bg-waka-500 text-white"
              : "hover:bg-gray-200 border-gray-400"
          }`}
        >
          <p>{totalPages}</p>
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="pt-[6.25rem] w-full mr-auto ml-auto pr-[3.75rem] pl-[3.75rem]">
        <div className="w-full flex relative h-full container">
          <LeftAsider
            fullName={user ? user.fullName : "Loading..."}
            endDate={user?.userSubscription[0]?.endDate || null}
            imgUser={
              user && user.userImage
                ? user.userImage
                : "https://s3v2.interdata.vn:9000/s3-586-15343-storage/dienthoaigiakho/wp-content/uploads/2024/01/16101418/trend-avatar-vo-danh-14.jpg"
            }
          />
          <div className="account-content h-full pt-6">
            <div className="px-5">
              <div className="mb-8 border-b border-slate-800">
                <div className="flex gap-6 py-3 tabs">
                  <div
                    className={`cursor-pointer flex items-center ${
                      activeTab === "ebook" ? "text-waka-500" : "text-white-300"
                    }`}
                    onClick={() => handleTabClick("ebook")}
                  >
                    <p className="font-medium text-[18px]">Đọc sách</p>
                  </div>
                  <div
                    className={`cursor-pointer flex items-center ${
                      activeTab === "accountSecurity"
                        ? "text-waka-500"
                        : "text-white-300"
                    }`}
                    onClick={() => handleTabClick("accountSecurity")}
                  >
                    <p className="font-medium text-[18px]">Nghe sách</p>
                  </div>
                  <div
                    className={`cursor-pointer flex items-center ${
                      activeTab === "likes"
                        ? "text-waka-500"
                        : "text-white-300 "
                    }`}
                    onClick={() => handleTabClick("likes")}
                  >
                    <p className="font-medium text-[18px]">Yêu thích</p>
                  </div>
                </div>
              </div>
              {activeTab === "ebook" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                    {currentItemsHistory.map((item, index) => (
                      <div key={index}>
                        <BookcaseCard
                          title={item.book.title}
                          img={item.book.bookImage}
                          book={item.book.bookID}
                          priceBook={item.book.price}
                          bookStatus={
                            item.book.bookBookTypes[0]?.accessType || ""
                          }
                          progress={item.progress}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center my-8">
                    <div className="flex gap-2 items-center">
                      {/* Previous Button */}
                      <button
                        onClick={handlePreviousPageHistory}
                        disabled={currentPageHistory === 1}
                        className={`w-9 h-9 rounded-full shadow-border flex items-center justify-center ${
                          currentPageHistory === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src="https://waka.vn/svgs/icon-chevron-left.svg"
                          alt="icon-chevron-left"
                        />
                      </button>

                      {renderPageNumbers(
                        totalPagesHistory,
                        currentPageHistory,
                        setCurrentPageHistory
                      )}
                      <button
                        onClick={handleNextPageHistory}
                        disabled={currentPageHistory === totalPagesHistory}
                        className={`w-9 h-9 rounded-full shadow-border flex items-center justify-center ${
                          currentPageHistory === totalPagesHistory
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src="https://waka.vn/svgs/icon-chevron-right.svg"
                          alt="icon-chevron-right"
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
              {activeTab === "likes" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                    {currentItemsLikes.map((item, index) => (
                      <div key={index}>
                        <BookcaseCard
                          title={item.book.title}
                          img={item.book.bookImage}
                          book={item.book.bookID}
                          priceBook={item.book.price}
                          bookStatus={
                            item.book.bookBookTypes[0]?.accessType || ""
                          }
                          progress={item.progress}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center my-8">
                    <div className="flex gap-2 items-center">
                      {/* Previous Button */}
                      <button
                        onClick={handlePreviousPageLikes}
                        disabled={currentPageLikes === 1}
                        className={`w-9 h-9 rounded-full shadow-border flex items-center justify-center ${
                          currentPageLikes === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src="https://waka.vn/svgs/icon-chevron-left.svg"
                          alt="icon-chevron-left"
                        />
                      </button>

                      {renderPageNumbers(
                        totalPagesLikes,
                        currentPageLikes,
                        setCurrentPageLikes
                      )}
                      <button
                        onClick={handleNextPageLikes}
                        disabled={currentPageLikes === totalPagesLikes}
                        className={`w-9 h-9 rounded-full shadow-border flex items-center justify-center ${
                          currentPageLikes === totalPagesLikes
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-200"
                        }`}
                      >
                        <img
                          src="https://waka.vn/svgs/icon-chevron-right.svg"
                          alt="icon-chevron-right"
                        />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookcase;
