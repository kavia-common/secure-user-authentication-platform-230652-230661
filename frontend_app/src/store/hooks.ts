import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// PUBLIC_INTERFACE
export function useAppDispatch(): AppDispatch {
  /** Typed version of useDispatch for the app store. */
  return useDispatch<AppDispatch>();
}

// PUBLIC_INTERFACE
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
