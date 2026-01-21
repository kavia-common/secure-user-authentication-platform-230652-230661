import { all } from "redux-saga/effects";

/**
 * Root saga for the application.
 *
 * Add feature sagas here as the app grows:
 *   import { authSaga } from "../features/auth/authSaga";
 *   yield all([authSaga()]);
 */
export function* rootSaga(): Generator {
  yield all([]);
}
