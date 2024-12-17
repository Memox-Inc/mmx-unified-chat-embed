// rollup.config.js
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Read package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));

export default {
  input: './components/chat/chat-widget/ChatWidget.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [
    peerDepsExternal(),

    replace({
      preventAssignment: true,
      include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      delimiters: ['', ''],
      values: {
        "'use client';": '',
        '"use client";': '',
        "'use client'": '',
        '"use client"': '',
        'use client;': '',
        'use client': '',
      },
    }),

    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname) }, // Changed to root directory
      ],
    }),
    typescript({
      tsconfig: 'tsconfig.build.json',
      useTsconfigDeclarationDir: true,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
    }),
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      browser: true,
    }),
    commonjs(),
    postcss(),
  ],
  external: ['react', 'react-dom'],
};
