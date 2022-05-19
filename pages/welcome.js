// import { END } from "redux-saga";
// import { SaveUserData } from "../Redux/Actions/User/DataAction";
// import { wrapper } from "../Redux/Store";
import { Grid, Input } from "@mui/material";
import { useRouter } from "next/router";
import { WithAuth } from "../Utils/ComponentUtilities/WithAuth";
import Link from "next/link";
import { Button } from "@mui/material";

function Welcome() {
  //constants here
  const router = useRouter();

  return (
    <Grid container justifyContent={"center"} spacing={5}>
      <Grid
        item
        xs={12}
        sx={{
          textAlign: "center",
        }}
      >
        <Link href="/Roundtables/list">
          <Button>Roundtables</Button>
        </Link>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          textAlign: "center",
        }}
      >
        <Link href="/Roundtables/create">
          <Button>Create RT</Button>
        </Link>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          textAlign: "center",
        }}
      >
        <Link href="/Profile/me">
          <Button>View Profile</Button>
        </Link>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          textAlign: "center",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/Profile/${e.target.email.value}`);
          }}
        >
          <Input type="email" placeholder="email" name="email" />
          <Button type="submit">View Other users</Button>
        </form>
      </Grid>
    </Grid>
  );
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
