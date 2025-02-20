import { ChangeEvent, useEffect, useState } from "react";
import Datepicker from "../components/common/DatePicker";
import Input from "../components/common/Input";
import AutoComplete from "../components/common/AutoComplete";
import ReactDatePiker from "react-datepicker";
import Button from "../components/common/Button";
import { UserData } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { ENDPOINT } from "../utils/endpoints";
import UseDebounce from "../hooks/useDebounce";

const MeetingDetailPage: React.FC = () => {
  const [userName, setUserName] = useState<{
    userId: string;
    isAdmin?: boolean;
    email: string;
    username: string;
    userImage?: string;
    token?: string;
  }>({
    userId: "",
    isAdmin: false,
    email: "",
    username: "",
    userImage: "",
    token: "",
  });
  const [initialData, setInitialData] = useState<{
    startDate: Date | null;
    agenda: string;
    selectedUsers: UserData[];
    selectedTime: Date | null;
  }>({
    startDate: null,
    agenda: "",
    selectedUsers: [],
    selectedTime: null,
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [agenda, setAgenda] = useState("");
  const [creatorId, setCreatorId] = useState(""); // 회의 생성자 id
  const [creatorUsername, setCreatorUsername] = useState(""); // 회의 생성자 이름
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserData[]>([]);
  const [isModified, setIsModified] = useState(false);
  const loginUser = localStorage.getItem("user");
  const selectedUserName = selectedUsers.map((user) => user.username);
  const debouncedSearchInputValue = UseDebounce(query, 700);
  const navigate = useNavigate();
  const now = new Date();
  const param = useParams();
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
  const setGetUsers = (users: UserData[]) => {
    setSelectedUsers((prevState) => [
      ...prevState,
      ...users.filter(
        (user) =>
          !prevState.some(
            (selectedUser) => selectedUser.username === user.username
          )
      ),
    ]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };
  const handleSelect = (user: UserData) => {
    setQuery("");
    setFilteredData([]);
    setSelectedUsers((prev) => [...prev, user]);
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

  useEffect(() => {
    if (debouncedSearchInputValue) {
      getUserName();
    }
    return () => {
      setFilteredData([]);
    };
  }, [debouncedSearchInputValue]);

  // 회의 등록했던 데이터 가져오기 API
  const getUserInfo = async () => {
    try {
      const request = await api.get(`${ENDPOINT.METTING}/${param.meetingId}`);

      const meeting = request.data.data.meeting;

      const newSelectedUsers = meeting.attendant.map((username: string) => ({
        username,
      }));
      setGetUsers(newSelectedUsers);

      setAgenda(meeting.agenda);
      setStartDate(meeting.date);

      const DateTime = new Date();
      const [hours, minutes] = meeting.startTime.split(":");
      DateTime?.setHours(parseInt(hours, 10));
      DateTime?.setMinutes(parseInt(minutes, 10));
      DateTime?.setSeconds(0);
      DateTime?.setMilliseconds(0);
      setSelectedTime(DateTime);
      setCreatorId(meeting.creatorId);
      setCreatorUsername(meeting.creatorUsername);

      setInitialData({
        startDate: meeting.date,
        agenda: meeting.agenda,
        selectedUsers: newSelectedUsers,
        selectedTime: DateTime,
      });
    } catch (err) {
      console.log("Error getUserInfo ", err);
    }
  };

  // 회의 수정한 데이터 API
  const handleClickFix = async () => {
    if (!selectedUserName.length) {
      alert("참여자를 입력해주세요");
      return;
    }
    if (!agenda) {
      alert("회의 안건을 입력해주세요");
      return;
    }
    const data = {
      creatorId: userName.userId,
      attendant: selectedUserName,
      date: startDate,
      startTime: selectedTimeString,
      agenda: agenda,
    };
    try {
      await api.put(`${ENDPOINT.METTING}/${param.meetingId}`, data);
      alert("회의 수정 완료");
      setGetUsers([]);
      navigate("/");
    } catch (err) {
      console.log("Error meetingDetail Fix ", err);
      alert("회의 수정 실패");
    }
  };

  // 회의 삭제한 데이터 API
  const handleClickDelete = async () => {
    try {
      await api.delete(`${ENDPOINT.METTING}/${param.meetingId}`);
      alert("삭제완료");
      navigate("/");
    } catch (err) {
      console.log("Error meetingDetail delete ", err);
      alert("삭제실패");
    }
  };

  useEffect(() => {
    setGetUsers([]);

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
        (selectedTime instanceof Date ? selectedTime.toISOString() : "") !==
          (initialData.selectedTime instanceof Date
            ? initialData.selectedTime.toISOString()
            : "") ||
        agenda !== initialData.agenda ||
        JSON.stringify(selectedUsers) !==
          JSON.stringify(initialData.selectedUsers);

      setIsModified(isModified);
    };
    checkModification();
  }, [startDate, selectedTime, agenda, selectedUsers, initialData]);

  return (
    <>
      <div className="w-full flex flex-col space-y-5 items-center">
        <p className="mt-20">회의 일정 상세 페이지</p>

        <div className="w-full max-w-md">
          {creatorId !== userName.userId ? (
            <Datepicker
              className="w-full px-4 py-2 border rounded-md"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              id={"날짜"}
              readOnly
            />
          ) : (
            <Datepicker
              className="w-full px-4 py-2 border rounded-md"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              id={"날짜"}
              minDate={now}
            />
          )}
        </div>
        <div className="w-full max-w-md">
          {creatorId !== userName.userId ? (
            <Input
              placeholder="회의 안건"
              id={"회의 안건"}
              value={agenda}
              onChange={handleClickAgenda}
              readOnly
            />
          ) : (
            <Input
              placeholder="회의 안건"
              id={"회의 안건"}
              value={agenda}
              onChange={handleClickAgenda}
            />
          )}
        </div>
        <div className="w-full max-w-md">
          <Input
            placeholder="생성자"
            id={"생성자"}
            value={creatorUsername}
            readOnly
          />
        </div>
        <div className="w-full max-w-md">
          {creatorId !== userName.userId ? (
            <AutoComplete
              onSelect={handleUserSelect}
              id={"참여자"}
              value={query || ""}
              readOnly={true}
            />
          ) : (
            <AutoComplete
              onSelect={handleUserSelect}
              id={"참여자"}
              readOnly={false}
              onChange={handleChange}
              value={query || ""}
            />
          )}

          {filteredData.length > 0 && (
            <ul className=" z-10 w-full bg-white border border-gray-300 rounded">
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
                className={
                  creatorId !== userName.userId
                    ? "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 pointer-events-none"
                    : "inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-[#a3aee6] transition duration-10"
                }
              >
                {user.username}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-md">
          {creatorId !== userName.userId ? (
            <ReactDatePiker
              className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2"
              selected={selectedTime}
              onChange={(date: Date | null) => setSelectedTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={10}
              dateFormat="hh:mm aa"
              readOnly
            />
          ) : (
            <ReactDatePiker
              className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2"
              selected={selectedTime}
              onChange={(date: Date | null) => setSelectedTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              minTime={now}
              maxTime={
                new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate(),
                  23,
                  59
                )
              }
              dateFormat="hh:mm aa"
            />
          )}
        </div>
        <div className="w-full max-w-md flex justify-between">
          <div className="w-1/3">
            {creatorId !== userName.userId ? null : (
              <Button
                btnText="수정"
                disabled={!isModified}
                onClick={handleClickFix}
              />
            )}
          </div>
          <div className="w-1/3">
            {creatorId !== userName.userId ? null : (
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

export default MeetingDetailPage;
