import PropTypes from "prop-types";

export default function ForbiddenModal({ forbiddenStatus, emailContact, onClose }) {
  return (
    <>
      <div
        className="v-modal"
        id="v-modal"
      />
      <div
        data-v-da1ecd7c=""
        className="el-dialog__wrapper"
        style={{ zIndex: 2001 }}>
        <div
          id="modal-login"
          className="fixed inset-0 z-[2001] overflow-auto">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="dialog"
            className="el-dialog dialog-login"
            style={{ marginTop: "15vh", width: 500 }}>
            <div className="w-full h-full relative text-center p-[1.875rem]">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal">
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <button
                  className="sr-only   absolute top-4 right-4"
                  onClick={onClose}>
                  Close modal
                </button>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Do vi phạm các quy định và chính sách hoạt động, tài khoản của bạn đã bị {forbiddenStatus === "BANNED" ? "cấm" : "đình chỉ"}.
                </h3>
                <p className="pb-2">Nếu bạn muốn khiếu nại, vui lòng gửi email đến {emailContact}</p>
                <button   onClick={onClose}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                  Xác nhận
                </button>
                {/* <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button> */}
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

ForbiddenModal.propTypes = {
  forbiddenStatus: PropTypes.string.isRequired,
  emailContact: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
