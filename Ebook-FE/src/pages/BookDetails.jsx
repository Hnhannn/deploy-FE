import { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { Link, useParams, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import truncate from "html-truncate";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  Scrollbar,
} from "swiper/modules";
import { message } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactStars from "react-rating-stars-component";
import EbookCard from "../components/CardEbook/EbookCard";
import { getBookById, getRandomBook } from "../service/API_Book_Service";
import LoginModal from "../components/LoginModal";
import ModelReiew from "../components/ModelReiew";
import ModelVIP from "../components/ModelVIP";
import { getReadBooks } from "../service/API_ReadBook_Service";
import { getOrderDetailsbyBookAndUser } from "../service/API_OrderDetail_Service";
import { getUserFromToken, getUserByUsername } from "../service/AuthService";
import { getReviewsByBookID } from "../service/API_Review_Service";
import { getBookTypes } from "../service/API_BookType_Service";
import { addToCart } from "../service/API_Cart_Service";
import {
  addLike,
  getLikeByBook,
  deleteLike,
} from "../service/API_like_Service";
import { MultiStepContext } from "../components/Form/StepContext";

function BookDetails() {
  const navigate = useNavigate();
  const { id: bookID } = useParams(); // Get the book ID from the URL parameters
  const handleBuyBook = () => {
    navigate(`/preorder/${bookID}`);
  };
  const { setCartItems } = useContext(MultiStepContext);
  const [book, setBook] = useState([]); // Khởi tạo book là một object
  const [isExpanded, setIsExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [checkRead, setCheckRead] = useState(0);
  const [checkOrder, setCheckOrder] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalVIP, setShowModalVIP] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);
  const [selectedBookType, setSelectedBookType] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likeID, setLikeID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [randomBook, setRandomBook] = useState([]);
  const userReview = reviews.find(
    (review) => review.user.userID === user?.userID
  );

  const handleReadBookClick = (e) => {
    if (!isLogin) {
      e.preventDefault();
      message.error("Vui lòng đăng nhập để đọc sách");
      setShowModal(true);
    }
  };

  const handleAddReview = (newReview) => {
    if (!isLogin) {
      return;
    }

    setReviews((prevReviews) => {
      const existingReviewIndex = prevReviews.findIndex(
        (review) => review.user.userID === newReview.user.userID
      );

      if (existingReviewIndex !== -1) {
        // Update the existing review
        const updatedReviews = [...prevReviews];
        updatedReviews[existingReviewIndex] = newReview;
        return updatedReviews;
      } else {
        // Add a new review
        return [newReview, ...prevReviews];
      }
    });
  };

  const handleBookTypeClick = (bookTypeID) => {
    if (book.bookBookTypes.some((type) => type.bookTypeID === bookTypeID)) {
      setSelectedBookType(bookTypeID);
    }
  };

  const getIdFromUrl = () => {
    const pathArray = window.location.pathname.split("/");
    return pathArray[pathArray.length - 1]; // Giả sử id nằm ở cuối URL
  };

  const showMoreReview = () => {
    setVisibleReviews(visibleReviews + 2);
  };

  const handleEditReview = (review) => {
    if (!isLogin) {
      return;
    }
    setSelectedReview(review);
    setShowModel(true);
  };

  const handleLikes = async () => {
    const like = {
      bookId: bookID,
      userId: user.userID,
    };
    try {
      const response = await addLike(like);
      setIsLiked(true);
      setLikeID(response.likeID); // Assuming the response contains the likeID
    } catch (error) {
      console.error("Error adding like:", error);
    }
  };

  useEffect(() => {
    if (book.bookBookTypes && book.bookBookTypes.length > 0) {
      setSelectedBookType(book.bookBookTypes[0].bookTypeID);
    }
  }, [book.bookBookTypes]);

  const handleDeleteLikes = async (likeID) => {
    try {
      const response = await deleteLike(likeID);
      setIsLiked(false);
      setLikeID(null); // Clear the likeID after deletion
    } catch (error) {
      console.error("Error removing like:", error);
    }
  };

  useEffect(() => {
    // Cuộn lên đầu trang với hiệu ứng mượt mà
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "YuKi - Đam Mê Đọc Sách, Kết Nối Tri Thức!";
    const id = getIdFromUrl();
    const token = localStorage.getItem("token"); // Giả sử token được lưu trong localStorage
    const userFromToken = getUserFromToken(token);
    setIsLogin(!!userFromToken); // Kiểm tra xem user đã đăng nhập chưa

    const fetchBookDetails = async () => {
      try {
        const review = await getReviewsByBookID(id);
        setReviews(Array.isArray(review) ? review : []);
        if (userFromToken) {
          try {
            const userData = await getUserByUsername(userFromToken.sub);
            setUser(userData);
            const readBooks = await getReadBooks(userData.userID, id);
            if (readBooks.length > 0) {
              setCheckRead(readBooks[0].readID);
            } else {
              console.log("No read books found");
            }

            const orderDetails = await getOrderDetailsbyBookAndUser(
              id,
              userData.userID
            );
            if (orderDetails.length > 0) {
              setCheckOrder(orderDetails[0].orderDetailID);
            } else {
              console.log("No order details found");
            }
            const likeStatus = await getLikeByBook(bookID, userData.userID);
            console.log("Like status:", likeStatus);

            if (likeStatus) {
              setIsLiked(true);
              setLikeID(likeStatus.likeID); // Accessing likeID directly from the object
            } else {
              setIsLiked(false);
              setLikeID(null);
            }

            console.log(
              "Like ID:",
              likeStatus ? likeStatus.likeID : "No like found"
            );
          } catch (error) {
            console.error("Error fetching user or books:", error);
          }
        }
        // Fetch the book details by ID
        const data = await getBookById(id);
        setBook(data);
        const random = await getRandomBook();
        setRandomBook(random);
      } catch (error) {
        console.error("Error fetching book details or comments:", error);
        navigate("/*"); // Navigate to "not found" page
      }
    };
    const fetchBookTypes = async () => {
      try {
        const response = await getBookTypes();
        setBookTypes(response);
      } catch (error) {
        console.error("Error fetching book types:", error);
      }
    };

    fetchBookTypes();
    fetchBookDetails();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentTime) / 1000); // Chênh lệch thời gian tính theo giây

    if (diffInSeconds < 60) {
      return "Vừa đăng"; // Nếu dưới 1 phút
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`; // Nếu dưới 1 giờ
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`; // Nếu dưới 1 ngày
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`; // Nếu dưới 1 tháng
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} tháng trước`; // Nếu dưới 1 năm
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      const currentTitle = document.title;
      try {
        await navigator.share({
          title: currentTitle,
          text: "Trang web này hay lắm!",
          url: window.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Chia sẻ không được hỗ trợ trên trình duyệt này.");
    }
  };

  const handleAddToCart = async () => {
    const cartItem = {
      quantity: 1,
      userID: user.userID, // Replace with the actual user ID
      bookID: book.bookID, // Replace with the actual book ID
    };
    try {
      const cartData = await addToCart(cartItem);
      setCartItems((prevItems) => {
        // Check if the item already exists in the cart
        const existingItem = prevItems.find(
          (item) => item.book.bookID === cartItem.bookID
        );
        if (existingItem) {
          // Update the quantity of the existing item if it's less than the limit
          return prevItems.map((item) =>
            item.book.bookID === cartItem.bookID
              ? {
                  ...item,
                  quantity:
                    item.quantity < 5
                      ? item.quantity + cartItem.quantity
                      : item.quantity,
                }
              : item
          );
        } else {
          // Add the new item to the cart
          return [...prevItems, { ...cartItem, ...cartData }];
        }
      });
      message.success("Thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  /// Calculate the number of reviews for each rating
  const ratingCounts = [0, 0, 0, 0, 0];
  let totalRating = 0;
  reviews.forEach((review) => {
    ratingCounts[review.rating - 1]++;
    totalRating += review.rating;
  });

  // Calculate the percentage of each rating
  const totalReviews = reviews.length;
  const ratingPercentages = ratingCounts.map(
    (count) => (count / totalReviews) * 100
  );
  // Calculate the average rating
  const averageRating =
    totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

  const Rating = Math.ceil(totalRating / totalReviews);

  const selectedType = book.bookBookTypes?.find(
    (type) => type.bookTypeID === selectedBookType
  );

  return (
    <>
      {/* Content */}
      <div>
        <div className="blur-layer-1 absolute top-[206px] right-1/2 z-0"></div>
        <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
        <div className="pt-20 w-full mr-auto ml-auto pr-[3.75rem] pl-[3.75rem]">
          <div className="flex inline-flex">
            <a
              href="/"
              className="cursor-pointer text-13-13 text-f2f nuxt-link-active"
            >
              Trang chủ
            </a>
            <img
              src="https://waka.vn/svgs/icon-chevron-right.svg"
              alt="icon-chevron-right"
              className="cursor-pointer w-[13px] h-[13px] mx-1"
            />
            <a
              href="#"
              aria-current="page"
              className="cursor-pointer text-13-13 text-f2f nuxt-link-exact-active nuxt-link-active"
            >
              {book.title}
            </a>
          </div>
        </div>
        <div className="flex justify-between mt-3 px-14">
          <div className="h-[504px] rounded-[771px] opacity-[.5] bg-[linear-gradient(180deg,_#16b68e_-16.8%,_#0b5b47_117.58%)] absolute top-[206px] right-1/2 z-0" />
          <div className="h-[847px] rounded-[847px] opacity-[.2] bg-[#fff] absolute top-[206px] right-1/2 z-0" />
          <div className="sticky top-[10%] w-[400px] z-20 h-full mr-[3.75rem]">
            {/* Khung chứa ảnh sách với kích thước cố định */}
            <div className="relative w-[335px] h-[491px] mb-10 mr-14">
              {/* Đường viền bao quanh ảnh sách */}
              <div className="absolute inset-0 border-4 border-red-500 rounded-xl" />
              {/* Ảnh sách */}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <img
                  alt={book.title}
                  src={book.bookImage || "/images/default-image.png"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              {selectedType && (
                <div>
                  {selectedType.accessType === "Miễn phí" ? (
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
                  ) : (
                    <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                      <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-pink-500 text-white rounded-bl-[12px] rounded-tr-[12px]">
                        {book.price > 0
                          ? `${book.price.toLocaleString("vi-VN")}đ`
                          : "Miễn phí"}
                      </p>
                      <img
                        src="https://waka.vn/svgs/icon-sale.svg"
                        alt="icon-sale"
                        className="cursor-pointer absolute top-0 right-0"
                      />
                    </div>
                  )}

                  {selectedType.accessType === "Hội viên" && (
                    <div className="absolute top-0 right-0 pl-3 w-[8.5rem] h-[1.75rem]">
                      <p className="py-1 px-3 h-7 font-medium uppercase text-[16px] leading-[16px] bg-orange-500 text-white rounded-bl-[12px] rounded-tr-[12px]">
                        HỘI VIÊN
                      </p>
                      <img
                        src="https://waka.vn/svgs/icon-member.svg"
                        alt="icon-member"
                        className="cursor-pointer absolute top-0 right-0"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="w-[54%] z-20 between-content mr-15">
            <div className="pb-4 border-b border-white-overlay">
              <h1 className="text-white-50 text-[2.25rem] leading-none font-medium">
                {book.title}
              </h1>
              <div className="flex mt-4 items-center">
                <span className="text-white-50 block mr-2 text-lg font-semibold">
                  {averageRating}
                </span>
                <ReactStars
                  key={Rating}
                  count={5} // Số sao tối đa
                  value={Rating} // Ensure value is a number
                  size={20} // Kích thước sao
                  edit={false} // Không cho phép chỉnh sửa
                  activeColor="#ffd700" // Màu sao được chọn
                  classNames="flex items-center"
                />
                <p className="text-white-50 ml-2">
                  <span className="text-white-400">・</span> {reviews.length}{" "}
                  đánh giá
                </p>
              </div>

              <div className="mt-4 grid z-30 relative cus-grid grid-cols-4">
                <div className="col-span-1 cus-col-span">
                  <p className="text-white-400 text-16-16 mb-[11px]">Tác giả</p>
                  <div className="text-white-50 text-16-16 mt-[2px] sm:mt-0 xl:mt-[2px]">
                    {book.authorBooks && book.authorBooks.length > 0 ? (
                      book.authorBooks.map((authorBook) => (
                        <p
                          key={authorBook.authorBookID}
                          className="text-white-50 text-16-16"
                        >
                          {authorBook.author.authorName}
                        </p>
                      ))
                    ) : (
                      <p className="text-white-50 text-16-16">Đang cập nhật</p>
                    )}
                  </div>
                </div>
                <div className="col-span-1 cus-col-span">
                  <p className="text-white-400 text-16-16 mb-[11px]">
                    Thể loại
                  </p>
                  <div className="text-white-50 text-16-16 mt-1 sm:mt-0 xl:mt-1">
                    {book.bookCategories && book.bookCategories.length > 0 ? (
                      book.bookCategories.map((category) => (
                        <p
                          key={category.bookCategoryID}
                          className="text-white-50 text-16-16"
                        >
                          {category.category.categoryName}
                        </p>
                      ))
                    ) : (
                      <p className="text-white-50 text-16-16">Đang cập nhật</p>
                    )}
                  </div>
                </div>
                <div className="col-span-1 cus-col-span">
                  <p className="text-white-400 text-16-16 mb-[11px]">
                    Nhà xuất bản
                  </p>
                  <p className="text-white-50 text-16-16">
                    {book.publisher ? (
                      book.publisher.publisherName
                    ) : (
                      <p className="text-white-50 text-16-16">Đang cập nhật</p>
                    )}
                  </p>
                </div>
                <div className="col-span-1 cus-col-span ml-5 sm:ml-0">
                  <p className="text-white-400 text-16-16 mb-[11px]">
                    Gói cước
                  </p>
                  {book.bookBookTypes && book.bookBookTypes.length > 0 ? (
                    book.bookBookTypes.map((type) => (
                      <p
                        key={type.bookBookTypeID}
                        className="text-white-50 text-16-16"
                      >
                        {type.accessType}
                      </p>
                    ))
                  ) : (
                    <p className="text-white-50 text-16-16">Đang cập nhật</p>
                  )}
                  {book.price > 0 && (
                    <p className="text-white-50 text-16-16">Mua lẻ</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-[1.875rem] ">
              <div className="flex items-center mb-[1.875rem]">
                <div className="pr-3 flex items-center cursor-pointer">
                  <span className="text-white-400 text-16-16 mb-1">
                    Chọn loại sách
                  </span>
                </div>
                <div className="px-3 flex items-center cursor-pointer mr-3 justify-center">
                  <div className="relative w-[310px] h-[36px] text-white-400 text-16-16 rounded-[9px] bg-[hsla(0,_0%,_100%,_.1)] rounded-lg flex items-center justify-center z-30">
                    {bookTypes.map((type) => (
                      <div
                        key={type.bookTypeID}
                        onClick={() => handleBookTypeClick(type.bookTypeID)}
                        className={`w-[234px] h-[32px] cursor-pointer rounded-[7px] m-[3px] inline-flex items-center justify-center text-center ${
                          selectedBookType === type.bookTypeID
                            ? "text-gray-300 bg-[hsla(0,_0%,_100%,_.1)] text-bold"
                            : ""
                        }`}
                      >
                        <span className="text-14-14 inline-flex items-center justify-center text-center">
                          {type.typeName}
                        </span>
                      </div>
                    ))}
                    {selectedBookType === 3 && (
                      <div
                        data-v-7b91b081=""
                        className="absolute right-0 -top-8"
                      >
                        <img
                          data-v-7b91b081=""
                          src="https://waka.vn/images/hot.gif"
                          alt=""
                          className="cursor-pointer w-12 h-12"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedBookType === 3 && (
                <div className="flex items-center mb-[1.875rem]">
                  <div className="pr-3 flex items-center cursor-pointer">
                    <span className="text-white-400 text-16-16 mb-1">
                      Giá sách giấy
                    </span>
                  </div>
                  <div className="px-3 flex items-center cursor-pointer mr-3 justify-center">
                    <p className="font-medium text-pink-500 text-3xl-32-32">
                      {book.price
                        ? new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(book.price)
                        : "Miễn phí"}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center relative z-30">
                {book.bookBookTypes &&
                book.bookBookTypes.length > 0 &&
                book.bookBookTypes[0].accessType === "Hội viên" &&
                user &&
                user.userSubscription &&
                user.userSubscription.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowModalVIP(true)}
                    className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer button-primary bg-green-700"
                  >
                    <img
                      src="https://waka.vn/svgs/icon-book-blank.svg"
                      alt="icon-book-blank"
                      className="cursor-pointer mr-2"
                    />
                    <span>Đọc sách</span>
                  </button>
                ) : (
                  <Link
                    to={`/read-book/${book.bookID}`}
                    onClick={handleReadBookClick}
                  >
                    {selectedBookType === 1 && (
                      <button
                        type="button"
                        className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer button-primary bg-green-700"
                      >
                        <img
                          src="https://waka.vn/svgs/icon-book-blank.svg"
                          alt="icon-book-blank"
                          className="cursor-pointer mr-2"
                        />
                        <span>Đọc sách</span>
                      </button>
                    )}
                    {selectedBookType === 2 && (
                      <button
                        type="button"
                        className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer button-primary bg-green-700"
                      >
                        <img
                          src="https://waka.vn/svgs/icon-play.svg"
                          alt="icon-book-blank"
                          className="cursor-pointer mr-2"
                        />
                        <span>Nghe sách</span>
                      </button>
                    )}
                  </Link>
                )}
                {book.bookChapters &&
                  book.bookChapters.length > 0 &&
                  book.bookChapters[0].audioLink &&
                  selectedBookType === 1 && (
                    <Link onClick={handleReadBookClick}>
                      <button
                        type="button"
                        className="text-white-default ml-3 text-16-16  rounded-full flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer  button-primary bg-[hsla(0,_0%,_100%,_.1)]"
                      >
                        <img
                          src="https://waka.vn/svgs/icon-play.svg"
                          alt="icon-book-blank"
                          className="cursor-pointer mr-2"
                        />
                        <span>Nghe sách</span>
                      </button>
                    </Link>
                  )}
                {book.bookChapters &&
                  book.bookChapters.length > 0 &&
                  book.bookChapters[0].audioLink &&
                  selectedBookType === 2 && (
                    <Link onClick={handleReadBookClick}>
                      <button
                        type="button"
                        className="text-white-default ml-3 text-16-16  rounded-full flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer  button-primary bg-[hsla(0,_0%,_100%,_.1)]"
                      >
                        <img
                          src="https://waka.vn/svgs/icon-book-blank.svg"
                          alt="icon-book-blank"
                          className="cursor-pointer mr-2"
                        />
                        <span>Đọc sách</span>
                      </button>
                    </Link>
                  )}
                {selectedBookType === 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isLogin) {
                        handleBuyBook();
                      } else {
                        message.error("Vui lòng đăng nhập để mua sách");
                        setShowModal(true);
                      }
                    }}
                    className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-[233px] py-3 px-4 cursor-pointer button-primary bg-green-700"
                  >
                    <img
                      src="https://waka.vn/svgs/icon-buy-book.svg"
                      alt="icon-book-blank"
                      className="cursor-pointer mr-2"
                    />
                    <span>Mua sách ngay</span>
                  </button>
                )}
                {showModal &&
                  createPortal(
                    <LoginModal onClose={() => setShowModal(false)} />,
                    document.body
                  )}
                {selectedBookType !== 3 ? (
                  <>
                    <div
                      className="p-3 btn-icon inline-block ml-3 rounded-full bg-[hsla(0,_0%,_100%,_.1)]"
                      onClick={() => {
                        if (isLogin) {
                          isLiked
                            ? () => handleDeleteLikes(likeID)
                            : handleLikes;
                        } else {
                          message.error("Vui lòng đăng nhập để thích sách");
                          setShowModal(true);
                        }
                      }}
                    >
                      <img
                        src={
                          isLiked
                            ? "https://waka.vn/svgs/liked_heart.svg"
                            : "https://waka.vn/svgs/icon-heart.svg"
                        }
                        alt="icon-heart"
                        className="cursor-pointer"
                      />
                    </div>
                    <div
                      className="p-3 btn-icon inline-block ml-3 rounded-full bg-[hsla(0,_0%,_100%,_.1)]"
                      onClick={handleShare}
                    >
                      <img
                        src="https://waka.vn/svgs/icon-share.svg"
                        alt="icon-share"
                        className="cursor-pointer"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        if (isLogin) {
                          handleAddToCart();
                        } else {
                          message.error(
                            "Vui lòng đăng nhập để thêm vào giỏ hàng"
                          );
                          setShowModal(true);
                        }
                      }}
                      className="p-3 btn-icon inline-block ml-3 w-12 h-12 rounded-full bg-[hsla(0,_0%,_100%,_.1)] flex items-center justify-center"
                    >
                      <i className="fa-solid fa-cart-shopping cursor-pointer"></i>
                    </div>
                    <div
                      className="p-3 btn-icon inline-block ml-3 rounded-full bg-[hsla(0,_0%,_100%,_.1)]"
                      onClick={handleShare}
                    >
                      <img
                        src="https://waka.vn/svgs/icon-share.svg"
                        alt="icon-share"
                        className="cursor-pointer"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-[3.75rem] mb-[3.75rem] mr-[.75rem]">
                <div className="relative">
                  <div className="text-16 text-white-50 text-justify check-des">
                    <p>
                      {isExpanded ? (
                        <span
                          dangerouslySetInnerHTML={{ __html: book.description }}
                        />
                      ) : (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: truncate(
                              DOMPurify.sanitize(book.description),
                              300
                            ),
                          }}
                        />
                      )}
                      <span
                        className="read-more cursor-pointer text-green-400"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? " Thu gọn" : " Xem thêm"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-white-default text-[1.625rem] leading-[normal] font-medium mb-4">
                Độc giả nói gì về “{book.title}”
              </div>
              <div>
                <div>
                  <div className="flex gap-6 py-3 tabs pb-4 border-b border-white-overlay">
                    <div
                      className={
                        "cursor-pointer flex items-centertext-white-300 font-normal"
                      }
                    >
                      <p>Đánh giá &amp; nhận xét ({reviews.length})</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="text-white-50 py-4 px-6 rounded-xl bg-[rgb(28,28,30)] bg-opacity-100">
                      <div className="flex items-center">
                        <div className="mr-10">
                          <h4 className="font-bold text-[4rem] leading-[70.4px] text-white-default">
                            {averageRating}
                          </h4>
                          <p className="text-white-400 text-14-14 mt-3">
                            {reviews.length} đánh giá
                          </p>
                        </div>
                        <div className="flex-1 min-w-[300px] mt-5">
                          {/* 5 sao */}
                          <div className="flex items-center flex-1 mb-[.625rem]">
                            <div className="flex items-center justify-end w-20">
                              {[...Array(5)].map((_, i) => (
                                <img
                                  key={i}
                                  src="https://waka.vn/svgs/icon-star-active.svg"
                                  alt="icon-star-active"
                                  className="cursor-pointer"
                                />
                              ))}
                            </div>
                            <div className="flex-1 ml-[1.875rem]">
                              <div
                                role="progressbar"
                                aria-valuenow={ratingPercentages[4]}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className="review-progress"
                              >
                                <div className="relative w-full h-2 !bg-[#2c2c2e] rounded overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-yellow-300 rounded-xl"
                                    style={{
                                      width: `${ratingPercentages[4]}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* 4 sao */}
                          <div className="flex items-center flex-1 mb-[.625rem]">
                            <div className="flex items-center justify-end w-20">
                              {[...Array(4)].map((_, i) => (
                                <img
                                  key={i}
                                  src="https://waka.vn/svgs/icon-star-active.svg"
                                  alt="icon-star-active"
                                  className="cursor-pointer"
                                />
                              ))}
                            </div>
                            <div className="flex-1 ml-[1.875rem]">
                              <div
                                role="progressbar"
                                aria-valuenow={ratingPercentages[3]}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className="review-progress"
                              >
                                <div className="relative w-full h-2 !bg-[#2c2c2e] rounded overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-yellow-300 rounded-xl"
                                    style={{
                                      width: `${ratingPercentages[3]}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* 3 sao */}
                          <div className="flex items-center flex-1 mb-[.625rem]">
                            <div className="flex items-center justify-end w-20">
                              {[...Array(3)].map((_, i) => (
                                <img
                                  key={i}
                                  src="https://waka.vn/svgs/icon-star-active.svg"
                                  alt="icon-star-active"
                                  className="cursor-pointer"
                                />
                              ))}
                            </div>
                            <div className="flex-1 ml-[1.875rem]">
                              <div
                                role="progressbar"
                                aria-valuenow={ratingPercentages[2]}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className="review-progress"
                              >
                                <div className="relative w-full h-2 !bg-[#2c2c2e] rounded overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-yellow-300 rounded-xl"
                                    style={{
                                      width: `${ratingPercentages[2]}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* 2 sao */}
                          <div className="flex items-center flex-1 mb-[.625rem]">
                            <div className="flex items-center justify-end w-20">
                              {[...Array(2)].map((_, i) => (
                                <img
                                  key={i}
                                  src="https://waka.vn/svgs/icon-star-active.svg"
                                  alt="icon-star-active"
                                  className="cursor-pointer"
                                />
                              ))}
                            </div>
                            <div className="flex-1 ml-[1.875rem]">
                              <div
                                role="progressbar"
                                aria-valuenow={ratingPercentages[1]}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className="review-progress"
                              >
                                <div className="relative w-full h-2 !bg-[#2c2c2e] rounded overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-yellow-300 rounded-xl"
                                    style={{
                                      width: `${ratingPercentages[1]}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* 1 sao */}
                          <div className="flex items-center flex-1 mb-[.625rem]">
                            <div className="flex items-center justify-end w-20">
                              <img
                                src="https://waka.vn/svgs/icon-star-active.svg"
                                alt="icon-star-active"
                                className="cursor-pointer"
                              />
                            </div>
                            <div className="flex-1 ml-[1.875rem]">
                              <div
                                role="progressbar"
                                aria-valuenow={ratingPercentages[0]}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                className="review-progress"
                              >
                                <div className="relative w-full h-2 !bg-[#2c2c2e] rounded overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-yellow-300 rounded-xl"
                                    style={{
                                      width: `${ratingPercentages[0]}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {(checkRead > 0 || checkOrder > 0) && (
                        <div>
                          {userReview ? (
                            <div className="mt-5 flex items-center justify-end">
                              <button
                                onClick={() => handleEditReview(userReview)}
                                type="button"
                                className="text-white-default text-16-16 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap py-3 px-6 text-16-16 button-primary bg-green-500"
                              >
                                <img
                                  src="https://waka.vn/svgs/icon-write.svg" // Use an edit icon
                                  alt="icon-edit"
                                  className="cursor-pointer mr-2"
                                />
                                <span>Chỉnh sửa đánh giá</span>
                              </button>
                            </div>
                          ) : (
                            <div className="mt-5 flex items-center justify-end">
                              <button
                                onClick={() => setShowModel(true)}
                                type="button"
                                className="text-white-default text-16-16 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap py-3 px-6 text-16-16 button-primary bg-green-500"
                              >
                                <img
                                  src="https://waka.vn/svgs/icon-write.svg"
                                  alt="icon-write"
                                  className="cursor-pointer mr-2"
                                />
                                <span>Viết đánh giá</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {reviews && reviews.length > 0 ? (
                      reviews
                        .sort(
                          (a, b) =>
                            new Date(b.reviewDate) - new Date(a.reviewDate)
                        )
                        .slice(0, visibleReviews)
                        .map((review, index) => (
                          <div key={index} className="mt-2">
                            <div className="text-white-50 py-4 px-6 rounded-xl bg-[rgb(28,28,30)] bg-opacity-100">
                              <div>
                                <div>
                                  <div className="bg-background-item rounded-xl mb-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <img
                                          src={
                                            review.user.profileImageUrl ||
                                            "https://cdn.vegaid.vn/VxGVOCyj2W/160x160x1639881800/cbb/469/079/cbb469079126422a40ebb35008639498.jpg"
                                          } // Use dynamic image if available
                                          className="w-[2.625rem] h-[2.625rem] rounded-full object-cover"
                                          alt="user profile"
                                        />
                                        <h5 className="text-[1.1875rem] leading-none text-white-50 ml-4">
                                          {review.user.fullName ||
                                            "Đang cập nhật"}{" "}
                                          {/* Use dynamic username */}
                                        </h5>
                                      </div>
                                      <div className="flex flex-col items-start">
                                        <span className="text-sm text-gray-500">
                                          {review.reviewDate
                                            ? formatTimeAgo(review.reviewDate)
                                            : "Vừa đăng"}
                                        </span>
                                        <ReactStars
                                          key={review.rating}
                                          count={5}
                                          value={review.rating}
                                          size={24}
                                          edit={false}
                                          activeColor="#ffd700"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <p className="pl-14 text-16-16 text-white-50 mt-2">
                                    {review.reviewContent}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center justify-center flex-col">
                        <img
                          src="https://waka.vn/images/review-empty.png"
                          alt=""
                          className="cursor-pointer"
                        />{" "}
                        <p className="text-16-16 text-white-400">
                          Chưa có đánh giá nào.
                        </p>{" "}
                        <p className="text-16-16 text-white-400">
                          Hãy trở thành người đầu tiên đánh giá nội dung này.
                        </p>
                      </div>
                    )}
                    {reviews && reviews.length > visibleReviews && (
                      <div className="flex items-center justify-center mt-6">
                        <button
                          onClick={showMoreReview}
                          className="pt-[.625rem] pb-[.625rem] px-6 border border-[#2C2C2E] text-white-default rounded-full text-[1rem] leading-5"
                        >
                          Xem thêm
                        </button>
                      </div>
                    )}
                    {showModel && (
                      <ModelReiew
                        onClose={() => setShowModel(false)}
                        userID={user.userID}
                        bookID={bookID}
                        review={selectedReview}
                        onAddReview={handleAddReview}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          <div className="static top-[10%] w-[300px] flex justify-end z-[1] ml-[15px] max-h-[300px]">
            <div className="relative w-full">
              <div className="w-full bg-white bg-opacity-50 p-4 rounded-3xl border border-white border-opacity-50 relative">
                <img
                  src="https://waka.vn/svgs/icon-bg-buy-retail.svg"
                  alt="icon-bg-buy-retail"
                  className="cursor-pointer absolute top-0 left-1/2 transform -translate-x-1/2"
                />
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 uppercase text-[13px] font-bold text-white flex items-center justify-center">
                  <span>Mua lẻ</span>
                  <img
                    src="https://waka.vn/svgs/icon-buy-retail.svg"
                    alt="icon-buy-retail"
                    className="cursor-pointer ml-1"
                  />
                </div>
                <p className="text-pink-500 text-center mt-8">
                  <span className="text-2xl font-medium">79.000</span>
                  <span className="text-2xl font-medium border-b-2 border-pink-500">
                    đ
                  </span>
                </p>
                {/* <Link to={`/preorder`}> */}
                <button
                  onClick={handleBuyBook}
                  className="bg-white bg-opacity-50 w-full py-3 rounded-full text-white text-[1rem] mt-4"
                >
                  Mua lẻ sách điện tử
                </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/* Bạn có thể thích */}
        <div className="w-full px-14 mt-[3.75rem]">
          {/* Start product */}
          <div className="w-full mt-4">
            {/* Title */}
            <div className="flex items-center mb-6">
              <h2 className="text-white text-[1.625rem] leading-none font-medium cursor-pointer">
                Bạn có thể thích
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
                      {Array.isArray(randomBook) &&
                        randomBook.map((item, index) => (
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
                    {Array.isArray(randomBook) && randomBook.length > 0
                      ? randomBook.map((item, index) => (
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
        {
          // Modal VIP
          showModalVIP && (
            <ModelVIP
              img={book.bookImage}
              onClose={() => setShowModalVIP(false)}
            />
          )
        }
      </div>
    </>
  );
}

export default BookDetails;
