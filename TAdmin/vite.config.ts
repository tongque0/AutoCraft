import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_ENABLE_MOCK } = loadEnv(mode, CWD);
  const enableMock = VITE_ENABLE_MOCK === 'true';
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({
        mockPath: 'mock',
        enable: enableMock,
      }),
      svgLoader(),
    ],

    server: {
      port: 3003,
      host: '0.0.0.0',
    },
  };
};
