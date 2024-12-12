export default function ModelVIP({ onClose, img }) {
  return (
    <>
      <div className="v-modal" id="v-modal" />
      <div id="modal-login" className="fixed inset-0 z-[2001] overflow-auto">
        <div
          className="el-dialog dialog-login"
          style={{ marginTop: "15vh", width: 584 }}
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
              <div className="px-20">
                <div className="mb-6">
                  <h1 className="text-[1.625rem] leading-[normal] mb-2 text-white-default">
                    Thông báo
                  </h1>
                  <p className="text-[.9375rem] leading-none text-white-50">
                    Để đọc hết nội dung cuốn sách này bạn cần nâng cấp gói hội
                    viên YUKI
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {/* Container cho hình ảnh */}
                  <div className="relative w-1/3 overflow-hidden rounded-xl aspect-[265/388]">
                    <img
                      src={img || "/images/default-image.png"}
                      alt="Thần thái uy nghi, dẫu quỳ vẫn oai"
                      className="absolute inset-0 object-contain w-full h-full"
                    />
                  </div>

                  {/* Phần email */}
                  <button
                    className="mt-5 w-full py-3 rounded-full bg-green-500 text-white cursor-pointer"
                    onClick={() => (window.location.href = "/package-plans")}
                  >
                    Mua hội viên
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
