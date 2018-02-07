// app/utils.js
// Helpers for our app!

export const getValuationPrice = (valuation) => {
  let price = null;

  // If both ML and scraper algorithms have returned 
  // defined values, then return the meta price.
  if (valuation.algoPrice && valuation.scraperPrice)
    price = valuation.metaPrice;
  else if (valuation.algoPrice && !valuation.scraperPrice)
    price = valuation.algoPrice;
  else if (!valuation.algoPrice && valuation.scraperPrice)
    price = valuation.scraperPrice;
  
  // 0th index is dollars, 1st index is cents
  [dollars, cents] = price ? [Math.round(price * 0.01), price % Math.round(price * 0.01)] : null;

  cents = cents < 10 ? '0' + cents.toString() : cents.toString();

  return dollars.toString() + '.' + cents;
}