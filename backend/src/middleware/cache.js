const NodeCache = require('node-cache');

const caches = {
  short: new NodeCache({ stdTTL: 30 }),
  medium: new NodeCache({ stdTTL: 120 }),
  long: new NodeCache({ stdTTL: 300 }),
  extraLong: new NodeCache({ stdTTL: 900 })
};

const cacheMiddleware = (duration) => {
  const store = caches[duration] || caches.short;

  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = store.get(key);

    if (cached) {
      return res.json(cached);
    }

    res.originalJson = res.json;
    res.json = (body) => {
      store.set(key, body);
      res.originalJson(body);
    };

    next();
  };
};

module.exports = cacheMiddleware;