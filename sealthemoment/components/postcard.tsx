import React, { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { REMOVE_POSTCARD_MUTATION } from "../graphql/mutations";
import { GET_POSTCARDS_QUERY } from "../graphql/queries";

interface postcardProps {
  description: string;
  id: number;
  specialID: string;
}

const Postcard: React.FC<postcardProps> = ({ description, id, specialID }) => {
  const router = useRouter();
  const tooltip = useRef<HTMLSpanElement>(null);
  const [deletePostcard, {}] = useMutation(REMOVE_POSTCARD_MUTATION, {
    variables: { pcId: id },
    refetchQueries: [{ query: GET_POSTCARDS_QUERY }],
  });
  const removePostcard = async () => {
    await deletePostcard({ variables: { pcId: id } });
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
