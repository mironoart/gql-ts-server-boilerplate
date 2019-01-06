import "reflect-metadata";
import { importSchema } from "graphql-import";
import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";

const typeDefs = importSchema("schema.graphql");
// also can do instead of const typeDefs = importSchema... -- GraphQLServer({ typeDefs: 'src/schema.graphql'....
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running on localhost:4000"));
