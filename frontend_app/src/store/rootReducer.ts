import { combineReducers } from "@reduxjs/toolkit";

/**
 * Root reducer for the application.
 *
 * Add feature slices here as the app grows:
 *   import authReducer from "../features/auth/authSlice";
 *   ...
 */
export const rootReducer = combineReducers({});

export type RootState = ReturnType<typeof rootReducer>;
