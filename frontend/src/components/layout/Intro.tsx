import { IntroStyles } from "../../styles";
import introImg from "../../images/intro.jpg";

export function Intro() {
  return (
    <IntroStyles>
      <div className="intro--main">
        <img src={introImg} alt="intro" />
        <h2>Duy trì trạng thái kết nối cho điện thoại</h2>
        <p>
          WhatsApp kết nối với điện thoại để đồng bộ tin nhắn. Để giảm mức sử
          dụng dữ liệu, hãy kết nối điện thoại với mạng Wi-Fi.
        </p>
      </div>
    </IntroStyles>
  );
}
