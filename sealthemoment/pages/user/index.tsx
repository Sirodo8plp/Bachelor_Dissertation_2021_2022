import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import DragAndDrop from "../../components/DaDarea";
import Gallery from "../../components/UploadPhotographsContainer";
import { NotificationProvider } from "../../components/NotificationContext";
import UploadButton from "../../components/uploadButton";
import UserNavigation from "../../components/usernav";
import { useUpdateLocationMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/userIsAuth";
import Camera from "../../components/Camera";

const User: React.FC<{}> = () => {
  useIsAuth();
  const [{ data, fetching }, findLocation] = useUpdateLocationMutation();
  const [photos, setPhotos] = useState<File[] | null>(null);

  useEffect(() => {
    const getLoc = async () => {
      const locationRequest = await findLocation();
    };
    getLoc();
  }, []);

  return (
    <>
      <UserNavigation selected={"upload"} />
      <h2 className="user__location">
        Current Location:{" "}
        {fetching ? "Loading..." : data?.updateLocation.location?.city}
      </h2>
      <main className="user__main">
        <NotificationProvider>
          <Camera />
          <DragAndDrop handleDU={setPhotos} />
          {photos && (
            <>
              <Gallery files={photos} />
              <UploadButton
                files={photos}
                handlePhotos={setPhotos}
                pageProps={undefined}
              />
            </>
          )}
        </NotificationProvider>
      </main>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(User);
