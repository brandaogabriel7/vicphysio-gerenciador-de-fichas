/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  // Make Vite env vars available.
  // https://stackoverflow.com/a/66389044
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const isElectron = process.env.VITE_BUILD_TARGET === 'electron';

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      isElectron &&
        electron({
          main: {
            // Shortcut of `build.lib.entry`.
            entry: 'electron/main.ts',
            vite: {
              plugins: [
                {
                  name: 'sequelize-dialect-stub',
                  resolveId(id) {
                    // Stub out Sequelize's optional DB dependencies
                    // These are not needed since we only use SQLite
                    const optionalDeps = [
                      'pg',
                      'pg-hstore',
                      'mysql2',
                      'mariadb',
                      'tedious',
                      'oracledb',
                      'snowflake-sdk',
                      'ibm_db',
                    ];
                    if (optionalDeps.includes(id)) {
                      return id;
                    }
                    return null;
                  },
                  load(id) {
                    const optionalDeps = [
                      'pg',
                      'pg-hstore',
                      'mysql2',
                      'mariadb',
                      'tedious',
                      'oracledb',
                      'snowflake-sdk',
                      'ibm_db',
                    ];
                    if (optionalDeps.includes(id)) {
                      return 'export default {}';
                    }
                    return null;
                  },
                },
              ],
            },
          },
          preload: {
            // Shortcut of `build.rollupOptions.input`.
            // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
            input: path.join(__dirname, 'electron/preload.ts'),
          },
          // Ployfill the Electron and Node.js API for Renderer process.
          // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
          // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
          renderer:
            process.env.NODE_ENV === 'test'
              ? // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
                undefined
              : {},
        }),
    ],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test-setup.ts',
    },
  });
};
