const Router = require('koa-router');
const router = new Router();
const { Listing, Valuation, User } = require('../db/models');
const spawn = require("child_process").spawn;

module.exports = router;

let attributes = ['id', 'name', 'description', 'category', 'condition', 'brand', 'status', 'sellerShips'];

router.get('/', async (ctx) => {
  let whereQ = {};
  if (ctx.query.condition) whereQ.condition = ctx.query.condition;
  if (ctx.query.status) whereQ.status = ctx.query.status;
  if (ctx.query.status) whereQ.id = ctx.query.id;
  ctx.body = await Listing.findAll({
    where:  whereQ,
    include: [{ model: Valuation, attributes: ['metaPrice', 'algoPrice', 'scraperPrice', 'soldPrice', 'createdAt']}, { model: User, attributes: ['email', 'firstName', 'lastName']}],
    attributes: attributes
  });
})

router.get('/:id', async (ctx) => {
  ctx.body = await Listing.findOne({
    where: {
      id: ctx.params.id
    },
    include: [{ model: Valuation, attributes: ['metaPrice', 'algoPrice', 'scraperPrice', 'soldPrice', 'createdAt']}, { model: User, attributes: ['email', 'firstName', 'lastName']}],
    attributes: attributes
  })
})

router.put('/:id', async (ctx) => {
  let listing = await Listing.findOne({
    where: {
      id: ctx.params.id
    },
    include: [{model: Valuation}]
  });
  listing = await listing.update(
    ctx.request.body
  )
  prices = await listing.getValuations()

  // we can then update our most recent price instance for this listing
  let price = await prices[prices.length-1].update({
    // these values are hard-coded now but should come from our algorithm/scraper
    algoPrice: 10,
    scraperPrice: 14
  })
  ctx.body = listing;
})

router.post('/', async (ctx) => {
  const pyProg = spawn('python', ['../../scripts/python/algo-price-calculator.py']);
  //pyProg.stdout.on('data', data => {
  //console.log(data);
    let price = await Valuation.create({
      algoPrice: 25,
      scraperPrice: 30
    });
    let listing = await Listing.findOrCreate({
      where: ctx.request.body
    });
    price = await price.setListing(listing[0]);
    listing = await Listing.findOrCreate({
      where: ctx.request.body,
      include: [{model: Valuation}]
    });
    ctx.body = listing;
  //});
})
