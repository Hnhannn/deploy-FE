import { React, useEffect, useState } from "react";
import PackageCard from "../components/CardEbook/PackageCard";
import { getAllPackagePlan } from "../service/PackagePlan_API_Service";

function PackagePlans() {
  const [monthlyPlans, setMonthlyPlans] = useState([]);
  const [weeklyPlans, setWeeklyPlans] = useState([]);

  useEffect(() => {
    // Cuộn lên đầu trang với hiệu ứng mượt mà
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "Mua hội viên";

    const fetchPackagePlans = async () => {
      try {
        const data = await getAllPackagePlan();
        // Phân loại dữ liệu
        const monthly = data
          .filter((item) =>
            [30, 60, 90, 120, 150, 180, 270, 365].includes(item.duration)
          )
          .sort((a, b) => a.duration - b.duration); // Sắp xếp theo thứ tự tăng dần của duration
        const weekly = data
          .filter((item) => [7, 14, 21].includes(item.duration))
          .sort((a, b) => a.duration - b.duration); // Sắp xếp theo thứ tự tăng dần của duration
        setMonthlyPlans(monthly); // Cập nhật state cho gói tháng
        setWeeklyPlans(weekly); // Cập nhật state cho gói tuần
      } catch (error) {
        console.error("Error fetching package plans:", error);
      }
    };

    fetchPackagePlans();
  }, []);

  return (
    <div className="relative z-[1]">
      <div>
        <div className="min-h-screen">
          <div className="h-[259px] w-full bg-member-package-plan relative">
            <img
              src="https://waka.vn/target/dist/client/member-package-plan.jpg?v=1724898321460"
              alt="Member Package Plan"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[rgba(18,_18,_20,_.8)] z-10 h-[258px]" />
            <div className="w-full px-14 py-12 absolute bottom-0 left-0 z-[11]">
              <p className="font-bold text-[3.125rem] leading-[55px] text-white-50 ">
                Gói hội viên
              </p>
              <p className="font-medium text-[19px] text-white-50 ">
                Nghe và đọc hơn 20,000 nội dung thuộc Kho sách Hội viên
              </p>
            </div>
          </div>

          {/* Gói tháng */}
          <div className="container px-14 pt-10 z-30">
            <div>
              <p className="text-f2f font-medium text-[1.625rem] leading-[normal]">
                Gói tháng
              </p>
              <p className="text-f2f text-[.9375rem] leading-none font-normal mt-2 mb-8">
                Sử dụng tài khoản ngân hàng
              </p>
              <div className="w-full flex flex-wrap gap-x-[1.875rem] gap-y-10 items-center">
                {monthlyPlans.map((item, index) => (
                  <PackageCard
                    key={index} // Sử dụng ID của gói làm key
                    planID={item.planID}
                    planName={item.planName}
                    price={`${item.price}đ`} // Thêm ký hiệu tiền tệ
                    duration={item.duration}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gói tuần */}
          <div className="container px-14 pt-10 mb-[62px] z-30">
            <div>
              <p className="text-f2f font-medium text-[1.625rem] leading-[normal] mb-8">
                Gói tuần
              </p>
              <div className="w-full flex flex-wrap gap-x-[1.875rem] gap-y-10 items-center">
                {weeklyPlans.map((item, index) => (
                  <PackageCard
                    key={index} // Sử dụng ID của gói làm key
                    planID={item.planID}
                    planName={item.planName}
                    price={`${item.price}đ`} // Thêm ký hiệu tiền tệ
                    duration={item.duration}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-f2f px-14 font-normal text-[1rem] leading-[1.2] pt-8">
          Để biết thêm chi tiết và giải đáp các yêu cầu bạn vui lòng liên hệ
          chúng tôi thông qua
          <a href="mailto:support@waka.vn" className="text-green-500">
            support@yuki.vn
          </a>{" "}
          hoặc
          <a className="text-green-500">0123456789</a>
        </div>
      </div>
    </div>
  );
}

export default PackagePlans;
