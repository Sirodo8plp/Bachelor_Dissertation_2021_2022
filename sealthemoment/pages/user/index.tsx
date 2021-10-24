import { withUrqlClient } from "next-urql";
import React, { useLayoutEffect } from "react";
import UserNavigation from "../../components/usernav";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/userIsAuth";
import { useUpdateLocationMutation } from "../../generated/graphql";
const User: React.FC<{}> = () => {
  const [{ data, fetching }, findLocation] = useUpdateLocationMutation();
  useIsAuth();
  useLayoutEffect(() => {
    const getLoc = async () => {
      const locationRequest = await findLocation();
      console.log(locationRequest);
    };

    getLoc();
  }, []);
  return (
    <>
      <UserNavigation />
      <main className="user__main">
        <h2 className="user__location">
          Current Location:{" "}
          {fetching ? "Loading..." : data?.updateLocation.location?.city}
        </h2>
      </main>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(User);
