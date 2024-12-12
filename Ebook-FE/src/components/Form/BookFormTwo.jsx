import { useState, useContext, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { MultiStepContext } from "./StepContext";

const voices = [
  { value: "lannhi", label: "Lan Nhi (Nữ - miền Bắc)" },
  { value: "minhquang", label: "Minh Quang (Nam - miền Bắc)" },
  { value: "myan", label: "My An (Nữ - miền Trung)" },
  { value: "ngoclam", label: "Ngọc Lam (Nữ - miền Nam)" },
];

function BookFormTwo() {
  const { setStep, BookData, setBookData } = useContext(MultiStepContext);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [voice, setVoice] = useState("lannhi");
  const [showConvertButton, setShowConvertButton] = useState(false);
  const [chapters, setChapters] = useState([
    { chapterTitle: "", chapterContent: "", audioLink: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);

  const addChapter = () => {
    if (chapters[currentChapter].chapterContent.length < 500) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        chapterContent: "Nội dung chương phải có ít nhất 500 chữ",
      }));
      return;
    }
    setErrors((prevErrors) => ({ ...prevErrors, chapterContent: "" }));
    setChapters([...chapters, { chapterTitle: "", chapterContent: "" , audioLink: "" }]);
    setCurrentChapter(chapters.length);
  };

  const intro =
    "bạn đang nghe sách nói tại YUKI. Sau đây là nội dung của cuốn sách " +
    BookData.title +
    " giọng đọc " +
    voice;
  const handleNext = () => {
    if (chapters.some((chapter) => chapter.chapterContent.length < 500)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        chapterContent: "Nội dung chương phải có ít nhất 500 chữ",
      }));
      return;
    }
    setErrors((prevErrors) => ({ ...prevErrors, chapterContent: "" }));
    setBookData({ ...BookData, chapters: chapters });
    setStep(3); // Proceed to the next step
  };

  useEffect(() => {
    if (BookData.bookTypes.some((bookType) => bookType.bookTypeID === 2)) {
      setShowConvertButton(true);
    }
  }, [BookData]);

const handleConvert = async (index) => {
  setIsLoading(true);
  try {
    const plainText = quillRef.current.getEditor().getText();
    const text = intro + " " + chapters[index].chapterTitle + " " + plainText;
    console.log(text);
    const response = await axios.post("https://api.fpt.ai/hmi/tts/v5", text, {
      headers: {
        "api-key": "C378sx997eQUcCJghXW4sdMMdkMH7XUe", // Thay bằng API key FPT của bạn
        voice: voice,
        speed: "-0.5",
      },
    });

    const checkAudioLink = async (url) => {
      try {
        const res = await axios.get(url);
        if (res.status === 200) {
          const newChapters = [...chapters];
          newChapters[index].audioLink = url;
          setChapters(newChapters);
          setIsLoading(false);
        } else {
          setTimeout(() => checkAudioLink(url), 3000); // Retry after 3 seconds
        }
      } catch (error) {
        setTimeout(() => checkAudioLink(url), 3000); // Retry after 3 seconds
      }
    };

    checkAudioLink(response.data.async);
  } catch (error) {
    console.error("Error converting text to speech:", error);
    if (error.code === "ERR_NETWORK") {
      alert(
        "Network error occurred. Please check your internet connection and try again."
      );
    }
    setIsLoading(false);
  }
};

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <form className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6">
          {chapters.map((chapter, index) => (
            <div key={index}>
              {/* Tên chương */}
              <div>
                <label className="block text-sm font-semibold text-white">
                  Tên chương {index + 1} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên chương"
                  className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md"
                  value={chapter.chapterTitle}
                  onChange={(e) => {
                    const newChapters = [...chapters];
                    newChapters[index].chapterTitle = e.target.value;
                    setChapters(newChapters);
                  }}
                />
              </div>

              {/* Nội dung chương */}
              <div>
                <label className="block text-sm font-semibold text-white">
                  Nội dung <span className="text-red-600">*</span>
                </label>
                <ReactQuill
                  ref={quillRef}
                  placeholder="Nhập nội dung chương..."
                  theme="snow"
                  className="bg-white text-black h-96 mb-5 mt-2 rounded-md shadow-sm border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out overflow-y-auto"
                  value={chapter.chapterContent}
                  onChange={(content) => {
                    const newChapters = [...chapters];
                    newChapters[index].chapterContent = content;
                    setChapters(newChapters);
                    const plainText = quillRef.current.getEditor().getText();
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      chapterContent:
                        content.length >= 500 ? "" : prevErrors.chapterContent,
                    }));
                  }}
                />
                {errors.chapterContent && (
                  <p className="text-red-500">{errors.chapterContent}</p>
                )}
                {showConvertButton && (
                  <>
                    <div>
                      <label
                        htmlFor="voice-select"
                        style={{ display: "block", marginBottom: "10px" }}
                      >
                        Chọn giọng đọc:
                      </label>
                      <select
                        id="voice-select"
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-md mb-5"
                      >
                        {voices.map((voiceOption) => (
                          <option
                            key={voiceOption.value}
                            value={voiceOption.value}
                          >
                            {voiceOption.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="bg-green-500 text-white w-40 py-2 px-4 rounded-3xl"
                      onClick={() => handleConvert(index)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang chuyển đổi..." : "Chuyển đổi"}
                    </button>
                    {chapter.audioLink && (
                      <div className="mt-4">
                        <audio
                          controls
                          src={chapter.audioLink}
                          className="w-full mb-4"
                        >
                          Your browser does not support the audio element.
                        </audio>
                        <a
                          href={chapter.audioLink}
                          download="audio.mp3"
                          className="bg-blue-500 text-white py-2 px-4 rounded-3xl"
                        >
                          Tải về
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </form>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-4">
        <div className="flex space-x-4">
          <button
            className="border text-white w-40 py-2 px-4 rounded-3xl"
            onClick={() => setStep(1)}
          >
            Quay lại
          </button>
          {chapters.length < 3 ? (
            <button
              className="bg-green-500 text-white w-40 py-2 px-4 rounded-3xl"
              onClick={addChapter}
            >
              Thêm chương
            </button>
          ) : (
            <button
              className="bg-green-500 text-white w-40 py-2 px-4 rounded-3xl"
              onClick={handleNext}
            >
              Tiếp theo
            </button>
          )}
          <button className="bg-purple-200 bg-opacity-96 text-purple-600 w-40 py-2 px-4 rounded-3xl">
            Lưu tạm
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookFormTwo;
