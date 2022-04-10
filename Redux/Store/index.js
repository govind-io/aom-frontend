import { createWrapper } from "next-redux-wrapper";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "../Reducers";
import rootSaga from "../Saga";

// function saveToLocalStorage(state) {
//   try {
//     const serialState = JSON.stringify(state);
//     localStorage.setItem("persistState", serialState);
//   } catch (e) {
//     console.warn(e);
//   }
// }

// function loadFromLocalStorage() {
//   if (!localStorage) return undefined;
//   try {
//     const serialState = localStorage.getItem("persistState");
//     if (serialState === null) return undefined;
//     return JSON.parse(serialState);
//   } catch (e) {
//     console.warn(e);
//     return undefined;
//   }
// }

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [logger, sagaMiddleware];

  const store = createStore(rootReducer, applyMiddleware(...middlewares));

  store.sagaTask = sagaMiddleware.run(rootSaga);

  // if (localStorage) {
  //   store.subscribe(() => saveToLocalStorage(store.getState()));
  //   console.log("subscribed to store");
  // }

  return store;
};

export const wrapper = createWrapper(makeStore);
