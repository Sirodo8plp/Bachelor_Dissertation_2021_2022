import { withUrqlClient } from "next-urql";
import React, { useContext, useRef } from "react";
import Notification from "../classes/notification";
import {
  NotificationContext,
  SetNotificationsContext,
} from "../components/NotificationContext";
import { useUploadImagesMutation } from "../generated/graphql";
import convertImageToNft from "../utils/convertToNft";
import { createUrqlClient } from "../utils/createUrqlClient";

interface buttonProps {
  files: File[] | null;
  handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const UploadButton: React.FC<buttonProps> = ({ files, handlePhotos }) => {
  const [{ data, fetching }, uploadImages] = useUploadImagesMutation();
  const buttonElement = useRef<HTMLButtonElement>(null);
  const privateKeyElement = useRef<HTMLInputElement>(null);
  const privateKeyWarning = useRef<HTMLSpanElement>(null);
  const notifications = useContext(NotificationContext);
  const setNotifications = useContext(SetNotificationsContext);

  const uploadPhotographs = async () => {
    if (
      privateKeyElement!.current!.value === "" ||
      privateKeyElement!.current!.value.length != 64
    ) {
      privateKeyWarning.current!.innerText =
        "Private key is required in order to sign your transaction!";
      return;
    }

    setNotifications!(notifications!.concat(new Notification("uploading")));
    buttonElement.current?.classList.add("loading");
    buttonElement.current!.innerHTML = "";
    const ipfsLinks: string[] = [];
    const transactionHashes: string[] = [];
    for (const file of files!) {
      const data = await convertImageToNft(
        file,
        privateKeyElement.current!.value,
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
        inputs: {
          ipfsLinks: ipfsLinks1,
          transactionHashes: transactionHashes,
        },
      });
      if (!fetching) {
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
      <input
        type="text"
        name="privateKey"
        id="privateKey"
        placeholder="Insert your address' private key!"
        ref={privateKeyElement}
      />
      <button
        ref={buttonElement}
        className="button"
        onClick={uploadPhotographs}
      >
        Confirm
      </button>
      <span className="formError" ref={privateKeyWarning}></span>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(UploadButton);
