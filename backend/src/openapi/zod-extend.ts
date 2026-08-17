import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Side-effect import: patches zod's prototype with `.openapi()`. Must run
// before any schema file calls `.openapi()`, which is why every schema
// file imports this first.
extendZodWithOpenApi(z);
