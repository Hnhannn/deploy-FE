import { React, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { MultiStepContext } from "../components/Form/StepContext";

function Cart() {
  const { cartItems, setCartItems } = useContext(MultiStepContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Thêm hiệu ứng cuộn mượt mà
    });
    document.title = "Giỏ hàng";
  }, []);

  const increaseQuantity = (bookID) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.book.bookID === bookID && item.quantity < 5
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (bookID) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.book.bookID === bookID && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <div>
      {cartItems.length > 0 ? (
        <>
          <div className="bg-background text-black-400 pt-20 px-14 text-base-16-19 pb-10 grid grid-cols-3 gap-6 items-start">
            <div className="col-span-2">
              <h2 className="text-2xl font-semibold mb-6">Giỏ hàng của bạn</h2>
              <table className="w-full bg-c1c rounded-xl animate-[appearing_.3s_linear_alternate]">
                <thead>
                  <tr className="text-white-50 font-medium">
                    <th className="w-1/2" />
                    <th className="py-4 w-1/6">Đơn giá</th>
                    <th className="w-1/6">Số lượng</th>
                    <th className="">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr
                      key={index}
                      className="text-white-50 font-medium border-t border-[hsla(0,_0%,_100%,_.1)]"
                    >
                      <td className="py-4 w-[25%] min-w-[20%]">
                        <div className="flex items-center gap-4 px-6">
                          <div className="w-[4.25rem] min-w-[4.25rem] h-[6.25rem] rounded-md bg-explore relative">
                            <img
                              src={
                                item.book?.bookImage ||
                                "/images/default-image.png"
                              }
                              className="absolute inset-0 rounded-md object-contain"
                              alt={item.book?.title}
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="t-ellipsis-2">{item.book?.title}</p>
                            <p className="text-white-400 font-normal">
                              x {item.quantity}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center w-[15%]">
                        {item.book?.price.toLocaleString("vi-VN") + ` đ`}
                      </td>
                      <td className="w-[10%]">
                        <div className="w-full flex items-center justify-center">
                          <div className="flex items-center text-white-50 font-normal">
                            <button
                              onClick={() => decreaseQuantity(item.book.bookID)}
                              className="w-9 h-9 border border-[rgba(255,255,255,0.2)] rounded-l-md"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={item.quantity}
                              className="pre-order__number-input w-9 h-9 border-y border-[rgba(255,255,255,0.2)] bg-transparent appearance-none text-center"
                            />
                            <button
                              onClick={() => increaseQuantity(item.book.bookID)}
                              className="w-9 h-9 border border-[rgba(255,255,255,0.2)] rounded-r-md"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="text-center w-[10%]">
                        {(item.book?.price * item.quantity).toLocaleString(
                          "vi-VN"
                        ) + ` đ`}
                      </td>
                      <td className="text-center w-[10%]">
                        <button className="p-1 text-red-500 hover:text-red-700">
                          <i className="fa-solid fa-trash text-sm"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Phần nhập voucher */}
            <div className="w-[27rem] h-fit bg-c1c rounded-xl flex flex-col divide-y divide-white-overlay sticky right-0 top-[135px] text-white-default font-medium">
              <div className="px-6 py-4">
                <div className="flex justify-between mb-7">
                  <p>Thành tiền</p>
                  <p>
                    {cartItems
                      .reduce(
                        (total, item) =>
                          total +
                          (item.book?.price || 0) * (item.quantity || 1),
                        0
                      )
                      .toLocaleString("vi-VN")}{" "}
                    đ
                  </p>
                </div>
                <div className="w-full">
                  <Link to={"/preordertocart"}>
                    <button className="bg-green-500 w-full py-2.5 rounded-full text-16-16 text-white-default font-semibold">
                      Thanh toán
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-background text-black-400 pt-20 px-14 text-base-16-19 pb-10 w-full h-[263px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img
              src="https://waka.vn/svgs/icon-empty.svg"
              alt="icon-empty"
              className="cursor-pointer"
            />
            <p className="font-medium text-base text-white-50 pb-2 pt-6">
              Bạn không có sản phẩm nào trong giỏ hàng
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
