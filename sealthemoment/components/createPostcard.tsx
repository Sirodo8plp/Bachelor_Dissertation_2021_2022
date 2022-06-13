import { useMutation } from "@apollo/client";
import React, { useContext, useRef } from "react";
import {
  selectedContext,
  SetPhotographsContext,
  setSelectedContext,
} from "../pages/user/photographs";
import { CREATE_POSTCARD_MUTATION } from "../graphql/mutations";

const CreatePostcard: React.FC<{}> = () => {
  const selectedPhotographs = useContext(selectedContext);
  const setSelectedPhotographs = useContext(setSelectedContext);
  const setPhotographs = useContext(SetPhotographsContext);
  const PostcardDescription = useRef<HTMLInputElement>(null);
  const PostcardButton = useRef<HTMLButtonElement>(null);

  const [createPostcard, { data, loading, error }] = useMutation(
    CREATE_POSTCARD_MUTATION
  );

  const createPostcardEvent = async () => {
    PostcardButton.current!.innerText = "";
    PostcardButton.current!.classList.add("loading");
    const description = PostcardDescription.current!.value;

    const data = await createPostcard({
      variables: {
        inputs: { imageLinks: selectedPhotographs!, description: description },
      },
    });

    PostcardButton.current!.innerText = "Create your Postcard!";
    PostcardButton.current?.classList.remove("loading");
    setSelectedPhotographs!(new Array());
  };

  return (
    <section className="photograph__createPostcardSection">
      <input
        ref={PostcardDescription}
        className="postcardDescription"
        type="text"
        name="PostcardDescription"
        id="PostcardDescription"
        placeholder="Optionally, add a description to your postcard!"
      />
      <button
        className="button"
        onClick={createPostcardEvent}
        ref={PostcardButton}
      >
        Create your Postcard!
      </button>
    </section>
  );
};

export default CreatePostcard;
