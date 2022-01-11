import { withUrqlClient } from "next-urql";
import React, { useContext, useRef } from "react";
import Notification from "../classes/notification";
import {
  NotificationContext,
  SetNotificationsContext,
} from "../components/NotificationContext";
import {
  useGetEtherAddressQuery,
  useUploadImagesMutation,
} from "../generated/graphql";
import convertImageToNft from "../utils/convertToNft";
import { createUrqlClient } from "../utils/createUrqlClient";

interface buttonProps {
  files: File[] | null;
  handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const UploadButton: React.FC<buttonProps> = ({ files, handlePhotos }) => {
  const [{ data, fetching }, uploadImages] = useUploadImagesMutation();
  const ether = useGetEtherAddressQuery();
  const buttonElement = useRef<HTMLButtonElement>(null);

  const notifications = useContext(NotificationContext);
  const setNotifications = useContext(SetNotificationsContext);

  const uploadPhotographs = async () => {
    if (
      ether[0].fetching ||
      !ether[0].data ||
      !ether[0].data.getEthereumAddress
    )
      return;

    const userEtherAddress = ether[0].data.getEthereumAddress;

    setNotifications!(notifications!.concat(new Notification("uploading")));
    buttonElement.current?.classList.add("loading");
    buttonElement.current!.innerHTML = "";
    const ipfsLinks: string[] = [];
    const tokenIDs: number[] = [];
    for (const file of files!) {
      const data = await convertImageToNft(file, userEtherAddress);
      if (
        data.errorMessage ===
        "MetaMask Tx Signature: User denied transaction signature."
      ) {
        setNotifications!(
          notifications!.concat(new Notification("deniedTransaction"))
        );
        continue;
      } else if (data.errorMessage === "Internal JSON-RPC error.") {
        setNotifications!(
          notifications!.concat(new Notification("imageAlreadyUploaded"))
        );
        continue;
      } else if (data.tokenID && data.ipfsLink) {
        ipfsLinks.push(data.ipfsLink);
        tokenIDs.push(Number(data.tokenID));
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
          tokenURIs: tokenIDs,
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
