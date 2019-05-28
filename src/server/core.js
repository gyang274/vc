// core.js
// author: <yg@gyang274@github.com>

const _ = require('lodash')


const suitNum = {
  'C': 0,
  'D': 1,
  'H': 2,
  'S': 3,
  'X': 4
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

const dNote = {
  dian: -1,
  bdian: -1,
  mens: -1,
  bmens: -1,
  shao: -1,
  bshao: -1,
  lake: -1
}


// setDeck
//   set a deck of 196 cards [{suit, rank, snum, rnum}, ..]
function setDeck () {

  function setDeckCore () {
    const suits = ['C', 'D', 'H', 'S']
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
      suit: 'X', rank: '0'
    })
    deck.push({
      suit: 'X', rank: '1'
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


// setHands
//   set a table of 6 players hands of cards and notes
function setHands () {
  
  let deck = _(setDeck()).shuffle()

  let hands = []
  for (let i = 0; i < 6; i++) {
    hands.push({
      cards: _(
        deck.filter(
          (card, index) => (index + 6 - i) % 6 === 0
        )
      ).sortBy(
        ['rnum', 'snum']
      ).value(),
      note: dNote
    })
  }

  return hands
}


// setPlayer
//   set player from database
function setPlayer (seat) {

  player = {
    seat: seat,
    note: dNote,
    coin: 0
  }

  return player
}


// setBoard
//   set a board of 6 players [{}, ..]
function setBoard (ids) {

  let board = []
  for (let i = 0; i < 6; i++) {
    board.push(setPlayer(ids[i]))
  }

  return board
}





module.exports = {
  setDeck, setHands
}