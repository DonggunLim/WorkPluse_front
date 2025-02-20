import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./common/Header";
import { useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem("user");

  const user = localStorage.getItem("user");
  const location = useLocation();
  const isAdmin = user ? JSON.parse(user).isAdmin : false;

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    // 로그인 상태이고 /admin 경로에 접근했을 때, 관리자가 아니면 에러 페이지로 리디렉션
    if (isLogin && location.pathname.startsWith("/admin") && !isAdmin) {
      navigate("/error");
    }
  }, [isLogin, location.pathname, isAdmin, navigate]);

  if (!isLogin) {
    return null;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
