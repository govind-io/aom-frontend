import { useEffect, useRef } from "react";

export default function VideoItem({ peer }) {
  const videoRef = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      style={{
        width: "80%",
      }}
    ></video>
  );
}
