import type { Options } from 'tsup';

// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

/**
 * Webpack unfortunately does not support the `node:` prefix making it impossible to polyfill the
 * `node:stream` and `node:util` libraries that we use here so we're removing it when we generate
 * our dists.
 *
 * @see {@link https://github.com/evanw/esbuild/issues/1760#issuecomment-964900401}
 * @see {@link https://github.com/webpack/webpack/issues/14166}
 */
const stripNodeColonPlugin = {
  name: 'strip-node-colon',
  setup({ onResolve }) {
    onResolve({ filter: /^node:/ }, args => {
      return {
        path: args.path.slice('node:'.length),
        external: true,
      };
    });
  },
};

export default defineConfig((options: Options) => ({
  ...options,

  cjsInterop: true,
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  esbuildPlugins: [stripNodeColonPlugin],
  format: ['esm', 'cjs'],
  minify: false,
  shims: true,
  silent: !options.watch,
  sourcemap: true,
  splitting: true,
}));
