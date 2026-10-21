const { Router } = require('express');

const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.json({ data: { status: 'ok', service: 'grace-api' } });
});

module.exports = { healthRouter };

