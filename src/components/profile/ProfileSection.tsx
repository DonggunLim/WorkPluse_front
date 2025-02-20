import axios from "axios";
import { useState } from "react";

type ProfileSectionProps = {
  onClick?: () => void;
  className?: string;
  title?: string;
  data?: {
    checkedBy?: string[];
    meetingId?: string;
    label?: string;
    name?: string;
    date?: string;
  }[];
  onListClick?: (item: {
    label?: string;
    date?: string;
    details?: string;
  }) => void;
  checkNewMeeting?: (meetingId: string, username: string) => void;
  isMeetingSection?: boolean;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
  onListClick,
  className,
  title,
  data,
  checkNewMeeting,
  isMeetingSection = true,
}) => {
  const [user, _setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const token = user.token;
  const username = user.username;

  const handleClickAlarm = async (meetingId: string) => {
    try {
      await axios.patch(
        `/api/meeting/check/${username}/${meetingId}`,
        { username, meetingId },
        {
          headers: {
            authorization: token,
          },
        }
      );
    } catch (err) {
      console.log("handleClickAlarm 오류", err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data.message);
      }
    }
  };

  return (
    <div className="h-full">
      <p className="font-bold pb-2 pt-8">{title}</p>
      <div
        className={`border border-[#DFDFDF] bg-white rounded-md h-[calc(100%-64px)] p-6 overflow-scroll ${className}`}
      >
        {data ? (
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                <button
                  className="mb-1 w-full flex justify-between items-center border-b border-gray-300 last:border-none py-2 cursor-pointer hover:text-gray-500"
                  onClick={() => {
                    if (isMeetingSection && item.meetingId) {
                      handleClickAlarm(item.meetingId);
                      checkNewMeeting?.(item.meetingId, username);
                    }
                    onListClick?.(item);
                  }}
                >
                  {isMeetingSection &&
                    !item.checkedBy?.includes(username) &&
                    item.meetingId && (
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    )}
                  <p className="truncate text-left w-[100px]">{item.label}</p>
                  <p>{item.date}</p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
