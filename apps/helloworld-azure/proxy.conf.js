const PROXY_CONFIG = [
  {
    context: [],
    target: 'https://hello-world.dp.schaeffler',
    changeOrigin: true,
    secure: false,
  },
  {
    context: ['/api/func-hello'],
    target: 'http://localhost:7071',
    secure: false,
  },
  {
    context: ['/public/api', '/api', '/admin'],
    target: 'http://localhost:8080',
    secure: false,
  },
  {
    context: ['/dotnet'],
    target: 'http://localhost:5000',
    secure: false,
  },
];

module.exports = PROXY_CONFIG;
