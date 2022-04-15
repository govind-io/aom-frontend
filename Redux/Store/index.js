import { createWrapper } from "next-redux-wrapper";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "../Reducers";
import rootSaga from "../Saga";

function saveToLocalStorage(state) {
  try {
    const serialState = JSON.stringify(state);
    localStorage.setItem("persistState", serialState);
  } catch (e) {
    console.warn(e);
  }
}

function loadFromLocalStorage() {
  try {
    console.log("tried local state");
    const serialState = localStorage.getItem("persistState");
    console.log("got local state");
    if (serialState === null) return undefined;
    console.log("got local storage state as", serialState);
    return JSON.parse(serialState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [logger, sagaMiddleware];

  const store = createStore(
    rootReducer,
    loadFromLocalStorage(),
    applyMiddleware(...middlewares)
  );

  store.sagaTask = sagaMiddleware.run(rootSaga);

  try {
    store.subscribe(() => saveToLocalStorage(store.getState()));
    console.log("subscribed to store");
  } catch (e) {
    console.log("can not sync to localstorage on server");
  }

  return store;
};

export const wrapper = createWrapper(makeStore);
