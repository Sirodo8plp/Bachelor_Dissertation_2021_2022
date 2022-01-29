import React, {
  useRef,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import Webcam from "react-webcam";
import { dataUrlToFile } from "../utils/dataToFile";
import {
  NotificationContext,
  SetNotificationsContext,
} from "./NotificationContext";
import Notification from "../classes/notification";

interface cameraProps {
  photos: File[] | null;
  setPhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" },
};

const Camera: React.FC<cameraProps> = ({ photos, setPhotos }) => {
  const webcamRef = useRef<Webcam>(null);
  const [permissionCamera, setPermissionCamera] = useState<any>(null);
  const notifications = useContext(NotificationContext);
  const setNotifications = useContext(SetNotificationsContext);

  const capture = useCallback(async () => {
    const file: File | null = await dataUrlToFile(
      webcamRef.current!.getScreenshot(),
      "cameraSnap"
    );
    if (file) setPhotos([file]);
  }, [setPhotos, webcamRef]);

  const checkPermissions = async () => {
    try {
      const request = await navigator.mediaDevices.getUserMedia(
        CAPTURE_OPTIONS
      );
      if (request.active) return "Success";
    } catch (error) {
      return "User rejected using their camera.";
    }
  };

  useEffect(() => {
    checkPermissions().then((res) => {
      if (res === "User rejected using their camera.") {
        setNotifications!(notifications!.concat(new Notification("noCamera")));
        return;
      }
      setPermissionCamera(
        <>
          <Webcam audio={false} screenshotFormat="image/jpeg" ref={webcamRef} />
          <button className="button" onClick={capture}>
            Take Photograph
          </button>
        </>
      );
    });
  }, []);

  return <>{permissionCamera}</>;
};

export default Camera;
