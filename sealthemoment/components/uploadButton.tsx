import React from "react";
import Router from "next/router";
import { useUploadImageMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import createPostcard from "../utils/createPostcard";

type notificationType =
  | "previewReady"
  | "uploadSuccessful"
  | "uploadFailed"
  | "500error"
  | "noCamera"
  | "hide";

interface buttonProps {
  files: File[] | null;
  handlePhotos: React.Dispatch<React.SetStateAction<File[] | null>>;
  state: {
    message: string;
    CSSclass: string;
  };
  notify: React.Dispatch<notificationType>;
}

const UploadButton: React.FC<buttonProps> = ({
  files,
  handlePhotos,
  notify,
  state,
}) => {
  const [{ data, fetching }, uploadImage] = useUploadImageMutation();
  const uploadPhotographs = async () => {
    files!.forEach(async (image) => {
      const req = await uploadImage({ image: image });
      createPostcard(image, "test upload");
    });
    if (!fetching && data?.uploadImage === "Image was successfully uploaded.") {
      notify("uploadSuccessful");
      handlePhotos(null);
    }
  };

  return (
    <button className="button" onClick={uploadPhotographs}>
      Confirm
    </button>
  );
};

export default withUrqlClient(createUrqlClient)(UploadButton);
