const cors = require('cors');

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET'],
  optionsSuccessStatus: 200
});

module.exports = corsMiddleware;