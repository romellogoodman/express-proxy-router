/* eslint no-console: 0 */
import express from 'express';
import proxy from '../index';

const server = express();
const port = 3005;

server.use(proxy({
  routes: [
    {
      path: '/test',
      proxy: {
        url: 'https://api.github.com/organizations',
        isXML: false,
        timeout: 10000
      },
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    },
    {
      path: '/test/github-orgs/:orgName',
      proxy: {
        url: 'https://api.github.com/orgs/<%= orgName %>',
        isXML: false,
        timeout: 10000
      },
      headers: {}
    },
    {
      path: '/test/sitemap/tech-crunch',
      proxy: {
        url: 'https://techcrunch.com/sitemap.xml',
        isXML: true,
        timeout: 10000
      },
      headers: {
        'content-type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    }
  ]
}));

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(port, () => {
  console.log(`Server for testing the proxy is listening on port ${port}!`);
});
