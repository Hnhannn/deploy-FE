import React, { useState } from 'react';
import ModelSupport from '../components/ModelSupport';

function Failed_Payment() {
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal

    // Hàm mở modal
    const showModalSupport = () => {
        setIsModalOpen(true);
    };

    // Hàm đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-background h-screen w-full">
                <div className="blur-result-layer-1 absolute right-1/2 z-0 h-full" />{" "}
                <div className="blur-result-layer-2 absolute left-1/2 z-0 h-full" />{" "}
                <div className="relative z-[1] flex justify-center items-center flex-col h-screen">
                    <div>
                        <img
                            src="https://waka.vn/svgs/icon-purchased-fail.svg"
                            alt="icon-purchased-fail"
                            className="cursor-pointer mx-auto"
                        />
                        <p className="text-[26px] whitespace-nowrap text-white-50 text-center">
                            Thanh toán không thành công!
                        </p>
                        <p className="font-normal text-[15px] whitespace-nowrap text-white-50 text-center">
                            Đã có lỗi trong quá trình thanh toán
                        </p>
                        <p className="font-normal text-[15px] whitespace-nowrap text-white-50 text-center">
                            Bạn vui lòng kiểm tra và thử lại. Hoặc có thể liên hệ hỗ trợ
                        </p>
                        <div className="mt-8 flex gap-4">
                            <button
                                data-v-53a258fe=""
                                className="bg-white-overlay border border-white-overlay py-2 px-4 rounded-full text-white-default text-[1rem] leading-5 button-secondary whitespace-nowrap w-full py-3 px-6"
                                onClick={showModalSupport} // Mở modal khi nhấn nút
                            >
                                Yêu cầu hỗ trợ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hiển thị Modal khi isModalOpen là true */}
            {isModalOpen && <ModelSupport onClose={closeModal} />}
        </>
    );
}

export default Failed_Payment;
