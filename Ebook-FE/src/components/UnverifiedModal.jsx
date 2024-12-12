import PropTypes from "prop-types";

export default function UnverifiedModal({ unverifiedEmail, onSendOtp, onCancel }) {
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
            style={{ marginTop: "15vh", width: 884 }}>
            <div className="flex justify-center">
              <div className="max-w-md mx-auto text-center px-4 sm:px-8 py-10 rounded-xl shadow text-white">
                <h2 className="text-lg font-semibold mb-4">Tài khoản chưa được xác thực</h2>
                <p className="mb-6">Email xác thực: {unverifiedEmail}</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => onSendOtp(unverifiedEmail)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Xác thực
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    Hủy
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
UnverifiedModal.propTypes = {
  unverifiedEmail: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSendOtp: PropTypes.func.isRequired,
};
