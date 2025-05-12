import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: './public/index.js',
  output: {
    file: "dist/web.js",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    babel({
      presets: ["@babel/preset-env"],
    }),
    terser(),
  ],
};
