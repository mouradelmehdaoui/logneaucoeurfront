import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  sector: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.sector = action.payload.sector;
    },
    logout: (state) => {
      state.token = null;
      state.sector = null;
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
