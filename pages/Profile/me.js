import { LoadingButton } from "@mui/lab";
import { Button, Grid, Input } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useUserData } from "../../CustomHooks/Profile/useUserData";
import { EditUserData } from "../../Redux/Actions/User/DataAction";
import { WithAuth } from "../../Utils/ComponentUtilities/WithAuth";
import { ProfileForm } from "../../Utils/DesignUtilities/Form";
import ToastHandler from "../../Utils/Toast/ToastHandler";

function Profile() {
  //custom hook calls here
  const [userData, setUserData] = useUserData({});
  const [formData, setFormData] = useState(userData);

  //useStates here
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //refs here
  const formref = useRef();

  //dispatch and other util const here
  const dispatch = useDispatch();

  //useEffects here
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  //event listeners here
  const editUser = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const password = e.target.password.value;
    const cnfpassword = e.target.cnfpassword.value;
    if (password !== cnfpassword) {
      return ToastHandler("warn", "Password and confirm password should match");
    }

    var data;

    if (!password) {
      data = {
        name,
      };
    } else {
      data = {
        name,
        password,
      };
    }

    const apiData = {
      data,
      onSuccess: () => {
        setError(false);
        setLoading(false);
        setEdit(false);
        e.target.password.value = "";
        e.target.cnfpassword.value = "";
      },
      onFailed: () => {
        setError(true);
        setLoading(false);
      },
    };

    setLoading(true);
    dispatch(EditUserData(apiData));
  };

  return (
    <>
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
            onSubmit={editUser}
            style={{
              width: "100%",
            }}
          >
            {ProfileForm.map((elem) => {
              if (!edit && elem.name.includes("password")) return;
              return (
                <Input
                  key={elem.name}
                  disabled={!edit}
                  {...elem}
                  fullWidth
                  style={{ marginTop: "20px", ...elem.style }}
                  error={error}
                  value={formData[elem.name] || ""}
                  onChange={(e) => {
                    let data = { ...formData, [e.target.name]: e.target.value };
                    setFormData(data);
                  }}
                />
              );
            })}
            <button
              style={{ display: "none" }}
              ref={formref}
              type="submit"
            ></button>
          </form>
          <Grid
            style={{
              width: "45%",
              marginTop: "30px",
            }}
          >
            <Button
              variant={"contained"}
              fullWidth
              onClick={() => {
                setEdit(!edit);
                if (edit) {
                  setFormData(userData);
                }
              }}
            >
              {edit ? "Discard" : "Edit"}
            </Button>
          </Grid>
          <Grid
            style={{
              width: "45%",
              marginTop: "30px",
            }}
          >
            {edit && (
              <LoadingButton
                variant={"contained"}
                fullWidth
                onClick={() => {
                  formref.current.click();
                }}
                loading={loading}
              >
                Save
              </LoadingButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default WithAuth(Profile);
