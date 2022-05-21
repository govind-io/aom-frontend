import { DELETE_ALL } from "../../Actions/DeleteAll";

import { SAVE_PARTICIPANTS } from "../../Types/Users/RoundtableTypes";

const intialState = {};

export const roundTableReducer = (state = intialState, action) => {
  const data = action.data;

  switch (action.type) {
    case SAVE_PARTICIPANTS: {
      return { ...state, participants: data };
    }

    case DELETE_ALL: {
      return intialState;
    }

    default: {
      return state;
    }
  }
};
