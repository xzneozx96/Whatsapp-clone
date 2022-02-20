import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { chatReducers } from "../redux/chat-slice";

export const store = configureStore({
  reducer: { chatReducers },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
