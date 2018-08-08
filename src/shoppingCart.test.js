const shoppingCart = require('./shoppingCart')

const pricingRules = {
  discounts: [{ promoCode: 'I<3AMAYSIM', amount: 0.1 }],
  deals: [{ code: 'ult_small', free: 3 }],
  bulkDiscounts: [{ code: 'ult_large', threshold: 3, price: 39.9 }],
  bundles: [{ code: 'ult_medium', bundleCode: '1gb' }]
}

beforeEach(() => shoppingCart.new(pricingRules))

describe('base scenarios', () => {
  test('scenario 1: deal', () => {
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_large')
    expect(shoppingCart.total()).toBe(94.7)
    expect(shoppingCart.items()).toEqual(['1 x Unlimited 5GB', '3 x Unlimited 1GB'])
  })

  test('scenario 2: bulk discount', () => {
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_large')
    shoppingCart.add('ult_large')
    shoppingCart.add('ult_large')
    shoppingCart.add('ult_large')
    expect(shoppingCart.total()).toBe(209.4)
    expect(shoppingCart.items()).toEqual(['4 x Unlimited 5GB', '2 x Unlimited 1GB'])
  })

  test('scenario 3: bundle', () => {
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_medium')
    shoppingCart.add('ult_medium')
    expect(shoppingCart.total()).toBe(84.7)
    expect(shoppingCart.items()).toEqual(['2 x Unlimited 2GB', '2 x 1 GB Data-pack', '1 x Unlimited 1GB'])
  })

  test('scenario 4: promo code', () => {
    shoppingCart.add('ult_small')
    shoppingCart.add('1gb', 'I<3AMAYSIM')
    expect(shoppingCart.total()).toBe(31.32)
    expect(shoppingCart.items()).toEqual(['1 x 1 GB Data-pack', '1 x Unlimited 1GB'])
  })
})

describe('other interesting scenarios', () => {
  test('invalid item', () => {
    expect(() => shoppingCart.add('invalid')).toThrow()
  })

  test('invalid promo code not applied', () => {
    shoppingCart.add('ult_small')
    shoppingCart.add('1gb', 'invalid')
    expect(shoppingCart.total()).toBe(34.80)
    expect(shoppingCart.items()).toEqual(['1 x 1 GB Data-pack', '1 x Unlimited 1GB'])
  })

  test('no bulk discount under threshold', () => {
    shoppingCart.add('ult_large')
    shoppingCart.add('ult_large')
    shoppingCart.add('ult_large')
    expect(shoppingCart.total()).toBe(134.7)
    expect(shoppingCart.items()).toEqual(['3 x Unlimited 5GB'])
  })

  test('buy 6 pay for 4', () => {
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
    shoppingCart.add('ult_small')
  	expect(shoppingCart.total()).toBe(99.6)
    expect(shoppingCart.items()).toEqual(['6 x Unlimited 1GB'])
  })

  test('do not pay for bundled item', () => {
    shoppingCart.add('ult_medium')
    shoppingCart.add('1gb')
	expect(shoppingCart.total()).toBe(29.9)
    expect(shoppingCart.items()).toEqual(['1 x 1 GB Data-pack', '1 x Unlimited 2GB'])
  })
})