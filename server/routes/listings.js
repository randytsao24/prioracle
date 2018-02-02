const Router = require('koa-router');
const router = new Router();
const { Listing, Valuation, User } = require('../db/models');
//const { spawn } = require("child_process");

module.exports = router;

let attributes = ['id', 'name', 'description', 'category', 'condition', 'brand', 'status', 'sellerShips'];

let runPy = new Promise(function(success, nosuccess) {
  const { spawn } = require('child_process');
  const pyprog = spawn(
    'python', 
    ['/home/asalas/fullstack-academy/immersive/senior-phase/prioracle/scripts/python/algo-price-calculator.py']
  ); // use path.resolve() for relative paths
  
  pyprog.stdout.on('data', (data) => {
    success(data);
    // pyProg.push(data);
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
  let user = await User.findById(Number(ctx.request.body.user.id));
  let userListings = await user.getListings();
  let updatedListings = []; 
  
  /*const python = spawn(
    'python', 
    ['../../scripts/python/algo-price-calculator.py']
  );*/
  /*python.stdout.on('data', data => {
    const pythonOutput = Number( data.toString() );
  });*/

  /* const fromRunPy = await runPy();
  const pythonOutput = await runPythonPromise();*/ 
  const pythonOutput = await runPy.then(function(fromRunpy) {
    console.log(fromRunpy.toString());
    return fromRunpy.toString();
  })
  //.then(async pythonOutput => {
      let price = await Valuation.create({
        algoPrice: 2 * pythonOutput,//2 * Number( data.toString() ),
        /*algoPrice: python.stdout.on('data', (data) => {
          return Number( data.toString() );
        }),*/
        scraperPrice: 0
      });
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
  //});
})
