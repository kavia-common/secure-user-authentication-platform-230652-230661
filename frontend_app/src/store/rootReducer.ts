import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth/authSlice";

/**
 * Root reducer for the application.
 *
 * Add feature slices here as the app grows.
 */
export const rootReducer = combineReducers({
  auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;
