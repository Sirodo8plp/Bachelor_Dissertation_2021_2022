import { useQuery } from "@apollo/client";
import React from "react";
import Postcard from "../../../components/postcard";
import UserNavigation from "../../../components/usernav";
import { GET_POSTCARDS_QUERY } from "../../../graphql/queries";
import { useIsAuth } from "../../../utils/userIsAuth";

const Postcards: React.FC<{}> = () => {
  useIsAuth();
  const { data, loading } = useQuery(GET_POSTCARDS_QUERY);
  if (!loading && data && data.getPostcards && data.getPostcards.length !== 0) {
    const cssClass = "postcards__container ".concat(
      getContainerClass(data!.getPostcards)
    );
    return (
      <>
        <UserNavigation selected="postcards" />
        <main className={cssClass}>
          {data?.getPostcards?.map((postcard: any) => {
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
  } else if (!loading && data?.getPostcards?.length === 0) {
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

const getContainerClass = (pcs: Object[]) => {
  if (pcs.length <= 3) {
    return "postcards__container--max3";
  } else {
    return "postcards__container--moreThan3";
  }
};

export default Postcards;
