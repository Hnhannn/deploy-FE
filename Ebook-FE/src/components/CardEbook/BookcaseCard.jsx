import { Link } from "react-router-dom";
export default function BookcaseCard({
  title,
  img,
  book,
  priceBook,
  bookStatus,
  progress,
}) {
  return (
    <div className="inline-block relative show-tooltip 2xl:w-[148px] cursor-pointer float-left lg:w-full w-full col-span-1">
      <Link
        to={
          progress !== null && progress >= 0
            ? `/read-book/${book}`
            : `/book-details/${book}`
        }
      >
        <div>
          <div className="relative w-full group">
            <div className="relative w-full overflow-hidden pt-full-265-388 grid-center rounded-xl">
              <img
                src={img || "/images/default-image.png"}
                alt="Thần thái uy nghi, dẫu quỳ vẫn oai"
                className="absolute top-0 left-0 object-cover w-full h-full"
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full book-border" />
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
            <div className="z-50">
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
            </div>
          </div>
          <a
            href="/ebook/than-thai-uy-nghi-dau-quy-van-oai-b4wyWW.html"
            className="text-f2f text-base-16-20 font-medium mt-4 h-[41px] t-ellipsis-2 hover:text-waka-500"
          >
            Thần thái uy nghi, dẫu quỳ vẫn oai
          </a>
          <div className="el-dialog__wrapper" style={{ display: "none" }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label="dialog"
              className="el-dialog dialog dialog-login "
              style={{ marginTop: "15vh", width: 424 }}
            >
              <div className="el-dialog__header">
                <span className="el-dialog__title" />
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div
        data-v-63f77c71=""
        className="el-dialog__wrapper"
        style={{ display: "none" }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="dialog"
          className="el-dialog  dialog dialog-login"
          style={{ marginTop: "15vh", width: 584 }}
        >
          <div className="el-dialog__header">
            <span className="el-dialog__title" />
          </div>
        </div>
      </div>
    </div>
  );
}
