import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MultiStepContext } from "./StepContext";

function BookFormThree() {
  const { setStep, BookData, setBookData } = useContext(MultiStepContext);

  console.log(BookData);
  return (
    <div>
      <div className="text-center text-lg font-normal text-black-222 mb-6">
        Bạn đã đăng đủ 5 chương truyện
        <br />
        Bạn có thể Đăng truyện ngay bây giờ hoặc tiếp tục thêm Chương
      </div>
      {/* <div className="text-center text-lg font-normal text-black-222 mb-6">
        Khi tiến hành đăng truyện, bạn đã chấp nhận các chính sách và quy định
        của Waka về
        <a href="https://sangtac.waka.vn/authorRules">
          <span className="text-cdv">
            Quy định Nội dung <br />
            và Chính sách chia sẻ quyền lợi
          </span>
        </a>
      </div> */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-4">
          <Link to="/admin/story-book">
            <button className="border text-white w-40 py-2 px-4 rounded-3xl">
              Hủy
            </button>
          </Link>

          <button
            className="bg-green-500 text-white w-40 py-2 px-4 rounded-3xl"
            onClick={async () => {
              try {
                const response = await fetch(
                  "http://localhost:8080/rest/books",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(BookData), // Convert BookData to JSON
                  }
                );

                if (response.ok) {
                  const data = await response.json();
                  console.log("Book submitted successfully:", data);
                  setStep(2); // Move to the next step if needed
                } else {
                  console.error("Failed to submit book:", response.statusText);
                }
              } catch (error) {
                console.error("Error submitting book:", error);
              }
            }}
          >
            Đăng Sách
          </button>
          <button className="bg-purple-200 bg-opacity-96 text-purple-600 w-40 py-2 px-4 rounded-3xl">
            Lưu tạm
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookFormThree;
