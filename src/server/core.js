// core.js
// author: <yg@gyang274@github.com>

const _ = require('lodash')


const suitNum = {
  'C': 0,
  'D': 1,
  'H': 2,
  'S': 3,
  'T': 4
}

const rankNum = {
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14,
  '2': 15,
  '0': 16,
  '1': 17,
}


// setDeck
//   set a deck of 196 cards [{suit, rank, snum, rnum}, ..]
function setDeck () {

  function setDeckCore () {
    const suits = ['C', 'D', 'H', 'S']
    // const ranks = ['5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
    const ranks = ['5', '8', 'K', '2']
    let deck = []
    suits.forEach(suit => {
      ranks.forEach(rank => {
        deck.push({
          suit: suit, rank: rank
        })
      })
    })
    deck.push({
      suit: 'T', rank: '0'
    })
    deck.push({
      suit: 'T', rank: '1'
    })
    return deck
  }

  let deck = []
  for (let i = 0; i < 4; i++) {
    deck = deck.concat(setDeckCore())
  }
  for (let j = 0; j < 6; j++) {
    deck.push({
      suit: 'S', rank: '3'
    })
    deck.push({
      suit: 'H', rank: '4'
    })
  }

  deck.forEach(
    card => {
      card.snum = suitNum[card.suit]
      card.rnum = rankNum[card.rank]
    }
  )

  return deck
}


// setCards
//   set a table of 6 players hands of cards
function setCards () {
  
  let deck = _.shuffle(setDeck())

  let cards = []
  for (let i = 0; i < 6; i++) {
    cards.push(
      _.sortBy(
        _.filter(
          deck, (card, index) => (index + 6 - i) % 6 === 0
        ), ['rnum', 'snum']
      )
    )
  }

  return cards
}


// setNotes
//   set a table of 6 player notes on games
function setNotes () {

  // notes: status: <'none'> -> 'play'/'pass'/'cask'/'cout'/'give'/'ende'
  let notes = {
    cardsInit: [

    ],
    cardsExec: [

    ],
    hands: [
  
    ],
    prevHand: [

    ],
    currHand: [

    ],
    asksId: -1,
    status: [
      'play', 'play', 'play', 'play', 'play', 'play',
    ],
    numAck: 6,
    dian: [
      false, false, false, false, false,
    ],
    mens: [

    ],
    shao: [

    ],
    lake: [
      -1, -1, -1, -1, -1, -1,
    ],
  }
  
  return notes
}


// check cardsOut
function isCardsOutValid (cardsOut) {

  let numCardsByRank = _.countBy(cardsOut, 'rank')

  let ranks = Object.keys(numCardsByRank)

  let numCards = _.sum(Object.values(numCardsByRank))

  if (ranks.includes('3') ) {
    return ranks.length === 1
  } else if (ranks.includes('4')) {
    return ranks.length === 1
  } else {
    return numCards > 0 && _.without(ranks, '0', '1', '2').length <= 1
  }
  
}

// check cardsOut is GoJi, assume cardsOut is valid
function isCardsOutGoJi (cardsOut) {

  let numCardsByRank = _.countBy(cardsOut, 'rank')

  let ranks = Object.keys(numCardsByRank)

  let numCards = _.sum(Object.values(numCardsByRank))

  if (ranks.includes('0') || ranks.includes('1')) {
    return true
  } else if (ranks.includes('2') && ranks.length === 1) {
    return true
  } else if (ranks.includes('A') && numCards >= 2) {
    return true
  } else if (ranks.includes('K') && numCards >= 2) {
    return true
  } else if (ranks.includes('Q') && numCards >= 3) {
    return true
  } else if (ranks.includes('J') && numCards >= 4) {
    return true
  } else if (ranks.includes('10') && numCards >= 5) {
    return true
  } else {
    return false
  }

  return false
}

// check cardsOut is GoJi 4 kai dian, assume cardsOut is valid
function isCardsOutGoJi4Kd (cardsOut) {

  let numCardsByRank = _.countBy(cardsOut, 'rank')

  let ranks = Object.keys(numCardsByRank)

  return isCardsOutGoJi(cardsOut) && !ranks.some(rank => ['0', '1', '2'].includes(rank))

}

// check cardsOut is 3, assume cardsOut is valid
function isCardsOut3d (cardsOut) {

  return cardsOut[0].rank === '4'

}

// check cardsOut is 4, assume cardsOut is valid
function isCardsOut4d (cardsOut) {

  return cardsOut[0].rank === '4'

}


// check cardsOut can beat previous cardsOut, assume cardsOut is valid
function isCardsOutBeatenPrevCardsOut (cardsOut, prevCardsOut) {
  
  let numCardsByRank = _.countBy(cardsOut, 'rank')

  let ranks = Object.keys(numCardsByRank)

  // let numCards = _.sum(Object.values(numCardsByRank))

  let prevNumCardsByRank = _.countBy(prevCardsOut, 'rank')

  let prevRanks = Object.keys(prevNumCardsByRank)

  // let prevNumCards = _.sum(Object.values(prevNumCardsByRank))

  if (prevRanks.includes('0')) {
    if (numCardsByRank['1'] >= prevNumCardsByRank['0']) {
      delete prevNumCardsByRank['0']
      prevRanks = _.pull(prevRanks, '0')
      numCardsByRank['1'] = numCardsByRank['1'] - prevNumCardsByRank['0']
      if (numCardsByRank['1'] === 0) {
        delete numCardsByRank['1']
        ranks = _.pull(ranks, '1')
      }
    } else {
      return false
    }
  } 
  
  if (prevRanks.includes('1')) {
    if (numCardsByRank['2'] >= 3 * prevNumCardsByRank['1']) {
      delete prevNumCardsByRank['1']
      prevRanks = _.pull(prevRanks, '0')
      numCardsByRank['2'] = numCardsByRank['2'] - 3 * prevNumCardsByRank['1']
      if (numCardsByRank['2'] === 0) {
        delete numCardsByRank['2']
        ranks = _.pull(ranks, '2')
      }
    } else {
      return false
    }
  }

  if (prevRanks.includes['2'] && prevRanks.length === 1) {
    if (numCardsByRank['0'] + numCardsByRank['1'] === prevNumCardsByRank['2'] 
    && _.sum(Object.values(numCardsByRank)) === _.sum(Object.values(prevNumCardsByRank))
    ) {
      return true
    } else {
      return false
    }
  }

  if (_.min(_.map(ranks, r => rankNum[r])) > _.min(_.map(prevRanks, r => rankNum[r]))
  && _.sum(Object.values(numCardsByRank)) === _.sum(Object.values(prevNumCardsByRank))
  ) {
    return true
  } else {
    return false
  }

  return false
}


function resNotes (notes) {
  // TODO: give suggestions on mai3/mai4/gong from notes
  return ':素质游戏，自觉进贡，静待服务器升级！'
}

// isHandEnde
// inputs:
//  cards: cardsOnHand of one player
function isHandEnde (cards) {

  return cards.length === 0

}

// isGameEnde
// inputs:
//  cards: cardsOnHand of 6 players, [[], [], [], [], [], [],]
function isGameEnde (cards) {

  if ((isHandEnde(cards[0]) && isHandEnde(cards[2]) && isHandEnde(cards[4]))
   || (isHandEnde(cards[1]) && isHandEnde(cards[3]) && isHandEnde(cards[5]))
  ) {
    return true
  }
  return false
}

// cardsToString
function cardsToString (cards) {

  cards = _.reverse(
    _.sortBy(cards, ['rnum', 'snum'])
  )

  let str = ''

  for (card of cards) {
    str += '一张' + cardsSuitToString(card.suit) + cardsRankToString(card.rank) + ' '
  }

  return str

}

function cardsSuitToString (suit) {
  if (suit === 'C') {
    return '梅花'
  } else if (suit === 'D') {
    return '钻石'
  } else if (suit === 'H') {
    return '红桃'
  } else if (suit === 'S') {
    return '黑桃'
  } else {
    return ''
  }
}

function cardsRankToString (rank) {
  if (rank === '0') {
    return '小王'
  } else if (rank === '1') {
    return '大王'
  } else {
    return rank
  }
}


// module.exports
module.exports = {
  setDeck, setCards, setNotes, resNotes,
  isCardsOutValid,
  isCardsOutGoJi,
  isCardsOutGoJi4Kd,
  isCardsOut3d,
  isCardsOut4d,
  isCardsOutBeatenPrevCardsOut,
  isHandEnde,
  isGameEnde,
  cardsToString,
}
