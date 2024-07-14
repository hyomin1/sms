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
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const handleResponseInterceptor = async (
  error: AxiosError
): Promise<AxiosResponse> => {
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
