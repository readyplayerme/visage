import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

export default [
  {
    input: 'src/library.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: [
          '**/__tests__',
          '**/__snapshots__',
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.stories.tsx',
          '**/setupTests.ts',
          'src/App/*',
          'src/index.tsx'
        ]
      }),
      resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'] }),
      postcss()
    ]
  }
];