// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react'
import { getAllPublishers, createPublisher, updatePublisher, deletePublisher } from "../../service/API_PublisherAdmin_Service.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Table, Input } from "antd";
// import { OrbitProgress } from "react-loading-indicators";



function Publisher() {
  const [publishers, setPublishers] = useState([]); // Khai báo state `publishers` để lưu danh sách nhà xuất bản
  const [filteredPublishers, setFilteredPublishers] = useState([]);
  const [name, setName] = useState(''); // Khai báo state `name` để lưu tên của nhà xuất bản
  const [editId, setEditId] = useState(null); // ID nhà xuất bản đang chỉnh sửa (nếu có)
  const [error, setError] = useState(""); // Biến trạng thái để lưu lỗi
  // const [loading, setLoading] = useState(false); // Trạng thái loading // Trạng thái loading
  const { Search } = Input;

  // Lấy danh sách NXB khi component được render lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const listPublishers = await getAllPublishers();
          setPublishers(listPublishers);
          setFilteredPublishers(listPublishers);
      } catch (error) {
        console.error("Error fetching publishers:", error);
      }
    };
    fetchData();
  }, []);

  // Thêm hoặc cập nhật nhà xuất bản
  const handleSavePublisher = async (e) => {
    e.preventDefault();
    // Kiểm tra đầu vào
    if (!name || name.trim() === "") {
      setError("Tên nhà xuất bản không được để trống.");
      return;
    }


    // Kiểm tra ký tự đặc biệt và số
    const regex = /^[A-Za-zÀ-ỹ0-9\s]+$/;
    if (!regex.test(name)) {
      setError("Tên nhà xuất bản chỉ được chứa chữ cái không được chứa ký tự đặc biệt.");
      return;
    }

    // Kiểm tra trùng tên nhà xuất bản
    const isDuplicate = publishers.some(
        (publisher) => publisher.publisherName.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError("Tên nhà xuất bản đã tồn tại. Vui lòng nhập tên khác.");
      return;
    }

    setError(""); // Xóa lỗi khi không có lỗi
    // setLoading(true); // Hiển thị loading

    try {
      if (editId) {
        // Cập nhật nhà xuất bản
        await updatePublisher(editId, { publisherName: name });
        setPublishers(
            publishers.map((publisher) =>
                publisher.publisherID === editId ? { ...publisher, publisherName: name } : publisher
            )
        );
        setFilteredPublishers(
            filteredPublishers.map(publisher =>
                publisher.publisherID === editId ? { ...publisher, publisherName: name } : publisher
            )
        );
        toast.success("Cập nhật nhà xuất bản thành công!");
      } else {
        // Thêm nhà xuất bản mới
        const newPublisher = await createPublisher({ publisherName: name });
        setPublishers([...publishers, newPublisher]);
        setFilteredPublishers([...filteredPublishers, newPublisher]);
        toast.success("Thêm nhà xuất bản thành công!");
      }
      setName(''); // Reset form
      setEditId(null); // Reset editId để quay lại chế độ thêm mới
    } catch (error) {
      console.error("Lỗi khi lưu nhà xuất bản:", error);
      toast.error("Lưu nhà xuất bản thất bại. Vui lòng thử lại!");
    }
    // finally {
    //   setLoading(false); // Ẩn loading
    // }
  };

  // Xóa nhà xuất bản
  const handleDeletePublisher = async (publisherID) => {
    try {
      const result = await Swal.fire({
        title: "Bạn có muốn xóa nhà xuất bản này không?",
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
        await deletePublisher(publisherID);
        setPublishers(publishers.filter((publisher) => publisher.publisherID !== publisherID));
        setFilteredPublishers(filteredPublishers.filter(publisher => publisher.publisherID !== publisherID));

        // Tùy chỉnh hộp thoại "Đã xóa"
        Swal.fire({
          title: "Đã xóa!",
          text: "Nhà xuất bản đã được xóa.",
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
      console.error("Lỗi khi xóa nhà xuất bản:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể xóa nhà xuất bản. Vui lòng thử lại sau!",
        icon: "error",
        background: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
        backdrop: "rgba(0, 0, 0, 0.5)"
      });
    }
  };

  // Chuyển sang chế độ chỉnh sửa
  const handleEditPublisher = (publisher) => {
    setEditId(publisher.publisherID);
    setName(publisher.publisherName);
    setError("");
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = publishers.filter(
        (publisher) => publisher.publisherName.toLowerCase().includes(searchValue)
    );
    setFilteredPublishers(filtered); // Lọc và cập nhật filteredPublishers
  };

  // Table columns configuration
  const columns = [
    {
      title: "Tên NXB",
      dataIndex: "publisherName",
      key: "publisherName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
          <div className="flex justify-center space-x-3">
            <button
                onClick={() => handleEditPublisher(record)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Cập nhật
            </button>
            <button
                onClick={() => handleDeletePublisher(record.publisherID)}
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
        <h2 className="text-xl font-semibold mb-4">Quản lý nhà xuất bản</h2>
        <div className="bg-gray-800 p-6">
          <form className="space-y-4" onSubmit={handleSavePublisher}>
            <div>
              <label className="block text-white">Tên NXB</label>
              <input
                type="text"
                placeholder="Nhập tên nhà xuất bản..."
                className="w-full p-2 bg-gray-700 border border-gray-300 rounded mt-1"
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
              className="px-3 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4"
              // disabled={loading} // Vô hiệu hóa nút khi loading
            >
              {editId ? "Cập nhật nhà xuất bản" : "Thêm nhà xuất bản"}
            </button>

            {/* Hiển thị hiệu ứng loading */}
            {/*{loading && (*/}
            {/*    <div className="flex justify-center items-center mt-4">*/}
            {/*      <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />*/}
            {/*    </div>*/}
            {/*)}*/}

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
            placeholder="Tìm kiếm theo tên NXB"
            enterButton="Tìm kiếm"
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: 16 }}
            id="inputSearch"
          />
          <h2 className="text-xl font-semibold mb-4">Danh sách nhà xuất bản</h2>
          <Table
            className="custom-table"
            columns={columns}
            dataSource={filteredPublishers}
            rowKey="publisherID"
            // loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Publisher;
