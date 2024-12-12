import React from "react";

function SliderBar() {
  return (
    <div className="relative">
      <div className="swiper-container w-full">
        <div className="swiper homeSlide swiper-initialized swiper-horizontal swiper-backface-hidden">
          <div
            className="swiper-wrapper"
            id="swiper-wrapper-62e2289bd5da39e3"
            aria-live="off"
            style={{
              transitionDuration: "0ms",
              transform: "translate3d(0px, 0px, 0px)",
            }}
          >
            <div
              className="swiper-slide home-slide cursor-pointer swiper-slide-active"
              role="group"
              aria-label="NaN / 6"
            >
              <img
                src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3586.jpg?w=1920&h=600"
                alt=""
              />
            </div>
            {/* <div class="swiper-slide home-slide cursor-pointer swiper-slide-next" style="background-size: cover; background-repeat: no-repeat; background-position: center center; width: 1528px;" role="group" aria-label="NaN / 6">
                        <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3589.jpg" alt="">
                        </div>
                        <div class="swiper-slide home-slide cursor-pointer" style="background-size: cover; background-repeat: no-repeat; background-position: center center; width: 1528px;" role="group" aria-label="NaN / 6">
                        
                        </div>
                        <div class="swiper-slide home-slide cursor-pointer" style="background-size: cover; background-repeat: no-repeat; background-position: center center; width: 1528px;" role="group" aria-label="NaN / 6"></div>
                        <div class="swiper-slide home-slide cursor-pointer" style="background-size: cover; background-repeat: no-repeat; background-position: center center; width: 1528px;" role="group" aria-label="NaN / 6"></div>
                        <div class="swiper-slide home-slide cursor-pointer" style="background-size: cover; background-repeat: no-repeat; background-position: center center; width: 1528px;" role="group" aria-label="NaN / 6"></div> */}
          </div>
          <div className="absolute !bg-[linear-gradient(180deg,_rgba(18,_18,_20,_0),_#000000)] bottom-0 left-0 w-full h-[7.5rem] z-10" />
        </div>
      </div>
      {/* End slider */}
      {/* Start cái nút của slider */}
      <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
        <span
          className="swiper-pagination-bullet swiper-pagination-bullet-active"
          aria-current="true"
        />
        <span className="swiper-pagination-bullet" />
        <span className="swiper-pagination-bullet" />
        <span className="swiper-pagination-bullet" />
        <span className="swiper-pagination-bullet" />
      </div>
      {/* End cái nút của slider */}
      {/* Start Nút Next Pev */}
      <div
        className="swiper-button-next style-next-back flex justify-center items-center absolute right-4 top-1/2 transform -translate-y-1/2"
        tabIndex={0}
        role="button"
        aria-label="Next slide"
        aria-controls="swiper-wrapper-62e2289bd5da39e3"
      >
        <img
          src="https://waka.vn/svgs/icon-next-slide.svg"
          alt="icon-next-slide"
          className="cursor-pointer"
        />
      </div>
      <div
        className="swiper-button-prev style-next-back flex justify-center items-center absolute left-4 top-1/2 transform -translate-y-1/2"
        tabIndex={0}
        role="button"
        aria-label="Previous slide"
        aria-controls="swiper-wrapper-62e2289bd5da39e3"
      >
        <img
          src="https://waka.vn/svgs/icon-back.svg"
          alt="icon-back"
          className="cursor-pointer"
        />
      </div>
      {/* End Nút Next Pev */}
    </div>
  );
}

export default SliderBar;
