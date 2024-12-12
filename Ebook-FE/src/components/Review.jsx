import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component"; // Ensure this is the correct import path
import PropTypes from "prop-types";
import ModelReiew from "./ModelReiew";
import { getReviewsByBookID } from "../service/API_Review_Service";

// import

function Review({ checkRead, checkOrder, userID, bookID }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [selectedReview, setSelectedReview] = useState(null);
  const userReview = reviews.find((review) => review.user.userID === userID);
  const isLogin = userID !== null;


  // Calculate the number of reviews for each rating
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByBookID(bookID);
        setReviews(data);
        setLoading(false);
        console.log("Reviews:", data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [bookID]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const reviewDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - reviewDate) / 1000); // Chênh lệch thời gian tính theo giây

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

  const showMoreReview = () => {
    setVisibleReviews(visibleReviews + 2);
  };

  const handleAddReview = (newReview) => {
    if (!isLogin) {
      return;
    }
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const handleEditReview = (review) => {
    if (!isLogin) {
      return;
    }
    setSelectedReview(review);
    setShowModel(true);
  };

  return (
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
                      style={{ width: `${ratingPercentages[4]}%` }}
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
                      style={{ width: `${ratingPercentages[3]}%` }}
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
                      style={{ width: `${ratingPercentages[2]}%` }}
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
                      style={{ width: `${ratingPercentages[1]}%` }}
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
                      style={{ width: `${ratingPercentages[0]}%` }}
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
          .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
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
                            {review.user.fullName || "Đang cập nhật"}{" "}
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
          <p className="text-16-16 text-white-400">Chưa có đánh giá nào.</p>{" "}
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
          readID={checkRead}
          orderID={checkOrder}
          userID={userID}
          bookID={bookID}
          review={selectedReview}
          onAddReview={handleAddReview}
        />
      )}
    </div>
  );
}

Review.propTypes = {
  checkRead: PropTypes.array.isRequired,
  checkOrder: PropTypes.array.isRequired,
  setShowModel: PropTypes.func.isRequired,
};
export default Review;
