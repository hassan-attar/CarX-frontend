import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import User from "../types/user";

const initialState: User = {
  isLoggedIn: false,
  firstName: "",
  lastName: "",
  email: "",
  location: {
    latitude: undefined,
    longitude: undefined,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload, isLoggedIn: true };
    },
    setUserInfo(state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
    logoutUser() {
      return initialState;
    },
    setUserLocation(
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) {
      return { ...state, location: action.payload };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
