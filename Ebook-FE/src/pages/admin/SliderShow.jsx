import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Table, Input, Modal, Button, message, Popconfirm } from "antd";
import "swiper/css";
import "swiper/css/pagination";
import { ImportDB } from "../../Firebase/UploadConfig";
import { v4 } from "uuid"; // Để sinh ID duy nhất
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getAllSliderShows,
  updateSliderOrder,
  PostSliderShows,
  updateSliderOrderbyID,
  deleteSliderByID,
} from "../../service/API_SliderShow_Service";

function SliderShow() {
  const [imageSlider, setImageSliders] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchImageSlider = async () => {
      const dataSlider = await getAllSliderShows();
      setImageSliders(dataSlider);
      console.log(dataSlider);
    };
    fetchImageSlider();
  }, []);

  const reorderSlider = async (index) => {
    const actualIndex = (currentPage - 1) * pageSize + index;
    const reorderedSliders = [
      imageSlider[actualIndex],
      ...imageSlider.slice(0, actualIndex),
      ...imageSlider.slice(actualIndex + 1),
    ];
    setImageSliders(reorderedSliders);

    try {
      await updateSliderOrder(reorderedSliders);
      message.success("Thứ tự slider được cập nhật thành công");
    } catch (error) {
      message.error("Failed to update slider order");
    }
  };

  const handleEditSlider = (index) => {
    const actualIndex = (currentPage - 1) * pageSize + index;
    const slider = imageSlider[actualIndex];
    setSelectedImage(slider.imageUrl);
    setImagePreview(slider.imageUrl);
    setIsEditing(true);
    setEditingIndex(actualIndex);
    setIsModalVisible(true);
  };

  const handleDeleteSlider = (index) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa slider này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        const actualIndex = (currentPage - 1) * pageSize + index;
        const sliderID = imageSlider[actualIndex].sliderID;

        try {
          await deleteSliderByID(sliderID);
          const updatedSliders = imageSlider.filter(
            (_, i) => i !== actualIndex
          );
          setImageSliders(updatedSliders);
          message.success("Xóa slider thành công");
        } catch (error) {
          message.error("Xóa slider thất bại");
        }
      },
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedImage) {
      message.error("Vui lòng chọn hình ảnh");
      return;
    }

    const sliderID = imageSlider[editingIndex].sliderID;

    const updatedSlider = {
      imageUrl: selectedImage,
    };

    console.log(updatedSlider);

    try {
      await updateSliderOrderbyID(sliderID, updatedSlider);
      const updatedSliders = [...imageSlider];
      updatedSliders[editingIndex] = {
        ...updatedSliders[editingIndex],
        ...updatedSlider,
      };
      setImageSliders(updatedSliders);
      message.success("Slider updated successfully");
      setIsModalVisible(false);
      setImagePreview(null);
      setSelectedImage(null);
      setIsEditing(false);
      setEditingIndex(null);
    } catch (error) {
      message.error("Failed to update slider");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "STT",
      render: (_, __, index) => index + 1,
      width: 50, // Cố định độ rộng cho cột STT
      align: "center", // Căn giữa nội dung
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div className="flex justify-center">
          <img
            src={record.imageUrl}
            alt={record.slideID}
            style={{
              width: "100%", // Đảm bảo hình ảnh không vượt quá kích thước của cột
              maxWidth: "200px", // Giới hạn kích thước tối đa của hình ảnh
              height: "auto", // Đảm bảo tỷ lệ hình ảnh không bị méo
            }}
          />
        </div>
      ),
      width: 200, // Cố định độ rộng cho cột hình ảnh
      align: "center", // Căn giữa hình ảnh
    },
    {
      title: "",
      key: "actions",
      render: (_, record, index) => (
        <div>
          <Button
            onClick={() => reorderSlider(index)}
            style={{
              color: "white",
              backgroundColor: "inherit",
              cursor: "default",
              boxShadow: "none",
            }}
          >
            Di chuyển lên đầu
          </Button>
          <Button
            onClick={() => handleEditSlider(index)}
            style={{
              marginLeft: 8,
              color: "white",
              backgroundColor: "inherit",
              cursor: "default",
              boxShadow: "none",
            }}
          >
            Cập nhật
          </Button>
          <Button
            onClick={() => handleDeleteSlider(index)}
            style={{
              marginLeft: 8,
              color: "white",
              backgroundColor: "inherit",
            }}
          >
            Xóa
          </Button>
        </div>
      ),
      width: 150,
      align: "center",
    },
  ];

  const handleFileChange = async (file) => {
    if (!file) {
      message.error("Vui lòng chọn hình ảnh");
      return;
    }

    const uniquePath = `banner/${v4()}`; // Sinh path unique
    const imgRef = ref(ImportDB, uniquePath); // Tham chiếu Firebase Storage

    try {
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      setSelectedImage(url);
      setImagePreview(url);
    } catch (error) {
      console.error("Error uploading image:", error.code, error.message);
    }
  };

  const handleAddSlider = async () => {
    if (!selectedImage) {
      message.error("Vui lòng chọn hình ảnh");
      return;
    }

    const newSliderShow = {
      imageUrl: selectedImage,
      userID: 1,
    };

    console.log(newSliderShow);

    try {
      const createdSliderShow = await PostSliderShows(newSliderShow);
      setImageSliders([...imageSlider, createdSliderShow]);
      message.success("Thêm banner thành công");
      setIsModalVisible(false);
      setImagePreview(null);
      setSelectedImage(null);
    } catch (error) {
      message.error("Thất bại khi thêm banner");
    }
  };

  return (
    <div className="flex px-5">
      {/* Sidebar */}
      <div className="w-64"></div>

      {/* Main Content */}
      <div className="flex-1 mt-6 flex flex-col items-center">
        <div className="text-center">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
            style={{ width: "1200px", height: "400px" }}
          >
            {imageSlider.map((slide) => (
              <SwiperSlide key={slide.id}>
                <img
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className="rounded-lg shadow-md"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Current Slide */}
        <div className="mt-4 text-white text-center">
          Vị trí: {currentSlide + 1} / {imageSlider.length}
        </div>
        {/* Table */}
        <div className="mt-6 w-full px-10">
          <div className="mb-4">
            <button
              onClick={() => setIsModalVisible(true)}
              className="px-6 py-2 bg-green-500 text-white rounded"
            >
              <i className="fa-solid fa-plus"></i> Thêm banner
            </button>
          </div>
          <Table
            columns={columns}
            dataSource={imageSlider}
            className="custom-table"
            rowKey={(record, index) => index}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20"],
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            // bordered
            style={{
              backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity, 1))",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
      <Modal
        title="Thêm slider"
        visible={isModalVisible}
        onOk={isEditing ? handleSaveEdit : handleAddSlider}
        onCancel={() => setIsModalVisible(false)}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files[0])}
        />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: "100%", maxHeight: "300px" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SliderShow;
