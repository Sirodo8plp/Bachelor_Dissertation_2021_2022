import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    console.log(data);
    if (!fetching && !data?.me) {
      router.push("/login");
    }
  }, [fetching, data, router]);
};
