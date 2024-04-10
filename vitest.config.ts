import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ['./src/test/ast.test.ts'],
    exclude: ['./src/test/extension.test.ts'],
  },
});