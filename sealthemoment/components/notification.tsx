import React, { useContext, useEffect } from "react";
import notification from "../classes/notification";
import {
  NotificationContext,
  SetNotificationsContext,
} from "../components/NotificationContext";

interface notificationProps {
  notification: notification;
}

const Notification: React.FC<notificationProps> = ({ notification }) => {
  const notifications = useContext(NotificationContext);
  const setnotifications = useContext(SetNotificationsContext);

  const closeNotification = () => {
    setnotifications!(
      notifications!.filter((notif) => !(notif.id === notification.id))
    );
  };
  return (
    <article className={notification.CSSclass}>
      {notification.message}{" "}
      <button onClick={closeNotification} className="notification__button">
        &#x2718;
      </button>
    </article>
  );
};

export default Notification;
