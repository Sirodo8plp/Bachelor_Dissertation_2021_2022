import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useIsAuth } from "../../utils/userIsAuth";

const User: React.FC<{}> = () => {
  useIsAuth();
  return <div>hello</div>;
};

export default withUrqlClient(createUrqlClient)(User);
