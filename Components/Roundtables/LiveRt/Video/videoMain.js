import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { socket } from "../../../../Utils/Configs/Socket";
import VideoItem from "./videoItem";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import { useSelector } from "react-redux";

export default function VideoGrid() {
  //states here
  const [localTracks, setLocalTracks] = useState();
  const [videoStatus, setVideoStatus] = useState(true);
  const [audioStatus, setAudioStatus] = useState(true);
  const [localSenderPeer, setLocalSenderPeer] = useState();
  const [remoteRecieverPeer, setRemoteRecievedPeer] = useState([]);
  const participants = useSelector((state) => {
    return state.roundtable.participants;
  });
  const userId = useSelector((state) => state.user.data.user);

  const [initiated, setInitiated] = useState(false);

  //to rerender once the receiving peer connection is established
  const [totalReceivingPeer, setTotalRecevingPeer] = useState(0);

  //sender configs
  const configuration = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun.2.google.com:19302",
          "stun:stun.3.google.com:19302",
          "stun:stun.4.google.com:19302",
        ],
      },
    ],
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
        socket.off("answer");
        socket.off("addIceCandidateAnswer");
      }
    };

    //sending created offer to server
    socket.emit("offer", { offer });

    //listening for ice candidate updates for remote peer i.e server
    socket.on("addIceCandidateAnswer", onIceCandidateAnswer);
  };

  const ViewStreamFromServer = async (uid) => {
    const remoteUsers = uid
      ? [{ id: uid }]
      : participants.filter((elem) => {
          return elem.id !== userId._id;
        });

    remoteUsers.forEach(async (elem) => {
      const peerConnection = new RTCPeerConnection(configuration);

      //socket event functions
      const onAnswer = async ({ answer, userId }) => {
        if (userId !== elem.id) return;
        const remoteDesc = new RTCSessionDescription(answer);
        await peerConnection.setRemoteDescription(remoteDesc);
      };

      const onIceCandidateAnswer = async ({ newIceCandidate, userId }) => {
        if (userId !== elem.id) return;

        await peerConnection.addIceCandidate(newIceCandidate);
      };

      //listening for answer by server
      socket.on("answerViewer", onAnswer);

      //creating an offer for server
      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      //Setting local peer sdp
      await peerConnection.setLocalDescription(offer);

      //listening for ice candidate updation and sending that ice candidate to server
      peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("addIceCandidateViewer", {
            newIceCandidate: e.candidate,
            userId: elem.id,
          });
        }
      };

      //listening and checking if peer connected server

      peerConnection.onconnectionstatechange = (e) => {
        console.log(
          "rtc peer connection state changed ",
          peerConnection.connectionState
        );
        if (peerConnection.connectionState === "connected") {
          setTotalRecevingPeer((prev) => prev + 1);
          socket.off("answerViewer", onAnswer);
          socket.off("addIceCandidateAnswerViewer", onIceCandidateAnswer);
          console.log("connected to rtc server for recieving remote stream ");
        }
      };

      peerConnection.ontrack = (e) => {
        const remoteStream = e.streams[0];
        setRemoteRecievedPeer((prev) => {
          const existinguser = prev.find((item) => item.for === elem.id);

          if (existinguser) {
            return [
              ...prev.filter((item) => item.for !== elem.id),
              {
                ...existinguser,
                tracks: [remoteStream],
              },
            ];
          }
          return [
            ...prev,
            { for: elem.id, tracks: [remoteStream], peer: peerConnection },
          ];
        });
      };

      //sending created offer to server
      socket.emit("offerViewer", { offer, userId: elem.id });

      //listening for ice candidate updates for remote peer i.e server
      socket.on("addIceCandidateAnswerViewer", onIceCandidateAnswer);
    });
  };

  //starting peer connection to send local streams
  useEffect(() => {
    if (!socket) return;
    StreamToServer();
  }, [socket, userId]);

  //creating peer connections with all speaker peers to receive there streams for intial
  useEffect(() => {
    if (!participants || initiated) return;

    ViewStreamFromServer();

    setInitiated(true);
  }, [participants]);

  //closing localtracks incase of leaving the page
  useEffect(() => {
    if (!localTracks) return;

    return () => {
      localTracks?.getAudioTracks()[0].stop();
      localTracks?.getVideoTracks()[0].stop();
    };
  }, [localTracks]);

  //closing allPeer connections incase of leaving the page
  useEffect(() => {
    if (!localSenderPeer) return;

    return () => {
      localSenderPeer?.close();
      remoteRecieverPeer?.forEach((elem) => {
        elem.peer.close();
      });
    };
  }, [localSenderPeer]);

  console.log(remoteRecieverPeer);

  //closing peer connections with peer who left the rt
  useEffect(() => {
    if (!socket) return;
    socket.on("user-left", async (user) => {
      setRemoteRecievedPeer((prev) => {
        return prev.filter((elem) => {
          if (elem.for === user.id) {
            elem.peer.close();
            setTotalRecevingPeer((prev) => prev - 1);
            return false;
          }
          return true;
        });
      });
    });
  }, [socket]);

  //updating peer connections

  useEffect(() => {
    const userJoined = ({ id }) => {
      if (id === userId._id) return;

      ViewStreamFromServer(id);
    };

    socket.on("user-joined", userJoined);

    return () => {
      socket.off("user-joined", userJoined);
    };
  }, []);

  return (
    <>
      <Grid container alignItems={"center"}>
        <Grid
          item
          xs={6}
          // sx={{
          //   position: "relative",
          // }}
          sx={{
            height: "400px",
          }}
        >
          <Grid
            item
            xs={12}
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
              <VideoItem videoTrack={localTracks} muted={true} />
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
              // position: "absolute",
              // bottom: "0px",
              // left: "0px",
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
        {remoteRecieverPeer.map((item) => {
          return (
            <Grid
              item
              xs={6}
              key={item.for}
              sx={{ height: "400px", border: "1px solid green" }}
            >
              <VideoItem
                videoTrack={item.tracks[0]}
                muted={false}
                totalReceivingPeer={totalReceivingPeer}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
