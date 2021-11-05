import React from "react";
import Router from "next/router";
import { useUploadImageMutation } from "../generated/graphql";

interface buttonProps {
  files: File[] | null;
  handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const UploadButton: React.FC<buttonProps> = ({ files, handlePhotos }) => {
  const [, uploadImage] = useUploadImageMutation();
  const uploadPhotographs = async () => {
    files!.forEach(async (image) => {
      const req = await uploadImage({ image: image });
      Router.reload();
    });
  };

  return (
    <button className="button" onClick={uploadPhotographs}>
      Confirm
    </button>
  );
};

export default UploadButton;
