import axios from "axios";
import { BASE_URL, config } from "./axiosConfig";
import { store } from "../redux/store";
import { logoutUser } from "../redux/features/user/userSlice";
import { navigate } from "../utils/navigation"; // Central nav
import { router } from "expo-router";

const api = axios.create();

api.interceptors.request.use(
  async (request) => {
    const cfg = await config();
    request.headers = { ...request.headers, ...cfg.headers };
    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
      router.push("/auth/sign-in");
    }
    return Promise.reject(error);
  }
);

export default api;
