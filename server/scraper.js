const {OperationHelper} = require('apac');

const OpHelper = new OperationHelper({
  // awsId: process.env.AMAZON_AWS_ID,
  // awsSecret: process.env.AMAZON_API_SECRET,
  // assocId: process.env.AMAZON_ASSOCIATE_ID,
  awsId: process.env.awsId,
  awsSecret: process.env.awsSecret,
  assocId: process.env.assocId,
  locale: 'US'
});

async function scrapePrice(keyword, condition) {

  let avgPrice = 0, count = 0, min = 0, max = 0, mean = 0;
  let price = 0;

  let response = await OpHelper.execute('ItemSearch', {
    'SearchIndex': 'All',
    'Keywords': keyword,
    'ResponseGroup': 'ItemAttributes, Offers',
    'ItemPage': 1
  });

    let tempData = response.result.ItemSearchResponse.Items.Item;
    tempData.forEach(function(value, index) {
      if (value.OfferSummary.LowestNewPrice)
        price = +value.OfferSummary.LowestNewPrice.Amount;
      else if (value.OfferSummary.LowestUsedPrice)
        price = +value.OfferSummary.LowestUsedPrice.Amount;
      else
        price = +value.OfferSummary.LowestRefurbishedPrice.Amount;

      if(!index)
        min = price;
      if( price > max )
        max = price;
      if(price < min)
        min = price;
      avgPrice += price;
      count++;
    });
    mean = Math.round(avgPrice/count);
    if(condition === "Like New")
      mean = (mean*9)/10;
    else if(condition === "Good")
      mean = (mean*8)/10;
    else if(condition === "Fair")
      mean = (mean*7)/10;
    else if(condition === "Poor")
      mean = (mean*6)/10;

    return {
      min:  min,
      max: max,
      mean
    };

}

module.exports = {scrapePrice};
