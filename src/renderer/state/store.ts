import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import oledReducer from '../features/oled/oledReducer';

const store = configureStore({
  reducer: {
    oled: oledReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  Action<string>
>;
