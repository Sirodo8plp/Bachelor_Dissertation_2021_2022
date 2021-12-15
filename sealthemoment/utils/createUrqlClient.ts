import { cacheExchange, query } from "@urql/exchange-graphcache";
import { dedupExchange } from "urql";
import { multipartFetchExchange } from "@urql/exchange-multipart-fetch";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  CreatePostcardMutation,
  LoadPostcardQuery,
  LoadPostcardDocument,
  UploadImagesMutation,
  GetUserPhotographsInformationQuery,
  GetUserPhotographsInformationDocument,
} from "../generated/graphql";

import { betterUpdateQuery } from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
          createNewPostcard: (_result, args, cache, info) => {
            betterUpdateQuery<CreatePostcardMutation, LoadPostcardQuery>(
              cache,
              { query: LoadPostcardDocument },
              _result,
              (result, query) => {
                if (!result.createNewPostcard) {
                  return query;
                }
                return {
                  getPostcards: new Array().concat({
                    description: result.createNewPostcard?.description,
                    id: result.createNewPostcard?.id,
                  }),
                };
              }
            );
          },
          uploadImages: (_result, args, cache, info) => {
            console.log("test");
            betterUpdateQuery<
              UploadImagesMutation,
              GetUserPhotographsInformationQuery
            >(
              cache,
              { query: GetUserPhotographsInformationDocument },
              _result,
              (result, query) => {
                if (result.uploadImages.message) {
                  return query;
                }
                console.log(result.uploadImages.images);
                return {
                  getUserPhotographs: {
                    images: new Array().concat(result.uploadImages.images),
                  },
                };
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    multipartFetchExchange,
  ],
});
