const products = require('./products')

let pricingRules = {}

module.exports.new = rules => {
  pricingRules = rules
}

module.exports.findBundleItem = code => pricingRules.bundles.find(b => b.code === code)

module.exports.isFreeItem = (code, count) => {
  const deal = pricingRules.deals.find(d => d.code === code)
  return deal && count % deal.free === 0
}

module.exports.isBundledItem = (order, code) => {
  const bundle = pricingRules.bundles.find(b => b.bundleCode === code)
  return bundle && order.items.find(i => i === bundle.code)
}

module.exports.applyBulkDiscount = (items, total) => {
  let amount = total
  pricingRules.bulkDiscounts.forEach(discount => {
    if (items[discount.code] > discount.threshold)
      amount -= items[discount.code] * (products.find(discount.code).price - discount.price)
  })

  return amount
}

module.exports.applyPromoDiscount = (promoCode, total) => {
  const discount = pricingRules.discounts.find(d => d.promoCode === promoCode) || { amount: 0 }
  return Math.round((total - total * discount.amount) * 100) / 100 // round to 2 decimals
}