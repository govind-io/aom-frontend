import {
  LOG_IN_REQ,
  LOG_OUT_REQ,
  LOG_OUT_SESSION,
  SIGN_UP_USER,
} from "../../Types/Users/AuthType";

export const LogInUser = (data) => ({
  data,
  type: LOG_IN_REQ,
});

export const LogOutUser = (data) => ({
  data,
  type: LOG_OUT_REQ,
});

export const SignUpUser = (data) => ({
  data,
  type: SIGN_UP_USER,
});

export const LogOutSession = (data) => ({
  data,
  type: LOG_OUT_SESSION,
});
