import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { socket } from "../../../Utils/Configs/Socket";

export default function AlertDialog({ open, setOpen, reqUser }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">
        Accept {reqUser?.name}&aposs Join Request
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Accepting will allow him to see all the activity by every user in this
          roundtabl
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            socket.emit("join-req-rejected", reqUser);
            handleClose();
          }}
        >
          Disagree
        </Button>
        <Button
          onClick={() => {
            socket.emit("join-req-accepted", reqUser);
            handleClose();
          }}
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
