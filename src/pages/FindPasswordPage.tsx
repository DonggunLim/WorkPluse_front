import Logo from "../components/common/Logo";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const regex =
  /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?`~\-]).{8,}$/;

const FindPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [issend, setIsSend] = useState(false);
  const [token, setToken] = useState({ value: "", expires: "" });
  const [emailInputValue, setEmailInputValue] = useState("");
  const [isclick, setIsclick] = useState(false);
  const [ifVerifyOk, setIsVerifyOk] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = !!localStorage.getItem("user");

  useEffect(() => {
    if (isLogin) {
      navigate("/");
      alert("로그인이 되어있습니다.");
    }
  }, [isLogin, navigate]);

  if (isLogin) {
    return null;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailValue = urlParams.get("email");
    const tokenValue = urlParams.get("token");
    const expiresValue = urlParams.get("expires");

    if (tokenValue && expiresValue && emailValue) {
      setIsSend(true);
      setEmailInputValue(emailValue);
      setToken({ value: tokenValue, expires: expiresValue });
    }
  }, [location]);

  const handleChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);
  const handleChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );
  const handleChangePasswordCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
    },
    []
  );

  const handleClickEmailSend = useCallback(async () => {
    if (!email.includes("@")) {
      alert("메일에@넣어주세요");
    } else {
      try {
        setIsLoading(true);
        await axios.post("/api/auth/send-email-password", {
          email,
        });
        setIsclick(true);
      } catch (err) {
        console.log("handleClickEmailSend 오류", err);
        if (axios.isAxiosError(err)) {
          alert(err.response?.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, [email]);

  const handleClickEmailVerify = useCallback(async () => {
    try {
      await axios.post("/api/auth/verify-email", {
        email: emailInputValue,
        token,
      });
      setIsVerifyOk(true);
    } catch (err) {
      console.log("handleClickEmailVerify 오류", err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data.message);
      }
    }
  }, [emailInputValue, token]);

  const handleClickPassword = useCallback(async () => {
    if (!regex.test(password)) {
      alert(
        "password는 8글자 이상 + 영문, 특수문자는 꼭 하나씩 들어가야됩니다."
      );
    } else if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다");
    } else if (password === passwordCheck) {
      try {
        await axios.patch("/api/auth/password", {
          email: emailInputValue,
          password,
        });
        alert("비밀번호가 변경되었습니다.");
        navigate("/login");
      } catch (err) {
        console.log("handleClickPassword 오류", err);
        if (axios.isAxiosError(err)) {
          alert(err.response?.data.message);
        }
      }
    }
  }, [password, passwordCheck, emailInputValue, navigate]);

  return (
    <>
      <div
        className={"grid grid-cols-1 h-screen md:grid-cols-2 content-center"}
      >
        <button
          onClick={() => navigate("/login")}
          className={"flex justify-center items-center pb-16 md:h-screen"}
        >
          <Logo className={"w-6/12"} />
        </button>
        <div
          className={
            "flex flex-col justify-center items-center gap-8 md:h-screen"
          }
        >
          <div className={"flex flex-col w-8/12 min-w-80 gap-4"}>
            <h2 className={"text-xl"}>비밀번호 찾기</h2>
            {!issend ? (
              <>
                <Input
                  type={"email"}
                  onChange={handleChangeEmail}
                  placeholder={"이메일을 입력해주세요"}
                  id={"이메일"}
                />

                {!isclick ? (
                  <Button
                    onClick={handleClickEmailSend}
                    btnText={
                      isloading ? "잠시만 기다려주세요" : "이메일 보내기"
                    }
                    disabled={isloading}
                  />
                ) : (
                  <Button
                    btnText={"이메일을 확인해주세요"}
                    disabled
                    className="bg-blue-300 hover:bg-blue-300"
                  />
                )}
              </>
            ) : (
              <>
                <input
                  className={
                    "px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2"
                  }
                  readOnly
                  value={emailInputValue}
                  id={"이메일"}
                />
                <Button
                  className={ifVerifyOk ? "bg-green-800" : "bg-blue-800"}
                  onClick={handleClickEmailVerify}
                  btnText={ifVerifyOk ? "인증되었습니다" : "이메일 인증받기"}
                />
              </>
            )}
          </div>
          {issend ? (
            <>
              <div className={"flex flex-col gap-4 w-8/12 min-w-80"}>
                <Input
                  type={"password"}
                  onChange={handleChangePassword}
                  placeholder={"비밀번호를 입력해주세요"}
                  id={"새 비밀번호"}
                />
                <Input
                  type={"password"}
                  onChange={handleChangePasswordCheck}
                  placeholder={"비밀번호를 한번 더 입력해주세요"}
                  id={"새 비밀번호 확인"}
                />
                <Button
                  onClick={handleClickPassword}
                  btnText={"비밀번호 변경"}
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <div
            className={
              "flex justify-center items-center text-sm text-slate-500"
            }
          >
            <button onClick={() => navigate("/login")}>로그인</button>
            <p className={"px-1"}> | </p>
            <button onClick={() => navigate("/signup")}>회원가입</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindPasswordPage;
