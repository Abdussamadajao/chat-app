import { AxiosInstance } from "axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../hooks";
import ApiInstance from "../../utils/api";
import { FormValues } from "../../utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AuthError {
  message: string;
}
interface User {
  message: string;
  data: {};
}

interface AuthState {
  user?: null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    AuthStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    AuthSuccess(state, action: PayloadAction<User | any>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isLoading = false;
      state.error = null;
    },
    AuthFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { AuthSuccess, AuthFailure, AuthStart, logout } =
  authSlice.actions;
export default authSlice.reducer;

export const registerUser =
  (credentials: any): any =>
  async (dispatch: any) => {
    dispatch(AuthStart());

    try {
      const res = await ApiInstance.post("/register", {
        name: credentials.name,
        email: credentials.email,
        image: credentials.image,
        password: credentials.password,
      });
      const user = res.config.data;
      dispatch(AuthSuccess(user));
    } catch (err: any) {
      console.log(err.message);
      //   message.error(err?.message);
      dispatch(AuthFailure(err.message));
      console.log(err);
    }
  };

export const loginUser =
  (credentials: any): any =>
  async (dispatch: any) => {
    dispatch(AuthStart());

    try {
      const res = await ApiInstance.post("/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const token = res.data.token;
      AsyncStorage.setItem("authToken", token);
      const user = res.config.data;
      dispatch(AuthSuccess(user));
    } catch (err: any) {
      console.log(err.message);
      //   message.error(err?.message);
      dispatch(AuthFailure(err.response.data.error));
    }
  };

export const logOutProvider = (): AppThunk | any => async (dispatch: any) => {
  try {
    dispatch(logout());
    AsyncStorage.removeItem("authToken");
    return initialState;
  } catch (err) {
    console.log(err);
  }
};