import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import DragAndDrop from "../../components/DaDphoto";
import Gallery from "../../components/gallery";
import { NotificationProvider } from "../../components/NotificationContext";
import UploadButton from "../../components/uploadButton";
import UserNavigation from "../../components/usernav";
import { useUpdateLocationMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/userIsAuth";

const User: React.FC<{}> = () => {
  const [{ data, fetching }, findLocation] = useUpdateLocationMutation();
  const [photos, setPhotos] = useState<File[] | null>(null);
  useIsAuth();

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
