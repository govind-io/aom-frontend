import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { SaveUserData } from "../Redux/Actions/User/DataAction";
import { wrapper } from "../Redux/Store";

export default function Welcome() {
  const userData = useSelector((state) => state.user.data);
  return (
    <>
      <h1>Welcome page</h1>
      <Button>Logout </Button>
      <Button>Clear all sessions</Button>
      title {userData.title}
      id {userData.id}
    </>
  );
}

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
