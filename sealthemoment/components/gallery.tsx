import React, { useEffect, useState } from "react";
import ImageUpload from "./imageUpload";
import UploadButton from "./uploadButton";

type notificationType =
  | "previewReady"
  | "uploadSuccessful"
  | "uploadFailed"
  | "500error"
  | "noCamera"
  | "hide";

interface GalleryProps {
  files: File[];
  state: {
    message: string;
    CSSclass: string;
  };
  notify: React.Dispatch<notificationType>;
}

const Gallery: React.FC<GalleryProps> = ({ files, state, notify }) => {
  const [gallery, setGallery] = useState<string>("");

  useEffect(() => {
    if (files.length === 1) setGallery("gallery gallery--single");
    else if (files.length % 2 === 0) setGallery("gallery gallery--even");
    else setGallery("gallery gallery--odd");
    notify("previewReady");
  }, [files]);

  return (
    <>
      <section className={gallery}>
        {Array.from(files).map((file, index) => {
          return <ImageUpload key={index} file={file} />;
        })}
      </section>
    </>
  );
};

export default Gallery;
