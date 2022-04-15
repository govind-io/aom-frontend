import {
  DELETE_USER_DATA,
  GET_USER_DATA,
  SAVE_USER_DATA,
} from "../../Types/Users/DataTypes";

export const SaveUserData = (data) => ({
  data,
  type: SAVE_USER_DATA,
});

export const DeleteUserData = () => ({
  type: DELETE_USER_DATA,
});

export const GetUserData = (data) => ({
  type: GET_USER_DATA,
  data,
});
