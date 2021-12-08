import React from "react";
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();
  const { pcID } = router.query;

  return;
};

export default Post;
