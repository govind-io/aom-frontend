import { Button, Input, Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../Utils/Configs/Socket";
import ToastHandler from "../../../Utils/Toast/ToastHandler";
import Message from "./Message";

export default function ChatMain({ messages }) {
  //refs here
  const inputRef = useRef();
  const messagesRef = useRef();
  const messageArea = useRef();
  //messages here
  const [Messages, setMessages] = useState(messages);

  //setting ref value
  messagesRef.current = Messages;

  //effects here
  useEffect(() => {
    if (!socket) return;

    socket.on("message", (data) => {
      setMessages([...messagesRef.current, data]);
    });
  }, [socket]);

  useEffect(() => {
    if (!messageArea.current) return;
    messageArea.current.scrollTop = messageArea.current.scrollHeight;
  }, [Messages]);

  return (
    <Grid
      container
      style={{
        height: "100%",
        backgroundColor: "#9b7e7e",
        borderRadius: "15px",
      }}
      alignItems="space-between"
    >
      <Grid item xs={12}>
        <Typography
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            textAlign: "center",
            padding: "20px",
          }}
        >
          Message
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          height: "calc(100vh - 330px)",
          overflowY: "auto",
          padding: "0px 20px 20px 20px",
          "&::-webkit-scrollbar": {
            width: "12px",
          },
          "&&::-webkit-scrollbar-track": {
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: "10px",
          },
          "&&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.5)",
          },
        }}
        ref={messageArea}
      >
        {Messages.map((elem) => {
          return (
            <Message
              key={elem.date}
              content={elem.content}
              date={elem.date}
              by={elem.by}
              user_id={elem.user_id}
            />
          );
        })}
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          paddingTop: "20px",
        }}
      >
        <hr
          style={{
            height: "5px",
          }}
        />
        <Grid
          container
          style={{
            padding: "20px 20px 20px 20px",
          }}
        >
          <Grid item xs={8}>
            <Input placeholder="Send Message Here" ref={inputRef} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              onClick={() => {
                const val = inputRef.current.childNodes[0].value;
                if (val.length < 1) {
                  return ToastHandler("warn", "Message cannot be empty");
                }
                socket.emit(
                  "send-message",
                  {
                    content: val,
                  },
                  (err) => {
                    if (err) return;
                    inputRef.current.childNodes[0].value = "";
                  }
                );
              }}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
