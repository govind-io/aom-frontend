import { LOG_IN_REQ, LOG_OUT_REQ } from "../../Types/Users/AuthType";

export const LogInUser = (data) => ({
  data,
  type: LOG_IN_REQ,
});

export const LogOutUser = (data) => ({
  data,
  type: LOG_OUT_REQ,
});
