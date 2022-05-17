var HttpsProxyAgent = require('https-proxy-agent');
const proxyConfig = [
  {
    context: ['/api'],
    // target: 'http://localhost:8080',
    target: 'https://guided-quoting-d.dev.dp.schaeffler', // using dev env,
    secure: false,
    changeOrigin: true,
  },
];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function (entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
