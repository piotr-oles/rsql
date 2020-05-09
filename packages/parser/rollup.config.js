import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "lib/index.js",
    output: {
      name: "RSQLParser",
      file: pkg.browser,
      format: "umd",
    },
    plugins: [resolve(), commonjs()],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "lib/index.js",
    external: Object.keys(pkg.dependencies),
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
  },
];
