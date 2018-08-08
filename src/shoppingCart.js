const products = require('./products')
const pricing = require('./pricing')

let order = []

const addItem = (items, code) => {
  const count = code in items ? items[code] + 1 : 1
  return { ...items, [code]: count }
}

module.exports.new = rules => {
  order = { items: [], promoCode: null }
  pricing.new(rules)
}

module.exports.add = (code, promoCode) => {
  if (!products.find(code)) {
    throw new Error(`Invalid code: ${code}`)
  }

  order = { items: [code, ...order.items], promoCode }
}

module.exports.total = () => {
  const result = order.items.reduce(
    (accumulator, code) => {
      accumulator.items = addItem(accumulator.items, code)

      if (pricing.isFreeItem(code, accumulator.items[code]) || pricing.isBundledItem(order, code)) {
        return accumulator
      }

      return {
        items: { ...accumulator.items },
        runningTotal: accumulator.runningTotal + products.find(code).price
      }
    },
    { items: {}, runningTotal: 0 }
  )

  const finalAmount = pricing.applyBulkDiscount(result.items, result.runningTotal)
  return pricing.applyPromoDiscount(order, finalAmount)
}

module.exports.items = () => {
  const result = order.items.reduce((accumulator, code) => {
    const items = addItem(accumulator, code)
    const bundle = pricing.findBundleItem(code)
    if (bundle && !order.items.find(i => i === bundle.bundleCode)) {
      return addItem(items, bundle.bundleCode)
    }

    return items
  }, {})

  return Object.keys(result).map(code => `${result[code]} x ${products.find(code).name}`)
}
