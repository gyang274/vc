// core.js
// author: <gyang274@github.com>

const fs = require('fs')

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

const lakeStr = [
  '头科', '二科', '三科', '四科', '二落', '大落'
]

const lakeNum = [
  2, 1, 0, 0, -1, -2
]

// setDeck
//   set a deck of 196 cards [{suit, rank, snum, rnum}, ..]
function setDeck () {

  function setDeckCore () {
    const suits = ['C', 'D', 'H', 'S']
    // const ranks = ['5', '8', 'K', '2']
    const ranks = ['5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2']
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


// setCardsTest
function setCardsTest () {

  let cards = [
    [], [], [], [], [], [], 
  ]

  // set-cards
  cards = [
    // id 0
    [
      { suit:  'S', rank: '3' },
      { suit:  'S', rank: '5' },
      { suit:  'S', rank: '5' },
      { suit:  'S', rank: 'K' },
      { suit:  'S', rank: 'K' },
      { suit:  'S', rank: '2' },
      { suit:  'S', rank: '2' },
      { suit:  'S', rank: '2' },
      { suit:  'S', rank: '2' },
      { suit:  'T', rank: '0' },
      { suit:  'T', rank: '1' },
    ], 
    // id 1
    [
      { suit: 'S', rank: '3' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '8' },
      { suit: 'S', rank: 'K' },
      { suit: 'S', rank: '2' },
    ],
    // id 2
    [
      { suit: 'S', rank: '3' },
      { suit: 'S', rank: '8' },
      { suit: 'S', rank: '8' },
      { suit: 'S', rank: 'A' },
      { suit: 'S', rank: 'A' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      
    ],
    // id 3
    [
      { suit: 'S', rank: '3' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      { suit: 'T', rank: '1' },
    ],
    // id 4
    [
      { suit: 'S', rank: '3' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '5' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      { suit: 'S', rank: '2' },
      { suit: 'T', rank: '1' },
    ],
    // id 5
    [
      { suit: 'S', rank: '3' },
      { suit: 'S', rank: '4' },
      { suit: 'S', rank: 'K' },
      { suit: 'S', rank: 'K' },
      { suit: 'S', rank: '2' },
      { suit: 'T', rank: '1' },
    ], 
  ]
  
  cards.forEach(
    cardsOnHand => cardsOnHand.forEach(
      cd => {
        cd.snum = suitNum[cd.suit]
        cd.rnum = rankNum[cd.rank]
      }
    )
  )

  cards.forEach(
    cardsOnHand => _.sortBy(cardsOnHand, ['rnum', 'snum'])
  )
    
  return cards

}


// setNotes
//   set a table of 6 player notes on games
function setNotes () {

  // notes:
  //  status: <'none'> -> 'play'/'feng'/'cout'/'cask'/'pass'/'give'/'ende'
  // TODO: add mode: 'feng' in notes
  let notes = {
    names: [

    ],
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

  return cardsOut[0].rank === '3'

}

// check cardsOut is 4, assume cardsOut is valid
function isCardsOut4d (cardsOut) {

  return cardsOut[0].rank === '4'

}

// check cardsOut has T0, T1, assume cardsOut is valid
function isCardsOutTd (cardsOut) {

  let numCardsByRank = _.countBy(cardsOut, 'rank')

  let ranks = Object.keys(numCardsByRank)

  return ranks.includes('0') || ranks.includes('1')

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

}

// getSeatId
function getSeatId (id, n) { return (id + n) % 6 }

// isOnSeatIxId
//  isOnSeatIxId: on same seat
function isOnSeatIxId (id1, id2) { return id1 === id2 }

// isOnSeatOxId
//  isOnSeatOxId: 对家
function isOnSeatOxId (id1, id2) { return id1 === (id2 + 3) % 6 }

// isHandDian
function isHandDian (notes, payload) {

  // corner case: user play 4 on 1st action directly
  return notes.numAck === 6 
      && isCardsOut4d(payload.cards)
      && !_.isEmpty(notes.prevHand) 
      && notes.prevHand.id === payload.id 
      && isCardsOutGoJi4Kd(notes.prevHand.cards)

}

// isHandMens
function isHandMens (notes, payload, cards) {

  return !_.isEmpty(notes.prevHand)
      && cards[notes.prevHand.id].length === 1
      && notes.prevHand.id !== payload.id
      // 对家有闷无贡 可以闷牌但是无贡
      // && notes.prevHand.id !== (payload.id + 3) % 6
      
}

// isHandShao
function isHandShaoInit (notes, payload) {

  return notes.numAck >= 5
      && !_.isEmpty(notes.prevHand)
      && isCardsOutGoJi(notes.prevHand.cards)
      && notes.prevHand.id !== payload.id
      && notes.prevHand.id !== (payload.id + 3) % 6
      && notes.status[(payload.id + 3) % 6] !== 'ende'
      && notes.status[(notes.prevHand.id + 3) % 6] !== 'ende'
      
}

function isHandShaoGoOn (notes, payload) {
  return !_.isEmpty(notes.shao)
      && notes.shao[0].on
      && notes.shao[0].src === payload.id
      // apply penalty on shao without Td outside
      //  so that isHandShaoGoOn and isHandShaoBkUp 
      //  conditions together make the universe complete
      // && isCardsOutTd(payload.cards)
}

function isHandShaoBkUp (notes, payload) {
  return !_.isEmpty(notes.shao)
      && notes.shao[0].on
      && notes.shao[0].src !== payload.id
}

function isHandShaoEnde (notes, payload) {
  return !_.isEmpty(notes.shao)
      && notes.shao[0].on
      && notes.shao[0].src === payload.id
      && isCardsOut3d(payload.cards)
}

// isHandLake
function isHandLake (notes, payload) {
  
  console.log(payload.cards)

  return isCardsOut3d(payload.cards)
  
}

// setHandNextCask
function setHandNextCask (notes, payload) {

  return setHandNextPass(notes, payload)

}

// setHandNextPass
function setHandNextPass (notes, payload) {

  let asksId = -1

  if (notes.numAck > 4) {
    if (isCardsOutGoJi(notes.currHand.cards)) {
      // 5-6人 && 对家够级 -> 对家 || 无头 (下家, 上家)
      asksId = (payload.id + 3) % 6
      if (notes.status[asksId] === 'ende') {
        asksId = notes.currHand.id
      } else if (notes.status[asksId] === 'cout') {
        if (notes.numAck === 5) {
          asksId = (notes.status.indexOf('ende') + 3) % 6
        }
      } else {
        asksId = (payload.id + 1) % 6
        if (notes.status[asksId] !== 'cout') {
          asksId = (payload.id + 4) % 6
        }
      }
    } else {
      // 5-6人 不打够级 -> 跳过pass/ende 顺位依次 对家双弃
      let doubleAsksSeatO = true
      for (let i = 1; i < 6; i++) {
        asksId = (payload.id + i) % 6
        if (notes.status[asksId] === 'play') {
          doubleAsksSeatO = false
          break
        }
      }
      // 对家双弃
      if (doubleAsksSeatO) {
        if (payload.id === (notes.currHand.id + 3) % 6) {
          asksId = notes.currHand.id
        } else {
          asksId = (notes.currHand.id + 3) % 6
          if (notes.status[asksId] === 'ende') {
            asksId = notes.currHand.id
          }
        }
      }
    }
  } else {

    // 2-4人 -> 顺位依次
    for (let i = 1; i < 6; i++) {
      asksId = (payload.id + i) % 6
      if (notes.status[asksId] !== 'ende') {
        break
      }
    }

  }

  if (asksId === -1) {
    console.log('setHandNextPass|sth. wrong?', notes, payload)
  }

  return asksId

}

// setHandNextCout
function setHandNextCout (notes, payload) {

  let asksId = -1

  if (notes.numAck > 4) {

    if (isCardsOutGoJi(payload.cards)) {

      // 5-6人 && 够级 -> 对家 || 无头 (下家, 上家)
      asksId = (payload.id + 3) % 6

      if (notes.status[asksId] === 'ende') {
        asksId = (payload.id + 1) % 6
      }

    } else {

      // 5-6人 不打够级 -> 跳过pass/ende 顺位依次 对家双弃
      let doubleAsksSeatO = true
      for (let i = 1; i < 6; i++) {
        asksId = (payload.id + i) % 6
        if (notes.status[asksId] === 'play') {
          doubleAsksSeatO = false
          break
        }
      }
      if (doubleAsksSeatO) {
        asksId = (payload.id + 3) % 6
        if (notes.status[asksId] === 'ende') {
          asksId = payload.id
        }
      }

    }

  } else {

    // 2-4人 -> 顺位依次
    for (let i = 1; i < 6; i++) {
      asksId = (payload.id + i) % 6
      if (notes.status[asksId] !== 'ende') {
        break
      }
    }
  
  }

  if (asksId === -1) {
    console.log('setHandNextCout|sth. wrong?', notes, payload)
  }

  return asksId

}


// isGameEnde
function isGameEnde (notes) {

  return (notes.status[0] === 'ende' && notes.status[2] === 'ende' && notes.status[4] === 'ende') 
      || (notes.status[1] === 'ende' && notes.status[3] === 'ende' && notes.status[5] === 'ende')
  
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
    return '权杖'
  } else if (suit === 'D') {
    return '钻石'
  } else if (suit === 'H') {
    return '红心'
  } else if (suit === 'S') {
    return '铲子'
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


// resNotes
function resNotes (notes) {
  
  // ':素质游戏，自觉进贡！'
  news = [
    {}, {}, {}, {}, {}, {}, 
  ]

  notes.names.forEach(
    (name, id) => {
      news[id].name = name
    }
  )

  news.forEach(it => it.points = 0)

  // dian
  news.forEach(it => it.dian = '')

  notes.dian.forEach(
    (dian, id) => {
      news[id].dian = dian ? '开点' : '没开'
      news[id].points = (
        (notes.dian[id] ? 1 : -1) + (notes.dian[(id + 3) % 6] ? -1 : 1)
      )
    }
  )

  // mens
  news.forEach(it => it.mens = '')

  notes.mens.forEach(
    (mens) => {
      console.log('notes mens' + `闷了${notes.names[mens.dst]}！` + `被${notes.names[mens.src]}闷！`)
      news[mens.src].mens += `闷了${notes.names[mens.dst]}！`
      news[mens.dst].mens += `被${notes.names[mens.src]}闷！`
      news[mens.src].points += 2
      news[mens.dst].points -= 2
    }
  )

  // shao
  news.forEach(it => it.shao = '')

  notes.shao.forEach(
    (shao) => {
      news[shao.src].shao += `烧了${notes.names[shao.dst]}！`
      news[shao.dst].shao += `被${notes.names[shao.src]}烧！`
      news[shao.src].points += 2
      news[shao.src].points += 2
    }
  )

  // lake
  notes.lake.forEach(
    (lake, id) => {
      news[id].lake = lakeStr[lake] 
      news[id].points = lakeNum[lake]
    }
  )

  return news

}

// writeNotes
function writeNotes (notes) {

  // TODO write to database e.g., mongodb
  let notesStr = JSON.stringify(notes, null, 2);

  // TODO timestamp + random number as filename
  fs.writeFile(
    'notes-' + (new Date()).toISOString + '.json', notesStr, (error) => {  
      if (error) throw error
  })

}

// module.exports
module.exports = {
  // constants
  suitNum,
  rankNum,
  lakeStr,
  lakeNum,
  // functions
  setDeck, 
  setCards,
  setCardsTest,
  setNotes, 
  resNotes, 
  writeNotes,
  isCardsOutValid,
  isCardsOutGoJi,
  isCardsOutGoJi4Kd,
  isCardsOut3d,
  isCardsOut4d,
  isCardsOutTd,
  isCardsOutBeatenPrevCardsOut,
  getSeatId,
  isOnSeatIxId,
  isOnSeatOxId,
  isHandDian,
  isHandMens,
  isHandShaoInit,
  isHandShaoGoOn,
  isHandShaoBkUp,
  isHandShaoEnde,
  isHandLake,
  setHandNextCask,
  setHandNextPass,
  setHandNextCout,
  isGameEnde,
  cardsToString,
}
