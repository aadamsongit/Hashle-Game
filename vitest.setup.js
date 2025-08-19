// vitest.setup.js
import { beforeAll } from "vitest";

beforeAll(() => {
  global.ImageBitmap = class {}; // simple mock
  global.createImageBitmap = () => Promise.resolve(new ImageBitmap());
});
