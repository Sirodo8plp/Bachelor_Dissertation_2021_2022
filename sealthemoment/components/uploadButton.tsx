import React, { useContext, useRef } from "react";
import Notification from "../classes/notification";
import {
  NotificationContext,
  SetNotificationsContext,
} from "../components/NotificationContext";
import convertImageToNft from "../utils/convertToNft";
import { UPLOAD_IMAGES_MUTATION } from "../graphql/mutations";
import { useMutation } from "@apollo/client";

interface buttonProps {
  files: File[] | null;
  handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const UploadButton: React.FC<buttonProps> = ({ files, handlePhotos }) => {
  const [uploadImages, { loading }] = useMutation(UPLOAD_IMAGES_MUTATION);
  const buttonElement = useRef<HTMLButtonElement>(null);
  const notifications = useContext(NotificationContext);
  const setNotifications = useContext(SetNotificationsContext);

  const uploadPhotographs = async () => {
    setNotifications!(notifications!.concat(new Notification("uploading")));
    buttonElement.current?.classList.add("loading");
    buttonElement.current!.innerHTML = "";
    const ipfsLinks: string[] = [];
    const transactionHashes: string[] = [];
    for (const file of files!) {
      const data = await convertImageToNft(
        file,
        notifications,
        setNotifications
      );
      if (data && data.transactionHash && data.ipfsLink) {
        ipfsLinks.push(data.ipfsLink);
        transactionHashes.push(data.transactionHash);
      }
    }
    if (ipfsLinks.length > 0) {
      ipfsLinks.forEach((link) => {
        link.replace("ipfs://", "");
        link = "https://ipfs.io/ipfs/".concat(link);
      });
      const ipfsLinks1 = ipfsLinks.map((link) => {
        return "https://ipfs.io/ipfs/".concat(link).replace("ipfs://", "");
      });
      const upload = await uploadImages({
        variables: {
          inputs: {
            ipfsLinks: ipfsLinks1,
            transactionHashes: transactionHashes,
          },
        },
      });
      if (!loading) {
        handlePhotos(null);
        buttonElement.current?.classList.remove("loading");
        setNotifications!(
          notifications!.concat(new Notification("uploadSuccessful"))
        );
        return;
      }
    }
    handlePhotos(null);
    buttonElement.current?.classList.remove("loading");
    return;
  };

  return (
    <>
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

export default UploadButton;
