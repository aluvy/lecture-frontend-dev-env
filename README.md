# lecture-frontend-dev-env

## Environment

```shell
* window, max OS
* node v20.11.0
* npm 10.2.4
* webpack ^5.1.4
```

## NODE_ENV

* window에서 NODE_ENV 환경변수를 사용하기 위해서는 win-node-env 패키지를 설치해야 한다.
```shell
$ npm i win-node-env
```

## mockup API

#### webpack.config.js

```javascript
module.exports = {
  devServer: {
    client: {
      overlay: true,
      progress: true,
      reconnect: false,
      logging: "error",
    },
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/",
    },
    hot: true,
    // before: app => {
    //   res.get("/api/users/", (req, res) => {
    //     res.json([
    //       { id: 1, name: "Alice" },
    //       { id: 2, name: "Bek" },
    //       { id: 3, name: "Chris" },
    //     ])
    //   }
    // }
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/setup-middleware/some/path', (_, response) => {
        response.send('setup-middlewares option GET');
      });

      // Use the `unshift` method if you want to run a middleware before all other middlewares
      // or when you are migrating from the `onBeforeSetupMiddleware` option
      middlewares.unshift({
        name: 'fist-in-array',
        // `path` is optional
        path: '/foo/path',
        middleware: (req, res) => {
          res.send('Foo!');
        },
      });

      // Use the `push` method if you want to run a middleware after all other middlewares
      // or when you are migrating from the `onAfterSetupMiddleware` option
      middlewares.push({
        name: 'hello-world-test-one',
        // `path` is optional
        path: '/foo/bar',
        middleware: (req, res) => {
          res.send('Foo Bar!');
        },
      });

      middlewares.push((req, res) => {
        res.send('Hello World!');
      });

      return middlewares;
    },
  }
}
```

```shell
curl http://localhost:8080/api/users
```

#### src/app.js

```javascript
import axios from 'axios';

document.addEventListener('DOMContentLoaded', async ()=>{
  const res = await axios.get('/api/users');
  console.log(res);

  document.body.innerHTML = (res.data || []).map(user => {
    return `<div>${user.id}: ${user.name}</div>`;
  }).join('');
})
```

## connect-api-mocker

#### install

```shell
$ npm i connect-api-mocker
```

#### /mocks/api/users/GET.json

``` javascript
[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bek" },
  { "id": 3, "name": "Chris" },
  { "id": 4, "name": "Daniel" },
]
```

#### webpack.config.js

```javascript
const apiMocker = require("connect-api-mocker");

module.exports = {
  devServer: {
    client: {
      overlay: true,
      progress: true,
      reconnect: false,
      logging: "error",
    },
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/",
    },
    hot: true,
    stats: 'errors-only',
    // before: app => {
    //   app.use(apiMocker("/api", "mocks/api"));
    // }
  },
}
```
