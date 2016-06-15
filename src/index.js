import _ from 'lodash';
import {Router} from 'express';
import http from 'superagent';

/**
 * Fetching the data at the endpoint.
 * @param {Object} url The url to hit.
 * @param {Object} proxyObj A proxy object for options.
 * @return {Promise} Returns a promise for data.
 */
function fetch (url, proxyObj) {
  const TIMEOUT_MS = 15000;

  return new Promise((resolve, reject) => {
    http
      .get(url)
      .timeout(proxyObj.timeout || TIMEOUT_MS)
      .end((err, res) => {
        if (err) {
          reject(new Error(typeof err === 'object' ? JSON.stringify(err) : err));
          return;
        }

        // IF xml return text ELSE return the json body
        const payload = proxyObj.isXML ? res.text : res.body;

        resolve(payload);
      });
  });
}

/**
 * Generates a function to handle the request & response.
 * @param {Object} routeInfo Info on the route to create the handler function.
 * @return {Funciton} Returns a function to handle the request & response from express.
 */
function handleRoute (routeInfo) {
  return (req, res) => {
    // Template the proxy url using the parameters in the request
    const templatedString = _.template(routeInfo.proxy.url);
    const requestUrl = templatedString(req.params);

    fetch(requestUrl, routeInfo.proxy)
      .then(data => {
        // Set the headers for the response
        _.forEach(routeInfo.headers, (value, key) => {
          res.setHeader(key, value);
        });

        res.send(data);
      })
      .catch(err => {
        res.send({
          message: 'There was an error with the proxy router.',
          error: typeof err === 'object' ? JSON.stringify(err) : err
        });
      });
  };
}

export default options => {
  const proxyRouter = Router({strict: true});
  const {routes} = options;

  // Create a router get for each route
  routes.map(route => {
    proxyRouter.get(route.path, handleRoute(route));
  });

  return proxyRouter;
};
