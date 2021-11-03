import React from "react";

interface buttonProps {
  files: FileList | null;
}

const UploadButton: React.FC<buttonProps> = () => {
  return <button className="button">Confirm</button>;
};

export default UploadButton;
