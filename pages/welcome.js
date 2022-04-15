import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import { LogOutSession, LogOutUser } from "../Redux/Actions/User/AuthAction";
import { SaveUserData } from "../Redux/Actions/User/DataAction";
import { wrapper } from "../Redux/Store";
import { WithAuth } from "../Utils/ComponentUtilities/WithAuth";
function Welcome() {
  //constants here
  const dispatch = useDispatch();
  const router = useRouter();

  //selectors here
  const userDataStore = useSelector((state) => state.user.data);

  //all Local state here
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState({ session: false, self: false });

  //useEffeects here
  useEffect(() => {
    setUserData(userDataStore);
  }, [userDataStore]);

  return (
    <>
      <h1>Welcome page</h1>
      <LoadingButton
        loading={loading.self}
        onClick={() => {
          setLoading({ ...loading, self: true });

          const data = {
            onSuccess: () => {
              setLoading({ ...loading, self: false });
              router.push("/Auth/Signin");
            },
            onFailed: () => {
              setLoading({ ...loading, self: false });
            },
          };

          dispatch(LogOutUser(data));
        }}
      >
        Logout
      </LoadingButton>
      <LoadingButton
        loading={loading.session}
        onClick={() => {
          setLoading({ ...loading, session: true });
          const data = {
            onSuccess: () => {
              setLoading({ ...loading, session: false });
            },
            onFailed: () => {
              setLoading({ ...loading, session: false });
            },
          };

          dispatch(LogOutSession(data));
        }}
      >
        Clear all sessions
      </LoadingButton>
      name {userData.user?.name}
      tokens = {userData.access} and {userData.refresh}
      title={userDataStore.title}
    </>
  );
}

export default WithAuth(Welcome);

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res }) => {
      let response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      response = await response.json();
      console.log("response is", response);
      store.dispatch(SaveUserData(response));
      // Stop the saga
      store.dispatch(END);
      await store.sagaTask.toPromise();
    }
);
