const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 알라딘 API 프록시
  app.use(
    '/ttb',
    createProxyMiddleware({
      target: 'https://www.aladin.co.kr',
      changeOrigin: true,
    })
  );

  // 네이버 음성 합성(TTS) API 프록시
  app.use(
    '/tts-premium',
    createProxyMiddleware({
      target: 'https://naveropenapi.apigw.ntruss.com',
      changeOrigin: true,
      pathRewrite: {
        '^/tts-premium': '/tts-premium', // 경로 재작성
      },
    })
  );

  // 네이버 파파고 번역 API 프록시
  app.use(
    '/v1/papago/n2mt',
    createProxyMiddleware({
      target: 'https://openapi.naver.com',
      changeOrigin: true,
      pathRewrite: {
        '^/v1/papago/n2mt': '/v1/papago/n2mt', // 경로 재작성
      }
    })
  );
};