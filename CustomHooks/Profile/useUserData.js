import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useUserData = (intialValue) => {
  //selectors here
  const userDataStore = useSelector((state) => state.user.data?.user);

  //useStates here
  const [userData, setUserData] = useState(intialValue);

  //useEffects defined here
  useEffect(() => {
    setUserData(userDataStore);
  }, [userDataStore]);

  return [userData, setUserData];
};
