import { useState, useEffect } from "react";
import ReactStars from "react-rating-stars-component";
import PropTypes from "prop-types";
import { createReview, updateReview } from "../service/API_Review_Service";

const ReactStarsWrapper = ({
  value = 5, // Giá trị mặc định cho số sao
  count = 5, // Tổng số sao
  size = 24, // Kích thước sao
  activeColor = "#ffd700", // Màu sắc sao được chọn
  onChange = () => {}, // Hàm callback khi thay đổi
  ...props
}) => {
  return (
    <ReactStars
      key={value}
      value={value}
      count={count}
      size={size}
      activeColor={activeColor}
      onChange={onChange}
      {...props}
    />
  );
};

ReactStarsWrapper.propTypes = {
  size: PropTypes.number,
  count: PropTypes.number,
  isHalf: PropTypes.bool,
  value: PropTypes.number,
  color: PropTypes.string,
  activeColor: PropTypes.string,
  emptyIcon: PropTypes.node, // `node` is used for React elements
  onChange: PropTypes.func,
};

function ModelReiew({ onClose, userID, bookID, review, onAddReview }) {
  const [charCount, setCharCount] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
    setReviewContent(e.target.value);
  };

  useEffect(() => {
    if (review) {
      setReviewContent(review.reviewContent);
      setRating(review.rating);
    }
  }, [review]);

  console.log("ran", rating);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewDTO = {
      reviewContent: reviewContent,
      rating: rating,
      bookId: bookID,
      userId: userID,
    };

    try {
      let response;
      if (review) {
        // Update existing review
        response = await updateReview(review.reviewID, reviewDTO);
        console.log("Review updated:", response);
      } else {
        // Create new review
        response = await createReview(reviewDTO);
        console.log("Review created:", response);
      }
      if (response) {
        onAddReview(response); // Đồng bộ review trả về từ backend
      }
      console.log("Review created:", response);
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <>
      <div className="v-modal" id="v-modal" />;
      <div id="modal" className="fixed inset-0 z-[2001] overflow-auto">
        <div
          className="el-dialog dialog-login"
          style={{ marginTop: "15vh", width: 424 }}
        >
          <div className="el-dialog__body">
            <div className="w-full h-full relative text-center p-[1.875rem]">
              <div className="absolute top-4 right-4" onClick={onClose}>
                <img
                  src="https://waka.vn/svgs/icon-close-white.svg"
                  alt="icon-close-white"
                  className="cursor-pointer"
                />
              </div>

              <div>
                <h3 className="text-[1.625rem] leading-none mb-6 text-white-50">
                  Đánh giá và nhận xét
                </h3>
                <div className="flex items-center mb-4">
                  <p className="text-15-15 text-white-50 text-left mr-4">
                    Đánh giá
                  </p>
                  <div className="flex items-center justify-center">
                    <ReactStarsWrapper
                      count={5}
                      onChange={handleRatingChange}
                      size={24}
                      activeColor="#ffd700"
                      value={rating}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-15-15 text-white-50 text-left mb-3">
                    Nhận xét
                  </p>
                  <div>
                    <textarea
                      maxLength={300}
                      placeholder="Hãy cho chúng mình một vài nhận xét và đóng góp ý kiến nhé "
                      className="review-textarea bg-transparent w-full border-white-600 border py-2 px-4 focus:outline-none focus:ring-0  outline-none text-white-default rounded-xl text-15-15 min-h-30"
                      style={{ height: 132 }}
                      defaultValue={""}
                      value={reviewContent}
                      onChange={handleTextChange}
                    />
                    <p>
                      <span className="text-white-300 text-13-13">
                        {charCount}/300
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3-5 mt-6  button-primary bg-green-500"
                >
                  {/**/}
                  <span className="">Gửi nhận xét</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ModelReiew.propTypes = {
  onClose: PropTypes.func.isRequired,
  userID: PropTypes.number.isRequired,
  bookID: PropTypes.number.isRequired,
  review: PropTypes.shape({
    reviewContent: PropTypes.string,
    rating: PropTypes.number,
    reviewID: PropTypes.number,
  }),
  onAddReview: PropTypes.func.isRequired, // Add prop type for onAddReview
};

export default ModelReiew;
