import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";
// import "swiper/swiper.min.css"; // Thêm dòng này
import { Navigation, Pagination } from "swiper/modules"; // Chỉ import các module

const TextSlider = ({ text, boxHeight }) => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const splitTextIntoSlides = (text, boxHeight) => {
      const tempDiv = document.createElement("div");
      tempDiv.style.width = "100%";
      tempDiv.style.height = `${boxHeight}px`;
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      tempDiv.style.overflow = "hidden";
      document.body.appendChild(tempDiv);

      let currentText = "";
      let slideContent = [];

      for (const char of text) {
        currentText += char;
        tempDiv.innerText = currentText;

        if (tempDiv.scrollHeight > boxHeight) {
          slideContent.push(currentText.slice(0, -1));
          currentText = char;
        }
      }

      if (currentText) {
        slideContent.push(currentText);
      }

      document.body.removeChild(tempDiv);
      return slideContent;
    };

    setSlides(splitTextIntoSlides(text, boxHeight));
  }, [text, boxHeight]);

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
    >
      {slides.map((content, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-[150px] p-4 overflow-hidden border border-gray-300">
            {content}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

TextSlider.propTypes = {
  text: PropTypes.string.isRequired,
  boxHeight: PropTypes.number.isRequired,
};

export default function App() {
  const text = `1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.1.Nếu biết thức tỉnh quan sát, ta có thể học hỏi bao điều hay. Tiếc rằng khi đắc thời người ta quên đi quá khứ rất nhanh. Chỉ trong đau khổ, nhục nhã ê chề mới chịu học.
2.Tự do tư tưởng không phải chỉ là muốn nghĩ thế nào thì nghĩ, mà còn là giải thoát ta ra khỏi các áp lực bắt ta phải suy nghĩ theo một lề lối nào đó.
3.Chúng ta càng ham muốn thì càng sợ hãi và càng sợ hãi lại càng đau khổ.
4.Sự hiểu biết về cõi vô hình rất quan trọng, vì khi hiểu rõ những điều xảy ra sau khi chết, ta sẽ không sợ chết nữa. Nếu có chết thì chỉ là cái chết hình hài xác thân chứ không phải là chấm dứt sự sống, và hình hài có chết đi thì sự sống mới tiếp tục tiến hóa ở một thể khác tinh vi hơn.
5.Người nghệ sĩ chân chính sáng tạo vì lòng yêu cái đẹp, chứ không vì tên tuổi, tiền bạc, địa vị.
6.Nguyên nhân chính của bệnh là do sự bận rộn với đời sống hằng ngày, nếp sống càng tiện nghi thì họ lại càng hết sức lao tâm lao lực để đạt đến cái tiện nghi hơn nữa.
7.Trong nhiều năm ròng rã, chúng ta cố tìm hạnh phúc và nhiều lần tưởng đã đạt được nó để hưởng một cách lâu bền. Nhưng lần nào ta cũng thất vọng. Sau đó, ta lại tiếp tục chạy theo ảo ảnh đó như trước. Nếu biết dừng chân suy nghĩ, ta sẽ thấy chúng ta đuổi theo hạnh phúc nhưng không hề biết đến bản chất thật sự của nó, và không biết phải dùng phương tiện nào để đạt được nó.
8.Các bạn hãy nhìn ly nước đầy trên tay tôi đây, nếu tôi tiếp tục rót thêm thì nước sẽ tràn ra ngoài. trừ khi tôi đổ bớt nước trong ly đi thì tôi mới rót thêm nước vào được. Kiến thức cũng thế, chỉ khi ta khiêm tốn gạt bỏ những thành kiến sẵn có, ta mới tiếp nhận thêm được những điều mới lạ.
9.Chúng ta dành nhiều giờ để bàn cãi sôi nổi về người này, người nọ, chê bai ông này, giễu cợt bà kia. Phải chăng chúng ta vẫn làm thế? Có bao giờ chúng ta đặt câu hỏi, tại sao chúng ta lại làm thế không? Lòng ta còn ham tiền bạc, danh vọng, địa vị, sức khỏe và chỉ cầu bình an cho chính mình thôi, nên chẳng bao giờ thỏa mãn.
10.Khi ta phát tâm làm một việc hợp với thiên ý thì một tinh tú ảnh hưởng tới ta bỗng chói sáng và các sóng điện mạnh mẽ đẩy ngược tia vũ trụ sang hướng khác. Do đó, con người có thể cải số mệnh dễ dàng nếu biết làm các việc tốt lành, đẹp đẽ.`;

  return <TextSlider text={text} boxHeight={170} />;
}
