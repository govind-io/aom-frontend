import { Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../../Utils/Configs/Socket";
import ToastHandler from "../../../../Utils/Toast/ToastHandler";
import { useRouter } from "next/router";
import Peer from "simple-peer";
import VideoItem from "./videoItem";
export default function VideoGrid() {
  //selectors here
  const participants = useSelector((state) => state.roundtable.participants);
  const me = useSelector((state) => state.user.data.user);

  //constants here
  const router = useRouter();

  //states here
  const [peers, setpeers] = useState([]);
  const [selfStream, setSelfStream] = useState();

  //refs here
  const initiatedRef = useRef();
  const participantsRef = useRef();
  const peersRef = useRef();
  const selfVideo = useRef();
  participantsRef.current = [];
  peersRef.current = peers;

  //checker refs
  const executionCheckRef = useRef();
  const executionRef = useRef();

  //handler functions here
  const func = async () => {
    if (initiatedRef.current) return;

    initiatedRef.current = true;
    try {
      const selfVideoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("created stream");
      selfVideo.current.srcObject = selfVideoStream;
      setSelfStream(selfVideoStream);
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
        const peer = createPeer(elem.socketId, socket.id, selfStream);

        return { peerId: elem.socketId, peer: peer };
      });

    setpeers(allPeers);
  }, [socket, selfStream, participants]);

  useEffect(() => {
    if (executionCheckRef.current) return;

    executionCheckRef.current = true;
    socket.on("user-sent-signal", (data) => {
      let existing = peersRef.current.find((elem) => {
        console.log(elem.peerid, data.callerId);
        return elem.peerId === data.callerId;
      });

      if (existing) return;

      const peer = {
        peerId: data.callerId,
        peer: addPeer(data.signal, data.callerId, selfStream),
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
    if (!selfVideo.current || initiatedRef.current) return;

    func();
  }, [selfVideo.current]);

  useEffect(() => {
    if (!selfStream) return;
    return () => {
      selfStream.getTracks().forEach((track) => track.stop());
    };
  }, [selfStream]);

  console.log(peers);

  return (
    <Grid
      container
      style={{
        overflowY: "auto",
        maxWidth: "100%",
      }}
    >
      <video
        style={{
          width: "80%",
        }}
        controls={false}
        ref={selfVideo}
        autoPlay={true}
        muted={true}
      ></video>
      {peers.map((peer) => {
        return <VideoItem key={peer.peerId} peer={peer.peer} />;
      })}
      <Button
        onClick={() => {
          selfStream.getTracks().forEach((track) => track.stop());
        }}
      >
        turn off
      </Button>
    </Grid>
  );
}
