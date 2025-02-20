import { useNavigate } from "react-router-dom";
import errorImg from "/img/errorImg.png";
import Button from "../components/common/Button";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex justify-center items-center -translate-y-20">
      <div className="w-96 flex flex-col justify-center items-center p-4">
        <img src={errorImg} alt="에러 이미지" className="w-56" />
        <h2 className="text-4xl font-bold pt-14">Page Not Found</h2>
        <p className="text-sm pt-4 pb-16 text-center">
          존재하지 않는 주소를 입력하셨거나,요청하신 페이지의 주소가 변경,
          삭제되어 찾을 수 없습니다.
        </p>
        <Button btnText="홈으로" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};
export default ErrorPage;
