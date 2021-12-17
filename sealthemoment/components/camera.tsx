import React, { useContext, useEffect, useRef, useState } from "react";
import {
  NotificationContext,
  SetNotificationsContext,
} from "./NotificationContext";
import Notification from "../classes/notification";

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" },
};

const Camera: React.FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const notifications = useContext(NotificationContext);
  const setNotifications = useContext(SetNotificationsContext);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia(
          CAPTURE_OPTIONS
        );
        setMediaStream(stream);
      } catch (err) {
        setNotifications!(notifications!.concat(new Notification("noCamera")));
      }
    }

    if (!mediaStream) {
      enableStream();
    } else {
      return function cleanup() {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [mediaStream, CAPTURE_OPTIONS]);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    if (videoRef && videoRef.current) videoRef.current.play();
  }
  return (
    <>
      {videoRef.current?.srcObject && (
        <video
          ref={videoRef}
          onCanPlay={handleCanPlay}
          autoPlay
          playsInline
          muted
        />
      )}
    </>
  );
};

export default Camera;
