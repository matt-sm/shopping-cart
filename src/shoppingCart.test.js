const shoppingCart = require('./shoppingCart')

test('scenario 1: deal', () => {
  shoppingCart.new()
  shoppingCart.add('ult_small')
  shoppingCart.add('ult_small')
  shoppingCart.add('ult_small')
  shoppingCart.add('ult_large')
  expect(shoppingCart.total()).toBe(94.70)
  expect(shoppingCart.items()).toEqual({ ult_large: 1, ult_small: 3 })
})

test('scenario 2: bulk discount', () => {
  shoppingCart.new()
  shoppingCart.add('ult_small')
  shoppingCart.add('ult_small')
  shoppingCart.add('ult_large')
  shoppingCart.add('ult_large')
  shoppingCart.add('ult_large')
  shoppingCart.add('ult_large')
  expect(shoppingCart.total()).toBe(209.40)
  expect(shoppingCart.items()).toEqual({ ult_small: 2, ult_large: 4 })
})

test('scenario 3: bundle', () => {
  shoppingCart.new()
  shoppingCart.add('ult_small')
  shoppingCart.add('ult_medium')
  shoppingCart.add('ult_medium')
  expect(shoppingCart.total()).toBe(84.70)
  expect(shoppingCart.items()).toEqual({ '1gb': 2, ult_medium: 2, ult_small: 1 })
})

test('scenario 4: promo code', () => {
  shoppingCart.new()
  shoppingCart.add('ult_small')
  shoppingCart.add('1gb', 'I<3AMAYSIM')
  expect(shoppingCart.total()).toBe(31.32)
  expect(shoppingCart.items()).toEqual({ '1gb': 1, ult_small: 1 })
})
