import axios from 'axios';
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ModalAddress({ handleSubmit, handleInputChange, errors, provinces, districts, wards,
  fetchDistricts, fetchWards, showModal, setShowModal, currentAddress, setUserId, setAddresses, getProvinceName, getDistrictName, getWardName }) {
  const [localPlan, setLocalPlan] = useState({ name: '', phone: '', email: '', address: '' });
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
  const updateAddress = async () => {
    if (!currentAddress) return; // Kiểm tra nếu currentAddress không tồn tại

    const parts = currentAddress.addressLine?.split(',').map((part) => part.trim()) || [];
    const name = parts[0] || '';
    const address = parts.slice(1, parts.length - 3).join(', ') || '';

    setLocalPlan({
      name: name,
      phone: currentAddress.phoneNumber || '',
      email: currentAddress.email || '',
      address: address,
    });

    // Cập nhật tỉnh/thành phố
    setSelectedProvince(currentAddress.city || '');

    try {
      // Lấy danh sách quận/huyện
      await fetchDistricts(currentAddress.city);
      setSelectedDistrict(currentAddress.district || '');

      // Lấy danh sách phường/xã
      await fetchWards(currentAddress.district);
      setSelectedWard(currentAddress.wardCode || '');
    } catch (error) {
      console.error('Có lỗi xảy ra khi cập nhật địa chỉ:', error);
    }
  };

  updateAddress();
}, [currentAddress]);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const addressLine = `${localPlan.name}, ${localPlan.address}, ${getWardName(selectedWard)}, ${getDistrictName(selectedDistrict)}, ${getProvinceName(selectedProvince)}`;
      const response = await axios.put(`http://localhost:8080/rest/address/${setUserId}/${setAddresses}`, {
        addressLine: addressLine,
        suburb: selectedWard,
        district: selectedDistrict,
        city: selectedProvince,
        phoneNumber: localPlan.phone,
        userId: setUserId,
      });
      toast.success('Cập nhật địa chỉ thành công');
      setShowModal(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật địa chỉ!');
    }
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="relative w-[60%] max-w-4xl mx-auto my-6">
              <div className="bg-[rgb(28,28,30)] rounded-lg shadow-lg">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-3xl font-semibold text-white">Cập nhật địa chỉ</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  {notification.message && (
                    <div className={`mb-4 p-4 text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {notification.message}
                    </div>
                  )}
                  <form onSubmit={handleFormSubmit}>
                    <div className="w-full flex pt-1">
                      <p className="text-gray-400 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">Họ và tên người nhận</p>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 h-12 rounded-xl text-black overflow-hidden">
                          <input
                            placeholder="Nhập họ và tên người nhận"
                            max={100}
                            className="bg-inherit w-full h-full px-6 placeholder:text-gray-400"
                            name="name"
                            value={localPlan.name}
                            onChange={(e) => {
                              handleInputChange(e);
                              setLocalPlan({ ...localPlan, name: e.target.value });
                            }}
                          />
                        </div>
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-gray-400 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">Số điện thoại</p>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 h-12 rounded-xl text-black overflow-hidden">
                          <input
                            placeholder="Nhập số điện thoại"
                            max={100}
                            className="bg-inherit w-full h-full px-6 placeholder:text-gray-400"
                            name="phone"
                            value={localPlan.phone}
                            onChange={(e) => {
                              handleInputChange(e);
                              setLocalPlan({ ...localPlan, phone: e.target.value });
                            }}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-gray-400 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">Tỉnh/Thành phố</p>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 h-12 rounded-xl text-black overflow-hidden">
                          <select
                            className="bg-inherit w-full h-full px-6 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:border-gray-300 focus:shadow-none"
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
                              <option key={province.ProvinceID} value={province.ProvinceID}>
                                {province.ProvinceName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-gray-400 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">Quận/Huyện</p>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 h-12 rounded-xl text-black overflow-hidden">
                          <select
                            className="bg-inherit w-full h-full px-6 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:border-gray-300 focus:shadow-none"
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
                              <option key={district.DistrictID} value={district.DistrictID}>
                                {district.DistrictName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-gray-400 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">Xã/Phường/Thị Trấn</p>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 h-12 rounded-xl text-black overflow-hidden">
                          <select
                            className="bg-inherit w-full h-full px-6 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:border-gray-300 focus:shadow-none"
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
                        {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
                      </div>
                    </div>
                    <div className="w-full flex pt-1">
                      <p className="text-gray-400 pt-[.875rem] pb-[.875rem] min-w-[13.125rem]">Địa chỉ nhận hàng</p>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 h-12 rounded-xl text-black overflow-hidden">
                          <input
                            placeholder="Nhập địa chỉ cụ thể nhận hàng(Số nhà, tên đường,...)"
                            value={localPlan.address}
                            name='address'
                            max={100}
                            className="bg-inherit w-full h-full px-6 placeholder:text-gray-400"
                            onChange={(e) => {
                              handleInputChange(e);
                              setLocalPlan({ ...localPlan, address: e.target.value });
                            }}
                          />
                        </div>
                        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                      </div>
                    </div>
                    <div className="w-full flex justify-end">
                      <button type="submit" className="text-white bg-yuki-500 hover:bg-green-500 text-[1rem] leading-5 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-6 py-3">
                        Cập nhật
                      </button>
                      <button
                        type="button"
                        className="text-white bg-gray-500 hover:bg-gray-700 text-[1rem] leading-5 py-2 rounded-full cursor-pointer flex items-center justify-center whitespace-nowrap px-6 py-3 ml-2"
                        onClick={() => setShowModal(false)}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}