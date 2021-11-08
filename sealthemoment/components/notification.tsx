import React, { useEffect } from "react";

type notificationType =
  | "previewReady"
  | "uploadSuccessful"
  | "uploadFailed"
  | "500error"
  | "noCamera"
  | "hide";

interface notificationProps {
  state: {
    message: string;
    CSSclass: string;
  };
  hide: React.Dispatch<notificationType>;
}

const Notification: React.FC<notificationProps> = ({ hide, state }) => {
  useEffect(() => {
    let timeout = setTimeout(() => {
      hide("hide");
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return <article className={state.CSSclass}>{state.message}</article>;
};

export default Notification;
