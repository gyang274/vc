const _ = require('lodash')

const core = require('./core')

// test isCardsOutGoQi

let cardsOut = [ 
  // { suit: 'D', rank: 'A' },
  // { suit: 'H', rank: 'A' },
  // { suit: 'S', rank: 'K' },
  // { suit: 'C', rank: 'Q' },
  { suit: 'H', rank: '8' },
  { suit: 'S', rank: '0' },
  // { suit: 'C', rank: '2' },
  // { suit: 'C', rank: '2' },
  // { suit: 'C', rank: '2' }

]

// let numCardsByRank = _.countBy(cardsOut, 'rank')
// console.log(numCardsByRank)
// let ranks = Object.keys(numCardsByRank)
// console.log(ranks)
// let numCards = _.sum(Object.values(numCardsByRank))
// console.log(numCards)
// console.log(
//   cardsOut, 'is 够级:', core.isCardsOutGoJi(cardsOut)
// )

// console.log(
//   cardsOut, 'is 纯够级', core.isCardsOutGoJi(cardsOut) && core.isCardsOutGoJi4Kd(cardsOut)
// )

console.log(
  core.cardsToString(cardsOut)
)