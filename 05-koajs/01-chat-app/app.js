const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

const subscriber = (id) => {
  return new Promise((resolve, reject) => {
    const client = {};
    client.id = id;
    client.onComplete = (data) => {
      resolve(data);
    };
    client.onError = () => {
      reject();
    };
    subscribers.push(client);
  });
};

router.get('/subscribe', async (ctx, next) => {
  const {request} = ctx;
  const clientId = request.query.r;

  ctx.body = await subscriber(clientId);
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    subscribers.forEach((client) => {
      client.onComplete(ctx.request.body.message);

      ctx.body = {
        code: 0,
        message: 'success',
      };
    });

    subscribers = [];
  } else {
    ctx.body = {
      code: -1,
      message: 'no message',
    };
  }
});

app.use(router.routes());

module.exports = app;
