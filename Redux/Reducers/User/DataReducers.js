import { HYDRATE } from "next-redux-wrapper";
import { DELETE_ALL } from "../../Actions/DeleteAll";
import { DELETE_USER_DATA, SAVE_USER_DATA } from "../../Types/Users/DataTypes";

const intialState = {
  loggedIn: false,
};

export const DataReducer = (state = intialState, action) => {
  const data = action.data || action.payload;

  switch (action.type) {
    case SAVE_USER_DATA: {
      return { ...state, ...data, loggedIn: true };
    }
    case HYDRATE: {
      return { ...state, ...data.user.data };
    }
    case DELETE_USER_DATA: {
      return intialState;
    }

    case DELETE_ALL: {
      return intialState;
    }

    default: {
      return state;
    }
  }
};
