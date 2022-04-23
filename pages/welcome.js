// import { END } from "redux-saga";

// import { SaveUserData } from "../Redux/Actions/User/DataAction";
// import { wrapper } from "../Redux/Store";
import { WithAuth } from "../Utils/ComponentUtilities/WithAuth";
function Welcome() {
  return <>Hello Anisha</>;
}

export default WithAuth(Welcome);

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ req, res }) => {
//       let response = await fetch(
//         "https://jsonplaceholder.typicode.com/todos/1"
//       );
//       response = await response.json();
//       store.dispatch(SaveUserData(response));
//       // Stop the saga
//       store.dispatch(END);
//       await store.sagaTask.toPromise();
//     }
// );
