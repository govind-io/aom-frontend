import {
  CREATE_ROUNDTABLE,
  GET_ROUNDTABLES_ALL,
  GET_ROUNDTABLE_DATA,
} from "../../Types/Users/RoundtableTypes";

export const GetAllRoundtables = (data) => ({
  type: GET_ROUNDTABLES_ALL,
  data,
});

export const CreateRoundtables = (data) => ({
  type: CREATE_ROUNDTABLE,
  data,
});

export const GetRoundtables = (data) => ({
  type: GET_ROUNDTABLE_DATA,
  data,
});
