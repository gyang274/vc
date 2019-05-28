const _ = require('lodash')

const core = require('./core')

let deck = core.setDeck()

deck = _.shuffle(deck)

let hands = core.setHands(deck)

// console.log(JSON.stringify(hands))
hands.forEach(
  (hand, index) => {
    console.log('====', index, hand.cards.length)
    console.log(hand.cards[0])
    console.log(hand.note)
  }
)