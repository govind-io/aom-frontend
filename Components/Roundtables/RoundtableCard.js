import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
export default function RoundtableCard({ item }) {
  const { name, moderator, _id, startTime, endTime } = item;

  return (
    <Box
      style={{
        margin: "20px auto",
        maxWidth: "500px",
        borderRadius: "20px",
      }}
    >
      <Paper
        style={{
          width: "100%",
          padding: "30px 15px",
          backgroundColor: "#cec9c9",
        }}
        elevation={5}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Roundtable:{" "}
              </span>
              {name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Moderator:{" "}
              </span>
              {moderator[0]?.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                Start Time:{" "}
              </span>
              {new Date(startTime).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              style={{
                color: "black",
                fontSize: "20px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                End Time:{" "}
              </span>
              {new Date(endTime).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "medium",
              })}
            </Typography>
          </Grid>
        </Grid>
        <Button
          style={{
            marginTop: "20px",
          }}
          variant="contained"
          fullWidth
        >
          Join RT
        </Button>
      </Paper>
    </Box>
  );
}
