import React, { useContext, useRef } from "react";
import {
  selectedContext,
  SetPhotographsContext,
  setSelectedContext,
} from "../pages/user/photographs";
import { useCreatePostcardMutation } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const CreatePostcard: React.FC<{}> = () => {
  const selectedPhotographs = useContext(selectedContext);
  const setSelectedPhotographs = useContext(setSelectedContext);
  const setPhotographs = useContext(SetPhotographsContext);
  const PostcardDescription = useRef<HTMLInputElement>(null);
  const PostcardButton = useRef<HTMLButtonElement>(null);
  const [{ data, fetching }, createPostcard] = useCreatePostcardMutation();

  const createPostcardEvent = async () => {
    PostcardButton.current!.innerText = "";
    PostcardButton.current!.classList.add("loading");
    const description = PostcardDescription.current!.value;
    const data = await createPostcard({
      inputs: { imageLinks: selectedPhotographs!, description: description },
    });
    console.log(data);
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

export default withUrqlClient(createUrqlClient)(CreatePostcard);
