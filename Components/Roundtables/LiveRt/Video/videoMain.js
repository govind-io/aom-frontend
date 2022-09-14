import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../../../Utils/Configs/Socket";
import VideoItem from "./videoItem";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";

export default function VideoGrid() {
  //states here
  const [localTracks, setLocalTracks] = useState();
  const [videoStatus, setVideoStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);
  const [localSenderPeer, setLocalSenderPeer] = useState();

  //sender configs
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const StreamToServer = async () => {
    //initiating peer
    const peerConnection = new RTCPeerConnection(configuration);

    setLocalSenderPeer(peerConnection);

    //initialising tracks
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    //adding tracks
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    setLocalTracks(localStream);

    //socket event functions
    const onAnswer = async ({ answer }) => {
      const remoteDesc = new RTCSessionDescription(answer);

      await peerConnection.setRemoteDescription(remoteDesc);
    };

    const onIceCandidateAnswer = async ({ newIceCandidate }) => {
      await peerConnection.addIceCandidate(newIceCandidate);
    };

    //listening for answer by server
    socket.on("answer", onAnswer);

    //creating an offer for server
    const offer = await peerConnection.createOffer();

    //Setting local peer sdp
    await peerConnection.setLocalDescription(offer);

    //listening for ice candidate updation and sending that ice candidate to server
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("addIceCandidate", {
          newIceCandidate: e.candidate,
        });
      }
    };

    //listening and checking if peer connected suvv
    peerConnection.onconnectionstatechange = (e) => {
      if (peerConnection.connectionState === "connected") {
        console.log("connected to rtc server for sending ");
      }
    };

    //sending created offer to server
    socket.emit("offer", { offer });

    //listening for ice candidate updates for remote peer i.e server
    socket.on("addIceCandidateAnswer", onIceCandidateAnswer);
  };

  const ViewStreamFromServer = async () => {
    const peerConnection = new RTCPeerConnection(configuration);
  };

  useEffect(() => {
    socket.on("connected", StreamToServer);

    //turning off all listeners
    return () => {
      socket.off("connected", StreamToServer);
      socket.removeAllListeners(["addIceCandidateAnswer", "answer"]);
    };
  }, []);

  useEffect(() => {
    if (!localTracks) return;

    return () => {
      localTracks?.getAudioTracks()[0].stop();
      localTracks?.getVideoTracks()[0].stop();
    };
  }, [localTracks]);

  useEffect(() => {
    if (!localSenderPeer) return;

    return () => {
      localSenderPeer.close();
    };
  }, [localSenderPeer]);

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={6}
          sx={{
            border: "2px solid red",
            height: "400px",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {localTracks && videoStatus ? (
            <VideoItem videoTrack={localTracks} />
          ) : (
            <div
              style={{
                height: "fit-content",
                display: "flex",
                alignItems: "center",
              }}
            >
              <VideocamOffIcon style={{ marginRight: "10px" }} /> VideoCam Off
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              right: "0px",
            }}
          >
            {audioStatus ? <MicIcon /> : <MicOffIcon />}
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Button
            onClick={() => {
              const videoTrack = localTracks.getVideoTracks()[0];
              videoTrack.enabled = !videoTrack.enabled;
              setVideoStatus(videoTrack.enabled);
            }}
          >
            {videoStatus ? <VideocamIcon /> : <VideocamOffIcon />}
          </Button>
          <Button
            onClick={() => {
              const audioTrack = localTracks.getAudioTracks()[0];
              audioTrack.enabled = !audioTrack.enabled;
              setAudioStatus(audioTrack.enabled);
            }}
          >
            {audioStatus ? <MicIcon /> : <MicOffIcon />}
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
