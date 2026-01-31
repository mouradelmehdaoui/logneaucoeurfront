// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import distributionReducer from "../features/distributionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    distribution: distributionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; // ✅ export par défaut
