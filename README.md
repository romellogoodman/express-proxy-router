# express-proxy-router
A router to proxy api requests (json/xml) through.

## Usage (see src/example for another)

```javascript
import express from 'express';
import proxy from '../index';

const server = express();

// Serves the result of api.test.com at the /test route
server.use(proxy({
  routes: [
    {
      path: '/test',
      proxy: {
        url: 'http://api.test.com',
        isXML: false
      }
    }
  ]
}));

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.listen(3000, () => {
  console.log('Server for testing the proxy is listening on port 3000!');
});
```

## Proxy Options

| Options | Description                         | Default | Type   |
|:--------|:------------------------------------|:--------|:-------|
| routes  | An array of the routes to proxy for | -       | Object |

## Proxy Routes Options

| Proxy Routes   | Description                                                              | Default | Type    |
|:---------------|:-------------------------------------------------------------------------|:--------|:--------|
| path           | The express path to route for                                            | -       | String  |
| proxy          | Info on the proxy                                                        | null    | Object  |
| -proxy.url     | The url to get data for the proxy                                        | null    | String  |
| -proxy.isXML   | Is the data xml                                                          | false   | Boolean |
| -proxy.timeout | The request timeout for server calls (ms)                                | 15000   | Number  |
| headers        | Options for the response header (same that express' res.setHeader takes) | -       | Object  |


### A note on path and proxy.url
We are using [lodash.template](https://lodash.com/docs#template) to pass in the req params into the route. To capitalize on this write the path and proxy.url as so:

```javascript
{
  path: '/test/:testParam',
  proxy: {
    url: 'https://api.test.com/<%= testParam %>'
  }
```
