import { defineConfig } from 'vitest/config'
import react from "@vitejs/plugin-react";
import typescript from '@rollup/plugin-typescript';


// noinspection JSUnusedGlobalSymbols
export default defineConfig((opt) => {  
  return {
    plugins: [react(), typescript({tsconfig: opt.mode === "test"? "./test/tsconfig.json" : "./tsconfig.json" })],
    test: {
      environmentMatchGlobs: [
        ['test/api/**\/*.{test,spec}.{ts,tsx}', 'jsdom'],
        ['test/server/**\/*.{test,spec}.{ts,tsx}', 'node'],
        ['test/benchmark/**\/*.bench.tsx', 'jsdom'],
      ],
      globals: true,
      setupFiles: "./test/vitest.setup.ts",
      logHeapUsage: true,
      unstubGlobals: true,
      clearMocks: true,
      snapshotFormat: {
        printBasicPrototype: true,
        escapeString: false,
        printFunctionName: true,
      },
  
    },
    
    build: {
      minify: true,
      lib: {
        // Could also be a dictionary or array of multiple entry points
        entry: 'src/index.tsx',
        name: 'react-helmet-async1',
        // the proper extensions will be added
        fileName: 'index',
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom/server'],
        output: {

          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: 'react',
            "react-dom": 'reactDom',
            'react/jsx-runtime': "reactJsxRuntime",
            'react/jsx-dev-runtime': "reactJsxDevRuntime",
            'react-dom/server': "reactDomServer",
          },
        },
      },
    },
  }
});