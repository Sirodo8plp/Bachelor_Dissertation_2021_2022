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
  locations?: Maybe<Array<Location>>;
  message?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createNewPostcard?: Maybe<Postcard>;
  deleteAllPhotographs: Scalars['String'];
  deleteUser: UserReturnType;
  login: UserReturnType;
  logout: Scalars['Boolean'];
  register: UserReturnType;
  removeLocation: LocationReturnType;
  removePhotograph: Scalars['String'];
  removePostcardByID: Scalars['String'];
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


export type MutationRemovePostcardByIdArgs = {
  pcID: Scalars['Float'];
};


export type MutationUploadImagesArgs = {
  inputs: UploadInputs;
};

export type Photograph = {
  __typename?: 'Photograph';
  id: Scalars['Float'];
  imageLink: Scalars['String'];
  location: Location;
  postcards: Array<Postcard>;
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
  images?: Maybe<Array<Photograph>>;
  message?: Maybe<Scalars['String']>;
  photograph?: Maybe<Photograph>;
};

export type Postcard = {
  __typename?: 'Postcard';
  description: Scalars['String'];
  id: Scalars['Float'];
  location: Location;
  photographs: Array<Photograph>;
  specialID: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  findPostcardById?: Maybe<Postcard>;
  getLocationById: LocationReturnType;
  getPhotographs: Array<Photograph>;
  getPostcards?: Maybe<Array<Postcard>>;
  getUserPhotographs?: Maybe<PhotographReturnType>;
  locations: GetLocationData;
  me?: Maybe<User>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryFindPostcardByIdArgs = {
  id: Scalars['String'];
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

export type GetLocationData = {
  __typename?: 'getLocationData';
  error?: Maybe<Scalars['String']>;
  locations?: Maybe<Array<Location>>;
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


export type CreatePostcardMutation = { __typename?: 'Mutation', createNewPostcard?: { __typename?: 'Postcard', id: number, description: string } | null | undefined };

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

export type RemovePostcardMutationVariables = Exact<{
  pcId: Scalars['Float'];
}>;


export type RemovePostcardMutation = { __typename?: 'Mutation', removePostcardByID: string };

export type UpdateLocationMutationVariables = Exact<{ [key: string]: never; }>;


export type UpdateLocationMutation = { __typename?: 'Mutation', updateLocation: { __typename?: 'LocationReturnType', message?: string | null | undefined, error?: { __typename?: 'LocationError', message: string, type: string } | null | undefined, location?: { __typename?: 'Location', region: string, city: string } | null | undefined } };

export type UploadImagesMutationVariables = Exact<{
  inputs: UploadInputs;
}>;


export type UploadImagesMutation = { __typename?: 'Mutation', uploadImages: { __typename?: 'PhotographReturnType', message?: string | null | undefined, images?: Array<{ __typename?: 'Photograph', imageLink: string, id: number, location: { __typename?: 'Location', city: string, region: string } }> | null | undefined } };

export type GetLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocationsQuery = { __typename?: 'Query', locations: { __typename?: 'getLocationData', error?: string | null | undefined, locations?: Array<{ __typename?: 'Location', city: string, region: string, id: number, photographs: Array<{ __typename?: 'Photograph', id: number }> }> | null | undefined } };

export type FindPostcardByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type FindPostcardByIdQuery = { __typename?: 'Query', findPostcardById?: { __typename?: 'Postcard', id: number, description: string, location: { __typename?: 'Location', city: string, region: string }, photographs: Array<{ __typename?: 'Photograph', id: number, imageLink: string }> } | null | undefined };

export type LoadPostcardQueryVariables = Exact<{ [key: string]: never; }>;


export type LoadPostcardQuery = { __typename?: 'Query', getPostcards?: Array<{ __typename?: 'Postcard', description: string, specialID: string, id: number }> | null | undefined };

export type GetUserPhotographsInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserPhotographsInformationQuery = { __typename?: 'Query', getUserPhotographs?: { __typename?: 'PhotographReturnType', images?: Array<{ __typename?: 'Photograph', id: number, imageLink: string, location: { __typename?: 'Location', id: number, city: string, region: string } }> | null | undefined } | null | undefined };

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
    id
    description
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
export const RemovePostcardDocument = gql`
    mutation RemovePostcard($pcId: Float!) {
  removePostcardByID(pcID: $pcId)
}
    `;

export function useRemovePostcardMutation() {
  return Urql.useMutation<RemovePostcardMutation, RemovePostcardMutationVariables>(RemovePostcardDocument);
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
    images {
      imageLink
      id
      location {
        city
        region
      }
    }
  }
}
    `;

export function useUploadImagesMutation() {
  return Urql.useMutation<UploadImagesMutation, UploadImagesMutationVariables>(UploadImagesDocument);
};
export const GetLocationsDocument = gql`
    query getLocations {
  locations {
    error
    locations {
      city
      region
      id
      photographs {
        id
      }
    }
  }
}
    `;

export function useGetLocationsQuery(options: Omit<Urql.UseQueryArgs<GetLocationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetLocationsQuery>({ query: GetLocationsDocument, ...options });
};
export const FindPostcardByIdDocument = gql`
    query findPostcardByID($id: String!) {
  findPostcardById(id: $id) {
    id
    description
    location {
      city
      region
    }
    photographs {
      id
      imageLink
    }
  }
}
    `;

export function useFindPostcardByIdQuery(options: Omit<Urql.UseQueryArgs<FindPostcardByIdQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FindPostcardByIdQuery>({ query: FindPostcardByIdDocument, ...options });
};
export const LoadPostcardDocument = gql`
    query LoadPostcard {
  getPostcards {
    description
    specialID
    id
  }
}
    `;

export function useLoadPostcardQuery(options: Omit<Urql.UseQueryArgs<LoadPostcardQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<LoadPostcardQuery>({ query: LoadPostcardDocument, ...options });
};
export const GetUserPhotographsInformationDocument = gql`
    query getUserPhotographsInformation {
  getUserPhotographs {
    images {
      id
      imageLink
      location {
        id
        city
        region
      }
    }
  }
}
    `;

export function useGetUserPhotographsInformationQuery(options: Omit<Urql.UseQueryArgs<GetUserPhotographsInformationQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetUserPhotographsInformationQuery>({ query: GetUserPhotographsInformationDocument, ...options });
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