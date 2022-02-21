import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { chatReducers } from "../redux/chat-slice";
import { authReducers } from "../redux/auth-slice";

export const store = configureStore({
  reducer: { chatReducers, authReducers },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // allow Non-Serializable Data
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
