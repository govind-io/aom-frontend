import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../../../Utils/Configs/Socket";
import VideoItem from "./videoItem";

export default function VideoGrid() {
  //states here
  const [localTracks, setLocalTracks] = useState({ video: "", audio: "" });

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const StreamToServer = async () => {
    const peerConnection = new RTCPeerConnection(configuration);

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    setLocalTracks({
      audio: localStream.getAudioTracks()[0],
      video: localStream.getVideoTracks()[0],
    });

    socket.on("answer", async ({ answer }) => {
      const remoteDesc = new RTCSessionDescription(answer);

      await peerConnection.setRemoteDescription(remoteDesc);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("addIceCandidate", {
          newIceCandidate: e.candidate,
        });
      }
    };

    peerConnection.onconnectionstatechange = (e) => {
      if (peerConnection.connectionState === "connected") {
        console.log("connected to rtc server for sending ");
      }
    };

    socket.emit("offer", { offer });

    socket.on("addIceCandidateAnswer", async ({ newIceCandidate }) => {
      await peerConnection.addIceCandidate(newIceCandidate);
    });
  };

  const ViewStreamFromServer = async () => {
    const peerConnection = new RTCPeerConnection(configuration);
  };

  console.log("tracks", { localTracks });

  useEffect(() => {
    socket.on("connected", StreamToServer);

    return () => {
      socket.off("connected", StreamToServer);
    };
  }, []);

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={6}
          style={{
            borderRadius: "1px solid red",
            height: "100px",
          }}
        >
          {localTracks.video && <VideoItem videoTrack={localTracks.video} />}
        </Grid>
      </Grid>
    </>
  );
}
