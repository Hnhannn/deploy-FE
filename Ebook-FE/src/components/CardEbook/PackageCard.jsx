import React from 'react';
import { Link } from "react-router-dom";

function PackageCard({ planID, planName, price, duration }) {
    // Chuyển đổi giá và thời gian thành số
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, "")); // Xóa ký tự không phải số
    const numericDuration = Number(duration);

    // Tính giá mỗi ngày
    const pricePerDay = numericDuration > 0 ? (numericPrice / numericDuration).toFixed(2) : 'N/A';

    // Định dạng giá tiền
    const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numericPrice);
    const formattedPricePerDay = numericDuration > 0 ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricePerDay) : 'N/A';

    return (
        <div className="h-fit rounded-xl bg-white-overlay divider y divide-white-overlay flex flex-col items-center w-[273px] border border-white-overlay hover:border-green-500">
            {/* <div className="bg-red-400 px-6 py-1 rounded-b-lg">
                <p className="font-bold text-[13px] uppercase text-white-50">
                    Phổ biến
                </p>
            </div> */}
            <div className="py-4 flex flex-col items-center">
                <div className="text-center">
                    <p className="uppercase font-medium text-[19px] whitespace-nowrap text-white-50 py-2 ">
                        {planName}
                    </p>
                </div>
            </div>
            <div className="w-full text-center border-t border-white-overlay pt-4 pb-6 px-10">
                <p className="font-medium text-[26px] whitespace-nowrap text-white-50 ">
                    {formattedPrice}
                </p>
                <p className="text-[13px] whitespace-nowrap text-white-50 ">
                    {formattedPricePerDay} / ngày
                </p>
                <Link to={`/payment/${planID}`}>
                    <button className="w-full mt-3.5 bg-[hsla(0,_0%,_100%,_.1)] border border-white-overlay py-3 rounded-full text-white-50 hover:bg-green-400">
                        Mua gói
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default PackageCard;
