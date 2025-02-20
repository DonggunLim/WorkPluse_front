import Button from "../common/Button";

interface UserRowProps {
  userData: {
    username: string;
    phone: string;
    birth: string;
    email: string;
    address: string;
    _id: string;
  };

  userDelete: (userId: string) => void;
}
/* 전체 유저 목록 관리 테이블 */
export const UserRow = ({ userData, userDelete }: UserRowProps) => {
  return (
    <>
      <td className="p-2 pl-4">{userData.username}</td>
      <td className="p-2 pl-4">{userData.email}</td>
      <td className="p-2 pl-4">{userData.phone}</td>
      <td className="p-2 pl-4">{userData.birth}</td>
      <td className="p-2 pl-4 max-w-[200px]">{userData.address}</td>
      <div className="flex items-center justify-center  h-[50px] ">
        <Button
          onClick={() => {
            userDelete(userData._id);
          }}
          btnText="삭제"
          className="!py-1 px-2 bg-gray-500 hover:bg-gray-600"
        />
      </div>
    </>
  );
};

interface AttendanceRowProps {
  attendData: {
    username: string;
    attendance: {
      status: boolean;
      timestamps: string;
    };
  };
}

/* 근태 관리 테이블 */
export const AttendanceRow = ({ attendData }: AttendanceRowProps) => {
  // 시간 포맷 함수
  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <td className="p-2 pl-4 h-[57px]">{attendData.username}</td>
      <td className="p-2 pl-4">
        {attendData.attendance.status === true
          ? "출근"
          : attendData.attendance.timestamps === ""
          ? "출근x"
          : "퇴근"}
      </td>
      <td className="p-2 pl-4">
        {attendData.attendance?.timestamps
          ? formatTime(attendData.attendance.timestamps)
          : "시간 정보 없음"}
      </td>
    </>
  );
};

interface VacationRowProps {
  vacation: {
    username: string;
    startDate: string;
    endDate: string;
    vacationType: string;
    reason: string;
    status: string;
    vacationId: string;
    _id: string;
  };
  vacationApproveData: (vacationId: string, status: string) => void;
}

/* 휴가 관리 테이블 */
export const VacationRow = ({
  vacation,
  vacationApproveData,
}: VacationRowProps) => {
  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 (${days[date.getDay()]})`;
  };

  return (
    <>
      <td className="p-2 pl-4">{vacation.username}</td>
      <td className="p-2 pl-4">{vacation.vacationType}</td>
      <td className="p-2 pl-4">{formatDate(vacation.startDate)}</td>
      <td className="p-2 pl-4">{formatDate(vacation.endDate)}</td>
      <td className="p-2 pl-4 max-w-[200px]">{vacation.reason}</td>
      <td className="p-2 pl-4">
        {vacation.status === "대기중" ? (
          <div className="w-[150px] flex ">
            <Button
              btnText="승인"
              className="w-auto text-sm bg-blue-500 hover:bg-blue-600 !py-2"
              onClick={() => {
                vacationApproveData(vacation._id, "승인");
              }}
            />
            <Button
              btnText="미승인"
              className="w-auto text-sm bg-gray-500 ml-2 hover:bg-gray-600 !py-2"
              onClick={() => vacationApproveData(vacation._id, "거부")}
            />
          </div>
        ) : (
          <button disabled>{vacation.status}</button>
        )}
      </td>
    </>
  );
};
