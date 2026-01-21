import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";

const sagaMiddleware = createSagaMiddleware();

// PUBLIC_INTERFACE
export const store = configureStore({
  /** Configure Redux store with Redux Toolkit and Redux-Saga middleware. */
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    // Saga uses generator functions and non-serializable values can appear in actions.
    // Redux Toolkit recommends disabling serializable checks for saga-based apps.
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
