import { useState, useRef, useEffect } from "react";
// import {getChappterById} from "../service/APIChapterService";
import { getBookById } from "../service/API_Book_Service";

export default function ModelMusic({ Close, bookID }) {
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái phát hoặc tạm dừng
  const audioRef = useRef(null); // Tham chiếu đến thẻ audio
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const bgMusicRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  const [book, setBook] = useState([]);
  const [bookChapters, setBookChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [aduioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    // Lấy volume từ localStorage khi component mount
    const savedVolume = localStorage.getItem("audioVolume");
    if (savedVolume !== null) {
      const newVolume = savedVolume / 100;
      setVolume(savedVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.volume = newVolume / 10;
      }
    }
  }, []);

  const handleSliderClick = (e) => {
    const runway = e.currentTarget; // Lấy thanh trượt
    const clickX = e.clientX - runway.getBoundingClientRect().left; // Tính toán vị trí nhấp chuột
    const runwayWidth = runway.clientWidth; // Lấy chiều rộng của thanh trượt
    const percentage = (clickX / runwayWidth) * 100; // Tính toán phần trăm vị trí nhấp
    const newTime = (duration * percentage) / 100; // Cập nhật thời gian phát nhạc

    // Thiết lập thời gian phát nhạc mới
    audioRef.current.currentTime = newTime; // Nếu bạn sử dụng ref cho audio

    // Nếu bạn muốn tự động phát nhạc khi người dùng nhấp vào thanh trượt, hãy bỏ dòng này
    // audioRef.current.play();
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100; // Chuyển đổi giá trị slider (0 - 100) thành giá trị volume (0 - 1)
    setVolume(e.target.value); // Cập nhật state
    audioRef.current.volume = newVolume; // Cập nhật volume của audio
    bgMusicRef.current.volume = newVolume / 10;

    // Lưu volume vào localStorage
    localStorage.setItem("audioVolume", e.target.value);
  };

  // Hàm để phát hoặc tạm dừng nhạc
  const togglePlayPause = () => {
    if (isPlaying) {
      bgMusicRef.current.pause();
      audioRef.current.pause(); // Nếu đang phát, dừng nhạc
    } else {
      // Giảm âm lượng nhạc nền
      bgMusicRef.current.play();
      audioRef.current.play(); // Nếu đang dừng, phát nhạc
    }
    setIsPlaying(!isPlaying); // Đổi trạng thái giữa phát và dừng
  };

  // Cập nhật thời gian hiện tại và tổng thời gian khi bài hát đang phát
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Cập nhật tổng thời gian bài hát khi bài hát đã tải xong
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  // Tính phần trăm bài hát đã phát
  const getPercentage = () => {
    return (currentTime / duration) * 100;
  };

  // Định dạng thời gian hiển thị (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleEnded = () => {
    bgMusicRef.current.pause();
    audioRef.current.pause(); // Nếu đang phát, dừng nhạc
    setIsPlaying(false);
    handleChapterClick(currentChapter + 1);
  };

  const handleChapterClick = (index) => {
    setCurrentChapter(index);
    setAudioUrl(bookChapters.bookChapters[index].audioLink);
    if (isPlaying) {
      audioRef.current.pause();
      setTimeout(() => {
        audioRef.current.play();
      }, 1000); // Trì hoãn 1 giây trước khi phát audio chính
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < bookChapters.length - 1) {
      handleChapterClick(currentChapter + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      handleChapterClick(currentChapter - 1);
    }
  };

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.2; // Thiết lập âm lượng nhỏ hơn
    }

    const fechAudio = async () => {
      const data = await getBookById(bookID);
      console.log(data.bookChapters);
      setBook(data);
      setBookChapters(data);
      if (data.bookChapters.length > 0) {
        setCurrentChapter(0);
        setAudioUrl(data.bookChapters[0].audioLink);
      }
    };
    fechAudio();
  }, []);

  return (
    <>
      <div
        id="modal-music"
        className=" w-full bg-black py-4 fixed z-20 bottom-0 left-0 backdrop-filter backdrop-blur-md border-t border-x-gray-400"
      >
        {/* Thẻ audio ẩn để phát nhạc */}
        <audio
          ref={audioRef}
          src={aduioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        ></audio>
        <audio
          ref={bgMusicRef}
          src="https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" // Link nhạc nền
          type="audio/mp3"
          loop
        />

        <div className="w-full mr-auto ml-auto pr-[3.75rem] pl-[3.75rem] flex justify-between px-14">
          <div className="flex gap-6 items-center flex-1">
            <div className="flex gap-x-2 items-start">
              <a
                href="/sach-noi/muon-kieu-nguoi-chon-cong-so-be3A9"
                className="block h-[56px] min-w-[38px] aspect-2/3"
              >
                <img
                  src={
                    bookChapters.bookImage
                      ? bookChapters.bookImage
                      : "Loading..."
                  }
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </a>
              <div className="py-2">
                <a
                  href="/sach-noi/muon-kieu-nguoi-chon-cong-so-be3A9"
                  className="block"
                >
                  <p className="font-semibold text-lg text-white-default hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                    {bookChapters.title ? bookChapters.title : "Loading..."}
                  </p>
                </a>
                <p className="text-sm text-white-300 overflow-hidden whitespace-nowrap text-ellipsis">
                  {book.authorBooks && book.authorBooks.length > 0
                    ? book.authorBooks
                        .map((authorBook) => authorBook.author.authorName)
                        .join(", ")
                    : "Loading..."}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1 rounded-xl hover:bg-white-overlay">
                <img
                  src="https://waka.vn/svgs/icon-heart.svg"
                  alt="icon-heart"
                  className="w-6 h-6"
                />
              </button>
              <button className="p-1 rounded-xl hover:bg-white-overlay">
                <img
                  src="https://waka.vn/svgs/icon-social-share.svg"
                  alt="icon-social-share"
                  className="w-6 h-6"
                />
              </button>
            </div>
          </div>
          <div className="w-full max-w-screen-sm">
            <div className="flex gap-x-4 justify-center items-center mb-3">
              <span>
                <span className="el-popover__reference-wrapper">
                  <button
                    className="p-1 rounded-xl hover:bg-white-overlay flex flex-col items-center el-popover__reference"
                    aria-describedby="el-popover-2082"
                  >
                    <p className="text-white-50 leading-[18px]">1.0</p>
                    <img
                      src="https://waka.vn/svgs/icon-speed.svg"
                      alt="icon-speed"
                      className="cursor-pointer"
                    />
                  </button>
                </span>
              </span>
              <button className="p-1 hover:bg-white-overlay rounded-xl h-8 w-8">
                <img
                  src="https://waka.vn/svgs/icon-rewind.svg"
                  alt="icon-rewind"
                  className="cursor-pointer"
                />
              </button>
              <button
                onClick={handlePrevChapter}
                className="p-1 hover:bg-white-overlay rounded-xl h-8 w-8 disabled:opacity-50"
              >
                <img
                  src="https://waka.vn/svgs/icon-prev.svg"
                  alt="icon-prev"
                  className="cursor-pointer"
                />
              </button>
              <button
                className="w-12 h-12 hover:bg-white-overlay rounded-xl"
                onClick={togglePlayPause}
              >
                <img
                  src={
                    isPlaying
                      ? "https://waka.vn/svgs/icon-pause.svg"
                      : "https://waka.vn/svgs/icon-playing.svg"
                  }
                  alt={isPlaying ? "icon-pause" : "icon-playing"}
                  className="w-full h-full"
                />
              </button>
              <button
                onClick={handleNextChapter}
                className="p-1 hover:bg-white-overlay rounded-xl h-8 w-8 disabled:opacity-50"
              >
                <img
                  src="https://waka.vn/svgs/icon-next.svg"
                  alt="icon-next"
                  className="cursor-pointer"
                />
              </button>
              <button className="p-1 hover:bg-white-overlay rounded-xl h-8 w-8">
                <img
                  src="https://waka.vn/svgs/icon-forward.svg"
                  alt="icon-forward"
                  className="cursor-pointer"
                />
              </button>
              <button className="p-1 hover:bg-white-overlay rounded-xl h-8 w-8">
                <img
                  src="https://waka.vn/svgs/icon-repeat-auto.svg"
                  alt="icon-repeat-auto"
                  className="cursor-pointer"
                />
              </button>
            </div>
            <div className="flex items-center gap-x-3">
              <div className="min-w-[60px] text-right">
                <p className="text-[13px] text-white-300 whitespace-nowrap">
                  {formatTime(currentTime)}
                </p>
              </div>
              <div className="el-slider player-slider flex-grow">
                <div
                  className="el-slider__runway relative bg-gray-600"
                  onClick={handleSliderClick}
                >
                  <div
                    className="el-slider__bar bg-white h-1 rounded transition-all duration-300"
                    style={{ width: `${getPercentage()}%`, left: "0%" }}
                  />
                  <div
                    className="top-1 absolute"
                    style={{
                      left: `${getPercentage()}%`,
                      transform: "translateX(-50%)",
                    }} // Căn giữa nút trượt
                  >
                    <div
                      className="absolute  el-tooltip el-slider__button bg-white border border-gray-300 rounded-full shadow-md"
                      style={{ width: "15px", height: "15px", bottom: "-6px" }} // Tăng kích thước tại đây
                      aria-describedby="el-tooltip-5450"
                    />
                  </div>
                </div>
              </div>
              <div className="min-w-[60px] text-left">
                <p className="text-[13px] text-white-300 whitespace-nowrap">
                  {formatTime(duration)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-x-4 flex-1 justify-end">
            <span>
              <span className="el-popover__reference-wrapper">
                <button
                  className="p-1 rounded-xl hover:bg-white-overlay el-popover__reference"
                  onClick={() => setShowPopover(!showPopover)}
                >
                  <img
                    src="https://waka.vn/svgs/icon-list-white.svg"
                    alt="icon-list-white"
                    className="cursor-pointer min-w-6"
                  />
                </button>
              </span>
            </span>
            <div>
              <div className="flex gap-x-2 items-center">
                <button className="p-1 rounded-xl hover:bg-white-overlay">
                  <img
                    src="https://waka.vn/svgs/icon-speaker-soft.svg"
                    alt="icon-speaker-soft"
                    className="cursor-pointer min-w-6"
                  />
                </button>
                <input
                  id="default-range"
                  type="range"
                  value={volume} // Liên kết với state volume
                  onChange={handleVolumeChange} // Cập nhật volume khi người dùng điều chỉnh slider
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
            <button
              className="p-1 rounded-xl hover:bg-white-overlay"
              onClick={Close}
            >
              <img
                src="https://waka.vn/svgs/icon-close-white.svg"
                alt="icon-close-white"
                className="cursor-pointer min-w-6"
              />
            </button>
          </div>
        </div>
        {showPopover && <Popover chapter={bookChapters.bookChapters} />}
      </div>
    </>
  );
}

const Popover = ({ chapter }) => {
  return (
    <>
      <div className="absolute z-20 bottom-20 left-[500px] rounded-xl py-4 border bg-black border-[hsla(0,_0%,_100%,_.1)]">
        <div className="w-full px-4">
          <p className="font-normal text-[15px] text-gray-300 px-3 pb-3 border-b border-gray-600 mb-2">
            Danh sách phát ({chapter.length ? chapter.length : "Loading..."})
          </p>
        </div>
        <div className="max-h-[500px] h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 px-4">
          <table className="w-full">
            <tbody>
              {chapter?.length > 0 ? (
                chapter.map((item, index) => (
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-white-overlay border-collapse child-td:py-2.5"
                  >
                    <td className="px-3 rounded-l-xl">
                      <p className="leading-5 font-normal text-white-300 whitespace-nowrap">
                        {index + 1}
                      </p>
                    </td>
                    <td className="px-3">
                      <p className="leading-5 font-normal text-waka-500 t-ellipsis-1">
                        {item.chapterTitle || "N/A"}
                      </p>
                      <p className="text-[13px] text-white-300">
                        {item.date || "N/A"}
                      </p>
                    </td>
                    <td className="px-3">
                      <p className="font-normal text-[15px] text-white-300 whitespace-nowrap">
                        {item.duration || "00:00"}
                      </p>
                    </td>
                    <td className="px-3">
                      <p className="font-normal text-[15px] text-waka-500 whitespace-nowrap text-right">
                        {item.price || "N/A"}
                      </p>
                    </td>
                    <td className="px-3 rounded-r-xl">
                      <div className="w-6 min-w-6">
                        <img
                          src="https://waka.vn/svgs/icon-playing.svg"
                          alt="icon-playing"
                          className="cursor-pointer w-full"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-white-300 py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
