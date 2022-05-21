import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function Message(props) {
  const { content, date, by, user_id } = props;

  const selfId = useSelector((state) => state.user.data.user);

  const formatDateString = (d) => {
    const dat = new Date(d);
    return `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;
  };

  return (
    <Paper
      elevation={5}
      style={{
        backgroundColor: "grey",
        width: "fit-content",
        maxWidth: "90%",
        padding: "10px",
        marginTop: "30px",
        borderRadius: "5px",
        marginLeft: selfId._id === user_id && "auto",
      }}
    >
      <Grid
        container
        style={{
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        {selfId._id !== user_id && (
          <Grid item xs={12}>
            <Typography
              style={{
                fontSize: "18px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Sender :{" "}
              </span>
              {by}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography
            style={{
              fontSize: "22px",
            }}
          >
            {content}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign={"right"}>{formatDateString(date)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
