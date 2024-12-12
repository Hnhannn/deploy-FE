import { useState, useRef } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";

const slides = [
  {
    id: 1,
    title: "Slide 1",
    image:
      "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49678.jpg?v=1&w=350&h=510",
  },
  {
    id: 2,
    title: "Slide 2",
    image:
      "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/48994.jpg?v=1&w=350&h=510",
  },
  {
    id: 3,
    title: "Slide 3",
    image:
      "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49679.jpg?v=1&w=350&h=510",
  },
  {
    id: 4,
    title: "Slide 4",
    image:
      "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49680.jpg?v=1&w=350&h=510",
  },
  {
    id: 5,
    title: "Slide 5",
    image:
      "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49681.jpg?v=1&w=350&h=510",
  },
];

function Slider3D() {
  //  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showButtonNP, setShowButtonNP] = useState(false);
  const swiperRef = useRef(null);

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div
      onMouseEnter={() => setShowButtonNP(true)}
      onMouseLeave={() => setShowButtonNP(false)}
    >
      <Swiper
        ref={swiperRef}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={3} // Chỉ hiển thị 3 slide
        slidesPerGroup={1} // Move one slide at a time
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 300,
          modifier: 4,
        }}
        autoplay={{
          delay: 3000, // Tự động chuyển slide sau 3 giây
          disableOnInteraction: false, // Không dừng autoplay khi người dùng tương tác
        }}
        modules={[EffectCoverflow, Autoplay]}
        pagination={{ clickable: true }}
        navigation={false} // Disable navigation buttons
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                display: "block",
                margin: "0 auto",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                overflow: "hidden", // Bo góc cho hình ảnh
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {showButtonNP && (
        <div>
          {/* Nút Next */}
          <div
            className="flex justify-center items-center absolute right-12 top-1/2 z-50 bg-white bg-opacity-55 rounded-full p-2 shadow-lg backdrop-blur-sm"
            onClick={handleNextClick}
            onMouseEnter={() => setShowButtonNP(true)}
          >
            <img
              src="https://waka.vn/svgs/icon-next-slide.svg"
              alt="icon-next-slide"
              className="cursor-pointer w-6 h-6" // Đặt kích thước cho biểu tượng
            />
          </div>

          {/* Nút Previous */}
          <div
            className="flex justify-center items-center absolute left-12 top-1/2 z-50 bg-white bg-opacity-55 rounded-full p-2 shadow-lg backdrop-blur-sm"
            onClick={handlePrevClick}
            onMouseEnter={() => setShowButtonNP(true)}
          >
            <img
              src="https://waka.vn/svgs/icon-back.svg"
              alt="icon-back"
              className="cursor-pointer w-6 h-6" // Đặt kích thước cho biểu tượng
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Slider3D;
