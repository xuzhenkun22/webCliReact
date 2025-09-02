/**
 * @name 代理的配置
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://127.0.0.1:4222',
      changeOrigin: true,
      pathRewrite: { '^/api/': '/api/v1/' },
    },
  },
};
