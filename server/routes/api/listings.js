const Router = require('koa-router');
const router = new Router();
const path = require('path')
const { spawn } = require('child_process');
const { Listing, Valuation, User } = require('../../db/models');
const { amazonPrice, craigslistPrice  } = require('../../scraper');

module.exports = router;

let attributes = ['id', 'name', 'description', 'category', 'condition', 'brand', 'status', 'sellerShips'];

let runPy = new Promise((resolve, reject) => {
  console.log("runPy initializing");
  const pyprog = spawn(
    'python',
    [path.resolve('scripts/python/algo-price-calculator.py')]
  );
  pyprog.stdout.on('data', (data) => {
    resolve(data);
  });
  pyprog.stderr.on('data', (data) => {
    reject(data);
  });
});


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

router.post('/', async (ctx) => {
  let user = await User.findById(Number(ctx.request.body.userId));
  let userListings = await user.getListings();
  let listingInfo = ctx.request.body.listing;
  let updatedListings = [];

  let scraperPrice1 = await amazonPrice(listingInfo.name, listingInfo.condition);

  let scraperPrice2 = await craigslistPrice(listingInfo.name, listingInfo.condition);

  let finalScraperPrice = (scraperPrice1 + scraperPrice2)/2;

  const pythonOutput = await runPy.then((fromRunpy) => {
    return fromRunpy.toString();
  }, (error) => console.log("runPy error: ", error));

  let price = await Valuation.create({
    algoPrice: pythonOutput,
    scraperPrice: finalScraperPrice
  });

  let listing = await Listing.findOrCreate({
    where: ctx.request.body.listing
  });
  price = await price.setListing(listing[0]);
  listing = await Listing.findOrCreate({
    where: ctx.request.body.listing,
    include: [{model: Valuation}]
  });
  if (user) {
    await userListings.push(listing[0]);
    updatedListings = await userListings.map(userListing => Number(userListing.id));
    await user.setListings(updatedListings);
  }
  ctx.body = listing;
})
