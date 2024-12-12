import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "react-quill/dist/quill.snow.css";
import { useState, useRef, useEffect } from "react";
// Hàm chia nội dung dựa trên chiều cao của container
const splitContentIntoSlidesByHeight = (content, maxHeight, elementRef) => {
  const words = content.split(" ");
  const slides = [];
  let tempContent = "";

  // Tạo phần tử ảo để đo chiều cao
  const testDiv = document.createElement("div");
  testDiv.style.position = "absolute";
  testDiv.style.visibility = "hidden";
  testDiv.style.width = elementRef.current.offsetWidth + "px";
  testDiv.className = "text-lg text-white"; // Thêm class để đảm bảo đo chiều cao chính xác
  document.body.appendChild(testDiv);

  for (let word of words) {
    testDiv.innerText = tempContent + word + " ";
    if (testDiv.offsetHeight > maxHeight) {
      slides.push(tempContent);
      tempContent = word + " ";
    } else {
      tempContent += word + " ";
    }
  }

  // Đừng quên thêm phần nội dung còn lại
  if (tempContent) slides.push(tempContent);

  // Xóa phần tử đo lường
  document.body.removeChild(testDiv);

  return slides;
};

function ReadBookTest() {
  const contentRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [progress, setProgress] = useState(70);


  const longContent = `<div><span style="font-weight: bold; font-size: 24px; font-family: &quot;Comic Sans MS&quot;;">H</span>ôi bại âm u cũ nát kiến trúc, tản ra ẩm ướt mốc meo hơi thở, thường thường len lỏi mà qua xà chuột, nhìn kỹ, lại có thể nhìn thấy trong một góc nằm một cái tiểu hài tử.
Chung quanh an tĩnh dị thường.
Vệ Tam trên người cái một trương cũ nát dơ bẩn chăn, xi măng bong ra từng màng trần nhà, thép lỏa lồ bên ngoài, luôn có tùy thời sụp xuống ảo giác.</div>
<p>&nbsp;‘ tí tách ——’</p>
<p>&nbsp;Một giọt hỗn bùn vị nước bẩn tích ở trên mặt nàng.</p>
<p>&nbsp;“……”</p>
<p>&nbsp;Vệ Tam đôi mắt cũng chưa mở to một chút, bọc chăn lăn đến góc tận cùng bên trong, tránh thoát mặt trên giọt nước, tiếp tục ngủ.</p>
<p>&nbsp;Rạng sáng bốn điểm, trong một góc đồng hồ báo thức đột nhiên vang lên, Vệ Tam duỗi tay ấn xuống đi.</p>
<p>&nbsp;‘ ca ——’</p>
<p>&nbsp;Đồng hồ báo thức chân chặt đứt.
Nàng chợt tỉnh táo lại,&nbsp;</p>
<p>gãi gãi loạn thành ổ gà đầu tóc, cầm lấy đồng hồ báo thức cùng nó chân nhìn nhìn,&nbsp;</p>
<p>còn hảo, có thể tu.
Vệ Tam đem chăn cuộn tròn cuộn tròn, đôi ở hơi chút sạch sẽ một chút trong một góc,</p>
<div><span style="font-weight: bold; font-size: 24px; font-family: &quot;Comic Sans MS&quot;;">H</span>ôi bại âm u cũ nát kiến trúc, tản ra ẩm ướt mốc meo hơi thở, thường thường len lỏi mà qua xà chuột, nhìn kỹ, lại có thể nhìn thấy trong một góc nằm một cái tiểu hài tử.
Chung quanh an tĩnh dị thường.
Vệ Tam trên người cái một trương cũ nát dơ bẩn chăn, xi măng bong ra từng màng trần nhà, thép lỏa lồ bên ngoài, luôn có tùy thời sụp xuống ảo giác.</div>
<p>&nbsp;‘ tí tách ——’</p>
<p>&nbsp;Một giọt hỗn bùn vị nước bẩn tích ở trên mặt nàng.</p>
<p>&nbsp;“……”</p>
<p>&nbsp;Vệ Tam đôi mắt cũng chưa mở to một chút, bọc chăn lăn đến góc tận cùng bên trong, tránh thoát mặt trên giọt nước, tiếp tục ngủ.</p>
<p>&nbsp;Rạng sáng bốn điểm, trong một góc đồng hồ báo thức đột nhiên vang lên, Vệ Tam duỗi tay ấn xuống đi.</p>
<p>&nbsp;‘ ca ——’</p>
<p>&nbsp;Đồng hồ báo thức chân chặt đứt.
Nàng chợt tỉnh táo lại,&nbsp;</p>
<p>gãi gãi loạn thành ổ gà đầu tóc, cầm lấy đồng hồ báo thức cùng nó chân nhìn nhìn,&nbsp;</p>
<p>còn hảo, có thể tu.
Vệ Tam đem chăn cuộn tròn cuộn tròn, đôi ở hơi chút sạch sẽ một chút trong một góc,</p>
`;

  // Gọi hàm chia nội dung
  useEffect(() => {
    if (contentRef.current) {
      const maxHeight = 500; // Chiều cao tối đa cho mỗi slide
      const generatedSlides = splitContentIntoSlidesByHeight(
        longContent,
        maxHeight,
        contentRef
      );
      setSlides(generatedSlides);
    }
  }, [contentRef, longContent]); // `100` là số ký tự tối đa mỗi slide (tùy chỉnh nếu cần)
  return (
    <div className="layout-web flex flex-col w-full min-h-screen bg-background">
      {/* Header read book */}
      <header className="flex items-center justify-between bg-[rgba(41,41,43,255)] h-14 text-white px-14">
        {/* Phần icon bên trái */}
        <div className="flex items-center">
          <Link to={`/book-details/6`}>
            <button className="text-white">
              {/* Icon mũi tên trái */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </Link>
        </div>
        <div className="text-center py-3">
          <span className="font-bold text-lg">Test</span>
        </div>
        {/* Phần icon bên phải */}
        <div className="flex items-center space-x-4">
          {/* Các icon như trong hình */}
          <button className="text-white">
            {/* Icon tai nghe */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8h-8-8"
              />
            </svg>
          </button>
          <button className="text-white">
            {/* Icon dấu sao */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
          {/* Add more icons as needed */}
        </div>
      </header>
      {/* End header read book */}
      <div
        ref={contentRef}
        className="flex-grow max-w-4xl mx-auto p-8 shadow-lg rounded-lg"
      >
        {/* Swiper */}
        <Swiper className="relative" spaceBetween={50} slidesPerView={1}>
          {slides.map((slideContent, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-[500px] bg-red-600 p-4">
                <p
                  className="text-lg text-white"
                  dangerouslySetInnerHTML={{
                    __html: slideContent,
                  }}
                ></p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Footer Section */}
      <footer className="flex items-center justify-between bg-[rgba(41,41,43,255)] h-14 text-white px-14 border-t border-gray-200 border-opacity-15 fixed bottom-0 left-0 right-0 z-50">
        {/* Progress Bar */}
        <div className="w-full px-28">
          <div className="flex justify-between mb-2">
            <p id="progress-text" className="text-start text-white-50">
              {/* {currentChapterTitle} */}
            </p>
            <p id="progress-text" className="text-end text-white-50">
              {(progress || 0).toFixed(0)}%
            </p>
          </div>
          <input
            // ref={progressBarRef}
            type="range"
            min="0"
            max="100"
            value={progress}
            className="w-full bg-slate-500 bg-opacity-20 rounded-full h-2"
            // onChange={handleProgressChange}
            // onMouseDown={handleMouseDown}
          />
          {/* Chấm tròn hiển thị vị trí hiện tại */}
          <div
            className="dot absolute top-1/2 transform -translate-y-1/2 bg-white h-4 w-4 rounded-full border border-white"
            style={{ left: `${progress}%` }}
          ></div>
        </div>
      </footer>
    </div>
  );
}

export default ReadBookTest;
