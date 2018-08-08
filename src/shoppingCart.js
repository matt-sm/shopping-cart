const products = [
  { code: 'ult_small', name: 'Unlimited 1GB', price: 24.9 },
  { code: 'ult_medium', name: 'Unlimited 2GB', price: 29.9 },
  { code: 'ult_large', name: 'Unlimited 5GB', price: 44.9 },
  { code: '1gb', name: '1 GB Data-pack', price: 9.9 }
]

let pricingRules = {}
let order = []

const findProduct = code => products.find(p => p.code === code)

const increment = (items, code) => {
  const count = code in items ? items[code] + 1 : 1
  return { ...items, [code]: count }
}

const isFreeItem = (code, count) => {
  const deal = pricingRules.deals.find(d => d.code === code)
  return deal && (count % deal.free === 0)
}

const isBundledItem = code => {
  const bundle = pricingRules.bundles.find(b => b.bundleCode === code)
  return bundle && order.items.find(i => i === bundle.code)
}

const applyBulkDiscount = (items, total) => {
  let amount = total
  pricingRules.bulkDiscounts.forEach(discount => {
    if (items[discount.code] > discount.threshold)
      amount -= items[discount.code] * (findProduct(discount.code).price - discount.price)
  })

  return amount
}

const getPromoDiscount = () => pricingRules.discounts.find(d => d.promoCode === order.promoCode) || { amount: 0 }

const applyPromoDiscount = total => Math.round((total - total * getPromoDiscount().amount) * 100) / 100 // round to 2 decimals

const findBundleItem = code => pricingRules.bundles.find(b => b.code === code)

const addBundleItem = (itemCounts, code) => {
  const bundle = findBundleItem(code)
  if (bundle && !order.items.find(i => i === bundle.bundleCode)) {
    return increment(itemCounts, bundle.bundleCode)
  }

  return itemCounts
}

module.exports.new = rules => {
  order = { items: [], promoCode: null }
  pricingRules = rules
}

module.exports.add = (code, promoCode) => {
  if (!findProduct(code)) {
    throw new Error(`Invalid code: ${code}`)
  }

  order = { items: [code, ...order.items], promoCode }
}

module.exports.total = () => {
  const result = order.items.reduce(
    (accumulator, code) => {
      accumulator.itemCounts = increment(accumulator.itemCounts, code)

      if (isFreeItem(code, accumulator.itemCounts[code]) || isBundledItem(code, accumulator.itemCounts)) {
        return accumulator
      }

      return {
        itemCounts: { ...accumulator.itemCounts },
        runningTotal: accumulator.runningTotal + findProduct(code).price
      }
    },
    { itemCounts: {}, runningTotal: 0 }
  )

  const finalAmount = applyBulkDiscount(result.itemCounts, result.runningTotal)
  return applyPromoDiscount(finalAmount)
}

module.exports.items = () => {
  const items = order.items.reduce((itemCounts, code) => {
    const counts = increment(itemCounts, code)
    
    return addBundleItem(counts, code)
  }, {})

  return Object.keys(items).map(code => `${items[code]} x ${findProduct(code).name}`)
}
