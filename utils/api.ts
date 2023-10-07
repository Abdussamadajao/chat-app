import axios, { AxiosInstance } from "axios";
import * as Device from "expo-device";

const ApiInstance: AxiosInstance = axios.create({
  baseURL: "https://chat-app-api-hag4.onrender.com",
});

ApiInstance.defaults.headers.post["Content-Type"] = "application/json";

export default ApiInstance;
