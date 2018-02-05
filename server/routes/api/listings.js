const Router = require('koa-router');
const router = new Router();
const { Listing, Valuation, User } = require('../../db/models');
const { scrapePrice } = require('../../scraper');

module.exports = router;

let attributes = ['id', 'name', 'description', 'category', 'condition', 'brand', 'status', 'sellerShips'];

let runPy = new Promise(function(success, nosuccess) {
  const { spawn } = require('child_process');
  const pyprog = spawn(
    'python',
    ['/Users/randytsao/Documents/Fullstack/Projects/prioracle-app/scripts/python/algo-price-calculator.py']
  ); // use path.resolve() for relative paths

  pyprog.stdout.on('data', (data) => {
    success(data);
  });
  pyprog.stderr.on('data', (data) => {
    nosuccess(data);
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
  let user = await User.findById(Number(ctx.request.body.userId));
  let userListings = await user.getListings();
  let listingInfo = ctx.request.body.listing;
  let updatedListings = [];

  let scraperPrice = await scrapePrice(listingInfo.name, listingInfo.condition);

  let price = await Valuation.create({
    algoPrice: 2 * 100,//pythonOutput,//2 * Number( data.toString() ),
    /*algoPrice: python.stdout.on('data', (data) => {
      return Number( data.toString() );
    }),*/
    scraperPrice: scraperPrice.mean
  });

  console.log(scraperPrice);

  let listing = await Listing.findOrCreate({
    where: ctx.request.body.listing
  });
  price = await price.setListing(listing[0]);
  listing = await Listing.findOrCreate({
    where: ctx.request.body.listing,
    include: [{model: Valuation}]
  });
  await userListings.push(listing[0]);
  updatedListings = await userListings.map(listing => Number(listing.id));
  await user.setListings(updatedListings);
  ctx.body = listing;
})
