import React, { useLayoutEffect, useRef } from "react";
import { useRemovePostcardMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface postcardProps {
  description: string;
  id: number;
  specialID: string;
}

const Postcard: React.FC<postcardProps> = ({ description, id, specialID }) => {
  const router = useRouter();
  const tooltip = useRef<HTMLSpanElement>(null);
  const [{ data, fetching }, delPostcard] = useRemovePostcardMutation();
  const removePostcard = async () => {
    await delPostcard({ pcId: id });
    router.reload();
  };

  const copyPostcardLink = async () => {
    await navigator.clipboard.writeText(
      `localhost:3000/viewPostcard/${specialID}`
    );
    tooltip.current!.innerText = "Link was copied!";
  };

  return (
    <article className="postcards__item">
      <h1 className="postcards__id">Postcard ID: {id}</h1>
      {description && (
        <p className="postcards__description">Description:{description}</p>
      )}
      <p className="postcards__link">
        <span className="postcards__linkText">
          localhost:3000/viewPostcard/{specialID}
        </span>
        <span
          className="postcards__button"
          onClick={copyPostcardLink}
          onMouseEnter={() => {
            tooltip!.current!.innerText = "Copy Link";
          }}
        >
          <span className="postcards__tooltip" ref={tooltip}></span>
          📋
        </span>
      </p>
      <button className="button button--negative" onClick={removePostcard}>
        Delete
      </button>
    </article>
  );
};

export default Postcard;
