import React, { useContext, useEffect, useRef } from "react";
import Image from "next/image";
import { selectedContext, setSelectedContext } from "../pages/user/photographs";

interface photographProps {
  link: string;
  id: string;
}

const Photograph: React.FC<photographProps> = ({ link, id }) => {
  const checkboxElemenet = useRef<HTMLInputElement>(null);
  const selectedPhotographs = useContext(selectedContext);
  const setSelectedPhotographs = useContext(setSelectedContext);

  useEffect(() => {
    if (
      selectedPhotographs &&
      selectedPhotographs.length === 0 &&
      checkboxElemenet &&
      checkboxElemenet.current
    ) {
      checkboxElemenet.current.checked = false;
    }
  }, [selectedPhotographs]);

  const addOrRemoveImage = () => {
    if (checkboxElemenet.current?.checked) {
      checkboxElemenet.current!.checked = false;
      setSelectedPhotographs!(
        selectedPhotographs!.filter((image) => image != link)
      );
    } else {
      checkboxElemenet.current!.checked = true;
      setSelectedPhotographs!(selectedPhotographs!.concat(link));
    }
  };

  return (
    <figure className="photograph">
      <Image
        src={link}
        layout="responsive"
        width={50}
        height={50}
        onClick={addOrRemoveImage}
      />
      <input
        className="photograph__checkbox"
        type="checkbox"
        id={id}
        ref={checkboxElemenet}
      />
    </figure>
  );
};

export default Photograph;
