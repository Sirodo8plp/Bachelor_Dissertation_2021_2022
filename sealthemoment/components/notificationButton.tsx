import React, { useContext } from "react";
import {
  AreNotificationsOpenContext,
  NotificationContext,
  OpenNotificationsContext,
} from "./NotificationContext";

const NotificationSystem = () => {
  const openNotifications = useContext(OpenNotificationsContext);
  const areNotificationsOpen = useContext(AreNotificationsOpenContext);
  const notifications = useContext(NotificationContext);

  const manageNotificationsWindow = () => {
    if (areNotificationsOpen === true || notifications!.length === 0) {
      openNotifications!(false);
      return;
    }
    openNotifications!(true);
  };

  return (
    <li
      className="user__link user__link--notifications"
      style={{ cursor: "pointer" }}
      onClick={manageNotificationsWindow}
    >
      <span>{notifications?.length}</span>
      Notifications
    </li>
  );
};

export default NotificationSystem;
