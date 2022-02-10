import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Notification from "../classes/notification";
import NotificationComponent from "../components/notification";

export const NotificationContext = React.createContext<
  Notification[] | null | undefined
>([]);

export type TsetNotifications = Dispatch<
  SetStateAction<Notification[] | null | undefined>
> | null;

type TsetIsExpanded = Dispatch<React.SetStateAction<boolean>> | null;

export const SetNotificationsContext =
  React.createContext<TsetNotifications>(null);

export const OpenNotificationsContext =
  React.createContext<TsetIsExpanded>(null);

export const AreNotificationsOpenContext = React.createContext<boolean>(false);

export const NotificationProvider: React.FC<React.ReactNode> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<
    Notification[] | null | undefined
  >([]);
  const [isExpanded, SetIsExpanded] = useState<boolean>(false);

  let containerClass = "notification__container";
  if (isExpanded === true && notifications!.length !== 0)
    containerClass = containerClass.concat(
      " notification__container--expanded"
    );

  useEffect(() => {
    if (notifications!.length === 0) {
      SetIsExpanded(false);
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider value={notifications}>
      <SetNotificationsContext.Provider value={setNotifications}>
        <OpenNotificationsContext.Provider value={SetIsExpanded}>
          <AreNotificationsOpenContext.Provider value={isExpanded}>
            {children}
            <section className={containerClass}>
              <button
                className="notification__container__button"
                onClick={() => {
                  SetIsExpanded(false);
                }}
              >
                Close
              </button>
              {notifications?.map((notification) => (
                <NotificationComponent
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </section>
          </AreNotificationsOpenContext.Provider>
        </OpenNotificationsContext.Provider>
      </SetNotificationsContext.Provider>
    </NotificationContext.Provider>
  );
};
