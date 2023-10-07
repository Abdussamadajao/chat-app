import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../hooks";
import ApiInstance from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { RootState } from "../store";
import axios from "axios";

interface AuthState {
  users: object | any;
  loading: boolean;
  error: string | null;
  isRequestSent: boolean;
  requests: object | any;
  friends: any;
  userId: any;
  sentRequests: Array<any> | any;
  userFriends: Array<any> | any;
}

const initialState: AuthState = {
  users: null,
  loading: false,
  error: null,
  isRequestSent: false,
  requests: null,
  friends: null,
  userId: null,
  sentRequests: [],
  userFriends: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
      state.isRequestSent = false;
    },
    fetchUsersSuccess: (state, action: PayloadAction) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    sendRequest: (state) => {
      state.isRequestSent = true;
      // state.loading = false;
    },
    fetchFriendReqSuccess: (state, action: PayloadAction) => {
      state.loading = false;
      state.requests = action.payload;
    },
    setFriendRequest: (state, action: PayloadAction<any>) => {
      state.requests = action.payload;
      state.loading = false;
    },
    acceptedFriends: (state, action: PayloadAction<any>) => {
      state.friends = action.payload;
      state.loading = false;
    },
    setUserId: (state, action: PayloadAction<any>) => {
      state.userId = action.payload;
    },
    setSentReq: (state, action: PayloadAction<any>) => {
      state.sentRequests = action.payload;
      state.loading = false;
    },
    setUserFriends: (state, action: PayloadAction<any>) => {
      state.userFriends = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchUsersFailure,
  fetchUsersStart,
  fetchUsersSuccess,
  sendRequest,
  fetchFriendReqSuccess,
  setFriendRequest,
  acceptedFriends,
  setUserId,
  setSentReq,
  setUserFriends,
} = usersSlice.actions;
export default usersSlice.reducer;

export const fetchUsers =
  (userId: any): AppThunk | any =>
  async (dispatch: any) => {
    dispatch(fetchUsersStart());
    const token = (await AsyncStorage.getItem("authToken")) as any;
    const decodedToken: any = await jwt_decode(token);
    let userId = decodedToken.userId;

    try {
      const res = await ApiInstance.get(`/users/${userId}`);
      const users = res.data;
      dispatch(setUserId(userId));
      dispatch(fetchUsersSuccess(users));
    } catch (error: any) {
      console.log("something when wrong", error);
      dispatch(fetchUsersFailure(error));
    }
  };

export const sendFriendRequests =
  (currentUserId: string, selectedUserId: string): AppThunk | any =>
  async (dispatch: any) => {
    dispatch(fetchUsersStart());

    try {
      const res: any = await ApiInstance.post("/friend-request", {
        currentUserId,
        selectedUserId,
      });

      if (res.status === 200) {
        sendRequest();
        await AsyncStorage.setItem("reqSent", "true");
      }

      // console.log(res);
    } catch (err) {
      console.log("something went wrong", err);
    }
  };

export const fetchFriendReq = (): AppThunk | any => async (dispatch: any) => {
  const token = (await AsyncStorage.getItem("authToken")) as any;
  const decodedToken: any = jwt_decode(token);
  let userId = decodedToken.userId;
  try {
    const res = await ApiInstance.get(`/friend-request/${userId}`);

    if (res.status === 200) {
      const data = res.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        email: item.email,
        images: item.image,
      }));

      dispatch(fetchFriendReqSuccess(data));
      // console.log("req", data);
    }
  } catch (err: any) {
    console.log("something went wrong", err);
    dispatch(fetchUsersFailure(err));
  }
};

export const acceptFriends =
  (userId: string): AppThunk | any =>
  async (dispatch: any) => {
    dispatch(fetchUsersStart());

    try {
      const res = await ApiInstance.get(`/accepted-friends/${userId}`);
      console.log("slic3e", res.data);

      dispatch(acceptedFriends(res?.data));
    } catch (err: any) {
      console.log("something when wrong", err);
      dispatch(fetchUsersFailure(err));
    }
  };

export const getAllFriendRequests =
  (userId: string): AppThunk | any =>
  async (dispatch: any) => {
    dispatch(fetchUsersStart());
    try {
      const response = await ApiInstance.get(`friend-requests/sent/${userId}`);
      dispatch(setSentReq(response.data));
    } catch (error: any) {
      console.log("something when wrong", error);
      dispatch(fetchUsersFailure(error));
    }
  };

export const fetchUserFriends =
  (userId: string): AppThunk | any =>
  async (dispatch: any) => {
    dispatch(fetchUsersStart());
    try {
      const response = await ApiInstance.get(`/friends/${userId}`);
      dispatch(setUserFriends(response.data));
    } catch (error: any) {
      console.log("something when wrong", error);
      dispatch(fetchUsersFailure(error));
    }
  };
