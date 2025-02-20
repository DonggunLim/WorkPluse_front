import { ChangeEvent, useEffect, useState } from "react";
import Datepicker from "../components/common/DatePicker";
import Input from "../components/common/Input";
import SelectBox from "../components/common/SelectBox";
import Button from "../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { ENDPOINT } from "../utils/endpoints";

const VacationDetailPage = () => {
  const [userName, setUserName] = useState<{
    userId: string;
    email: string;
    username: string;
    token: string;
  }>({ userId: "", email: "", username: "", token: "" });
  const [initialData, setInitialData] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    isOption: string;
    reason: string;
  }>({
    startDate: null,
    endDate: null,
    isOption: "",
    reason: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [isOption, setIsOption] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [reason, setReason] = useState("");
  const [requesterId, setRequesterId] = useState("");
  const [requesterUsername, setRequesterUsername] = useState("");
  const loginUser = localStorage.getItem("user");
  const param = useParams();
  const navigate = useNavigate();

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setIsOption(e.target.value);
  };
  const handleChangeReason = (e: ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
  };

  // 휴가 등록했던 데이터 가져오기 API
  const getUserInfo = async () => {
    try {
      const request = await api.get(`${ENDPOINT.VACATION}/${param.vacationId}`);

      const vacation = request.data.data.vacation;

      setIsOption(vacation.vacationType);
      setReason(vacation.reason);
      setStartDate(vacation.startDate);
      setEndDate(vacation.endDate);
      setRequesterId(vacation.requesterId);
      setRequesterUsername(vacation.username);

      setInitialData({
        startDate: vacation.startDate,
        endDate: vacation.endDate,
        isOption: vacation.vacationType,
        reason: vacation.reason,
      });
    } catch (err) {
      console.log("Error getUserInfo ", err);
    }
  };

  const data = {
    username: userName.username,
    userId: userName.userId,
    startDate: startDate,
    endDate: endDate,
    vacationType: isOption,
    reason: reason,
  };

  const updateVacationDetails = async () => {
    try {
      await api.put(`${ENDPOINT.VACATION}/${param.vacationId}`, data);

      alert("휴가신청 수정완료");
      navigate("/");
    } catch (err) {
      console.log("Error vacationDetail Fix ", err);
      alert("휴가 수정 실패");
    }
  };

  // 휴가 수정한 데이터 API
  const handleClickFix = () => {
    if (!reason) {
      alert("사유를 입력해주세요");
      return;
    }
    updateVacationDetails();
  };

  // 휴가 삭제한 데이터 API
  const handleClickDelete = async () => {
    try {
      await api.delete(`${ENDPOINT.VACATION}/${param.vacationId}`);
      alert("삭제완료");
      navigate("/");
    } catch (err) {
      console.log("Error vacationDetail delete ", err);
      alert("삭제실패");
    }
  };

  useEffect(() => {
    if (loginUser) {
      const user = JSON.parse(loginUser);
      setUserName(user);
      getUserInfo();
    }
  }, []);

  // 수정한게 없을 때는 수정 버튼 disabled 설정
  useEffect(() => {
    const checkModification = () => {
      const isModified =
        (startDate instanceof Date ? startDate.toISOString() : "") !==
          (initialData.startDate instanceof Date
            ? initialData.startDate.toISOString()
            : "") ||
        (endDate instanceof Date ? endDate.toISOString() : "") !==
          (initialData.endDate instanceof Date
            ? initialData.endDate.toISOString()
            : "") ||
        isOption !== initialData.isOption ||
        reason !== initialData.reason;

      setIsModified(isModified);
    };
    checkModification();
  }, [startDate, endDate, isOption, reason, initialData]);

  return (
    <>
      <div className="w-full flex flex-col space-y-5 items-center">
        <p className="mt-20">휴가 신청 상세 페이지</p>
        <div className="w-full max-w-md">
          <Input
            placeholder="이름"
            id={"이름"}
            value={requesterUsername}
            readOnly
          />
        </div>
        <div className="w-full max-w-md">
          {requesterId !== userName.userId ? (
            <Datepicker
              id={"시작 날짜"}
              className="w-full px-4 py-2 border rounded-md"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              readOnly
            />
          ) : (
            <Datepicker
              id={"시작 날짜"}
              className="w-full px-4 py-2 border rounded-md"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
            />
          )}
        </div>
        <div className="w-full max-w-md">
          {requesterId !== userName.userId ? (
            <Datepicker
              id={"종료 날짜"}
              className="w-full px-4 py-2 border rounded-md"
              dateFormat="yyyy/MM/dd"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              readOnly
            />
          ) : (
            <Datepicker
              id={"종료 날짜"}
              className="w-full px-4 py-2 border rounded-md"
              dateFormat="yyyy/MM/dd"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={new Date()}
            />
          )}
        </div>
        <div className="w-full max-w-md">
          {requesterId !== userName.userId ? (
            <SelectBox
              id={"종류"}
              className=""
              value={isOption}
              optionText1="연차"
              optionText2="반차"
              onChange={handleChangeSelect}
              disabled={true}
            />
          ) : (
            <SelectBox
              id={"종류"}
              className=""
              value={isOption}
              optionText1="연차"
              optionText2="반차"
              onChange={handleChangeSelect}
              disabled={false}
            />
          )}
        </div>
        <div className="w-full max-w-md">
          {requesterId !== userName.userId ? (
            <Input
              placeholder="사유"
              id={"사유"}
              value={reason}
              onChange={handleChangeReason}
              readOnly
            />
          ) : (
            <Input
              placeholder="사유"
              id={"사유"}
              value={reason}
              onChange={handleChangeReason}
            />
          )}
        </div>
        <div className="w-full max-w-md flex justify-between">
          <div className="w-1/3">
            {requesterId !== userName.userId ? null : (
              <Button
                btnText="수정"
                disabled={!isModified}
                onClick={handleClickFix}
              />
            )}
          </div>
          <div className="w-1/3 ">
            {requesterId !== userName.userId ? null : (
              <Button
                className="px-4 py-3 bg-[#f00] text-white rounded-md hover:bg-[#ba0000] transition duration-10"
                btnText="삭제"
                onClick={handleClickDelete}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VacationDetailPage;
