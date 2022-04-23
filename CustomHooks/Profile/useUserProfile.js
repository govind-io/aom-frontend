import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetOtherUser } from "../../Redux/Actions/User/DataAction";

export const useUserProfile = (intialValue, loadingData, errorData, email) => {
  //useStates here
  const [userData, setUserData] = useState(intialValue);
  const [loading, setLoading] = useState(loadingData);
  const [error, setError] = useState(errorData);

  //Dispatch defined here
  const dispatch = useDispatch();

  //useEffects defined here
  useEffect(() => {
    if (!email) return;

    const ApiData = {
      data: {
        email,
      },
      onSuccess: (data) => {
        setLoading(false);
        setUserData(data.user);
        setError({ val: false });
      },
      onFailed: (message) => {
        setLoading(false);
        setError({ val: true, message });
      },
    };

    dispatch(GetOtherUser(ApiData));
  }, []);

  return [userData, setUserData, loading, error];
};
