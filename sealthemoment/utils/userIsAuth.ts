import { ME_QUERY } from "../graphql/queries";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";

export const useIsAuth = () => {
  const { data, loading } = useQuery(ME_QUERY);
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/login");
    }
  }, [loading, data, router]);
};
