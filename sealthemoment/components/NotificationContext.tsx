import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Notification from "../classes/notification";
import NotificationComponent from "../components/notification";

export const NotificationContext = React.createContext<
  Notification[] | null | undefined
>(null);

type TsetNotifications = Dispatch<
  SetStateAction<Notification[] | null | undefined>
> | null;

export const SetNotificationsContext =
  React.createContext<TsetNotifications>(null);

export const NotificationProvider: React.FC<React.ReactNode> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    Notification[] | null | undefined
  >(null);

  const doesUserHaveCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      for (let i = 0; i < devices.length; i++) {
        if (devices[i].kind === "videoinput") return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    doesUserHaveCamera().then((res) => {
      if (res === false) {
        const tmp = new Array(new Notification("noCamera"));
        setNotifications([new Notification("noCamera")]);
      }
    });
  }, []);

  return (
    <NotificationContext.Provider value={notifications}>
      <SetNotificationsContext.Provider value={setNotifications}>
        {children}
        {notifications && (
          <section className="notification__container">
            {notifications?.map((notification) => (
              <NotificationComponent
                key={notification.id}
                notification={notification}
              />
            ))}
          </section>
        )}
      </SetNotificationsContext.Provider>
    </NotificationContext.Provider>
  );
};
