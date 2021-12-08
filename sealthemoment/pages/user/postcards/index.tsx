import { withUrqlClient } from "next-urql";
import React from "react";
import UserNavigation from "../../../components/usernav";
import { useLoadPostcardQuery } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useIsAuth } from "../../../utils/userIsAuth";

const Postcards: React.FC<{}> = () => {
  useIsAuth();
  const [{ data, fetching }] = useLoadPostcardQuery();

  if (!fetching) {
    return (
      <>
        <UserNavigation selected="postcards" />
        {data?.getPostcards && (
          <main className="postcards">
            {data?.getPostcards?.postcards.map((postcard) => {
              return (
                <article key={postcard.id} className="postcards__item">
                  <h1 className="postcards__id">Postcard ID: {postcard.id}</h1>
                  {postcard.description && (
                    <p className="postcards__description">
                      Description:{postcard.description}
                    </p>
                  )}
                  <p className="postcards__link">
                    <span className="postcards__linkText">
                      localhost:3000/viewPostcard/{postcard.id}
                    </span>
                    <span className="postcards__button">📋</span>
                  </p>
                </article>
              );
            })}
          </main>
        )}
      </>
    );
  } else if (!fetching && !data) {
    return <article>You have not upload any postcards yet!</article>;
  } else {
    return <article>Loading</article>;
  }
};

export default withUrqlClient(createUrqlClient)(Postcards);
