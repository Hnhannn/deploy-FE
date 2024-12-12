import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPackagePlan, getPackagePlanID } from '../service/PackagePlan_API_Service';
import PaymentService from '../service/PaymentService';


function Payment() {
    const [openDropdown, setOpenDropdown] = useState(null); // null nếu không có dropdown nào mở
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("qr"); // Phương thức thanh toán đã chọn    
    const [selectedPlanID, setSelectedPlanID] = useState(null);
    const [plansAll, setPlansAll] = useState([]);  // All package plans
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [productPrice, setProductPrice] = useState(0);
    const navigate = useNavigate();

    const getIdFromUrl = () => {
        const pathArray = window.location.pathname.split("/");
        return pathArray[pathArray.length - 1]; // Giả sử id nằm ở cuối URL
    };

    useEffect(() => {
        const idFromUrl = getIdFromUrl();
        setSelectedPlanID(idFromUrl);
        const fetchPackagePlansID = async () => {
            try {

                const allPackage = await getAllPackagePlan();
                setPlansAll(allPackage);
            } catch (error) {
                console.error('Error fetching package plans:', error);
            }
        };
        fetchPackagePlansID();
    }, []);

    useEffect(() => {
        const fetchSelectedPlan = async () => {
            if (selectedPlanID) {
                try {
                    const data = await getPackagePlanID(selectedPlanID);
                    setSelectedPlan(data);
                    setProductPrice(data.price);
                    console.log('Selected plan:', data);
                } catch (error) {
                    console.error('Error fetching selected package plan:', error);
                }
            }
        };

        fetchSelectedPlan();
    }, [selectedPlanID]); // Khi selectedPlanID thay đổi, gọi lại API

    const handleProductSelect = (event) => {
        const newPlanID = event.target.value;
        setSelectedPlanID(newPlanID); // Cập nhật selectedPlanID khi người dùng chọn gói mới
    };

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    const selectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
    };

    const isPaymentMethodSelected = selectedPaymentMethod !== null;

    const handlePayment = async () => {
        if (isPaymentMethodSelected) {
            try {
                const data = await PaymentService.handlePayment(productPrice);
                if (data.redirectUrl) {
                    localStorage.setItem('value', selectedPlanID);
                    localStorage.setItem('paymentType', 'package');
                    window.location.href = data.redirectUrl; // Điều hướng đến trang thanh toán gói cước
                }
            } catch (error) {
                console.error("Error during payment:", error);
            }
        } else {
            console.log("Please select a payment method");
        }
    };

    return (
      <>
        <div className="relative z-[1]">
          <div>
            <div className="min-h-screen">
              <div className="h-[259px] w-full relative border-b border-[hsla(0,_0%,_100%,_.1)]">
                <div className="w-full px-14 py-12 absolute bottom-0 left-0 z-[11]">
                  <p className="font-bold text-[3.125rem] leading-[55px] text-white-50">
                    Chọn hình thức thanh toán
                  </p>
                  <p className="font-medium text-[19px] text-white">
                    An toàn - Nhanh chóng - Bảo mật
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex">
                <div className="flex-1">
                  <div className="w-full max-w-screen-md px-4 mx-auto">
                    <p className="font-medium text-base pt-12 pb-6 text-white-50">
                      Chọn phương thức thanh toán
                    </p>
                    <div className="flex flex-col gap-2">
                      <div>
                        <div
                          className={`w-full cursor-pointer p-3 rounded-xl hover:bg-white-overlay flex gap-x-3 items-center border transition-colors ${
                            selectedPaymentMethod === "qr"
                              ? "border-yuki-500"
                              : "border-[hsla(0,_0%,_100%,_.1)]"
                          }`}
                          onClick={() => selectPaymentMethod("qr")}
                        >
                          <div className="w-10 h-10 min-w-10 rounded-xl bg-white-overlay p-2">
                            <img
                              src="https://waka.vn/svgs/icon-money-card.svg"
                              alt="icon-pay-qr"
                              className="cursor-pointer"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center">
                              <p className="font-medium text-base text-white-50 ">
                                Thanh toán VNPay
                              </p>
                              {selectedPaymentMethod === "qr" && (
                                <img
                                  src="https://waka.vn/svgs/icon-check.svg" // Thay đổi thành URL của hình ảnh dấu tích
                                  alt="selected"
                                  className="ml-2"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="w-full pl-13 [transition:max-height_.75s] overflow-hiddenn max-h-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-l border-[hsla(0,_0%,_100%,_.1)] p-6 bg-white-overlay h-full w-[550px]">
                  <p className="font-medium text-base text-white-50 ">
                    Thông tin thanh toán
                  </p>
                  <table className="table-auto">
                    <tbody>
                      <tr>
                        <td>
                          <p className="font-normal text-[15px] text-white-300 py-2 pr-5 ">
                            Sản phẩm
                          </p>
                        </td>
                        <td>
                          <div className="w-full min-w-[270px]">
                            <div className="w-full relative">
                              <select
                                className="w-full rounded-xl border border-yuki-500 py-1 px-4 bg-white-overlay text-yuki-500 appearance-none"
                                aria-haspopup="list"
                                aria-controls="dropdown-menu-6735"
                                role="button"
                                tabIndex={0}
                                onChange={handleProductSelect}
                                value={selectedPlan ? selectedPlan.planID : ""}
                              >
                                {plansAll.map((plan) => (
                                  <option key={plan.planID} value={plan.planID}>
                                    {plan.planName} - {plan.price}đ
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="font-normal text-[15px] text-white-300 py-2 pr-5 ">
                            Giá sản phẩm
                          </p>
                        </td>
                        <td>
                          <p className="font-normal text-[15px] text-white-300 py-2 pr-5 ">
                            {selectedPlan && selectedPlan.price
                              ? `${selectedPlan.price.toLocaleString()}đ`
                              : "Loading..."}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p className="font-normal text-[15px] text-white-300 py-2 pr-5 ">
                            Hình thức thanh toán
                          </p>
                        </td>
                        <td>
                          <p className="leading-5 font-normal text-white-50 ">
                            {selectedPaymentMethod}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="w-full">
                    <button
                      type="button"
                      className={`text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap w-full button-primary ${
                        isPaymentMethodSelected
                          ? "bg-[#15b088] opacity-100"
                          : "bg-gray-500 opacity-50"
                      }`}
                      disabled={!isPaymentMethodSelected}
                      onClick={handlePayment} // Kích hoạt nút khi phương thức thanh toán đã được chọn
                    >
                      <span data-v-4e3aa8af="" className="">
                        Thanh toán
                      </span>
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

export default Payment;