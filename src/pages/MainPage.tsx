import { useEffect, useState } from "react";
import CheckInOut from "../components/main/CheckInOut";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../components/main/calendarStyle.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Meeting {
  _id: string;
  meeting: string;
  creatorId: string;
  attendant: string[];
  date: string;
  startTime: string;
  agenda: string;
  createdAt: string;
}

interface Vacation {
  _id: string;
  createdAt: string;
  endDate: string;
  reason: string;
  requesterId: string;
  startDate: string;
  status: string;
  username: string;
  vacationType: string;
}

const MainPage = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [user, _setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [meetingList, setMeetingList] = useState<Meeting[]>([]);
  const [selectMeetingList, setSelectMeetingList] = useState<Meeting[]>([]);
  const [vacationList, setVacationList] = useState<Vacation[]>([]);
  const [selectVacationList, setSelectVacationList] = useState<Vacation[]>([]);
  const [isDayclick, setisDayClick] = useState(false);

  const selectDay = Array.isArray(value)
    ? dayjs(value[0]).format("YYYY년 MM월 DD일")
    : dayjs(value).format("YYYY년 MM월 DD일");

  const currentMonth = dayjs(value as Date).format("YYYY-MM");
  const navigate = useNavigate();
  const token = user.token;

  const fetchData = async () => {
    try {
      const [meetingResponse, vacationResponse] = await Promise.all([
        axios.get(`/api/meeting/month/${currentMonth}`, {
          headers: { authorization: token },
        }),
        axios.get(`/api/vacation/month/${currentMonth}`, {
          headers: { authorization: token },
        }),
      ]);
      setMeetingList(meetingResponse.data.meetings);
      setVacationList(vacationResponse.data.vacations);
    } catch (err) {
      console.log("fetchData 에러", err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data.message);
      }
    }
  };

  const handleClickDay = (value: Date) => {
    const meetingDate = meetingList.filter(
      (obj) => obj.date.split("T")[0] === dayjs(value).format("YYYY-MM-DD")
    );
    const vacationDate = vacationList.filter((obj) => {
      const start = dayjs(obj.startDate.split("T")[0]);
      const end = dayjs(obj.endDate.split("T")[0]);
      const selected = dayjs(value).startOf("day");

      return selected.isBetween(start, end, null, "[]");
    });
    setSelectMeetingList(meetingDate);
    setSelectVacationList(vacationDate);
    setisDayClick(true);
  };

  const currentDayMeetingList = selectMeetingList.map((item) => {
    return (
      <li key={item._id}>
        <button
          onClick={() => navigate(`/meeting-detail/${item._id}`)}
          className="transition ease-in-out flex items-center w-full border-b hover:bg-teal-50 "
        >
          <div className="bg-teal-500 rounded-lg p-2 text-white text-sm text-nowrap ml-4">
            회의
          </div>
          <div className="flex justify-between w-full p-4">
            <h4 className="max-w-[200px] truncate">{item.agenda}</h4>
            <p>{item.startTime}</p>
          </div>
        </button>
      </li>
    );
  });

  const currentDayVacationList = selectVacationList.map((item) => {
    return (
      <li key={item._id}>
        <button
          onClick={() => navigate(`/vacation-detail/${item._id}`)}
          className="transition ease-in-out flex items-center w-full border-b hover:bg-pink-50"
        >
          <div className="bg-pink-500 rounded-lg p-2 text-white text-sm text-nowrap ml-4">
            휴가
          </div>
          <div className="flex justify-between w-full p-4">
            <h4 className="max-w-[200px] truncate">{item.username}</h4>
            <p>{item.vacationType}</p>
          </div>
        </button>
      </li>
    );
  });

  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    onChange(activeStartDate);
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  return (
    <div className="flex justify-center bg-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] w-[1280px] h-[calc(100vh-65px)] gap-4 p-8 overflow-auto scrollbar-hide">
        <div className=" flex flex-col gap-4">
          <CheckInOut />
          <div className="bg-white shadow-lg rounded-lg h-60 md:h-[calc(66vh-5rem)] min-h-[420px]">
            <div className="bg-slate-500 rounded-t-lg flex justify-center items-center h-14 sticky top-[-2rem]">
              <div className="text-white text-lg">{selectDay}</div>
            </div>
            {isDayclick ? (
              <ul className="border border-slate-400 rounded-b-lg h-[calc(100%-3.5rem)] overflow-auto scrollbar-hide">
                {currentDayMeetingList} {currentDayVacationList}
              </ul>
            ) : (
              <div className="flex justify-center border border-slate-400 rounded-b-lg items-center w-full h-[calc(100%-3.5rem)]">
                <p className="text-lg">날짜를 선택해주세요</p>
              </div>
            )}
          </div>
        </div>
        <div
          style={{ display: "flex", height: "calc(100% - 3rem)" }}
          className="calendarStyle"
        >
          <Calendar
            onChange={onChange}
            value={value}
            formatDay={(_, date) => dayjs(date).format("D")} // '일' 제거, 숫자만 표시
            formatYear={(_, date) => dayjs(date).format("YYYY")} // 네비게이션에서 숫자 년도만 표시
            formatMonthYear={(_, date) => dayjs(date).format("YYYY년 MM월")} // 네비게이션에서 '2023. 12' 형식으로 표시
            calendarType="gregory" // 일요일 부터 시작
            showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
            next2Label={null} // +1년 & +10년 이동 버튼 숨기기
            prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
            minDetail="year" // 10년단위 년도 숨기기
            onActiveStartDateChange={handleActiveStartDateChange} //네비게이션 클릭해도 fetchMeeting 실행되게
            onClickDay={handleClickDay}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const meetingCount = meetingList.filter((meeting) =>
                  dayjs(meeting.date.split("T")[0]).isSame(dayjs(date), "day")
                ).length;

                const vacationCount = vacationList.filter((vacation) => {
                  const start = dayjs(vacation.startDate.split("T")[0]);
                  const end = dayjs(vacation.endDate.split("T")[0]);
                  const current = dayjs(date).startOf("day");
                  return current.isBetween(start, end, null, "[]");
                }).length;

                if (meetingCount > 0 || vacationCount > 0) {
                  return (
                    <div className="flex flex-col items-center mt-1">
                      {meetingCount > 0 && (
                        <span className="bg-teal-500 text-white rounded-full px-2 py-1 text-xs">
                          회의 {meetingCount}건
                        </span>
                      )}
                      {vacationCount > 0 && (
                        <span className="bg-pink-500 text-white rounded-full px-2 py-1 text-xs mt-1">
                          휴가 {vacationCount}건
                        </span>
                      )}
                    </div>
                  );
                }
              }
              return null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
