import { DELETE_USER_DATA, SAVE_USER_DATA } from "../../Types/Users/DataTypes";

const intialState = {
  data: {},
};

export const DataReducer = (state = intialState, action) => {
  const data = action.data;

  switch (action.type) {
    case SAVE_USER_DATA: {
      return { ...state, data };
    }

    case DELETE_USER_DATA: {
      return intialState;
    }

    default: {
      return state;
    }
  }
};
