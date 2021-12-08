import React, { useRef } from "react";
import Image from "next/image";

interface photographProps {
  link: string;
  id: string;
  photographs: string[] | null;
  setPhotographs: React.Dispatch<React.SetStateAction<string[] | null>>;
}

const Photograph: React.FC<photographProps> = ({
  link,
  id,
  photographs,
  setPhotographs,
}) => {
  const checkboxElemenet = useRef<HTMLInputElement>(null);
  const addOrRemoveImage = () => {};

  return (
    <article>
      <Image src={link} width="300" height="300" />
      <input type="checkbox" id={id} ref={checkboxElemenet} />
    </article>
  );
};

export default Photograph;
