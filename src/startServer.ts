import "reflect-metadata";
import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

import { redis } from "./redis";
import { createTypeormConn } from "./utils/createTypeormConn";
import { confirmEmail } from "./routes/confirmEmail";
import { genSchema } from "./utils/genSchema";

const SESSION_SECRET = "session_secret";
const RedisStore = connectRedis(session);

export const startServer = async () => {
  // also can do instead of const typeDefs = importSchema... -- GraphQLServer({ typeDefs: 'src/schema.graphql'....
  const server = new GraphQLServer({
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host"), // getting url so we can pass it to the resolvers
      session: request.session
    })
  });

  server.express.use(
    session({
      store: new RedisStore({}),
      name: "qid",
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      }
    })
  );
  const cors = {
    credentials: true,
    origin:
      process.env.NODE_ENV === "test"
        ? "*"
        : (process.env.FRONTEND_HOST as string)
  };
  server.express.get("/confirm/:id", confirmEmail);

  await createTypeormConn();
  const app = await server.start({
    cors,
    port: process.env.NODE_ENV === "test" ? 0 : 4000
  });
  console.log("Server is running on localhost:4000");
  return app;
};
