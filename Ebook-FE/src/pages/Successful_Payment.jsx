import React from 'react';
import { Link } from "react-router-dom";

function Successful_Payment() {
    return (
        <>
            <div className="bg-background h-screen w-full">
                <div className="blur-result-layer-1 absolute right-1/2 z-0 h-full" />
                <div className="blur-result-layer-2 absolute left-1/2 z-0 h-full" />
                <div className="relative z-[1] flex justify-center items-center flex-col h-screen">
                    <div>
                        <img
                            src="https://waka.vn/svgs/icon-purchased-success.svg" // Thay đổi hình ảnh để biểu thị thanh toán thành công
                            alt="icon-purchased-success"
                            className="cursor-pointer mx-auto"
                        />
                        <p className="text-[26px] whitespace-nowrap text-white-50 text-center">
                            Thanh toán thành công!
                        </p>
                        <p className="font-normal text-[15px] whitespace-nowrap text-white-50 text-center">
                            Cảm ơn bạn đã thanh toán.
                        </p>
                        <p className="font-normal text-[15px] whitespace-nowrap text-white-50 text-center">
                            Đơn hàng của bạn đã được xác nhận.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <Link to="/">
                                <button
                                    type="button"
                                    className="text-white-default text-[1rem] leading-5 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full py-3 px-6 button-primary bg-yuki-500"
                                >
                                    <span>
                                        Tiếp tục mua sắm
                                    </span>
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Successful_Payment
