import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../common/Button";

const CheckInOut = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [user, _setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isCheckIn, setIsCheckIn] = useState(false);
  const [checkinTime, setCheckinTime] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [isCheckInClick, setIsCheckInClick] = useState(false);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: false,
  };

  const userId = user.userId;
  const token = user.token;

  const arrDayStr = ["일", "월", "화", "수", "목", "금", "토"];
  const dt = new Date();
  const today =
    dt.getFullYear() +
    "년 " +
    (dt.getMonth() + 1) +
    "월 " +
    dt.getDate() +
    "일 (" +
    arrDayStr[dt.getDay()] +
    ")";

  const updateCurrentTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("ko-KR", options);
    setCurrentTime(timeString);
  };

  const getCheckinOutTime = async () => {
    try {
      const response = await axios.get(`/api/user/attendance/${userId}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      if (!response.data.attendance) {
        return null;
      }
      const { timestamps, status } = response.data.attendance;
      const now = new Date(timestamps).toLocaleTimeString("ko-KR", options);
      if (status) {
        setCheckinTime(now);
        setIsCheckIn(status);
        setIsCheckInClick(status);
        localStorage.setItem(
          "today",
          new Date(timestamps).getDate().toString()
        );
      } else {
        if (timestamps) {
          localStorage.setItem("isCheckOutClick", JSON.stringify(true));
        }
        setCheckoutTime(now);
        setIsCheckIn(status);
        localStorage.setItem(
          "today",
          new Date(timestamps).getDate().toString()
        );
      }
    } catch (err) {
      console.log("getCheckinOutTime 오류", err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data.message);
      }
    }
  };

  getCheckinOutTime();

  useEffect(() => {
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 6000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClickCheckInOut = async () => {
    try {
      const response = await axios.patch(
        `/api/user/${userId}/attendance`,
        { status: !isCheckIn },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      const { timestamps, status } = response.data.attendance;
      const now = new Date(timestamps).toLocaleTimeString("ko-KR", options);
      if (!isCheckIn) {
        setCheckinTime(now);
        setIsCheckIn(status);
        setIsCheckInClick(status);
      } else {
        setCheckoutTime(now);
        setIsCheckIn(status);
        localStorage.setItem("isCheckOutClick", JSON.stringify(true));
      }
    } catch (err) {
      console.log("handleClickCheckInOut 오류", err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data.messsage);
      }
    }
  };

  const isCheckOutClick = localStorage.getItem("isCheckOutClick");
  let parsedIsCheckOutClick = isCheckOutClick
    ? JSON.parse(isCheckOutClick)
    : false;

  const nowDay = new Date().getDate().toString();
  const checkOutTime = localStorage.getItem("today");

  if (nowDay !== checkOutTime) {
    parsedIsCheckOutClick = false;
  }

  return (
    <div className="bg-white grow flex items-center border border-slate-400 rounded-lg shadow-lg px-4 h-[calc(34vh-4rem)] min-h-64">
      <div className="flex flex-col justify-evenly gap-4 w-full h-4/6">
        <h2 className="text-2xl text-ellipsis">{today}</h2>
        <div className="flex justify-evenly py-4 rounded-lg bg-slate-100">
          <div className="flex flex-col items-center">
            <p className="text-sm text-slate-500">현재시간</p>
            <h3 className="text-lg">{currentTime}</h3>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm text-slate-500">
              {!parsedIsCheckOutClick
                ? isCheckInClick
                  ? isCheckIn
                    ? "출근시간"
                    : "퇴근시간"
                  : "출근시간"
                : "퇴근시간"}
            </p>
            <h3 className="text-lg">
              {!parsedIsCheckOutClick
                ? isCheckInClick
                  ? isCheckIn
                    ? checkinTime
                    : checkoutTime
                  : "출근 전"
                : checkoutTime}
            </h3>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            className={
              parsedIsCheckOutClick ? "bg-blue-200 hover:bg-blue-200" : ""
            }
            disabled={parsedIsCheckOutClick}
            onClick={handleClickCheckInOut}
            btnText={
              parsedIsCheckOutClick
                ? "수고하셨습니다."
                : isCheckIn
                ? "퇴근"
                : "출근"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;
