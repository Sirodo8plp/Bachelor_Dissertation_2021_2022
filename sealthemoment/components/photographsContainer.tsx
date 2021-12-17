import React, { useContext } from "react";
import Photograph from "./photograph";
import { PhotographsContext } from "../pages/user/photographs";

const PhotographContainer: React.FC<{}> = () => {
  const photographs = useContext(PhotographsContext);
  if (photographs) {
    return (
      <section className="photograph__images">
        {photographs.map((link, index) => {
          return (
            <Photograph
              link={link.imageLink}
              id={"checkbox".concat(index.toString())}
              key={"photograph".concat(index.toString())}
            />
          );
        })}
      </section>
    );
  } else {
    return <></>;
  }
};

export default PhotographContainer;
