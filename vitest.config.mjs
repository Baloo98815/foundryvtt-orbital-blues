import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./tests/mocks/foundry.mjs'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['module/**/*.mjs'],
      reporter: ['text', 'html']
    }
  }
});
