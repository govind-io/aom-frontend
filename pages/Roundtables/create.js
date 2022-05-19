import { DateTimePicker, LoadingButton, LocalizationProvider } from "@mui/lab";
import { Button, Input, Paper, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { WithAuth } from "../../Utils/ComponentUtilities/WithAuth";
import DateFnsUtils from "@date-io/date-fns";
import ToastHandler from "../../Utils/Toast/ToastHandler";
import { useDispatch, useSelector } from "react-redux";
import { CreateRoundtables } from "../../Redux/Actions/Roundtable";
import Router from "next/router";
function CreateRoundTable() {
  //local states here
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    startTime: new Date().getTime() + 30 * 60 * 1000,
    endTime: new Date().getTime() + 60 * 60 * 1000,
  });

  //selectors here
  const moderator = useSelector((state) => state.user.data);

  //constants here
  const dispatch = useDispatch();

  //function here
  const createRt = () => {
    if (!data.name) {
      return ToastHandler(
        "warn",
        "Roundtable name is required to be atleast 6 characters long"
      );
    }

    if (
      new Date(data.endTime).getTime() - new Date(data.startTime).getTime() <
      30 * 60 * 1000
    ) {
      return ToastHandler(
        "warn",
        "Atleast 30 mins difference should be there in end time and start time"
      );
    }

    const apiData = {
      data: {
        ...data,
        endTime: new Date(data.endTime).getTime(),
        startTime: new Date(data.startTime).getTime(),
        moderator: moderator.user._id,
      },
      onSuccess: () => {
        setLoading(false);
        Router.push("/Roundtables/list");
      },
      onFailed: () => {
        setLoading(false);
      },
    };

    setLoading(true);

    dispatch(CreateRoundtables(apiData));
  };

  return (
    <Box
      style={{
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Paper
        elevation={5}
        style={{
          backgroundColor: "rgb(255 255 255)",
          borderRadius: "20px",
          padding: "10px 20px",
          textAlign: "center",
        }}
      >
        <Input
          placeholder="Roundtable name"
          fullWidth
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <DateTimePicker
            renderInput={(props) => (
              <TextField
                style={{
                  width: "100%",
                  marginTop: "20px",
                }}
                {...props}
              />
            )}
            value={data.startTime}
            onChange={(value) => {
              setData({ ...data, startTime: value });
            }}
            minDateTime={new Date()}
            label="Start Time"
          />
          <DateTimePicker
            renderInput={(props) => (
              <TextField
                style={{
                  width: "100%",
                  marginTop: "20px",
                }}
                {...props}
              />
            )}
            value={data.endTime}
            onChange={(value) => {
              setData({ ...data, endTime: value });
            }}
            minDateTime={
              new Date(new Date(data.startTime).getTime() + 30 * 60 * 1000)
            }
            label="End Time"
          />
        </LocalizationProvider>

        <LoadingButton
          variant="contained"
          style={{
            margin: "20px auto",
          }}
          onClick={createRt}
          loading={loading}
        >
          Create now
        </LoadingButton>
      </Paper>
    </Box>
  );
}

export default WithAuth(CreateRoundTable);
