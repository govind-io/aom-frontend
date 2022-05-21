import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../../Utils/Configs/Socket";

export default function ParticipantList(props) {
  const [participants, setParticipants] = useState(props.participants);

  useEffect(() => {
    if (!socket) return;

    socket.on("user-joined", async (user) => {
      setParticipants((prev) => {
        if (prev.find((elem) => elem.id === user.id)) return prev;
        return [...prev, user];
      });
    });

    socket.on("user-left", async (user) => {
      setParticipants((prev) => prev.filter((elem) => elem.id !== user.id));
    });
  }, [socket]);

  return (
    <Grid container padding={"20px"} marginTop={"30px"}>
      <Grid item xs={12} marginBottom={"10px"}>
        <Typography
          textAlign="center"
          style={{
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Participants
        </Typography>
      </Grid>
      <Grid item xs={12} marginBottom={"10px"}>
        <Typography
          textAlign="center"
          style={{
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Moderator
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {participants
          .filter((elem) => elem.type === "moderator")
          .map((elem) => {
            return (
              <Grid container marginBottom={"5px"} key={elem.name}>
                <Typography
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {elem.name}
                </Typography>
              </Grid>
            );
          })}
      </Grid>
      <Grid item xs={12} marginBottom={"10px"}>
        <Typography
          textAlign="center"
          style={{
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Audience
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {participants
          .filter((elem) => elem.type === "audience")
          .map((elem) => {
            return (
              <Grid container marginBottom={"5px"} key={elem.name}>
                <Typography
                  style={{
                    fontSize: "14px",
                  }}
                >
                  {elem.name}
                </Typography>
              </Grid>
            );
          })}
      </Grid>
    </Grid>
  );
}
