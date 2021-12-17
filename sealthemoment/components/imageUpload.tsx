import React, { useEffect, useState } from "react";

interface ImageUpload {
  file: File;
}

const ImageUpload: React.FC<ImageUpload> = ({ file }) => {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return (
    <figure className="gallery__figure">
      {preview ? (
        <img
          className="gallery__image"
          src={preview}
          alt="image to be uploaded"
        />
      ) : (
        "Loading..."
      )}
    </figure>
  );
};

export default ImageUpload;
