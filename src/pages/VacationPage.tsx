import { ChangeEvent, useEffect, useState } from "react";
import SelectBox from "../components/common/SelectBox";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Datepicker from "../components/common/DatePicker";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ENDPOINT } from "../utils/endpoints";

const VacationPage = () => {
  const [userName, setUserName] = useState<{
    userId: string;
    email: string;
    username: string;
    token?: string;
  }>({ userId: "", email: "", username: "" });
  const [isOption, setIsOption] = useState("연차");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const loginUser = localStorage.getItem("user");
  const today = new Date();

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setIsOption(e.target.value);
    console.log(e.target.value);
  };
  const handleChangeReason = (e: ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  // 휴가 등록 API
  const handelClickSubmit = async () => {
    if (!reason) {
      alert("사유를 입력해주세요");
      return;
    }
    const data = {
      username: userName.username,
      userId: userName.userId,
      startDate: startDate,
      endDate: endDate,
      vacationType: isOption,
      reason: reason,
    };
    try {
      await api.post(ENDPOINT.VACATION, data);
      alert("휴가 신청 완료");
      navigate("/");
    } catch (err) {
      console.log("Error submit vacation data ", err);
      alert("휴가 신청 실패");
    }
  };

  useEffect(() => {
    if (loginUser) {
      setUserName(JSON.parse(loginUser));
    }
  }, []);

  return (
    <>
      <div className="w-full flex flex-col space-y-5 items-center">
        <p className="mt-20">휴가 신청 페이지</p>
        <div className="w-full max-w-md">
          <Input
            placeholder="이름"
            id={"이름"}
            value={userName.username}
            readOnly
          />
        </div>
        <div className="w-full max-w-md">
          <Datepicker
            id={"시작 날짜"}
            className="w-full px-4 py-2 border rounded-md"
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={today}
          />
        </div>
        <div className="w-full max-w-md">
          <Datepicker
            id={"종료 날짜"}
            className="w-full px-4 py-2 border rounded-md"
            dateFormat="yyyy/MM/dd"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={today}
          />
        </div>
        <div className="w-full max-w-md">
          <SelectBox
            id={"종류"}
            className=""
            value={isOption}
            optionText1="연차"
            optionText2="반차"
            onChange={handleChangeSelect}
          />
        </div>
        <div className="w-full max-w-md">
          <Input placeholder="사유" id={"사유"} onChange={handleChangeReason} />
        </div>
        <div className="w-full max-w-md">
          <Button btnText="등록" onClick={handelClickSubmit} />
        </div>
      </div>
    </>
  );
};

export default VacationPage;
