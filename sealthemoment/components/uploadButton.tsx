import React from "react";
import Router from "next/router";
import { useUploadImageMutation } from "../generated/graphql";

type notificationType =
  | "previewReady"
  | "uploadSuccessful"
  | "uploadFailed"
  | "500error"
  | "noCamera"
  | "hide";

interface buttonProps {
  files: File[] | null;
  // handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
  // state: {
  //   message: string;
  //   CSSclass: string;
  // };
  // notify: React.Dispatch<notificationType>;
}

const UploadButton: React.FC<buttonProps> = ({ files }) => {
  const [, uploadImage] = useUploadImageMutation();
  const uploadPhotographs = async () => {
    files!.forEach(async (image) => {
      const req = await uploadImage({ image: image });
      console.log(req.error);
    });
  };

  return (
    <button className="button" onClick={uploadPhotographs}>
      Confirm
    </button>
  );
};

export default UploadButton;
