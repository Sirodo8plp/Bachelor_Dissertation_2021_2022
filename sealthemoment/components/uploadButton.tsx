import { withUrqlClient } from "next-urql";
import React, { useContext, useRef } from "react";
import Notification from "../classes/notification";
import {
  NotificationContext,
  SetNotificationsContext,
} from "../components/NotificationContext";
import { useUploadImagesMutation } from "../generated/graphql";
import createPostcard from "../utils/createPostcard";
import { createUrqlClient } from "../utils/createUrqlClient";

interface buttonProps {
  files: File[] | null;
  handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const UploadButton: React.FC<buttonProps> = ({ files, handlePhotos }) => {
  const [{ data, fetching }, uploadFiles] = useUploadImagesMutation();
  const buttonElement = useRef<HTMLButtonElement>(null);
  const descriptionElement = useRef<HTMLInputElement>(null);

  const notifications = useContext(NotificationContext);
  const setNotifications = useContext(SetNotificationsContext);

  const uploadPhotographs = async () => {
    setNotifications!(notifications!.concat(new Notification("uploading")));
    buttonElement.current?.classList.add("loading");
    buttonElement.current!.innerHTML = "";
    const ipfsLinks: string[] = [];
    const tokenIDs: number[] = [];
    for (const file of files!) {
      const data = await createPostcard(
        file,
        descriptionElement.current?.value || ""
      );
      if (data.errorMessage) {
        setNotifications!(
          notifications
            ? notifications.concat(new Notification("imageAlreadyUploaded"))
            : [new Notification("imageAlreadyUploaded")]
        );
        handlePhotos(null);
        buttonElement.current?.classList.remove("loading");
        return;
      }
      if (data.tokenID && data.ipfsLink) {
        ipfsLinks.push(data.ipfsLink);
        tokenIDs.push(Number(data.tokenID));
      }
    }
    ipfsLinks.forEach((link) => {
      link.replace("ipfs://", "");
      link = "https://ipfs.io/ipfs/".concat(link);
    });
    const ipfsLinks1 = ipfsLinks.map((link) => {
      return "https://ipfs.io/ipfs/".concat(link).replace("ipfs://", "");
    });
    const upload = await uploadFiles({
      inputs: {
        ipfsLinks: ipfsLinks1,
        tokenURIs: tokenIDs,
      },
    });
    if (!fetching) {
      handlePhotos(null);
      buttonElement.current?.classList.remove("loading");
      setNotifications!(
        notifications
          ? notifications.concat(new Notification("uploadSuccessful"))
          : [new Notification("uploadSuccessful")]
      );
      return;
    }
  };

  return (
    <>
      <input
        ref={descriptionElement}
        className="postcardDescription"
        type="text"
        name="PostcardDescription"
        id="PostcardDescription"
        placeholder="Optionally, add a description to your postcard!"
      />
      <button
        ref={buttonElement}
        className="button"
        onClick={uploadPhotographs}
      >
        Confirm
      </button>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(UploadButton);
