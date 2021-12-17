import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Notification from "../classes/notification";
import NotificationComponent from "../components/notification";

export const NotificationContext = React.createContext<
  Notification[] | null | undefined
>([]);

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
  >([]);

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
