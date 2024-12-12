import { Link } from "react-router-dom";
import LoadingSkeleton from "../Loading/LoadingSkeleton";

function EbookCard({ title, img, book, priceBook, bookStatus, progress }) {
  return (
    <div className="inline-block relative lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer mr-[42px] last:mr-[50px]">
      <Link
        to={
          progress !== null && progress >= 0
            ? `read-book/${book}`
            : `/book-details/${book}`
        }
      >
        <div className="relative w-full group">
          {progress !== null && progress >= 0 && (
            <div>
              <div className="absolute right-2 bottom-8 z-20 transform transition-transform duration-200 group-hover:scale-110">
                <img
                  src="https://waka.vn/svgs/icon-continue-read.svg"
                  alt="icon-continue-read"
                  className="cursor-pointer w-10-5 h-10-5"
                />
              </div>
              <div className="absolute w-[92%] ml-2 bottom-4 h-[.375rem] rounded bg-[rgba(18,_18,_20,_.6)] from-gray-700 to-gray-900 p-[1px] shadow-lg z-20">
                <div
                  className="h-1 rounded bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="relative w-full overflow-hidden rounded-xl">
            <img
              src={img || "/images/default-image.png"}
              alt="Đập nồi bán sắt đi học"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full book-border" />
          {/* Thay thế lớp book-border với border tùy chỉnh */}
          {priceBook === 0 && bookStatus === "Miễn phí" ? (
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
                {`${priceBook.toLocaleString("vi-VN")}đ`}{" "}
                {/* Hiển thị giá với định dạng tiền tệ */}
              </p>
              <img
                src="https://waka.vn/svgs/icon-sale.svg"
                alt="icon-sale"
                className="cursor-pointer absolute top-0 right-0"
              />
            </div>
          )}

          {priceBook === 0 && bookStatus === "Hội viên" && (
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
          )}
        </div>
      </Link>
      <Link
        to={
          progress !== null && progress >= 0
            ? `read-book/${book}`
            : `/book-details/${book}`
        }
        className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-green-500 block mt-2"
      >
        {title}
      </Link>
    </div>
  );
}

const LoadingPage = () => {
  return (
    <div className="inline-block relative lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer mr-[42px] last:mr-[50px]">
      <div className="relative w-full">
        <div className="relative overflow-hidden rounded-xl">
          <LoadingSkeleton className="w-[267px] h-[360px] object-cover rounded-xl" />
        </div>
        {/* <div className="absolute top-0 left-0 w-full h-full book-border" /> */}
      </div>
      <div className="text-f2f text-base-16-20 font-medium py-3 h-[41px] t-ellipsis-2 hover:text-green-500 block">
        <LoadingSkeleton className=" rounded-full h-4 w-40"></LoadingSkeleton>
      </div>
    </div>
  );
};

EbookCard.LoadingPage = LoadingPage;

export default EbookCard;
