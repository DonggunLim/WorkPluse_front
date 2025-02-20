import { useEffect, useState } from "react";
import Logo from "./Logo";
import Bell from "../icons/Bell";
import MenuIcon from "../icons/MenuIcon";
import XIcon from "../icons/XIcon";
import { useNavigate } from "react-router-dom";
import defaultImg from "../icons/profileImg.svg";
import api from "../../utils/api";

const Header = () => {
  const [isMenu, setIsMenu] = useState(false);
  const [idAdmin, setIsAdmin] = useState(false);
  const [isAlarm, setIsAlarm] = useState(false);
  const [AvatarImage, setAvatarImage] = useState("");
  const [user, _setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin);
      user.userImage
        ? setAvatarImage(user.userImage)
        : setAvatarImage(defaultImg);
    }
  }, [user]);

  const handleClickMenu = () => {
    setIsMenu(!isMenu);
  };

  const checkNewMeeting = async () => {
    try {
      const response = await api.get(`/meeting/my/unchecked/${user.username}`);
      return response.data.unCheckedMeeting;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkNewMeeting() //
      .then(setIsAlarm);
    const timerId = setInterval(() => {
      checkNewMeeting() //
        .then(setIsAlarm);
    }, 2500);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <header className="sticky top-0 bg-white">
      <div
        className={"flex justify-center items-center border-b border-slate-300"}
      >
        <div
          className={
            "flex  justify-between items-center gap-8 px-8 py-2 h-16 w-1280"
          }
        >
          <button onClick={() => navigate("/")}>
            <Logo width={"110px"} />
          </button>

          <div
            className={`${
              !idAdmin ? "md:flex hidden" : "hidden"
            }  gap-8 w-full text-slate-900 `}
          >
            <button onClick={() => navigate("/")}>메인페이지</button>
            <button onClick={() => navigate("/meeting")}>회의 일정 생성</button>
            <button onClick={() => navigate("/vacation")}>휴가 신청</button>
          </div>
          <div
            className={`${
              idAdmin ? "md:flex hidden" : "hidden"
            }  gap-8 w-full text-slate-900 `}
          >
            <button onClick={() => navigate("/admin")}>관리자페이지</button>
          </div>
          <div className={"flex"}>
            <button
              onClick={() => navigate("/profile")}
              className={"flex justify-between items-center pr-2"}
            >
              <Bell
                className={`${isAlarm ? "block" : "hidden"}`}
                height={"32px"}
              />
            </button>
            <button
              className="md:flex hidden justify-center items-center w-8 h-8"
              onClick={() => navigate("/profile")}
            >
              <img
                className="object-cover w-full h-full rounded-full cursor-pointer"
                src={AvatarImage}
                alt="Profile image"
              />
            </button>
            <button
              className={
                "md:flex hidden justify-between items-center text-slate-400 text-sm text-nowrap pl-4"
              }
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("isCheckOutClick");
                navigate("/login");
              }}
            >
              로그아웃
            </button>
            {isMenu ? (
              <button className={"md:hidden block"} onClick={handleClickMenu}>
                <XIcon width={"24px"} />
              </button>
            ) : (
              <button className={"md:hidden block"} onClick={handleClickMenu}>
                <MenuIcon width={"24px"} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={`${isMenu ? "flex" : "hidden"} relative h-screen`}>
        <div
          className={`${
            !idAdmin ? "flex" : "hidden"
          } bg-white flex-col items-center absolute w-full`}
        >
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900 "}
            onClick={() => {
              navigate("/");
              setIsMenu(false);
            }}
          >
            메인페이지
          </button>
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900"}
            onClick={() => {
              navigate("/meeting");
              setIsMenu(false);
            }}
          >
            회의 일정 생성
          </button>
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900"}
            onClick={() => {
              navigate("/vacation");
              setIsMenu(false);
            }}
          >
            휴가 신청
          </button>
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900"}
            onClick={() => {
              navigate("/profile");
              setIsMenu(false);
            }}
          >
            프로필
          </button>
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900"}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("isCheckOutClick");
              navigate("/login");
              setIsMenu(false);
            }}
          >
            로그아웃
          </button>
        </div>

        <div
          className={`${
            idAdmin ? "flex" : "hidden"
          } bg-white flex-col items-center absolute w-full`}
        >
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900 "}
            onClick={() => {
              navigate("/admin");
              setIsMenu(false);
            }}
          >
            관리자 페이지
          </button>
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900"}
            onClick={() => {
              navigate("/profile");
              setIsMenu(false);
            }}
          >
            프로필
          </button>
          <button
            className={"py-4 border-b border-slate-300 w-11/12 text-slate-900"}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
              setIsMenu(false);
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
