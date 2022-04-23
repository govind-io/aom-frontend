import { CircularProgress, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Global/Header";
import { GetUserData } from "../../Redux/Actions/User/DataAction";
export const WithAuth = (Comp) => {
  return (props) => {
    if (typeof window === "undefined")
      return (
        <>
          <Header />
          <Comp {...props} />
        </>
      );

    const [loading, setLoading] = useState(false);
    const loggedIn = useSelector((state) => state.user.data.loggedIn);

    const router = useRouter();

    const dispatch = useDispatch();

    useEffect(() => {
      if (loggedIn) return;

      router.push("/Auth/Signin");
    }, [loggedIn]);

    useEffect(() => {
      setLoading(true);
      const data = {
        onSuccess: () => {
          setLoading(false);
        },
        onFailed: () => {
          router.push("/Auth/Signin");
        },
      };
      dispatch(GetUserData(data));
    }, []);

    if (loading) {
      return (
        <Grid
          container
          style={{
            width: "100%",
            height: "100%",
          }}
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      );
    } else {
      return (
        <>
          <Header />
          <Comp {...props} />
        </>
      );
    }
  };
};
