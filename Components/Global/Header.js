import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserData } from "../../CustomHooks/Profile/useUserData";
import { LogOutSession, LogOutUser } from "../../Redux/Actions/User/AuthAction";

export default function Header() {
  //constants here
  const dispatch = useDispatch();
  const router = useRouter();

  //all Local state here
  const [userData, setUserData] = useUserData({});
  const [loading, setLoading] = useState({ session: false, self: false });

  //Functions here
  const LogoutSession = () => {
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
  };

  const LogOutSelf = () => {
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
  };

  return (
    <Grid
      container
      style={{
        padding: "16px 0px",
      }}
    >
      <Grid
        item
        xs={10}
        style={{
          textAlign: "center",
        }}
      >
        <Typography
          textAlign="center"
          style={{
            marginLeft: "16.66%",
            fontSize: "21px",
          }}
          variant="h1"
        >
          Welcome {userData.user?.name}
        </Typography>
      </Grid>
      <Grid
        item
        style={{
          display: "flex",
          alignItems: "center",
        }}
        xs={2}
      >
        <LoadingButton loading={loading.self} onClick={LogOutSelf}>
          Logout
        </LoadingButton>
        <LoadingButton loading={loading.session} onClick={LogoutSession}>
          Clear all sessions
        </LoadingButton>
      </Grid>
    </Grid>
  );
}
