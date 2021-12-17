import { withUrqlClient } from "next-urql";
import React from "react";
import Postcard from "../../../components/postcard";
import UserNavigation from "../../../components/usernav";
import { useLoadPostcardQuery } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useIsAuth } from "../../../utils/userIsAuth";

const Postcards: React.FC<{}> = () => {
  useIsAuth();
  const [{ data, fetching }] = useLoadPostcardQuery();

  if (!fetching && data?.getPostcards?.length !== 0) {
    return (
      <>
        <UserNavigation selected="postcards" />
        <main className="postcards">
          {data?.getPostcards?.map((postcard) => {
            return (
              <Postcard
                key={postcard.id}
                description={postcard.description}
                id={postcard.id}
                specialID={postcard.specialID}
              />
            );
          })}
        </main>
      </>
    );
  } else if (!fetching && data?.getPostcards?.length === 0) {
    return (
      <>
        <UserNavigation selected="postcards" />
        <h1 className="postcards__Heading">
          You have not created any postcards yet!
        </h1>
      </>
    );
  } else {
    return <h2 className="postcards__Heading">Loading</h2>;
  }
};

export default withUrqlClient(createUrqlClient)(Postcards);
