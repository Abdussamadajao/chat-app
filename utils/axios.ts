import { AxiosInstance, AxiosRequestConfig } from "axios";
import _http from "./api";

export function axiosBaseQuery(
  baseConfig?: AxiosRequestConfig,
  http: AxiosInstance = _http
) {
  return request;

  async function request(config?: AxiosRequestConfig) {
    try {
      const response = await http.request(config!);
      return {
        data: response.data,
        meta: { request: response.request, response },
      };
    } catch (error: object | any) {
      return {
        error: error.response
          ? {
              message: error.response.data.message,
              status: error.response.status,
              data: error.response.data,
            }
          : {
              message: "Something went wrong",
              data: { message: "Something went wrong" },
            },
      };
    }
  }
}
