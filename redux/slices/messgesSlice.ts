import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../hooks";
import ApiInstance from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  messages?: Array<any> | any;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  messages: [],
  isLoading: false,
  error: null,
};

export const messagesSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    fetchMsgStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setMessages: (state, action: PayloadAction<any>) => {
      state.messages = action.payload;
      state.isLoading = false;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const { fetchMsgStart, fetchUsersFailure, setMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;
