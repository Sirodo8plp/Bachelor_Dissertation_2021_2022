import { withUrqlClient } from "next-urql";
import React, { useEffect, useLayoutEffect, useReducer, useState } from "react";
import UserNavigation from "../../components/usernav";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/userIsAuth";
import { useUpdateLocationMutation } from "../../generated/graphql";
import DragAndDrop from "../../components/DaDphoto";
import Gallery from "../../components/gallery";
import UploadButton from "../../components/uploadButton";
import Notification from "../../components/notification";
import { inform } from "../../utils/informUser";

const notification = {
  message: "",
  CSSclass: "",
  visible: false,
};

const User: React.FC<{}> = () => {
  const [{ data, fetching }, findLocation] = useUpdateLocationMutation();
  const [photos, setPhotos] = useState<File[] | null>(null);
  const [state, dispatch] = useReducer(inform, notification);
  useIsAuth();

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
    const getLoc = async () => {
      const locationRequest = await findLocation();
    };
    getLoc();

    doesUserHaveCamera().then((res) => {
      if (res === false) {
        dispatch("noCamera");
      }
    });
  }, []);

  return (
    <>
      <UserNavigation selected={"upload"} />
      <h2 className="user__location">
        Current Location:{" "}
        {fetching ? "Loading..." : data?.updateLocation.location?.city}
      </h2>
      <main className="user__main">
        <DragAndDrop handleDU={setPhotos} />
        {photos && <Gallery files={photos} notify={dispatch} state={state} />}
        {photos && (
          <UploadButton
            files={photos}
            handlePhotos={setPhotos}
            notify={dispatch}
            state={state}
            pageProps={undefined}
          />
        )}
      </main>
      {state.visible === true ? (
        <Notification hide={dispatch} state={state} />
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(User);
