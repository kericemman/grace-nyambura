const { getOverview } = require('../services/adminOverview.service');

async function overview(_request, response, next) {
  try {
    return response.json({ data: await getOverview() });
  } catch (error) {
    return next(error);
  }
}

module.exports = { overview };
