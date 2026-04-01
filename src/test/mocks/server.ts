import { setupServer } from "msw/node";

import { housesHandlers } from "./handlers";

export const server = setupServer(...housesHandlers);
