import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
export default defineConfig([
  {
    input: 'src/index.ts',
    output: { file: 'lib/index.d.ts', format: 'esm' },
    plugins: [dts()],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: `lib/index.js`,
        format: 'cjs',
        exports: 'named',
      },
      {
        file: `lib/index.mjs`,
        format: 'esm',
      },
    ],
    onwarn(warning, warn) {
      if (
        warning.code &&
        ['MIXED_EXPORTS', 'PREFER_NAMED_EXPORTS'].includes(warning.code)
      )
        return;
      warn(warning);
    },
    plugins: [
      typescript({
        incremental: true,
        outputToFilesystem: false,
      }),
    ],
  },
]);
