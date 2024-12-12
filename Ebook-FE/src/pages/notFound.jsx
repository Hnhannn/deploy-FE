import { Link } from "react-router-dom";

function notFound() {

  return (
    <div className="page-error">
      <div>
        <div className="w-full px-[160px] pt-[5.5rem] top-0 min-h-[600px]">
          <p className="uppercase text-center font-medium">
            Không tìm thấy trang này
          </p>
          <div className="flex justify-center my-4">
            <img src="/images/404.png" alt="" />
          </div>
          <div className="text-center font-normal text-[14px] text-white-400 -mt-[65px]">
            Trang bạn yêu cầu không tồn tại hoặc có lỗi từ máy chủ.
          </div>
          <div className="text-center mt-[16px]">
            <Link to="/">
              <button className="uppercase font-medium text-[14px] text-white bg-green-500 px-6 py-3 rounded-[20px]">
                Về trang chủ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default notFound