import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";
import { ImportDB } from "../../Firebase/UploadConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid"; // Để sinh ID duy nhất
import { getAllCategories } from "../../service/API_Category_Service";
import { getAllAuthors } from "../../service/API_Author_Service";
import { getBookTypes } from "../../service/API_BookType_Service";
import { getAllPublishers } from "../../service/API_PublisherAdmin_Service";
import { MultiStepContext } from "./StepContext";

function BookFormOne() {
  const { setStep, BookData, setBookData } = useContext(MultiStepContext);
  const [options, setOptions] = useState({
    OptionAuthor: [],
    OptionCategory: [],
    OptionType: [],
  });
  const [errors, setErrors] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({
    category: [],
    bookTypes: [],
    author: [],
  });
  const [isPhysicalBookSelected, setIsPhysicalBookSelected] = useState(false);
  const [img, setImg] = useState();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoryResponse = await getAllCategories();
        const authorResponse = await getAllAuthors();
        const typeResponse = await getBookTypes();
        const publisherResponse = await getAllPublishers();
        console.log("Category Response:", typeResponse);

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

        // Cập nhật state với dữ liệu từ API
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

  const handleFileChange = async (file) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const uniquePath = `file/${v4()}`; // Sinh path unique
    const imgRef = ref(ImportDB, uniquePath); // Tham chiếu Firebase Storage

    try {
      console.log("Uploading image...");
      await uploadBytes(imgRef, file);
      console.log("Image uploaded successfully.");
      const url = await getDownloadURL(imgRef);
      setImg(url);
      setBookData({ ...BookData, bookImage: url });
    } catch (error) {
      console.error("Error uploading image:", error.code, error.message);
    }
  };

  const handleDelete = async (path) => {
    const imgRef = ref(ImportDB, path);

    try {
      await deleteObject(imgRef);
      console.log("Image deleted successfully.");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleChange = (selectedOptions, field) => {
    if (field === "category") {
      const categories = selectedOptions
        ? selectedOptions.map((option) => ({ categoryId: option.value }))
        : [];

      setBookData((prevData) => ({
        ...prevData,
        categories,
      }));

      setSelectedOptions((prev) => ({ ...prev, category: selectedOptions }));
      setErrors((prevErrors) => ({ ...prevErrors, category: "" }));
    } else if (field === "author") {
      const authors = selectedOptions
        ? selectedOptions.map((option) => ({ authorId: option.value }))
        : [];

      setBookData((prevData) => ({
        ...prevData,
        authors,
      }));

      setSelectedOptions((prev) => ({ ...prev, author: selectedOptions }));
      setErrors((prevErrors) => ({ ...prevErrors, author: "" }));
    } else if (field === "bookType") {
      const bookTypes = selectedOptions
        ? selectedOptions.map((option) => ({
            bookTypeID: option.value,
            accessType: option.value === 3 ? "" : "Miễn phí",
          }))
        : [];

      setBookData((prevData) => ({
        ...prevData,
        bookTypes,
      }));

      setSelectedOptions((prev) => ({ ...prev, bookTypes: selectedOptions }));
      setErrors((prevErrors) => ({ ...prevErrors, bookTypes: "" }));
      // Kiểm tra nếu "Sách giấy" được chọn
      const isPaperBook =
        selectedOptions && selectedOptions.some((option) => option.value === 3);
      setIsPhysicalBookSelected(isPaperBook);
    } else if (field === "publisher") {
      const publisherId = selectedOptions ? selectedOptions.value : null;

      setBookData((prevData) => ({
        ...prevData,
        publisherId,
      }));

      setSelectedOptions((prev) => ({
        ...prev,
        publisherId: selectedOptions.value,
      }));
      setErrors((prevErrors) => ({ ...prevErrors, publisher: "" }));
    }
  };
  const handleAccessTypeChange = (selected, index) => {
    const updatedTypes = [...BookData.bookTypes];
    updatedTypes[index].accessType = selected.value;

    setBookData((prevData) => ({
      ...prevData,
      bookTypes: updatedTypes,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!BookData.title) newErrors.title = "Tên sách là bắt buộc";
    if (!selectedOptions.author.length)
      newErrors.author = "Tác giả là bắt buộc";
    if (!selectedOptions.bookTypes.length)
      newErrors.bookTypes = "Loại sách là bắt buộc";
    if (!selectedOptions.category.length)
      newErrors.category = "Thể loại là bắt buộc";
    if (!BookData.description)
      newErrors.description = "Giới thiệu truyện là bắt buộc";
    if (isPhysicalBookSelected && !BookData.price)
      newErrors.price = "Giá sách giấy là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFields()) {
      setStep(2); // Proceed to the next step
    }
  };

  const modules = {
    toolbar: false,
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        {/* Image */}
        <div className="col-span-3">
          <div className="flex flex-col items-center">
            {img ? (
              <img
                src={img}
                alt="Selected"
                style={{ width: "200px", marginTop: "10px" }}
              />
            ) : (
              <div className="w-48 h-72 bg-gray-200 flex items-center justify-center text-gray-500">
                <span>CHỌN ẢNH BÌA</span>
              </div>
            )}
            <div className="mt-5 border bg-green">
              <label
                htmlFor="fileInput"
                className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md"
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
            <p className="text-xs mt-2 text-white">
              Kích thước yêu cầu: 800x1170
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="col-span-9 space-y-4">
          {/* Tên truyện */}
          <div>
            <label className="block text-sm font-medium text-white">
              Tên sách <span className="text-red-600">*</span>
            </label>
            <input
              value={BookData["title"]}
              type="text"
              onChange={(e) => {
                setBookData({ ...BookData, title: e.target.value });
                setErrors((prevErrors) => ({ ...prevErrors, title: "" }));
              }}
              placeholder="Nhập tên sách"
              className="mt-1 block w-full px-4 py-2  text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>

          {/* Tác giả */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Tác giả <span className="text-red-600">*</span>
              </label>
              <Select
                className="mt-1 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                options={options.OptionAuthor}
                isMulti={true}
                value={selectedOptions.author}
                onChange={(option) => handleChange(option, "author")}
                placeholder="Chọn tác giả"
                maxMenuHeight={200}
              ></Select>
              {errors.author && <p className="text-red-500">{errors.author}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Loại sách <span className="text-red-600">*</span>
              </label>
              <Select
                className="mt-1 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                options={options.OptionType}
                isMulti={true}
                value={selectedOptions.OptionType}
                onChange={(option) => handleChange(option, "bookType")}
                placeholder="Chọn thể loại"
                maxMenuHeight={200}
              ></Select>
              {errors.bookTypes && (
                <p className="text-red-500">{errors.bookTypes}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {BookData.bookTypes &&
              BookData.bookTypes.map((type, index) => {
                const isPaperBook =
                  options.OptionType.find(
                    (opt) => opt.value === type.bookTypeID
                  )?.label === "Sách giấy";
                return (
                  <div key={type.bookTypeID}>
                    {!isPaperBook && (
                      <>
                        <label className="block text-sm font-medium text-white">
                          Loại sách {index + 1} -{" "}
                          {
                            options.OptionType.find(
                              (opt) => opt.value === type.bookTypeID
                            )?.label
                          }
                        </label>
                        <div className="mt-1 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex">
                          <label className="flex items-center mr-4">
                            <input
                              type="radio"
                              name={`accessType-${index}`}
                              value="Miễn phí"
                              checked={type.accessType === "Miễn phí"}
                              onChange={() =>
                                handleAccessTypeChange(
                                  { value: "Miễn phí", label: "Miễn phí" },
                                  index
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-white">Miễn phí</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`accessType-${index}`}
                              value="Hội viên"
                              checked={type.accessType === "Hội viên"}
                              onChange={() =>
                                handleAccessTypeChange(
                                  { value: "Hội viên", label: "Hội viên" },
                                  index
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-white">Hội viên</span>
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            {isPhysicalBookSelected && (
              <div>
                <label className="block text-sm font-medium text-white">
                  Giá sách giấy <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập giá sách giấy"
                  value={BookData.price || ""}
                  onChange={(e) => {
                    setBookData({ ...BookData, price: e.target.value });
                    setErrors((prevErrors) => ({ ...prevErrors, price: "" }));
                  }}
                  className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md"
                />
                {errors.price && <p className="text-red-500">{errors.price}</p>}
              </div>
            )}
          </div>

          {/* Trạng thái và Thể loại */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Thể loại <span className="text-red-600">*</span>
              </label>
              <Select
                className="mt-1 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                options={options.OptionCategory}
                isMulti={true}
                value={selectedOptions.category}
                onChange={(option) => handleChange(option, "category")}
                placeholder="Chọn thể loại"
                maxMenuHeight={200}
              ></Select>
              {errors.category && (
                <p className="text-red-500">{errors.category}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Nhà xuất bản
              </label>
              <Select
                className="mt-1 text-black shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                options={options.OptionPublisher}
                isSearchable={true}
                value={selectedOptions.publisher}
                onChange={(option) => handleChange(option, "publisher")}
                placeholder="Chọn nhà xuất bản"
              />
            </div>
          </div>

          {/* Giới thiệu truyện */}
          <div>
            <label className="block text-sm font-medium text-white">
              Giới thiệu sách <span className="text-red-600">*</span>
            </label>
            <ReactQuill
              placeholder="Nhập ghi chú"
              theme="snow"
              className="bg-white text-black h-28"
              value={BookData["description"]}
              onChange={(value) => {
                setBookData({ ...BookData, description: value });
                setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
              }}
              modules={modules}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex space-x-4">
          <button className="border text-white w-40 py-2 px-4 rounded-3xl">
            Hủy
          </button>
          <button
            className="bg-green-500 text-white w-40 py-2 px-4 rounded-3xl"
            onClick={handleNext}
          >
            Tiếp theo
          </button>
          <button className="bg-purple-200 bg-opacity-96 text-purple-600 w-40 py-2 px-4 rounded-3xl">
            Lưu tạm
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookFormOne;
