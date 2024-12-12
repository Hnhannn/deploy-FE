// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { getAllAuthors, createAuthor, updateAuthor, deleteAuthor } from "../../service/API_Author_Service";
import { Table, Input } from "antd";

function Author() {
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const { Search } = Input;

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const listAuthors = await getAllAuthors();
          setAuthors(listAuthors);
          setFilteredAuthors(listAuthors);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchData();
  }, []);

  const handleSaveAuthor = async (e) => {
    e.preventDefault();
    // Kiểm tra đầu vào
    if (!name || name.trim() === "") {
      setError("Tên tác giả không được để trống.");
      return;
    }

    // Kiểm tra ký tự đặc biệt và số
    // const regex = /^[A-Za-zÀ-ỹ0-9\s]+$/;
    // if (!regex.test(name)) {
    //   setError("Tên tác giả chỉ được chứa chữ cái không được chứa ký tự đặc biệt.");
    //   return;
    // }

    // Kiểm tra trùng tên tác giả
    const isDuplicate = authors.some(
        (author) => author.authorName.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError("Tên tâc giả đã tồn tại. Vui lòng nhập tên khác.");
      return;
    }

    setError(""); // Xóa lỗi khi không có lỗi

    try {
      if (editId) {
        // Cập nhật tác giả
        await updateAuthor(editId, { authorName: name });
        setAuthors(
            authors.map((author) =>
                author.authorID === editId ? { ...author, authorName: name } : author
            )
        );
        setFilteredAuthors(
            filteredAuthors.map((author) =>
                author.authorID === editId ? { ...author, authorName: name } : author
            )
        );
        toast.success("Cập nhật tác giả thành công!");
      } else {
        // Thêm tác giả mới
        const newAuthor = await createAuthor({ authorName: name });
        setAuthors([...authors, newAuthor]);
        setFilteredAuthors([...filteredAuthors, newAuthor]);
        toast.success("Thêm tác giả thành công!");
      }
      setName(''); // Reset form
      setEditId(null); // Reset editID để quay lại chế độ thêm mới
    } catch (error) {
      console.error("Lỗi khi lưu tác giả:", error);
      toast.error("Lưu tác giả thất bại. Vui lòng thử lại!");
    }
  };

  const handleEditAuthor = (author) => {
    setEditId(author.authorID);
    setName(author.authorName);
    setError("");
  };

  const handleDeleteAuthor = async (authorID) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa tác giả này không?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });

      if (result.isConfirmed) {
        await deleteAuthor(authorID);
        setAuthors(authors.filter((author) => author.authorID !== authorID));
        setFilteredAuthors(filteredAuthors.filter(author => author.authorID !== authorID));

        // Tùy chỉnh hộp thoại "Đã xóa"
        Swal.fire({
          title: "Đã xóa!",
          text: "Tác giả đã được xóa.",
          icon: "success",
          background: "rgba(0, 0, 0, 0.8)", // Nền mờ
          color: "#ffffff", // Chữ trắng
          backdrop: "rgba(0, 0, 0, 0.5)", // Nền sau mờ
          timer: 2000, // Tự động đóng sau 2 giây
          timerProgressBar: true, // Thanh tiến trình đếm ngược
          showConfirmButton: false, // Ẩn nút xác nhận
        });
      }
    } catch (error) {
      console.error("Lỗi khi xóa tác giả:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa tác giả. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)",
      });
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = authors.filter(
        (author) => author.authorName.toLowerCase().includes(searchValue)
    );
    setFilteredAuthors(filtered); // Lọc và cập nhật filteredAuthors
  };

  // Table columns configuration
  const columns = [
    {
      title: "Tên tác giả",
      dataIndex: "authorName",
      key: "authorName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
          <div className="flex justify-center space-x-3">
            <button
                onClick={() => handleEditAuthor(record)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Cập nhật
            </button>
            <button
                onClick={() => handleDeleteAuthor(record.authorID)}
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
        <h2 className="text-xl font-semibold mb-4">Quản lý tác giả</h2>
        <div className="bg-gray-800 p-6">
          <form className="space-y-4" onSubmit={handleSaveAuthor}>
            <div>
              <label className="block text-white">Tên tác giả</label>
              <input
                type="text"
                placeholder="Nhập tên tác giả"
                className={`w-full p-2 bg-gray-700 border border-gray-300 rounded mt-1 'bg-gray-500' : 'bg-gray-700'}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(""); // Xóa lỗi nếu có khi người dùng bắt đầu nhập
                }}
              />
              {error && (
                <p style={{ color: "red", marginTop: "5px" }}>{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editId ? "Cập nhật tác giả" : "Thêm tác giả"}
            </button>
            {/* Container của Toast */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
            />
          </form>
        </div>

        {/* Table for listing users */}
        <div className="bg-gray-800 p-6 mt-8 mb-8">
          <Search
            placeholder="Tìm kiếm theo tên tác giả"
            enterButton="Tìm kiếm"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 16 }}
            id="inputSearch"
          />
          <h2 className="text-xl font-semibold mb-4">Danh sách tác giả</h2>
          <Table
            className="custom-table"
            columns={columns}
            dataSource={filteredAuthors}
            rowKey="publisherID"
            // loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </div>
  );
}
export default Author;
