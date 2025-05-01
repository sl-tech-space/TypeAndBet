import { gql } from "@apollo/client";

export const USER_ALL_FIELDS = gql`
  fragment UserAllFields on User {
    id
    name
    email
    password
    icon
    gold
    createdAt
    updatedAt
  }
`;

export const USER_BASIC_FIELDS = gql`
  fragment UserBasicFields on User {
    id
    name
    email
    icon
    gold
  }
`;
