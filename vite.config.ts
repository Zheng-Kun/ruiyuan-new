import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import { ConfigEnv, loadEnv, UserConfig } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_API_URL_PREFIX } = loadEnv(mode, CWD);
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
        enable: true,
      }),
      svgLoader(),
      AutoImport({
        imports: [
          'vue', // 自动导入 ref, reactive, computed, defineProps, defineEmits 等
        ],
        dts: 'src/auto-imports.d.ts', // 自动生成类型声明文件
        eslintrc: {
          enabled: true, // 自动生成 eslint 配置
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),
      visualizer({ open: true, gzipSize: true, brotliSize: true }),
    ],

    server: {
      port: 30002,
      host: '0.0.0.0',
      proxy: {
        [VITE_API_URL_PREFIX]: {
          // target: 'http://192.168.120.167:10000/',
          target: 'http://101.132.189.0:10000/',
          rewrite(path) {
            return path.replace(new RegExp(`^${VITE_API_URL_PREFIX}`), '');
          },
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 1500, // 警告阈值
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 更精确的匹配，避免空 chunk
              if (id.includes('vue') && !id.includes('vue-element-plus-x') && !id.includes('vue-router')) {
                return 'vue';
              }

              // TDesign
              if (id.includes('tdesign-vue-next')) return 'tdesign-vue-next';

              // ECharts - 更精确的匹配
              if (id.includes('/echarts/') || id.includes('echarts/lib')) return 'echarts';

              // Cytoscape（精确匹配）
              if (id.includes('/cytoscape/') || id.includes('cytoscape')) return 'cytoscape';

              // vue-element-plus-x（最后匹配，避免被 vue 匹配到）
              if (id.includes('vue-element-plus-x')) {
                return 'vue-element-plus-x';
              }

              // 进一步细分 vendor 包
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('axios')) return 'axios';
              if (id.includes('dayjs') || id.includes('moment')) return 'date-utils';
              if (id.includes('pinia') || id.includes('vuex')) return 'state-management';
              if (id.includes('vue-router')) return 'vue-router';
              if (id.includes('@vue/')) return 'vue-runtime';

              // 工具类库
              if (id.includes('core-js') || id.includes('tslib')) return 'polyfills';

              // UI 相关（除了已经单独分离的）
              if (id.includes('element-plus') && !id.includes('vue-element-plus-x')) return 'ui-components';

              return 'vendor';
            }
            return undefined;
          },
        },
      },
    },
  };
};
