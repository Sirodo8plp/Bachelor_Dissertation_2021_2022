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

export type Mutation = {
  __typename?: 'Mutation';
  login: UserReturnType;
  register: UserReturnType;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  inputs: UserDataInput;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryUserArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  userID: Scalars['Float'];
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
  user?: Maybe<User>;
};

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserReturnType', errors?: Array<{ __typename?: 'DbError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', userID: number, username: string, password: string, firstName: string, lastName: string, email: string } | null | undefined } };


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
      userID
      username
      password
      firstName
      lastName
      email
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};