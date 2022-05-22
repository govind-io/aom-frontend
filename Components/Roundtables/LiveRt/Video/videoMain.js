import { Button, Grid, Skeleton, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../../Utils/Configs/Socket";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";
import { useRouter } from "next/router";
import Peer from "simple-peer";
import VideoItem from "./videoItem";
import VideocamIcon from "@mui/icons-material/Videocam";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import MicOffIcon from "@mui/icons-material/MicOff";
import { Box } from "@mui/system";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
export default function VideoGrid() {
  //selectors here
  const participants = useSelector((state) => state.roundtable.participants);
  const me = useSelector((state) => state.user.data.user);

  //constants here
  const router = useRouter();

  //states here
  const [peers, setpeers] = useState([]);
  const [selfStream, setSelfStream] = useState();

  //tracks here
  const [audioTrack, setAudioTrack] = useState();
  const [videoTrack, setVideoTrack] = useState();
  const [trackState, setTrackState] = useState({ audio: false, video: false });

  //refs here
  const initiatedRef = useRef();
  const participantsRef = useRef();
  const peersRef = useRef();
  const selfVideo = useRef();
  const streamRef = useRef();
  participantsRef.current = participants;
  peersRef.current = peers;
  streamRef.current = selfStream;

  //checker refs
  const executionCheckRef = useRef();
  const executionRef = useRef();

  //handler functions here
  const func = async () => {
    try {
      const selfVideoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setSelfStream(selfVideoStream);

      setAudioTrack(selfVideoStream.getAudioTracks()[0]);
      setVideoTrack(selfVideoStream.getVideoTracks()[0]);

      setTrackState({ audio: true, video: true });
    } catch (e) {
      ToastHandler("err", `Error Loading audio and video ${e.message}`);
      router.push("/Roundtables/list");
    }
  };

  const createPeer = (idToCall, callerId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { callerId, idToCall, signal });
    });

    peer.on("close", () => {
      const temp = peersRef.current.filter((elem) => {
        return elem.peerId !== callerId;
      });

      setpeers([...temp]);
    });

    peer.on("error", (err) => {
      console.log("errors is", err, err.message);
    });
    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("responding-signal", { idToCall: callerId, signal });
    });

    peer.signal(incomingSignal);

    peer.on("stream", (stream) => {
      setpeers((prev) => {
        return prev.map((elem) => {
          if (elem.peerId === callerId) {
            elem.stream = stream;
          }

          return elem;
        });
      });
    });

    peer.on("close", () => {
      const temp = peersRef.current.filter((elem) => {
        return elem.peerId !== callerId;
      });
      setpeers([...temp]);
    });

    peer.on("error", (err) => {
      console.log("errors is", err, err.message);
    });

    return peer;
  };

  //effects here
  useEffect(() => {
    if (!socket || !participants || !selfStream) return;

    if (executionRef.current) return;

    executionRef.current = true;

    const allPeers = participants
      .filter((elem) => elem.id !== me._id)
      .map((elem) => {
        const peer = createPeer(elem.socketId, socket.id, streamRef.current);

        return { peerId: elem.socketId, peer: peer };
      });

    setpeers(allPeers);
  }, [socket, selfStream, participants]);

  useEffect(() => {
    if (executionCheckRef.current) return;

    executionCheckRef.current = true;
    socket.on("user-sent-signal", (data) => {
      const peer = {
        peerId: data.callerId,
        peer: addPeer(data.signal, data.callerId, streamRef.current),
      };

      setpeers((prev) => {
        return [...prev, peer];
      });
    });

    socket.on("user-responded-to-signal", (data) => {
      const item = peersRef.current.find((p) => p.peerId == data.id);
      item.peer.signal(data.signal);
    });
  }, []);

  useEffect(() => {
    if (initiatedRef.current) return;

    initiatedRef.current = true;
    func();
  }, [selfVideo.current]);

  useEffect(() => {
    if (!selfStream) return;
    return () => {
      selfStream.getTracks().forEach((track) => track.stop());
    };
  }, [selfStream]);

  useEffect(() => {
    if (!selfVideo.current || !selfStream) return;

    selfVideo.current.srcObject = selfStream;
  }, [selfStream, selfVideo]);

  return (
    <Grid
      container
      style={{
        overflowY: "auto",
        maxWidth: "80%",
        maxHeight: "100%",
        margin: "auto",
      }}
    >
      <Grid
        item
        style={{
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: participants?.length > 1 ? "50%" : "100%",
          backgroundColor: "rgb(175 88 88)",
          padding: "0px 20px",
        }}
      >
        {selfStream ? (
          <div
            style={{
              position: "relative",
              maxWidth: "100%",
              height: "290px",
            }}
          >
            <video
              style={{
                width: "100%",
                objectFit: "contain",
                height: "100%",
              }}
              controls={false}
              ref={selfVideo}
              autoPlay={true}
              muted={true}
            ></video>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                position: "absolute",
                alignItems: "center",
                bottom: "18px",
              }}
            >
              <span
                style={{
                  padding: "5px",
                  backgroundColor: "grey",
                  marginLeft: "10px",
                  borderRadius: "5px",
                }}
              >
                <Button
                  onClick={() => {
                    const track = selfStream.getVideoTracks()[0];
                    track.enabled = !track.enabled;
                    setTrackState({ ...trackState, video: track.enabled });
                  }}
                  variant="contained"
                >
                  {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
                </Button>
                <Button
                  onClick={() => {
                    const track = selfStream.getAudioTracks()[0];
                    track.enabled = !track.enabled;
                    setTrackState({ ...trackState, audio: track.enabled });
                  }}
                  style={{
                    marginLeft: "10px",
                  }}
                  variant="contained"
                >
                  {trackState.audio ? <KeyboardVoiceIcon /> : <MicOffIcon />}
                </Button>
              </span>
              <Typography
                style={{
                  backgroundColor: "grey",
                  borderRadius: "5px",
                  padding: "5px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  marginRight: "10px",
                  display: "flex",
                  alignItems: "center",
                  height: "fit-content",
                }}
              >
                {me.name.length > 12
                  ? me.name.substring(0, 9) + "..."
                  : me.name}{" "}
              </Typography>
            </Box>
          </div>
        ) : (
          <Skeleton width="100%" height="300px" animation="wave" />
        )}
      </Grid>
      {peers.map((peer) => {
        return <VideoItem key={peer.peerId} peer={peer} />;
      })}
    </Grid>
  );
}
