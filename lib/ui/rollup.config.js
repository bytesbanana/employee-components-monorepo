import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';


export default defineConfig([
  // ESM build (import)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/employee-lib.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
        rootDir: './',
      }),
    ],
    external: [/^@?lit(-\w+)?($|\/.+)/],
  },
  // UMD build (required)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/employee-lib.umd.js',
      format: 'umd',
      name: 'EmployeeComponents',
      sourcemap: true,
      globals: {
        'lit': 'Lit',
      },
    },
    plugins: [
      resolve(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
      }),
      terser(),
    ],
    external: [/^@?lit(-\w+)?($|\/.+)/]
  },
]);