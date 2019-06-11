// core-test.js
const _ = require('lodash')

const core = require('./core')

// test isCardsOutGoJi, isCardsOutGoJi4Kd
let cardsOut = [ 
  { suit: 'C', rank: '8' },
  { suit: 'D', rank: 'K' },
  { suit: 'H', rank: 'A' },
  { suit: 'S', rank: 'A' },
  { suit: 'S', rank: '2' },
  { suit: 'T', rank: '0' },
  { suit: 'T', rank: '1' }
]

console.log(
  core.cardsToString(cardsOut)
)

console.log(
  cardsOut, 'is 够级:', core.isCardsOutGoJi(cardsOut)
)

console.log(
  cardsOut, 'is 纯够级', core.isCardsOutGoJi4Kd(cardsOut)
)
