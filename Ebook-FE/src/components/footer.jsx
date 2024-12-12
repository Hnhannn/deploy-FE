import React from 'react'
function Footer() {
  return (
    <div className="bg-background text-black-400 pt-20 px-14 text-base-16-19 pb-10">
      <div className="grid grid-cols-7 gap-8 w-full">
        <div className="col-span-2">
          <div>
            <div className="w-[180px] mb-4 ">
              <img src="/images/21.png" alt="Logo" className="cursor-pointer" />
            </div>
            <span className="block text-999">
              Công ty cổ phần Cyber-Savants
            </span>
            <div className="flex items-center mt-5 text-999">
              <div className="flex items-center mr-6">
                <img
                  src="https://waka.vn/svgs/icon-phone-footer.svg"
                  alt="icon-phone-footer"
                  className="cursor-pointer"
                />
                <span className="ml-2.5">0374003493</span>
              </div>
              <div className="flex items-center">
                <img
                  src="https://waka.vn/svgs/icon-email-footer.svg"
                  alt="icon-email-footer"
                  className="cursor-pointer"
                />
                <span className="ml-2.5">Support@yuki.vn</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div>
            <h3 className="mb-4 text-white-50">Về chúng tôi</h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="text-999 hover:text-white-300">
                  <a href="/gioi-thieu">Giới thiệu</a>
                </li>
                <li className="text-999 hover:text-white-300">
                  <a href="/co-cau-to-chuc">Cơ cấu tổ chức</a>
                </li>
                <li className="text-999 hover:text-white-300">
                  <a href="/linh-vuc-hoat-dong">Lĩnh vực hoạt động</a>
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="text-999 hover:text-white-300">
                  <a href="/bao-cao-thi-truong">Cơ hội đầu tư</a>
                </li>
                <li className="text-999 hover:text-white-300">
                  <a href="/tuyen-dung">Tuyển dụng</a>
                </li>
                <li className="text-999 hover:text-white-300 cursor-pointer">
                  <span>Liên hệ</span>
                </li>
                <li className="text-999 hover:text-white-300">
                  <a href="/xuat-ban-cuon-sach-cua-rieng-ban-tai-sao-khong-YwQw">
                    Dịch vụ xuất bản sách
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <div>
            <h3 className="mb-4 text-white-50">Thông tin hữu ích</h3>
            <ul className="space-y-2">
              <li className="text-999 hover:text-white-300">
                <a href="/thoa-thuan-su-dung-dich-vu-waka">
                  Thỏa thuận sử dụng dịch vụ
                </a>
              </li>
              <li className="text-999 hover:text-white-300">
                <a href="/quyen-loi-hoi-vien-waka">Quyền lợi</a>
              </li>
              <li className="text-999 hover:text-white-300">
                <a href="/quyen-loi-rieng-tu">Quy định riêng tư</a>
              </li>
              <li className="text-999 hover:text-white-300">
                <a href="/cau-hoi-thuong-gap">Câu hỏi thường gặp</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-1">
          <div>
            <h3 className="mb-4 text-white-50">Tin tức</h3>
            <ul className="space-y-2">
              <li className="text-999 hover:text-white-300">
                <a href="/tin-waka">Tin dịch vụ</a>
              </li>
              <li className="text-999 hover:text-white-300">
                <a href="/review-truyen">Review sách</a>
              </li>
              <li className="text-999 hover:text-white-300">
                <a href="/lich-phat-hanh">Lịch phát hành</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex items-center">
            <div className="mr-5">
              <img
                src="/images/logo.png"
                alt="QR Code"
                className="cursor-pointer "
              />
            </div>
            <div>
              <a target="_blank" href="#" className="block mb-4">
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                  alt="App Store"
                  className="cursor-pointer"
                />
              </a>
              <a target="_blank" href="#" className="block">
                <img
                  src="https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftudo6xt7ozvsqz5vm8fk.png"
                  alt="Google Play"
                  className="cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs mt-8 text-999">
        Công ty Cổ phần Sách điện tử YuKi - Tầng 5,Toà nhà FPT Polytechnic,
        đường số 22, phường Thường Thạnh, quận Cái Răng, TP Cần Thơ, Việt Nam.
        <br />
        ĐKKD số 0108796796 do SKHĐT TP Hà Nội cấp ngày 24/06/2019 <br />
        Giấy xác nhận Đăng ký hoạt động phát hành xuất bản phẩm điện tử số
        8132/XN-CXBIPH do Cục Xuất bản, In và Phát hành cấp ngày 31/12/2019{" "}
        <br />
        Giấy chứng nhận Đăng ký cung cấp dịch vụ nội dung thông tin trên mạng
        Viễn thông di động số 19/GCN-DĐ do Cục Phát thanh, truyền hình và thông
        tin điện tử ký ngày 11/03/2020 <br />
        Số VPGD: 024.73086566 | Số CSKH: 1900545482 nhánh 5 | Hotline:
        0877736289
      </p>
    </div>
  );
}

export default Footer;