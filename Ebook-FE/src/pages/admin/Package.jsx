import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import { addOrUpdatePlan, deletePlan, fetchPlans } from '../../service/Package_Service';

function Package() {
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ planName: '', price: '', duration: '' });
    const [editingPlanID, setEditingPlanID] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const data = await fetchPlans();
                setPlans(data.sort((a, b) => b.planID - a.planID));
                console.log(data); // Check the structure of the data
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        loadPlans();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlan({ ...newPlan, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error message for the field
    };

    const formatPrice = (price) => {
        return parseFloat(price) * 1000;
    };

    const handleAddOrUpdatePlan = async (e) => {
        e.preventDefault();
        // Frontend validation
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
        let validationErrors = {};

        if (!newPlan.planName) {
            validationErrors.planName = 'Tên gói cước không được trống.';
        } else if (specialCharRegex.test(newPlan.planName)) {
            validationErrors.planName = 'Tên gói cước không được chứa ký tự đặc biệt.';
        } else if (plans.some(plan => plan.planName.toLowerCase() === newPlan.planName.toLowerCase() && plan.planID !== editingPlanID)) {
            validationErrors.planName = 'Tên gói cước đã tồn tại.';
        }

        if (!newPlan.price) {
            validationErrors.price = 'Giá gói cước không được trống.';
        } else if (isNaN(newPlan.price)) {
            validationErrors.price = 'Giá gói phải là số.';
        } else if (newPlan.price < 0) {
            validationErrors.price = 'Giá gói không được là số âm.';
        } else if (newPlan.price == 0) {
            validationErrors.price = 'Giá gói phải lớn hơn 0.';
        }

        if (!newPlan.duration) {
            validationErrors.duration = 'Thời gian không được trống.';
        } else if (isNaN(newPlan.duration)) {
            validationErrors.duration = 'Thời gian phải là số.';
        } else if (newPlan.duration < 0) {
            validationErrors.duration = 'Thời gian không được là số âm.';
        } else if (newPlan.duration == 0) {
            validationErrors.duration = 'Thời gian phải lớn hơn 0.';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const formattedPrice = formatPrice(newPlan.price);
            const data = await addOrUpdatePlan({ ...newPlan, price: formattedPrice }, editingPlanID);
            if (editingPlanID) {
                setPlans(plans.map(plan => (plan.planID === editingPlanID ? data : plan)).sort((a, b) => b.planID - a.planID));
                toast.success('Cập nhật gói cước thành công!');
            } else {
                setPlans([data, ...plans].sort((a, b) => b.planID - a.planID));
                toast.success('Thêm gói cước thành công!');
            }
            setNewPlan({ planName: '', price: '', duration: '' });
            setEditingPlanID(null);
        } catch (error) {
            console.error('Error adding or updating plan:', error);
            toast.error('Có lỗi xảy ra khi thêm hoặc cập nhật gói cước.');
        }
    };

    const handleEditPlan = (plan) => {
        setNewPlan({ planName: plan.planName, price: plan.price / 1000, duration: plan.duration.toString() });
        setEditingPlanID(plan.planID);
        setErrors({});
    };

    const handleDeletePlan = async (planID) => {
        try {
            const result = await Swal.fire({
                title: "Bạn có chắc chắn muốn xóa gói cước này không?",
                text: "Hành động này không thể hoàn tác!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy",
                background: "rgba(0, 0, 0, 0.8)",
                color: "#ffffff",
                backdrop: "rgba(0, 0, 0, 0.5)"
            });
    
            if (result.isConfirmed) {
                await deletePlan(planID);
                setPlans(plans.filter(plan => plan.planID !== planID).sort((a, b) => b.planID - a.planID));
    
                // Tùy chỉnh hộp thoại "Đã xóa"
                Swal.fire({
                    title: "Đã xóa!",
                    text: "Gói cước đã được xóa.",
                    icon: "success",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "#ffffff",
                    backdrop: "rgba(0, 0, 0, 0.5)",
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error('Lỗi khi xóa gói cước:', error);
            Swal.fire({
                title: "Lỗi!",
                text: "Không thể xóa gói cước. Vui lòng thử lại sau!",
                icon: "error",
                background: "rgba(0, 0, 0, 0.8)",
                color: "#ffffff",
                backdrop: "rgba(0, 0, 0, 0.5)"
            });
        }
    };

    const handleCancelUpdate = () => {
        setNewPlan({ planName: '', price: '', duration: '' });
        setEditingPlanID(null);
        setErrors({});
    };
    
    return (
      <div className="w-5/5 p-6 overflow-y-auto ml-60 mt-6">
        <ToastContainer />
        <h2 className="text-xl font-semibold mb-4">Quản lý gói cước</h2>
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <form onSubmit={handleAddOrUpdatePlan}>
            <div className="mb-4">
              <label className="block text-white mb-2">Tên gói cước</label>
              <input
                type="text"
                name="planName"
                value={newPlan.planName}
                onChange={handleInputChange}
                placeholder="Nhập tên gói cước (ví dụ: YUKI 1 TUẦN)"
                className={`w-full p-2 border border-gray-300 rounded mt-1 text-white ${
                  errors.planName ? "border-red-500" : ""
                } ${editingPlanID !== null ? "bg-gray-500" : "bg-gray-700"}`}
                disabled={editingPlanID !== null}
              />
              {errors.planName && (
                <p className="text-red-500 text-sm mt-1">{errors.planName}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Giá</label>
              <input
                type="text"
                name="price"
                value={newPlan.price}
                onChange={handleInputChange}
                placeholder="Nhập giá (ví dụ: 89 = 89.000)"
                className={`w-full p-2 border border-gray-300 bg-gray-700 rounded mt-1 text-white ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Thời gian (ngày)</label>
              <input
                type="text"
                name="duration"
                value={newPlan.duration}
                onChange={handleInputChange}
                placeholder="Nhập thời gian (ngày)"
                className={`w-full p-2 border border-gray-300 rounded mt-1 text-white ${
                  errors.duration ? "border-red-500" : ""
                } ${editingPlanID !== null ? "bg-gray-500" : "bg-gray-700"}`}
                disabled={editingPlanID !== null}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {editingPlanID ? "Cập nhật gói cước" : "Thêm gói cước"}
              </button>
              {editingPlanID && (
                <button
                  type="button"
                  onClick={handleCancelUpdate}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Hủy cập nhật
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <table className="min-w-full divide-y divide-gray-600 table-auto">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-white">STT</th>
                <th className="px-2 py-2 text-left text-white">Tên gói cước</th>
                <th className="px-2 py-2 text-left text-white">Giá gói cước</th>
                <th className="px-2 py-2 text-left text-white">
                  Thời gian (Ngày)
                </th>
                <th className="px-2 py-2 text-left text-white"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {plans.map((plan, index) => (
                <tr key={plan.planID}>
                  <td className="px-2 py-2 text-white">{index + 1}</td>
                  <td className="px-2 py-2 text-white">{plan.planName}</td>
                  <td className="px-2 py-2 text-white">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(plan.price)}
                  </td>
                  <td className="px-2 py-2 text-white">{plan.duration}</td>
                  <td className="px-2 py-2 text-white">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleEditPlan(plan)}
                    >
                      Cập nhật
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDeletePlan(plan.planID)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default Package;