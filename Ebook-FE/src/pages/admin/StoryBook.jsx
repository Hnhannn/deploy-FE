// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Table, Input, Modal, Button, message, Popconfirm } from "antd";
import Select from "react-select";
import {
  getBookByAccessType,
  getBookByType,
  deleteBook,
} from "../../service/API_Book_Service";
import axios from "axios";
import { getAllCategories } from "../../service/API_Category_Service";
import { getAllAuthors } from "../../service/API_Author_Service";
import { getBookTypes } from "../../service/API_BookType_Service";
import { getAllPublishers } from "../../service/API_PublisherAdmin_Service";
import { ImportDB } from "../../Firebase/UploadConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

const StoryBook = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [books, setBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({
    OptionAuthor: [],
    OptionCategory: [],
    OptionType: [],
    OptionPublisher: [],
  });
  const [selectedOptions, setSelectedOptions] = useState({
    category: [],
    bookTypes: [],
    author: [],
    publisher: null,
  });
  const [img, setImg] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoryResponse = await getAllCategories();
        const authorResponse = await getAllAuthors();
        const typeResponse = await getBookTypes();
        const publisherResponse = await getAllPublishers();

        const optionsType = typeResponse.map((item) => ({
          value: item.bookTypeID,
          label: item.typeName,
        }));
        const optionsCategory = categoryResponse.map((item) => ({
          value: item.categoryID,
          label: item.categoryName,
        }));

        const optionsAuthor = authorResponse.map((item) => ({
          value: item.authorID,
          label: item.authorName,
        }));

        const optionsPublisher = publisherResponse.map((item) => ({
          value: item.publisherID,
          label: item.publisherName,
        }));

        setOptions({
          OptionType: optionsType,
          OptionCategory: optionsCategory,
          OptionAuthor: optionsAuthor,
          OptionPublisher: optionsPublisher,
        });
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      setSelectedOptions({
        bookTypes: selectedBook.bookBookTypes
          ? selectedBook.bookBookTypes.map((type) => ({
              value: type.bookType.bookTypeID,
              label: options.OptionType.find(
                (opt) => opt.value === type.bookType.bookTypeID
              )?.label,
              accessType: type.accessType,
              bookTypeName: type.bookType.bookTypeName,
            }))
          : [],
        author: selectedBook.authorBooks
          ? selectedBook.authorBooks.map((author) => ({
              value: author.author.authorID,
              label: options.OptionAuthor.find(
                (opt) => opt.value === author.author.authorID
              )?.label,
            }))
          : [],
        categories: selectedBook.bookCategories
          ? selectedBook.bookCategories.map((category) => ({
              value: category.category.categoryID,
              label: options.OptionCategory.find(
                (opt) => opt.value === category.category.categoryID
              )?.label,
            }))
          : [],
        publisher: selectedBook.publisher
          ? options.OptionPublisher.find(
              (opt) => opt.value === selectedBook.publisher.publisherID
            )
          : null,
      });
      setImg(selectedBook.bookImage);
    }
  }, [selectedBook, options]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBookByType(activeTab);
        const sortedBooks = response.sort(
          (a, b) => new Date(b.postDate) - new Date(a.postDate)
        );
        setBooks(sortedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      message.success("Sách đã được xoá thành công!");
      setBooks(books.filter((book) => book.bookID !== bookId));
    } catch (error) {
      message.error("Error deleting book");
    }
  };

  const handleUpdate = (book) => {
    setSelectedBook(book);
    setPrice(book.price);
    setIsModalVisible(true);
  };

  const updatedBooks = async (bookID, updatedBook) => {
    const response = await axios.put(
      `http://localhost:8080/rest/books/${bookID}`,
      updatedBook
    );
    return response.data;
  };

  const handleModalOk = async () => {
    try {
      const updatedBook = {
        ...selectedBook,
        price,
        categories: selectedOptions.category.map((opt) => ({
          categoryId: opt.value,
        })),
        bookTypes: selectedOptions.bookTypes.map((opt) => ({
          bookTypeID: opt.value,
          accessType: opt.accessType,
        })),
        authors: selectedOptions.author.map((opt) => ({
          authorId: opt.value,
        })),
        publisherId: selectedOptions.publisher
          ? selectedOptions.publisher.value
          : null,
        bookImage: img,
      };

      const updatedData = await updatedBooks(selectedBook.bookID, updatedBook);

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookID === updatedData.bookID ? updatedData : book
        )
      );
      setIsModalVisible(false);
      message.success("Cập nhật sách thành công!!");
    } catch (error) {
      message.error("Lỗi khi cập nhật sách");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    const uniquePath = `file/${v4()}`; // Generate a unique path for the image
    const imgRef = ref(ImportDB, uniquePath);

    try {
      await uploadBytes(imgRef, file);
      console.log("Image uploaded successfully.");

      // Fetch the URL of the uploaded image and update the state
      const url = await getDownloadURL(imgRef);
      setImg(url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleChange = (selectedOptions, field) => {
    switch (field) {
      case "publisher":
        setSelectedOptions((prev) => ({
          ...prev,
          publisher: selectedOptions,
        }));
        break;
      case "author":
        setSelectedOptions((prev) => ({
          ...prev,
          author: selectedOptions,
        }));
        break;
      case "category":
        setSelectedOptions((prev) => ({
          ...prev,
          category: selectedOptions,
        }));
        break;
      case "bookTypes":
        setSelectedOptions((prev) => ({
          ...prev,
          bookTypes: selectedOptions,
        }));
        break;
      default:
        break;
    }
  };

  const handleAccessTypeChange = (selected, index) => {
    const updatedTypes = [...selectedOptions.bookTypes];
    updatedTypes[index] = {
      ...updatedTypes[index],
      accessType: selected.value,
    };

    setSelectedOptions((prev) => ({
      ...prev,
      bookTypes: updatedTypes,
    }));

    setSelectedBook((prevData) => ({
      ...prevData,
      bookBookTypes: prevData.bookBookTypes.map((type, idx) =>
        idx === index ? { ...type, accessType: selected.value } : type
      ),
    }));
  };

  const columns = [
    {
      title: "SST",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1, // Tự động đánh số thứ tự
    },
    {
      title: "Hình ảnh",
      dataIndex: "bookImage",
      key: "bookImage",
      render: (image) =>
        image ? (
          <img
            src={image}
            alt="Book"
            style={{ width: "50px", height: "auto", borderRadius: "4px" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Tên sách",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "No Title", // Hiển thị "No Title" nếu không có dữ liệu
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher",
      key: "publisher",
      render: (publisher) => publisher?.publisherName || "No Publisher", // Hiển thị tên NXB
    },
    {
      title: "Thể loại",
      dataIndex: "bookCategories",
      key: "bookCategories",
      render: (bookCategories) =>
        bookCategories && bookCategories.length > 0
          ? bookCategories.map((bookCategory, idx) => (
              <div
                key={idx}
                className="text-sm text-black bg-gray-600 px-2 py-1 rounded-lg mb-1"
              >
                {bookCategory?.category?.categoryName || "Unknown Category"}
              </div>
            ))
          : "No Categories",
    },
    {
      title: "Tác giả",
      dataIndex: "authorBooks",
      key: "authorBooks",
      render: (authorBooks) =>
        authorBooks && authorBooks.length > 0
          ? authorBooks.map((authorBook, idx) => (
              <div
                key={idx}
                className="text-sm text-black bg-gray-600 px-2 py-1 rounded-lg mb-1"
              >
                {authorBook?.author?.authorName || "Unknown Author"}
              </div>
            ))
          : "No Authors",
    },
  ];
  if (activeTab !== 3) {
    columns.push({
      title: "Số Chương",
      dataIndex: "bookChapters",
      key: "bookChapters",
      render: (chapters) => chapters?.length || 0, // Đếm số lượng chương
    });
    columns.push({
      title: "Gói Cước",
      dataIndex: "bookBookTypes",
      key: "bookBookTypes",
      render: (bookBookTypes) =>
        bookBookTypes && bookBookTypes.length > 0
          ? bookBookTypes.map((type, idx) => (
              <div
                key={idx}
                className="text-sm bg-gray-600 text-black px-2 py-1 rounded-lg mb-1"
              >
                {type.accessType ? type.accessType : "No Type"}
                {idx < bookBookTypes.length - 1 && <br />}
              </div>
            ))
          : "No Subscription",
    });
  }
  // Thêm cột "Price" nếu `activeTab === 3`
  if (activeTab === 3) {
    columns.push({
      title: "Giá sách",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        const formattedPrice = price
          ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          : "No Price";
        return (
          <span>{formattedPrice ? `${formattedPrice} VND` : "No Price"}</span>
        );
      },
    });
  }

  columns.push({
    title: "",
    key: "actions",
    render: (_, record) => (
      <div>
        {/* <Button
          size="small"
          className="mr-2 mb-2 "
          onClick={() => handleAddChapter(record.bookID)}
        >
          Thêm Chương
        </Button> */}
        <Button
          size="small"
          className="mr-2"
          style={{
            color: "white",
            backgroundColor: "inherit",
            cursor: "default",
            boxShadow: "none",
          }}
          onClick={() => handleUpdate(record)}
        >
          Cập Nhật
        </Button>
        <Popconfirm
          title="Bạn có chắc chắn muốn xoá sách?"
          onConfirm={() => handleDelete(record.bookID)}
          okText="Xoá"
          cancelText="Không"
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      </div>
    ),
  });

  const renderTable = (tabIndex) => {
    switch (tabIndex) {
      case 1:
      case 2:
      case 3:
        return (
          <div className="bg-gray-800 p-6 rounded-lg">
            <Table
              columns={columns}
              dataSource={books}
              className="custom-table"
              rowKey={(record, index) => index}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: ["5", "10", "20"],
              }}
              // bordered
              style={{
                backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity, 1))",
                borderRadius: "8px",
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      {/* Main Content - Card section */}
      <main className=" p-6 overflow-y-auto ml-60 mt-6">
        <div className="flex space-x-4 border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === 1 ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            Sách điện tử
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 2 ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab(2)}
          >
            Sách nói
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 3 ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab(3)}
          >
            Sách giấy
          </button>
        </div>

        <div className="mt-4">{renderTable(activeTab)}</div>
      </main>
      <Modal
        title="Cập Nhật Sách"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div className="flex space-x-6">
          {/* Hình ảnh bên trái */}
          <div className="flex-shrink-0">
            {img ? (
              <img
                src={img}
                alt="Selected"
                className="w-30 h-auto object-cover rounded-md border border-gray-300"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded-md border border-gray-300">
                <span>CHỌN ẢNH BÌA</span>
              </div>
            )}
            <label
              htmlFor="fileInput"
              className="mt-4 inline-block cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md text-center"
            >
              Chọn ảnh bìa
            </label>
            <input
              accept="image/*"
              id="fileInput"
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>

          {/* Inputs bên phải */}
          <div className="flex-1 space-y-6">
            {/* Tên sách */}
            <div>
              <label className="block text-sm font-medium text-black">
                Tên sách <span className="text-red-600">*</span>
              </label>
              <input
                name="title"
                value={selectedBook?.title || ""}
                type="text"
                onChange={handleInputChange}
                placeholder="Nhập tên sách"
                className="mt-1 block w-full px-4 py-2 text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>

            {/* Giá sách */}
            <div>
              <label className="block text-sm font-medium text-black">
                Giá sách
              </label>
              <input
                name="price"
                value={price}
                type="text"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Nhập giá sách"
                className="mt-1 block w-full px-4 py-2 text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Nhà xuất bản */}
            <div>
              <label className="block text-sm font-medium text-black">
                Nhà xuất bản <span className="text-red-600">*</span>
              </label>
              <Select
                options={options.OptionPublisher}
                value={selectedOptions.publisher}
                onChange={(option) => handleChange(option, "publisher")}
                placeholder="Chọn nhà xuất bản"
              />
              {errors.publisher && (
                <p className="text-red-500">{errors.publisher}</p>
              )}
            </div>

            {/* Tác giả */}
            <div>
              <label className="block text-sm font-medium text-black">
                Tác giả <span className="text-red-600">*</span>
              </label>
              <Select
                options={options.OptionAuthor}
                isMulti={true}
                value={selectedOptions.author}
                onChange={(option) => handleChange(option, "author")}
                placeholder="Chọn tác giả"
              />
              {errors.author && <p className="text-red-500">{errors.author}</p>}
            </div>

            {/* Thể loại */}
            <div>
              <label className="block text-sm font-medium text-black">
                Thể loại <span className="text-red-600">*</span>
              </label>
              <Select
                options={options.OptionCategory}
                isMulti={true}
                value={selectedOptions.category}
                onChange={(option) => handleChange(option, "category")}
                placeholder="Chọn thể loại"
              />
              {errors.category && (
                <p className="text-red-500">{errors.category}</p>
              )}
            </div>
            {/* Loại sách */}
            <div>
              <label className="block text-sm font-medium text-black">
                Gói cước <span className="text-red-600">*</span>
                <p>
                  {selectedBook?.bookBookTypes &&
                  selectedBook.bookBookTypes.length > 0
                    ? selectedBook.bookBookTypes
                        .map(
                          (type) =>
                            options.OptionType.find(
                              (opt) => opt.value === type.bookType.bookTypeID
                            )?.label || type.bookType.bookTypeName
                        ) // Ensure label is set
                        .join(", ")
                    : "Chưa chọn gói cước"}
                </p>
              </label>
              {selectedOptions.bookTypes.map((type, index) => (
                <Select
                  key={`${type.bookTypeID}-${index}`}
                  className="mt-1 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  options={[
                    { value: "Miễn phí", label: "Miễn phí" },
                    { value: "Hội viên", label: "Hội viên" },
                  ]}
                  value={{
                    value: type.accessType,
                    label:
                      type.accessType === "Miễn phí" ? "Miễn phí" : "Hội viên",
                  }}
                  onChange={(option) => handleAccessTypeChange(option, index)}
                  placeholder="Chọn gói cước"
                  maxMenuHeight={200}
                />
              ))}
              {errors.bookTypes && (
                <p className="text-red-500">{errors.bookTypes}</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoryBook;
