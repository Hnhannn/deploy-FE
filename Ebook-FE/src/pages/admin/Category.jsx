// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Table, Input } from "antd";
import {createCategory, updateCategory, deleteCategory, getAllCategories} from "../../service/API_Category_Service.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function Category() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editID, setEditID] = useState(null);
  const [error, setError] = useState("");
  const { Search } = Input;
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listCategories = await getAllCategories();
          setCategories(listCategories);
          setFilteredCategories(listCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();``
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    // Kiểm tra đầu vào
    if (!name || name.trim() === "") {
      setError("Tên thể loại không được để trống.");
      return;
    }


    // Kiểm tra ký tự đặc biệt và số *bắt lỗi viết số đc
    const regex = /^[A-Za-zÀ-ỹ0-9\s]+$/;
    if (!regex.test(name)) {
      setError("Tên thể loại chỉ được chứa chữ cái không được chứa ký tự đặc biệt.");
      return;
    }

    // Kiểm tra trùng tên nhà xuất bản
    const isDuplicate = categories.some(
        (category) => category.categoryName.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError("Tên thể loại đã tồn tại. Vui lòng nhập tên khác.");
      return;
    }

    setError(""); // Xóa lỗi khi không có lỗi

    try {
      if (editID) {
        // Cập nhật thể loại
        await updateCategory(editID, { categoryName: name });
        setCategories(
            categories.map((category) =>
                category.categoryID === editID ? { ...category, categoryName: name } : category
            )
        );
        setFilteredCategories(
            filteredCategories.map((category) =>
                category.categoryID === editID ? { ...category, categoryName: name } : category
            )
        );
        toast.success("Cập nhật thể loại thành công!");
      } else {
        // Thêm thể loại mới
        const newCategory = await createCategory({ categoryName: name });
        setCategories([...categories, newCategory]);
        setFilteredCategories([...filteredCategories, newCategory]);
        toast.success("Thêm thể loại thành công!");
      }
      setName(''); // Reset form
      setEditID(null); // Reset editID để quay lại chế độ thêm mới
    } catch (error) {
      console.error("Lỗi khi lưu thể loại:", error);
      toast.error("Lưu thể loại thất bại. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (categoryID) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa thể loại này không?",
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
        await deleteCategory(categoryID);
        setCategories(categories.filter((category) => category.categoryID !== categoryID));
        setCategories(filteredCategories.filter(category => category.categoryID !== categoryID));

        // Tùy chỉnh hộp thoại "Đã xóa"
        Swal.fire({
          title: "Đã xóa!",
          text: "Thể loại đã được xóa.",
          icon: "success",
          background: "rgba(0, 0, 0, 0.8)", // Nền mờ
          color: "#ffffff", // Chữ trắng
          backdrop: "rgba(0, 0, 0, 0.5)", // Nền sau mờ
          timer: 2000, // Tự động đóng sau 2 giây
          timerProgressBar: true, // Thanh tiến trình đếm ngược
          showConfirmButton: false // Ẩn nút xác nhận
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa thể loại:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa thể loại. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)"
      });
    }
  };

  const handleEdit = (category) => {
    setEditID(category.categoryID);
    setName(category.categoryName);
    setError("");
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = categories.filter(
        (category) => category.categoryName.toLowerCase().includes(searchValue)
    );
    setFilteredCategories(filtered); // Lọc và cập nhật filteredCategories
  };

  // Table columns configuration
  const columns = [
    {
      title: "Tên thể loại",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
          <div className="flex justify-center space-x-3">
            <button
                onClick={() => handleEdit(record)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Cập nhật
            </button>
            <button
                onClick={() => handleDelete(record.categoryID)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
      ),
    },
  ];

  return (
    <div className="flex px-5">
      {/* Sidebar */}
      <div className="w-64">{/* Nội dung của sidebar */}</div>

      {/* Main content */}
      <div className="flex-1 mt-6">
        {/* Form input user */}
        <h2 className="text-xl font-semibold mb-4">Quản lý thể loại</h2>
        <div className="bg-gray-800 p-6">
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-white">Tên thể loại</label>
              <input type="text" placeholder="Nhập tên thể loại" className="w-full p-2 bg-gray-700 border border-gray-300 rounded mt-1"
                     value={name}
                     onChange={(e) => {
                       setName(e.target.value);
                       if (error) setError(""); // Xóa lỗi nếu có khi người dùng bắt đầu nhập
                     }}/>
              {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editID ? 'Cập nhật thể loại' : 'Thêm thể loại'}
            </button>
            {/* Container của Toast */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          </form>
        </div>

        {/* Table for listing users */}
        <div className="bg-gray-800 p-6 mt-8 mb-8">
          <Search
              placeholder="Tìm kiếm theo tên thể loại"
              enterButton="Tìm kiếm"
              onChange={(e) => handleSearch(e.target.value)}
              style={{ marginBottom: 16 }}
              id="inputSearch"
          />
          <h2 className="text-xl font-semibold mb-4">Danh sách thể loại</h2>
          <Table
              className='custom-table'
              columns={columns}
              dataSource={filteredCategories}
              rowKey="categoryID"
              pagination={{ pageSize: 10 }}

          />
        </div>
      </div>
    </div>
  );
}

export default Category;
