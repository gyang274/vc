// core.js
// author: <gyang274@github.com>

// client side replica of server side core.js

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

// check cardsOut can beat previous cardsOut, assume cardsOut is valid
function isCardsOutBeatenPrevCardsOut (cardsOut, prevCardsOut) {
  
  let numCardsByRank = _.countBy(cardsOut, 'rank')

  let ranks = Object.keys(numCardsByRank)

  // let numCards = _.sum(Object.values(numCardsByRank))

  let prevNumCardsByRank = _.countBy(prevCardsOut, 'rank')

  let prevRanks = Object.keys(prevNumCardsByRank)

  // let prevNumCards = _.sum(Object.values(prevNumCardsByRank))
  
  // 大王打小王
  if (prevRanks.includes('0')) {
    if (numCardsByRank['1'] >= prevNumCardsByRank['0']) {
      numCardsByRank['1'] = numCardsByRank['1'] - prevNumCardsByRank['0']
      delete prevNumCardsByRank['0']
      prevRanks = _.pull(prevRanks, '0')
      if (numCardsByRank['1'] === 0) {
        delete numCardsByRank['1']
        ranks = _.pull(ranks, '1')
      }
    } else {
      return false
    }
  }
  // 三个2打大王
  if (prevRanks.includes('1')) {
    if (numCardsByRank['2'] >= 3 * prevNumCardsByRank['1']) {
      numCardsByRank['2'] = numCardsByRank['2'] - 3 * prevNumCardsByRank['1']
      delete prevNumCardsByRank['1']
      prevRanks = _.pull(prevRanks, '1')
      if (numCardsByRank['2'] === 0) {
        delete numCardsByRank['2']
        ranks = _.pull(ranks, '2')
      }
    } else {
      return false
    }
  }
  // 大小王打纯2
  if (prevRanks.includes['2'] && prevRanks.length === 1) {
    if (numCardsByRank['0'] + numCardsByRank['1'] === prevNumCardsByRank['2'] 
    && _.sum(Object.values(numCardsByRank)) === _.sum(Object.values(prevNumCardsByRank))
    ) {
      return true
    } else {
      return false
    }
  }
  // 无王无2或2带x则大打小
  if (ranks.length === 0 && prevRanks.length === 0) {
    return true
  } else if (_.min(_.map(ranks, r => rankNum[r])) > _.min(_.map(prevRanks, r => rankNum[r]))
          && _.sum(Object.values(numCardsByRank)) === _.sum(Object.values(prevNumCardsByRank))) {
    return true
  } else {
    return false
  }

}

// es6 exports
export default {
  // constants
  suitNum,
  rankNum,
  // functions
  isCardsOutBeatenPrevCardsOut,
}