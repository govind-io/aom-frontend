import {
  CREATE_ROUNDTABLE,
  GET_ROUNDTABLES_ALL,
} from "../../Types/Users/RoundtableTypes";

export const GetAllRoundtables = (data) => ({
  type: GET_ROUNDTABLES_ALL,
  data,
});

export const CreateRoundtables = (data) => ({
  type: CREATE_ROUNDTABLE,
  data,
});
