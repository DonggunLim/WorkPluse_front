import axios, { HttpStatusCode, isAxiosError } from "axios";
import { API_BASE_URL } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {},
});

// 요청 인터셉터: 모든 요청에 token을 자동으로 추가
api.interceptors.request.use(
  (config) => {
    try {
      const user = localStorage.getItem("user");
      const { token } = user && JSON.parse(user);
      if (token) {
        config.headers.authorization = `${token}`;
      }
    } catch (error) {
      console.error("토큰 에러:", error);
    }
    return config;
  },
  (error) => {
    if (isAxiosError(error)) {
      if (error.status === HttpStatusCode.BadRequest) {
        console.error("잘못된 요청입니다.");
      }
      if (error.status === HttpStatusCode.Unauthorized) {
        console.error("권한이 없습니다.");
      }
    } else {
      return Promise.reject(error);
    }
  }
);
// 응답 인터셉터: 응답을 전처리하거나 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error)) {
      if (error.status === HttpStatusCode.BadRequest) {
        console.error("잘못된 요청입니다.");
      }
      if (error.status === HttpStatusCode.Unauthorized) {
        console.error("권한이 없습니다.");
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
