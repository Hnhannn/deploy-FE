import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserByUsername, getUserFromToken } from "../service/AuthService";
import BookPaymentService from "../service/BookPaymentService";
import Modal from "../components/ModalAddress";
import { MultiStepContext } from "../components/Form/StepContext";

function PreOrderToCart() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // Phương thức thanh toán đã chọn
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { cartItems } = useContext(MultiStepContext);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [newPlan, setNewPlan] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const hasSavedAddress = addresses.length > 0;
  const [showModal, setShowModal] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const isPaymentMethodSelected = selectedPaymentMethod !== null;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "Thanh toán";
    fetchProvinces();
    const token = localStorage.getItem("token");
    const userToken = getUserFromToken(token);

    if (userToken) {
      getUserByUsername(userToken.sub)
        .then((userData) => {
          setUserId(userData.userID);
          setFullName(userData);
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, []);

useEffect(() => {
  const fetchAddresses = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/rest/address/user/${userId}`
        );
        setAddresses(response.data);
        console.log(response.data);

        if (response.data.length > 0) {
          setSelectedProvince(String(response.data[0].city));
          setSelectedDistrict(String(response.data[0].district));
          setSelectedWard(String(response.data[0].wardCode));
          setIsFormValid(true);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    }
  };

  fetchAddresses();
}, [userId]);

  const fetchProvinces = async () => {
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
    const apiKey = "00f57f4d-141f-11ef-b1d4-92b443b7a897";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      setProvinces(data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district";
    const apiKey = "00f57f4d-141f-11ef-b1d4-92b443b7a897";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: apiKey,
        },
        body: JSON.stringify({
          province_id: parseInt(provinceId),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      setDistricts(data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward";
    const apiKey = "00f57f4d-141f-11ef-b1d4-92b443b7a897";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: apiKey,
        },
        body: JSON.stringify({
          district_id: parseInt(districtId),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();
      setWards(data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      calculateShippingFee();
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  const calculateShippingFee = async () => {
    setErrors({});
    const toDistrictId = selectedDistrict; // ID quận
    const toWardCode = selectedWard; // Mã xã/phường

    const url =
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
    const apiKey = "3ca27473-a8a4-11ef-8e53-0a00184fe694";
    const shopId = "195409";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: apiKey,
          ShopId: shopId,
        },
        body: JSON.stringify({
          service_type_id: 2, // Kiểu dịch vụ (2 là dịch vụ giao hàng tiết kiệm)
          from_district_id: 1572, // ID quận xuất phát (điền vào ID quận của cửa hàng bạn)
          to_district_id: parseInt(toDistrictId), // ID quận đích
          to_ward_code: toWardCode, // Mã xã/phường đích
          height: 10, // Kích thước sản phẩm (ví dụ: 10cm)
          length: 10,
          weight: 1, // Trọng lượng sản phẩm (ví dụ: 1kg)
          width: 10,
          insurance_value: 0, // Giá trị bảo hiểm (0 nếu không có bảo hiểm)
          cod_failed_amount: 0,
          coupon: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Error calculating shipping fee");
      }

      const data = await response.json();
      setShippingFee(data.data.service_fee); // Lấy phí vận chuyển từ phản hồi của API
    } catch (error) {
      console.error("Error calculating shipping fee:", error);
    }
  };

  const selectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
  };

  const calculateTotalPrice = () => {
    const cartTotal = cartItems.reduce(
      (total, item) => total + (item.book?.price || 0) * (item.quantity || 1),
      0
    );
    return cartTotal + shippingFee;
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error(
        "Vui lòng chọn phương thức thanh toán trước khi tiến hành thanh toán!"
      );
      return;
    }
    if (isFormValid) {
      const paymentMethodId = selectedPaymentMethod === "qr" ? 1 : 3;

      console.log("Payment method ID:", paymentMethodId);

      const orderData = {
        userId: userId,
        paymentMethodId: paymentMethodId,
        orderStatus:
          selectedPaymentMethod === "qr" ? "Đã xác nhận" : "Chờ xác nhận",
        totalAmount: calculateTotalPrice(),
      };
      try {
        if (selectedPaymentMethod === "qr") {
          const data = await BookPaymentService.handlePayment(
            calculateTotalPrice()
          );
          if (data.redirectUrl) {
            // Save temporary information to localStorage
            localStorage.setItem("tempOrderData", JSON.stringify(orderData));
            localStorage.setItem("address", JSON.stringify(addresses[0]));
            localStorage.setItem("paymentType", "book");
            localStorage.setItem("orderStatus", "confirmed");
            localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Lưu cartItems vào localStorage
            window.location.href = data.redirectUrl;
          }
        } else if (selectedPaymentMethod === "cod") {
          const response = await axios.post(
            "http://localhost:8080/rest/order",
            orderData
          );
          const orderId = response.data.orderID; // Extract the order ID from the response
          // Create order details
          const orderDetails = cartItems.map((item) => ({
            orderId: orderId,
            bookId: item.book.bookID,
            quantity: item.quantity,
            price: item.book.price,
          }));
          console.log(orderDetails);
          await axios.post(
            "http://localhost:8080/rest/orderDetail",
            orderDetails
          );
          if (response.status === 201) {
            await axios.delete(
              `http://localhost:8080/rest/cartdetails/deleteCart/${userId}`
            );

            localStorage.setItem("orderStatus", "pending");
            localStorage.setItem("address", JSON.stringify(addresses[0]));
            localStorage.setItem("user", JSON.stringify(fullName));
            localStorage.setItem("orderId", orderId);
            window.location.href = "/order_successfully";
          }
        }
      } catch (error) {
        console.error("Error during payment:", error);
        toast.error("Có lỗi xảy ra khi thanh toán!");
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    const addressRegex = /^[a-zA-Z0-9À-ỹ\s,.-/]+$/;

    if (!newPlan.name) {
      errors.name = "Họ và tên không được trống";
    } else if (!nameRegex.test(newPlan.name)) {
      errors.name = "Họ và tên không được chứa ký tự đặc biệt";
    }

    if (!newPlan.phone) {
      errors.phone = "Số điện thoại không được trống";
    } else if (isNaN(newPlan.phone)) {
      errors.phone = "Số điện thoại phải là số.";
    } else if (!phoneRegex.test(newPlan.phone)) {
      errors.phone = "Số điện thoại không đúng định dạng";
    }

    if (!selectedProvince) {
      errors.province = "Chưa chọn tỉnh/thành phố";
    }

    if (!selectedDistrict) {
      errors.district = "Chưa chọn quận/huyện";
    }

    if (!selectedWard) {
      errors.ward = "Chưa chọn phường/xã";
    }

    if (!newPlan.address) {
      errors.address = "Địa chỉ cụ thể nhận hàng không được trống";
    } else if (!addressRegex.test(newPlan.address)) {
      errors.address =
        "Địa chỉ cụ thể nhận hàng chỉ có số, chữ và các ký tự hợp lệ như dấu - , dấu chấm, dấu phẩy, dấu /";
    }

    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const getProvinceName = (provinceId) => {
    const province = provinces.find(
      (p) => p.ProvinceID === parseInt(provinceId)
    );
    return province ? province.ProvinceName : "";
  };

  const getDistrictName = (districtId) => {
    const district = districts.find(
      (d) => d.DistrictID === parseInt(districtId)
    );
    return district ? district.DistrictName : "";
  };

  const getWardName = (wardId) => {
    const ward = wards.find((w) => w.WardCode === wardId);
    return ward ? ward.WardName : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const addressData = {
        userId: userId,
        addressLine: `${newPlan.name}, ${newPlan.address}, ${getWardName(
          selectedWard
        )}, ${getDistrictName(selectedDistrict)}, ${getProvinceName(
          selectedProvince
        )}`,
        suburb: selectedWard,
        district: selectedDistrict,
        city: selectedProvince,
        phoneNumber: newPlan.phone,
      };
      console.log(addressData);
      try {
        const response = await axios.post(
          "http://localhost:8080/rest/address",
          addressData
        );
        if (response.status === 201) {
          toast.success("Địa chỉ đã được lưu thành công!");
          setAddresses([...addresses, response.data]);
        }
      } catch (error) {
        console.error("Error saving address:", error);
        toast.error("Có lỗi xảy ra khi lưu địa chỉ!");
      }
    }
  };

  const openEditModal = (address) => {
    setCurrentAddress(address);
    setShowModal(true);
  };

  return (
    <>
      <ToastContainer />
      <div className="pt-[6.25rem] w-full mr-auto ml-auto pr-[3.75rem] pl-[3.75rem]">
        <div className="flex min-h-screen gap-[3.75rem]">
          <div className="flex-1">
            <div>
              <h1 className="text-[26px] font-medium text-white-50 pb-5">
                Địa chỉ nhận hàng
              </h1>
              <div className="w-full bg-[rgb(28,28,30)] rounded-xl p-6 animate-[appearing_.3s_linear_alternate]">
                {addresses.length === 0 ? (
                  <form onSubmit={handleSubmit}>
                    <div className="w-full flex pt-1">
                      <p className="text-white-50 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">
                        Họ và tên người nhận
                      </p>
                      <div className="flex-1">
                        <div className="w-full bg-[rgb(44,44,46)] h-12 rounded-xl text-white-50 overflow-hidden">
                          <input
                            placeholder="Nhập họ và tên người nhận"
                            max={100}
                            className="bg-inherit w-full h-full px-6 placeholder:text-white-400"
                            name="name"
                            value={newPlan.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-white-50 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">
                        Số điện thoại
                      </p>
                      <div className="flex-1">
                        <div className="w-full bg-[rgb(44,44,46)] h-12 rounded-xl text-white-50 overflow-hidden">
                          <input
                            placeholder="Nhập số điện thoại"
                            max={100}
                            className="bg-inherit w-full h-full px-6 placeholder:text-white-400"
                            name="phone"
                            value={newPlan.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-white-50 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">
                        Tỉnh/Thành phố
                      </p>
                      <div className="flex-1">
                        <div className="w-full bg-[rgb(44,44,46)] h-12 rounded-xl text-white-400 overflow-hidden">
                          <select
                            className="bg-inherit w-full h-full px-6 placeholder:text-white-400 border border-[#1f1e1e] focus:outline-none focus:border-[#1f1e1e] focus:shadow-none"
                            id="provinceSelect"
                            name="province"
                            value={selectedProvince}
                            onChange={(e) => {
                              handleInputChange(e);
                              setSelectedProvince(e.target.value);
                              fetchDistricts(e.target.value);
                            }}
                          >
                            <option value="">Chọn tỉnh/thành phố</option>
                            {provinces.map((province) => (
                              <option
                                key={province.ProvinceID}
                                value={province.ProvinceID}
                              >
                                {province.ProvinceName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.province && (
                          <p className="text-red-500 text-sm">
                            {errors.province}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-white-50 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">
                        Quận/Huyện
                      </p>
                      <div className="flex-1">
                        <div className="w-full bg-[rgb(44,44,46)] h-12 rounded-xl text-white-400 overflow-hidden">
                          <select
                            className="bg-inherit w-full h-full px-6 placeholder:text-white-400 border border-[#1f1e1e] focus:outline-none focus:border-[#1f1e1e] focus:shadow-none"
                            id="districtSelect"
                            name="district"
                            value={selectedDistrict}
                            onChange={(e) => {
                              handleInputChange(e);
                              setSelectedDistrict(e.target.value);
                              fetchWards(e.target.value);
                            }}
                          >
                            <option value="">Chọn quận/huyện</option>
                            {districts.map((district) => (
                              <option
                                key={district.DistrictID}
                                value={district.DistrictID}
                              >
                                {district.DistrictName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.district && (
                          <p className="text-red-500 text-sm">
                            {errors.district}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-white-50 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">
                        Xã/Phường/Thị Trấn
                      </p>
                      <div className="flex-1">
                        <div className="w-full bg-[rgb(44,44,46)] h-12 rounded-xl text-white-400 overflow-hidden">
                          <select
                            className="bg-inherit w-full h-full px-6 placeholder:text-white-400 border border-[#1f1e1e] focus:outline-none focus:border-[#1f1e1e] focus:shadow-none"
                            id="wardSelect"
                            name="ward"
                            value={selectedWard}
                            onChange={(e) => {
                              handleInputChange(e);
                              setSelectedWard(e.target.value);
                            }}
                          >
                            <option value="">Chọn phường/xã</option>
                            {wards.map((ward) => (
                              <option key={ward.WardCode} value={ward.WardCode}>
                                {ward.WardName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.ward && (
                          <p className="text-red-500 text-sm">{errors.ward}</p>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-white-50 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">
                        Địa chỉ nhận hàng
                      </p>
                      <div className="flex-1">
                        <div className="w-full bg-[rgb(44,44,46)] h-12 rounded-xl text-white-50 overflow-hidden">
                          <input
                            placeholder="Nhập địa chỉ cụ thể nhận hàng(Số nhà, tên đường,...)"
                            value={newPlan.address}
                            name="address"
                            max={100}
                            className="bg-inherit w-full h-full px-6 placeholder:text-white-400"
                            onChange={handleInputChange}
                          />
                        </div>
                        {errors.address && (
                          <p className="text-red-500 text-sm">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full flex justify-end">
                      <button
                        type="submit"
                        className="text-white-default text-16-16 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-6 py-3  button-primary bg-yuki-500"
                      >
                        Lưu địa chỉ
                      </button>
                    </div>
                  </form>
                ) : (
                  addresses.map((address, index) => (
                    <div key={index} className="appear">
                      <div className="w-full p-6 bg-c1c rounded-xl">
                        <div className="w-full flex justify-between items-center">
                          <div className="flex items-center gap-x-4">
                            <img
                              src="https://waka.vn/svgs/icon-location.svg"
                              alt="icon-location"
                              className="cursor-pointer"
                            />
                            <p className="font-medium text-white-50">
                              {address.addressLine} | {address.phoneNumber}
                            </p>
                          </div>
                          <div>
                            <div
                              className="text-waka-500 cursor-pointer"
                              onClick={() => openEditModal(address)}
                            >
                              Sửa địa chỉ
                            </div>
                            <Modal
                              showModal={showModal}
                              setShowModal={setShowModal}
                              addresses={addresses}
                              handleSubmit={handleSubmit}
                              handleInputChange={handleInputChange}
                              newPlan={newPlan}
                              errors={errors}
                              provinces={provinces}
                              districts={districts}
                              wards={wards}
                              selectedProvince={selectedProvince}
                              selectedDistrict={selectedDistrict}
                              selectedWard={selectedWard}
                              fetchDistricts={fetchDistricts}
                              fetchWards={fetchWards}
                              setUserId={userId}
                              setAddresses={addresses[0].addressID}
                              currentAddress={currentAddress}
                              validateForm={validateForm}
                              getProvinceName={getProvinceName}
                              getDistrictName={getDistrictName}
                              getWardName={getWardName}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="w-full pt-[3.75rem]">
              <h1 className="text-[26px] font-medium text-white-50 pb-5">
                Sản phẩm
              </h1>
              <table className="w-full bg-c1c rounded-xl animate-[appearing_.3s_linear_alternate]">
                <thead>
                  <tr className="text-white-50 font-medium">
                    <th className="w-1/2" />
                    <th className="py-4 w-1/6">Đơn giá</th>
                    <th className="w-1/6">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <>
                      <tr
                        key={index}
                        className="text-white-50 font-medium border-t border-[hsla(0,_0%,_100%,_.1)]"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-4 px-6">
                            <div className="w-[4.25rem] min-w-[4.25rem] h-[6.25rem] rounded-md bg-explore relative">
                              <img
                                src={
                                  item.book?.bookImage ||
                                  "/images/default-image.png"
                                }
                                className="absolute inset-0 rounded-md object-contain"
                              />
                            </div>
                            <div>
                              <p className="t-ellipsis-2">{item.book?.title}</p>
                              <p className="text-white-400 font-normal pt-3">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          {item.book?.price.toLocaleString("vi-VN")}
                        </td>
                        <td>
                          <div className="w-full flex items-center justify-center">
                            {(item.book?.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full pt-[3.75rem]">
              <h1 className="text-[26px] font-medium text-white-50 pb-5">
                Hình thức thanh toán
              </h1>
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
                        src="https://waka.vn/svgs/icon-pay-qr.svg"
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
                            src="https://waka.vn/svgs/icon-check.svg"
                            alt="selected"
                            className="ml-2"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full pl-13 [transition:max-height_.75s] overflow-hiddenn max-h-0"></div>
                </div>
                <div>
                  <div
                    className={`w-full cursor-pointer p-3 rounded-xl hover:bg-white-overlay flex gap-x-3 items-center border transition-colors ${
                      selectedPaymentMethod === "cod"
                        ? "border-yuki-500"
                        : "border-[hsla(0,_0%,_100%,_.1)]"
                    }`}
                    onClick={() => selectPaymentMethod("cod")}
                  >
                    <div className="w-10 h-10 min-w-10 rounded-xl bg-white-overlay p-2">
                      <img
                        src="https://waka.vn/svgs/icon-cod.svg"
                        alt="icon-cod"
                        className="cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center">
                        <p className="font-medium text-base text-white-50">
                          Thanh toán khi nhận hàng
                        </p>
                        {selectedPaymentMethod === "cod" && (
                          <img
                            src="https://waka.vn/svgs/icon-check.svg"
                            alt="selected"
                            className="ml-2"
                          />
                        )}
                      </div>
                      <p className="text-[13px] text-white-300">
                        Thanh toán khi nhận hàng
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[27rem] h-fit bg-c1c rounded-xl flex flex-col divide-y divide-white-overlay sticky right-0 top-[153px] text-white-default font-medium">
            <div className="px-6 py-4">
              <div className="flex justify-between">
                <p>Thành tiền</p>
                <p>
                  {cartItems
                    .reduce(
                      (total, item) =>
                        total + (item.book?.price || 0) * (item.quantity || 1),
                      0
                    )
                    .toLocaleString("vi-VN")}{" "}
                  đ
                </p>
              </div>
              <div className="flex justify-between">
                <div>Phí vận chuyển</div>
                <p>
                  {shippingFee > 0
                    ? `${shippingFee.toLocaleString("vi-VN")} VND`
                    : "Chưa tính phí"}
                </p>
              </div>
            </div>
            <div>
              <div className="px-6 py-4 flex justify-between">
                <p>Tổng số tiền</p>
                <p>{calculateTotalPrice().toLocaleString("vi-VN")} đ</p>
              </div>
              <div className="w-full">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-full text-16-16 text-white-default font-semibold ${
                    (!hasSavedAddress && !isFormValid) ||
                    !isPaymentMethodSelected
                      ? "bg-gray-400"
                      : "bg-green-500"
                  }`}
                  disabled={
                    (!hasSavedAddress && !isFormValid) ||
                    !isPaymentMethodSelected
                  }
                  onClick={handlePayment}
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PreOrderToCart;
