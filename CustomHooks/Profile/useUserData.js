import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetOtherUser } from "../../Redux/Actions/User/DataAction";

export const useUserData = (intialValue, email, loadingData, errorData) => {
  //selectors here
  const userDataStore = useSelector((state) => state.user.data);

  //useStates here
  const [userData, setUserData] = useState(intialValue);
  const [loading, setLoading] = useState(loadingData);
  const [error, setError] = useState(errorData);

  //Dispatch defined here
  const dispatch = useDispatch();

  //useEffects defined here
  useEffect(() => {
    if (email) return;
    setUserData(userDataStore);
    setError(false);
    setLoading(false);
  }, [userDataStore]);

  useEffect(() => {
    if (!email) return;

    const ApiData = {
      data: {
        email,
      },
      onSuccess: (data) => {
        setLoading(false);
        console.log(data);
        setUserData(data.user);
        setError(false);
      },
      onFailed: (data) => {
        setLoading(false);
        setError(true);
      },
    };

    dispatch(GetOtherUser(ApiData));
  }, []);

  return [userData, setUserData, loading, error];
};
