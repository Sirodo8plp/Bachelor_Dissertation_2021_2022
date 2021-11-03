import React from "react";

interface buttonProps {
  files: File[] | null;
}

const UploadButton: React.FC<buttonProps> = ({ files }) => {
  const uploadPhotographs = () => {};

  return (
    <button className="button" onClick={uploadPhotographs}>
      Confirm
    </button>
  );
};

export default UploadButton;
