# shopping-cart
A shopping cart prototype.

Tested with Node v8.11.3.

## Install
`npm i`

## Run tests
`npm test`

## Assumptions
- Incorrect promo codes will be ignored.
- If a free-of-charge item is already added with its corressponding bundle item, a second free-of-charge item will not be added.
- "3 for 2" or similar deals can only be configured to offer one free item, eg. "4 for 3" not "4 for 2".
- multiples of "3 for 2" deals will yield more free items eg. "6 for 4".

## Approach
The basic approach is to have a simple `add()` function that adds items to an array, and have the business logic embedded in the `total()` and `item()` functions.  In each of these functions a `reduce()` processes each item, applying bundle and deal logic to calculate the total/item list.  Bullk discounts and promo codes are processed at the end due to the fact they require knowledge of the entire order.
