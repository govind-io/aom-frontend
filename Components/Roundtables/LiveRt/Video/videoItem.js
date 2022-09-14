import { useEffect, useRef } from "react";

export default function VideoItem({ videoTrack }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!videoTrack) return;

    videoRef.current.srcObject = videoTrack;
  }, [videoTrack]);

  return (
    <video
      ref={videoRef}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "containe",
      }}
      muted={true}
      autoPlay={true}
    ></video>
  );
}
