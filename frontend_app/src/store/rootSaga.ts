import { all } from "redux-saga/effects";
import { authSaga } from "../features/auth/authSaga";

/**
 * Root saga for the application.
 *
 * Add feature sagas here as the app grows.
 */
export function* rootSaga(): Generator {
  yield all([authSaga()]);
}
