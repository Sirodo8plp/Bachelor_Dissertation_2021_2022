import { withUrqlClient } from "next-urql";
import React, { useEffect, useLayoutEffect, useState } from "react";
import UserNavigation from "../../components/usernav";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/userIsAuth";
import { useUpdateLocationMutation } from "../../generated/graphql";
import DragAndDrop from "../../components/DaDphoto";
import Gallery from "../../components/gallery";
import UploadButton from "../../components/uploadButton";

const User: React.FC<{}> = () => {
  const [{ data, fetching }, findLocation] = useUpdateLocationMutation();
  const [hasCamera, setHasCamera] = useState<boolean | null>(false);
  const [photos, setPhotos] = useState<FileList | null>(null);
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

  doesUserHaveCamera().then((res) => {
    setHasCamera(res);
  });

  // useEffect(() => {
  //   const getLoc = async () => {
  //     const locationRequest = await findLocation();
  //   };
  //   getLoc();
  // }, []);

  return (
    <>
      <UserNavigation selected={"upload"} />
      <h2 className="user__location">
        Current Location:{" "}
        {fetching ? "Loading..." : data?.updateLocation.location?.city}
      </h2>
      <main className="user__main">
        <DragAndDrop handleDU={setPhotos} />
        {photos && <Gallery files={photos} />}
        {photos && <UploadButton files={photos} />}
      </main>
      {!hasCamera ? (
        <p className="camera__error">
          A camera device could not be found. However, you can still upload or
          drag and drop your photographs.
        </p>
      ) : null}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(User);
