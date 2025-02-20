import { ChangeEvent, useEffect, useState } from "react";
import Datepicker from "../components/common/DatePicker";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import ReactDatePiker from "react-datepicker";
import AutoComplete from "../components/common/AutoComplete";
import { UserData } from "../types";
import api from "../utils/api";
import { ENDPOINT } from "../utils/endpoints";
import { useNavigate } from "react-router-dom";
import UseDebounce from "../hooks/useDebounce";

// 현재 시간을 가장 가까운 30분 단위로 반올림
const getRoundedDate = () => {
  const date = new Date();
  const minutes = date.getMinutes();
  const roundedMinutes = minutes <= 30 ? 30 : 60;
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

const MeetingPage: React.FC = () => {
  const [userName, setUserName] = useState<{
    userId: string;
    email: string;
    username: string;
    token?: string;
  }>({ userId: "", email: "", username: "", token: "" });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(
    getRoundedDate()
  );
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [agenda, setAgenda] = useState("");
  const selectedUserName = selectedUsers.map((user) => user.username);
  const debouncedSearchInputValue = UseDebounce(query, 700);
  const now = new Date();
  const navigate = useNavigate();
  const availablueUsers = filteredData.filter(
    (user) =>
      !selectedUsers.some((selected) => selected.username === user.username)
  );
  // date에서 시간만 string변환
  const hours = selectedTime?.getHours().toString().padStart(2, "0");
  const minutes = selectedTime?.getMinutes().toString().padStart(2, "0");
  const selectedTimeString = `${hours}:${minutes}`;

  const setDeleteUsers = (user: UserData) => {
    setSelectedUsers((prevState) =>
      prevState.filter(
        (selectedUser) => selectedUser.username !== user.username
      )
    );
  };

  const handleSelect = (user: UserData) => {
    setQuery("");
    setFilteredData([]);
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      setFilteredData([]);
    }
  };

  // 참여자 자동완성 검색 API
  const getUserName = async () => {
    try {
      const response = await api.get(
        `${ENDPOINT.USER}/search?username=${debouncedSearchInputValue}`
      );

      setFilteredData(response.data.users);
    } catch (err) {
      console.log("Error getUserName ", err);
    }
  };

  const handleUserSelect = (user: UserData) => {
    setSelectedUsers((prev) => [...prev, user]);
  };
  const handleClickAgenda = (e: ChangeEvent<HTMLInputElement>) => {
    setAgenda(e.target.value);
  };
  const handleClickCancel = (user: UserData) => {
    setDeleteUsers(user);
  };

  // 회의 등록 API
  const handleClickSubmit = async () => {
    if (!agenda) {
      alert("회의 안건을 입력해주세요");
      return;
    }
    if (selectedUserName.length === 0) {
      alert("참여자를 입력해주세요");
      return;
    }

    const data = {
      creatorId: userName.userId,
      date: startDate,
      startTime: selectedTimeString,
      agenda: agenda,
      attendant: selectedUserName,
      username: userName.username,
    };

    try {
      await api.post(ENDPOINT.METTING, data);

      alert("회의 신청 완료");
      navigate("/");
    } catch (err) {
      console.log("Error submit meeting data", err);
      alert("회의 신청 실패");
    }
  };

  useEffect(() => {
    const loginUser = localStorage.getItem("user");

    if (loginUser) {
      const parsedUser = JSON.parse(loginUser);
      setUserName(parsedUser);
      const initialUser: UserData = { username: parsedUser.username };
      setSelectedUsers([initialUser]);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearchInputValue) {
      getUserName();
    }
  }, [debouncedSearchInputValue]);

  return (
    <>
      <div className="w-full flex flex-col space-y-5 items-center">
        <p className="mt-20">회의 일정 생성 페이지</p>
        <div className="w-full max-w-md">
          <Datepicker
            className="w-full px-4 py-2 border rounded-md"
            dateFormat="yyyy/MM/dd"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            id={"날짜"}
            minDate={now}
          />
        </div>
        <div className="w-full max-w-md">
          <Input
            placeholder="회의 안건"
            id={"회의 안건"}
            onChange={handleClickAgenda}
          />
        </div>
        <div className="w-full max-w-md">
          <Input
            placeholder="생성자"
            id={"생성자"}
            value={userName.username}
            readOnly
          />
        </div>
        <div className="w-full max-w-md">
          <AutoComplete
            onSelect={handleUserSelect}
            id={"참여자"}
            onChange={handleChange}
            value={query || ""}
          />
          {filteredData.length > 0 && (
            <ul className=" z-10 w-full bg-white border border-gray-300 rounded overflow-auto h-[100px] scrollbar-hide">
              {availablueUsers.map((user, index) => (
                <li key={index} className="" onClick={() => handleSelect(user)}>
                  {user.username}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5">
            {selectedUsers.map((user, index) => (
              <span
                key={index}
                onClick={() => handleClickCancel(user)}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-[#a3aee6] transition duration-10"
              >
                {user.username}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-md">
          <ReactDatePiker
            className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2"
            selected={selectedTime}
            onChange={(date: Date | null) => setSelectedTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            minTime={now}
            maxTime={
              new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)
            }
            dateFormat="hh:mm aa"
          />
        </div>

        <div className="w-full max-w-md">
          <Button btnText="등록" onClick={handleClickSubmit} />
        </div>
      </div>
    </>
  );
};

export default MeetingPage;
