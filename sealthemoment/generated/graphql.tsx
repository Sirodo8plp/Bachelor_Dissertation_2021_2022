import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type DbError = {
  __typename?: 'DbError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Location = {
  __typename?: 'Location';
  city: Scalars['String'];
  id: Scalars['Float'];
  photographs: Array<Photograph>;
  region: Scalars['String'];
  users: Array<User>;
};

export type LocationError = {
  __typename?: 'LocationError';
  message: Scalars['String'];
  type: Scalars['String'];
};

export type LocationReturnType = {
  __typename?: 'LocationReturnType';
  error?: Maybe<LocationError>;
  location?: Maybe<Location>;
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNewPostcard: PostcardReturnType;
  deleteAllPhotographs: Scalars['String'];
  deleteUser: UserReturnType;
  login: UserReturnType;
  logout: Scalars['Boolean'];
  register: UserReturnType;
  removeLocation: LocationReturnType;
  removePhotograph: Scalars['String'];
  updateLocation: LocationReturnType;
  uploadImages: PhotographReturnType;
};


export type MutationCreateNewPostcardArgs = {
  inputs: PostcardInputs;
};


export type MutationDeleteUserArgs = {
  userID: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  inputs: UserDataInput;
};


export type MutationRemoveLocationArgs = {
  id: Scalars['Float'];
};


export type MutationRemovePhotographArgs = {
  id: Scalars['Float'];
};


export type MutationUploadImagesArgs = {
  inputs: UploadInputs;
};

export type Photograph = {
  __typename?: 'Photograph';
  id: Scalars['Float'];
  imageLink: Scalars['String'];
  location: Location;
  postcard: Postcard;
  tokenURI: Scalars['Float'];
  user: User;
};

export type PhotographError = {
  __typename?: 'PhotographError';
  message: Scalars['String'];
  type: Scalars['String'];
};

export type PhotographReturnType = {
  __typename?: 'PhotographReturnType';
  error?: Maybe<PhotographError>;
  message: Scalars['String'];
  photograph?: Maybe<Photograph>;
};

export type Postcard = {
  __typename?: 'Postcard';
  description: Scalars['String'];
  id: Scalars['Float'];
  location: Location;
  photographs: Array<Photograph>;
  user: User;
};

export type PostcardReturnType = {
  __typename?: 'PostcardReturnType';
  error: Scalars['String'];
  message: Scalars['String'];
  postcard: Postcard;
};

export type Query = {
  __typename?: 'Query';
  findPostcardById?: Maybe<Postcard>;
  getLocationById: LocationReturnType;
  getPhotographs: Array<Photograph>;
  getPostcards?: Maybe<User>;
  getUserPhotographs?: Maybe<Array<Photograph>>;
  locations: Array<Location>;
  me?: Maybe<User>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryGetLocationByIdArgs = {
  id: Scalars['Float'];
};


export type QueryUserArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['Float'];
  lastName: Scalars['String'];
  locations: Array<Location>;
  password: Scalars['String'];
  photographs: Array<Photograph>;
  postcards: Array<Postcard>;
  username: Scalars['String'];
};

export type UserDataInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserReturnType = {
  __typename?: 'UserReturnType';
  errors?: Maybe<Array<DbError>>;
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type PostcardInputs = {
  description: Scalars['String'];
  imageLinks: Array<Scalars['String']>;
};

export type UploadInputs = {
  ipfsLinks: Array<Scalars['String']>;
  tokenURIs: Array<Scalars['Int']>;
};

export type NewLocationFragment = { __typename?: 'Location', region: string, city: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, email: string, firstName: string, lastName: string, password: string };

export type CreatePostcardMutationVariables = Exact<{
  inputs: PostcardInputs;
}>;


export type CreatePostcardMutation = { __typename?: 'Mutation', createNewPostcard: { __typename?: 'PostcardReturnType', message: string } };

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserReturnType', errors?: Array<{ __typename?: 'DbError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, email: string, firstName: string, lastName: string, password: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserReturnType', errors?: Array<{ __typename?: 'DbError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, email: string, firstName: string, lastName: string, password: string } | null | undefined } };

export type UpdateLocationMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation: { __typename?: 'LocationReturnType', message?: string | null | undefined, error?: { __typename?: 'LocationError', message: string, type: string } | null | undefined, location?: { __typename?: 'Location', region: string, city: string } | null | undefined } };

export type UploadImagesMutationVariables = Exact<{
  inputs: UploadInputs;
}>;


export type UploadImagesMutation = { __typename?: 'Mutation', uploadImages: { __typename?: 'PhotographReturnType', message: string } };

export type LoadPostcardQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadPostcardQuery = { __typename?: 'Query', getPostcards?: { __typename?: 'User', postcards: Array<{ __typename?: 'Postcard', id: number, description: string, photographs: Array<{ __typename?: 'Photograph', id: number, imageLink: string, tokenURI: number }> }> } | null | undefined };

export type GetUserPhotographsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserPhotographsQuery = { __typename?: 'Query', getUserPhotographs?: Array<{ __typename?: 'Photograph', imageLink: string }> | null | undefined };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string, firstName: string, lastName: string, password: string } | null | undefined };

export const NewLocationFragmentDoc = gql`
    fragment newLocation on Location {
  region
  city
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  firstName
  lastName
  password
}
    `;
export const CreatePostcardDocument = gql`
    mutation createPostcard($inputs: postcardInputs!) {
  createNewPostcard(inputs: $inputs) {
    message
  }
}
    `;

export function useCreatePostcardMutation() {
  return Urql.useMutation<CreatePostcardMutation, CreatePostcardMutationVariables>(CreatePostcardDocument);
};
export const LoginDocument = gql`
    mutation Login($password: String!, $username: String!) {
  login(password: $password, username: $username) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!, $firstName: String!, $lastName: String!, $email: String!) {
  register(
    inputs: {username: $username, password: $password, firstName: $firstName, lastName: $lastName, email: $email}
  ) {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateLocationDocument = gql`
    mutation updateLocation {
  updateLocation {
    error {
      message
      type
    }
    location {
      ...newLocation
    }
    message
  }
}
    ${NewLocationFragmentDoc}`;

export function useUpdateLocationMutation() {
  return Urql.useMutation<UpdateLocationMutation, UpdateLocationMutationVariables>(UpdateLocationDocument);
};
export const UploadImagesDocument = gql`
    mutation uploadImages($inputs: uploadInputs!) {
  uploadImages(inputs: $inputs) {
    message
  }
}
    `;

export function useUploadImagesMutation() {
  return Urql.useMutation<UploadImagesMutation, UploadImagesMutationVariables>(UploadImagesDocument);
};
export const LoadPostcardDocument = gql`
    query LoadPostcard {
  getPostcards {
    postcards {
      id
      description
      photographs {
        id
        imageLink
        tokenURI
      }
    }
  }
}
    `;

export function useLoadPostcardQuery(options: Omit<Urql.UseQueryArgs<LoadPostcardQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoadPostcardQuery>({ query: LoadPostcardDocument, ...options });
};
export const GetUserPhotographsDocument = gql`
    query getUserPhotographs {
  getUserPhotographs {
    imageLink
  }
}
    `;

export function useGetUserPhotographsQuery(options: Omit<Urql.UseQueryArgs<GetUserPhotographsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserPhotographsQuery>({ query: GetUserPhotographsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};