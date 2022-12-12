// 1. Set up root '/api' route.
// 2. Add the api-'/api' route to the main honojs app.

import { Hono } from "hono";
import { tweets } from "./tweets";

export const api = new Hono();
api.route("/tweets", tweets);

api.get("/", (c) => {
  return c.text("api-root!");
});
