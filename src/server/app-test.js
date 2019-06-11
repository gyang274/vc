// app-test.js
const _ = require('lodash')

const io = require('socket.io-client')

// create 6 players
let usernames = [
  'yg', 'lw', 'cl', 'fy', 'yb', 'fl' 
]

let sockets = [
  [], [], [], [], [], [], 
]

let cards = [
  [], [], [], [], [], [], 
]

let cardsOut = [
  [], [], [], [], [], [], 
]

let status = [
  [], [], [], [], [], [], 
]


async function init () {
  for (let i = 0; i < 6; i++) {
    sockets[i] = io.connect('http://127.0.0.1:3000')
  }  
}

// set names
async function setNames () {
  sockets.forEach(
    (socket, index) => {
      socket.emit(
        'set-user-name', {
          name: usernames[index]
        }
      )
    }
  )
}

// set players sit down / stand up
async function setSeats () {
  sockets.forEach(
    (socket, index) => {
      socket.emit(
        'set-user-seat-sit-down', {
          id: index
        }
      )
    }
  )

  await sleep(100)

  for (i of [2, 5]) {
    sockets[i].emit(
      'set-user-seat-stand-up', {id: i}
    )
  }

  await sleep(100)
  
  for (i of [2, 5]) {
    sockets[i].emit(
      'set-user-seat-sit-down', {id: i}
    )
  }
  
}

// get names
async function getNames () {
  
  sockets.forEach(
    (socket, index) => {
      socket.emit(
        'get-names', {}, (response) => {
          console.log('get-names:', response.concat(response.splice(0, index)))
        }
      )
    }
  )

}

// action waitOk
async function actionWaitOk () {

  sockets.forEach(
    (socket, index) => {
      socket.emit('set-user-hand-wait-ok', {
        name: usernames[index], seat: index
      })
    }
  )

  // action waitOk -> srv-hands-init
  await sleep(100)

  sockets.forEach(
    (socket, index) => {
      socket.emit('get-cards', { id: index }, (response) => {
        cards[index] = response
      })
    }
  )

}

// action exec
async function actionExec (rk = '3') {

  // console.log('actionExec|cardsInit:', cards)

  // count how many rk = '3' on each player hand
  countOfRk = []
  for (let i = 0; i < 6; i++) {
    numCardsByRank = _.countBy(cards[i], 'rank')
    ranks = Object.keys(numCardsByRank)
    if (ranks.includes(rk)) {
      countOfRk.push(numCardsByRank[rk])
    } else {
      countOfRk.push(0)
    }
  }
  console.log('actionExec|countOfRk:', rk, countOfRk)
  indexNeedRk = []
  for (let i = 0; i < 6; i++) {
    if (countOfRk[i] === 0) {
      indexNeedRk.push(i)
    }
  }
  for (let i = 0; i < 6; i++) {
    while (countOfRk[i] > 1) {
      j = indexNeedRk.pop(i)
      cidx = _.findIndex(cards[i], {rank: rk})
      c = _.pullAt(cards[i], [cidx])
      sockets[i].emit(
        'set-user-hand-exec', {
          name: usernames[i], seat: i,
          id: j, cards: c, cardsIndex: cidx
        }
      )
      sockets[j].on(
        'srv-user-hand-exec', (payload) => {
          console.log('actionExec|srv-user-hand-exec', j, payload)
          // cards[j] = _.sortBy(
          //   cards[j].concat(payload.cards), ['rnum', 'snum']
          // )
        }
      )
      cards[j] = _.sortBy(
        cards[j].concat(c), ['rnum', 'snum']
      )
      countOfRk[i] -= 1
    }
  }
  await sleep(100)
  // console.log('actionExec|cardsExec:', cards)
}

// action execOk
async function actionExecOk () {

  // action execOk -> srv-hands-play -> srv-hands-next
  sockets.forEach(
    (socket, index) => {
      socket.on('srv-hands-play', (payload) => { 
        console.log('srv-hands-play', payload)
      })
    }
  )

  sockets.forEach(
    (socket, index) => {
      socket.on('srv-hands-next', (payload) => { 
        console.log('srv-hands-next', payload)
      })
    }
  )

  // action execOk
  sockets.forEach(
    (socket, index) => {
      if (_.filter(cards[index], {rank: '3'}).length === 1) {
        socket.emit('set-user-hand-exec-ok', {
          name: usernames[index], seat: index
        })
      } else {
        console.log('actionExecOk|execOk requires one and only one 3d.')
      }
    }
  )



}


async function showCardsOnHand (id) {

  console.log(cards[id])

}

// action cout
async function actionCout (id, rks) {

  console.log('actionCout|rks must ordered from 1, 0, 2, A, ..., 5, 4, 3.')

  cardsIndex = []
  cardsOfHand = []

  for (rk of rks) {
    cindex = _.findLastIndex(cards[id], {rank: rk})
    if (_.isUndefined(cindex)) {
      console.log('actionCout|card rank not available/enough:', rk)
    } else {
      cardsIndex.push(cindex)
      cardsOfHand.push(
        _.pullAt(cards[id], cindex)
      )
    }
  }

  sockets[id].emit(
    'set-user-hand-cout', {
      name: usernames[id], seat: id,
      id: id, cards: cardsOfHand, cardsIndex: cardsIndex,
    }
  )

}


// miscellaneous
function sleep (ms) {
  return new Promise(
    resolve => {
      setTimeout(resolve, ms)
    }
  )
}

// main
async function main () {
  
  await init()

  await setNames()

  await setSeats()

  await getNames()

  await actionWaitOk()

  await sleep(100)

  await actionExec(rk = '3')

  await actionExec(rk = '4')

  await actionExecOk()

}


if (require.main === module) {
  main()
}


module.exports = {
  // constants
  usernames, 
  sockets, 
  cards, 
  cardsOut,
  status,
  // actions
  init, 
  setNames, 
  setSeats,
  getNames,
  actionWaitOk,
  actionExec,
  actionExecOk,
  actionCout,
  // status
  showCardsOnHand,
  // main
  main,
}




