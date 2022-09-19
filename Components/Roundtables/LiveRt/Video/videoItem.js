import { useEffect, useRef } from "react";

export default function VideoItem({ videoTrack, muted, totalReceivingPeer }) {
  const videoRef = useRef();

  useEffect(() => {
    if (!videoTrack) return;

    videoRef.current.srcObject = videoTrack;
  }, [videoTrack, totalReceivingPeer]);

  return (
    <video
      ref={videoRef}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "containe",
      }}
      muted={muted}
      autoPlay={true}
    ></video>
  );
}
