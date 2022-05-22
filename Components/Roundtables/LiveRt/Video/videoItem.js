import { Grid, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

export default function VideoItem({ peer }) {
  //refs
  const videoRef = useRef();

  //states
  const [remoteStream, setRemoteStream] = useState();

  //selectors
  const participants = useSelector((state) => state.roundtable.participants);

  useEffect(() => {
    if (peer.stream) {
      return setRemoteStream(peer.stream);
    }
    peer.peer.on("stream", (stream) => {
      console.log("stream");
      setRemoteStream(stream);
    });
  }, []);

  useEffect(() => {
    if (!remoteStream) return;

    videoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  return (
    <Grid
      item
      style={{
        height: "300px",
        display: "flex",
        justifyContent: "center",
        width: participants?.length > 1 ? "50%" : "100%",
        backgroundColor: "rgb(175 88 88)",
        padding: "0px 20px",
      }}
    >
      {remoteStream ? (
        <div
          style={{
            position: "relative",
            maxWidth: "100%",
            height: "295px",
          }}
        >
          <video
            style={{
              width: "100%",
              objectFit: "contain",
              height: "100%",
            }}
            controls={false}
            ref={videoRef}
            autoPlay={true}
          ></video>
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              position: "absolute",
              bottom: "18px",
            }}
          >
            <Typography
              style={{
                backgroundColor: "grey",
                borderRadius: "5px",
                padding: "5px",
                fontSize: "12px",
                fontWeight: "bold",
                margin: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {participants.find((elem) => elem.socketId === peer.peerId).name
                .length > 12
                ? participants
                    .find((elem) => elem.socketId === peer.peerId)
                    .name.substring(0, 9) + "..."
                : participants.find((elem) => elem.socketId === peer.peerId)
                    .name}{" "}
            </Typography>
          </Box>
        </div>
      ) : (
        <Skeleton width="100%" height="300px" animation="wave" />
      )}
    </Grid>
  );
}
