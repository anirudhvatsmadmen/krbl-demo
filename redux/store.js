import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./features/event/eventSlice";
import userReducer from "./features/user/userSlice";
import mediaReducer from "./features/media/mediaSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    event: eventReducer,
    media: mediaReducer
  },
});

// export const RootState = store.getState;
// export const AppDispatch = store.dispatch;
export const RootState = () => store.getState();
export const AppDispatch = () => store.dispatch;
