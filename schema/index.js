import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';

// Define your types here.
const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!,
    gender: String
  }

  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    createUser(email: String!, name: String!, password: String!, gender: String): User
  }
`;

// Generate the schema object from your types definition.
export default makeExecutableSchema({typeDefs, resolvers});
