import React, { useState, useEffect } from "react";

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" },
};

export const useUserMedia = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await window.navigator.mediaDevices.getUserMedia(
          CAPTURE_OPTIONS
        );
        setMediaStream(stream);
      } catch (err) {
        console.error(CAPTURE_OPTIONS);
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

  return mediaStream;
};
