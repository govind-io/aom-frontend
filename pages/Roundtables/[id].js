import { CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { WithAuth } from "../../Utils/ComponentUtilities/WithAuth";
import { useDispatch, useSelector } from "react-redux";
import { GetRoundtables } from "../../Redux/Actions/Roundtable";
import ParticipantList from "../../Components/Roundtables/LiveRt/ParticipantList";
import { io } from "socket.io-client";
import { Tokens } from "../../Utils/Configs/ApiConfigs";
import { socket, setSocket } from "../../Utils/Configs/Socket";
import ToastHandler from "../../Utils/Toast/ToastHandler";
import AlertDialog from "../../Components/Roundtables/LiveRt/Confirmation";
import ChatMain from "../../Components/Roundtables/Chat/chatMain";

import VideoGrid from "../../Components/Roundtables/LiveRt/Video/videoMain";
function Roundtable() {
  const router = useRouter();
  const { id } = router.query;

  //local states here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [isModerator, setisModerator] = useState(false);
  const [open, setOpen] = useState(false);
  const [reqUser, setReqUser] = useState();
  const [updatedSocket, setUpdateSocket] = useState(false);

  //state selectors here
  const user_id = useSelector((state) => state?.user?.data?.user?._id);

  //refs here
  const acceptedRef = useRef();
  acceptedRef.current = accepted;

  //constants here
  const dispatch = useDispatch();

  //useEffects here
  useEffect(() => {
    if (!id) return;
    const apiData = {
      data: {
        id,
      },
      onSuccess: (data) => {
        setData(data.roundtable);
        setLoading(false);
        setError(false);
      },
      onFailed: (e) => {
        setLoading(false);
        setError(e);
        setData({});
      },
    };

    setLoading(true);
    dispatch(GetRoundtables(apiData));
  }, [id]);

  useEffect(() => {
    if (!data?.moderator) return;
    setisModerator(data.moderator[0]?.id === user_id);

    const temp = io("http://127.0.0.1:3001/", {
      query: {
        user_id,
        roundtable_id: id,
      },
      auth: {
        token: Tokens.refresh,
      },
      "force new connection": true,
      reconnectionAttempts: "5",
      timeout: 10000,
      transports: ["websocket"],
    });

    setSocket(temp);
    setUpdateSocket(!updatedSocket);

    return () => {
      socket.disconnect();
    };
  }, [data, user_id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect_error", (err) => {
      ToastHandler("err", err.message);
    });

    socket.on("connect", () => {
      console.log("connected to the serve succesfully", socket.id);
    });

    socket.on("connected", () => {
      console.log("connected to the rt");
    });

    socket.on("accepted", () => {
      setAccepted(true);
      socket.emit("accepted");
    });

    socket.on("rejected", () => {
      setRejected(true);
      socket.emit("rejected");
    });

    socket.on("disconnect", () => {
      if (acceptedRef.current) {
        ToastHandler("warn", "Roundtable ended or moderator left");
      }
      router.push("/Roundtables/list");
    });

    socket.on("connected", () => {
      ToastHandler("sus", "joined roundtable succesfully");
    });

    if (!isModerator) return;

    socket.on("join-req", (data) => {
      setOpen(true);
      setReqUser(data);
    });
  }, [socket, isModerator, updatedSocket]);

  return (
    <>
      {loading && (
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "calc(100% - 93px)",
          }}
        >
          <CircularProgress />
        </Grid>
      )}

      {!accepted && !isModerator && !rejected && (
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "calc(100% - 93px)",
          }}
        >
          <Typography
            color={"blue"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Requested Moderator to let you in <CircularProgress />
          </Typography>
        </Grid>
      )}

      {rejected && !isModerator && (
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "calc(100% - 93px)",
          }}
        >
          <Typography color={"red"}>
            Moderator rejected your join req
          </Typography>
        </Grid>
      )}
      {(accepted || isModerator) && (
        <Grid
          container
          style={{
            padding: "20px",
          }}
        >
          <Grid item xs={12}>
            <Grid container>
              <Grid
                item
                xs={6}
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Roundtable:
                <span
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  {data.name}
                </span>{" "}
                By{" "}
                <span
                  style={{
                    fontWeight: "normal",
                  }}
                >
                  {data.moderator?.[0]?.name}
                </span>
                :
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Paper elevation={4}>
              <ParticipantList participants={data.participants} />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <VideoGrid />
          </Grid>
          <Grid item xs={3}>
            <ChatMain messages={data.messages} />
          </Grid>
        </Grid>
      )}
      <AlertDialog reqUser={reqUser} open={open} setOpen={setOpen} />
    </>
  );
}

export default WithAuth(Roundtable);
