import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

const handleRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleResponseInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse> => {
  // 리프레시 토큰 만료 시 로그인창으로 리다이렉트
  if (error.response?.status === 401) {
    window.location.href = "/";
  } else if (error.response?.status === 403) {
  }
  const errorMsg = error.response?.data as { message: string };
  alert(errorMsg.message);
  return new Promise(() => {});
};

axiosApi.interceptors.request.use(
  handleRequestInterceptor,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => handleResponseInterceptor(error)
);

export default axiosApi;