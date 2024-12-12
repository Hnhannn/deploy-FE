export default function ModelSupport({ onClose }) {
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
                    Bạn cần hỗ trợ
                  </h1>
                  <p className="text-[.9375rem] leading-none text-white-50">
                    Liên hệ với chúng tôi thông qua các kênh hỗ trợ
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="flex items-center cursor-pointer justify-center bg-white-overlay border border-white-overlay py-2 px-4 rounded-full text-white-default text-[1rem] leading-5 button-secondary whitespace-nowrap">
                    <img
                      src="https://waka.vn/svgs/icon-messenger.svg"
                      alt="icon-messenger"
                      className="cursor-pointer mr-2"
                    />
                    <span>Messenger</span>
                  </div>
                  <div className="flex items-center justify-center cursor-pointer bg-white-overlay border border-white-overlay py-2 px-4 rounded-full text-white-default text-[1rem] leading-5 button-secondary whitespace-nowrap">
                    <img
                      src="https://waka.vn/svgs/icon-zalo.svg"
                      alt="icon-zalo"
                      className="cursor-pointer mr-2"
                    />
                    <span>Zalo</span>
                  </div>
                </div>
                <span className="text-15-15 text-white-50 block text-center my-4">
                  Hoặc
                </span>
                <div>
                  <div className="mb-2 flex items-center justify-start cursor-pointer bg-white-overlay border border-white-overlay py-3 px-4 rounded-full text-white-default text-[1rem] leading-5 button-secondary whitespace-nowrap">
                    <img
                      src="https://waka.vn/svgs/icon-telephone.svg"
                      alt="icon-telephone"
                      className="cursor-pointer mr-2"
                    />
                    <span>Hotline 0374003493</span>
                  </div>
                  <div className="mb-2 flex items-center justify-start cursor-pointer bg-white-overlay border border-white-overlay py-3 px-4 rounded-full text-white-default text-[1rem] leading-5 button-secondary whitespace-nowrap">
                    <img
                      src="https://waka.vn/svgs/icon-help-white.svg"
                      alt="icon-help-white"
                      className="cursor-pointer mr-2"
                    />
                    <span>Tổng đài 1900545482 nhánh 5</span>
                  </div>
                  <div className="mb-2 flex items-center justify-start cursor-pointer bg-white-overlay border border-white-overlay py-3 px-4 rounded-full text-white-default text-[1rem] leading-5 button-secondary whitespace-nowrap">
                    <img
                      src="https://waka.vn/svgs/icon-email.svg"
                      alt="icon-email"
                      className="cursor-pointer mr-2"
                    />
                    <span>Email support@waka.vn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
