import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Camera from "../../components/camera";
import DragAndDrop from "../../components/DaDarea";
import { NotificationProvider } from "../../components/NotificationContext";
import UploadButton from "../../components/uploadButton";
import Gallery from "../../components/UploadPhotographsContainer";
import UserNavigation from "../../components/usernav";
import { UPDATE_LOCATION_MUTATION } from "../../graphql/mutations";
import { useIsAuth } from "../../utils/userIsAuth";

const User: React.FC<{}> = () => {
  useIsAuth();
  const [findLocation, { data, loading }] = useMutation(
    UPDATE_LOCATION_MUTATION
  );
  const [photos, setPhotos] = useState<File[] | null>(null);

  useEffect(() => {
    const getLoc = async () => {
      const locationRequest = await findLocation();
    };
    getLoc();
  }, []);

  return (
    <>
      <main className="user__main">
        <NotificationProvider>
          <UserNavigation selected={"upload"} />
          <h2 className="user__location">
            Current Location:{" "}
            {loading ? "Loading..." : data?.updateLocation.location?.city}
          </h2>
          <Camera photos={photos} setPhotos={setPhotos} />
          <DragAndDrop handleDU={setPhotos} />
          {photos && (
            <>
              <Gallery files={photos} />
              <UploadButton files={photos} handlePhotos={setPhotos} />
            </>
          )}
        </NotificationProvider>
      </main>
    </>
  );
};

export default User;
