const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:8080',
    // target: 'https://guided-quoting-d.dev.dp.schaeffler', // using dev env,
    secure: false,
    changeOrigin: true,
  },
];

module.exports = PROXY_CONFIG;
