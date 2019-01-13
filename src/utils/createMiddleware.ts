import { GraphQLMiddlewareFunc, Resolver } from "../types/graphql-utils";

export const createMiddleware = (
  middlewarefunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) =>
  middlewarefunc(resolverFunc, parent, args, context, info);
