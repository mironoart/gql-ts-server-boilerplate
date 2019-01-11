import { GraphQLServer } from "graphql-yoga";
import { redis } from "./redis";

import { createTypeormConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/genSchema";

export const startServer = async () => {
  // also can do instead of const typeDefs = importSchema... -- GraphQLServer({ typeDefs: 'src/schema.graphql'....
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host") // getting url so we can pass it to the resolvers
    })
  });

  server.express.get("/confirm/:id", confirmEmail);

  await createTypeormConn();
  const app = await server.start({
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");
  return app;
};
