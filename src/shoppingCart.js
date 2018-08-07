const products = [
  { code: 'ult_small', name: 'Unlimited 1GB', price: 24.9 },
  { code: 'ult_medium', name: 'Unlimited 2GB', price: 29.9 },
  { code: 'ult_large', name: 'Unlimited 5GB', price: 44.9 },
  { code: '1gb', name: '1 GB Data-pack', price: 9.9 }
]

const pricingRules = {
  discounts: [{ promoCode: 'I<3AMAYSIM', amount: 0.1 }],
  deals: [{ code: 'ult_small', free: 3 }],
  bulkDiscounts: [{ code: 'ult_large', threshold: 3, price: 39.9}],
  bundles: [ {code: 'ult_medium', bundleCode: '1gb'}]
}

let order = []

module.exports.new = () => {
  order = { items: [], discount: 0 }
}

module.exports.add = (item, promoCode) => {
  order = { items: [item, ...order.items] }

  discount = pricingRules.discounts.find(d => d.promoCode === promoCode) || { amount: 0 }
  order.discount = discount.amount
}

module.exports.total = () => {
  result = order.items.reduce((accumulator, currentValue) => {
    if (currentValue in accumulator) {
      accumulator[currentValue]++
    } else {
      accumulator[currentValue] = 1
    }

    // deal
    deal = pricingRules.deals.find(d => d.code === currentValue)
    if (deal) {
      if (accumulator[currentValue] === deal.free) {
        return accumulator
      }
    }
    
    return {...accumulator, total: accumulator.total + products.find(p => p.code === currentValue).price}
  }, {total: 0})

  // total - bulk discounts
  pricingRules.bulkDiscounts.map(discount => {
    if (result[discount.code] >= discount.threshold)
      result.total = result.total - (result[discount.code] * (products.find(p => p.code === discount.code).price - discount.price))
  })

  // total - discount
  return Math.round((result.total - result.total * order.discount) * 100) / 100
}

module.exports.items = () => {
  return order.items.reduce((items, item) => {
    if (item in items) {
      items[item]++
    } else {
      items[item] = 1
    }

    // add bundled items
    bundle = pricingRules.bundles.find(b => b.code === item)

    if (bundle) {
      if (bundle.bundleCode in items) {
        items[bundle.bundleCode]++
      } else {
        items[bundle.bundleCode] = 1
      }
    }

    return items
  }, {})
}
