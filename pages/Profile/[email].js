import { Grid, Input, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useUserProfile } from "../../CustomHooks/Profile/useUserProfile";
import { WithAuth } from "../../Utils/ComponentUtilities/WithAuth";
import { ProfileForm } from "../../Utils/DesignUtilities/Form";

function User() {
  //extracting query params here
  const router = useRouter();
  const { email } = router.query;

  //custom hook calls here
  const [userData, setUserData, loading, error] = useUserProfile(
    {},
    { val: false },
    false,
    email
  );

  //conditional Uis
  const loadingUi = () => {
    return ProfileForm.map((elem) => {
      if (elem.name.includes("password")) return;
      return (
        <Grid container justifyContent="center">
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Skeleton
              key={elem.name}
              variant="rectangular"
              width={"100%"}
              height={"30px"}
            />
          </Grid>
        </Grid>
      );
    });
  };

  const errorUi = () => {
    return (
      <Grid container justifyContent="center">
        <Typography textAlign={"center"} variant="h3">
          {error.message}
        </Typography>
      </Grid>
    );
  };

  return (
    <>
      {loading ? (
        loadingUi()
      ) : error.val ? (
        errorUi()
      ) : (
        <Grid container justifyContent="center">
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <form
              style={{
                width: "100%",
              }}
            >
              {ProfileForm.map((elem) => {
                if (elem.name.includes("password")) return;
                return (
                  <Input
                    key={elem.name}
                    disabled
                    {...elem}
                    fullWidth
                    style={{ marginTop: "20px", ...elem.style }}
                    value={userData[elem.name] || ""}
                  />
                );
              })}
            </form>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default WithAuth(User);
