// app-test.js
const _ = require('lodash')

const io = require('socket.io-client')

const core = require('./core')

// create 6 players
let usernames = [
  'yg', 'lw', 'cl', 'fy', 'yb', 'fl' 
]

let sockets = [
  
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


async function init (numNPC = 6) {
  for (let i = 0; i < numNPC; i++) {
    sockets.push(io.connect('http://127.0.0.1:3000'))
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

  // await sleep(100)

  // for (i of [2, 3]) {
  //   sockets[i].emit(
  //     'set-user-seat-stand-up', {id: i}
  //   )
  // }

  // await sleep(100)
  
  // for (i of [2, 3]) {
  //   sockets[i].emit(
  //     'set-user-seat-sit-down', {id: i}
  //   )
  // }
  
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
        id: index, name: usernames[index],
      })
    }
  )

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
          name: usernames[i], id: i, jd: j, cards: c, cardsIndex: cidx
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

  // console.log('actionCout|rks must ordered from 1, 0, 2, A, ..., 5, 4, 3.')

  cardsIndex = []
  cardsOfHand = []

  for (rk of rks) {
    cindex = _.findLastIndex(cards[id], {rank: rk})
    if (cindex === -1) {
      console.log('actionCout|card rank not available/enough:', rk)
    } else {
      cardsIndex.push(cindex)
      cardsOfHand = cardsOfHand.concat(_.pullAt(cards[id], cindex))
    }
  }

  sockets[id].emit(
    'set-user-hand-cout', {
      id: id, name: usernames[id], cards: cardsOfHand, cardsIndex: cardsIndex,
    }
  )

}

// action cask
async function actionCask (id) {
  sockets[id].emit(
    'set-user-hand-cask', {
      id: id, name: usernames[id]
    }
  )
}

// action pass
async function actionPass (id) {
  sockets[id].emit(
    'set-user-hand-pass', {
      id: id, name: usernames[id]
    }
  )
}

async function giveUp4d(ids = [2, 3]) {
  // id2 give 4, id3 give up 4
  for (i of ids) {
    _.pullAt(cards[i], 1)
    sockets[i].emit(
      'set-user-hand-exec', {
        id: i, jd: i, cards: [
          { suit: 'S', rank: '4', snum: 3, rnum: 4 },
        ],
        cardsIndex: 1
      }
    )
  }
}

async function onCardsTestGame () {

  await sleep(100); await actionCout(0, ['5', '5'])

  await sleep(100); await actionPass(1)

  await sleep(100); await actionCout(2, ['8', '8'])

  await sleep(100); await actionPass(3)

  await sleep(100); await actionPass(4)

  await sleep(100); await actionCask(5)

  await sleep(100); await actionPass(0)

  await sleep(100); await actionCout(5, ['K', 'K'])

  // 够级
  await sleep(100); await actionPass(2)

  // 开点
  await sleep(100); await actionCout(5, ['4'])

  // 对家双弃
  await sleep(100); await actionPass(0)
  await sleep(100); await actionPass(1)
  await sleep(100); await actionPass(2)
  await sleep(100); await actionPass(3)
  await sleep(100); await actionPass(4)
  await sleep(100); await actionPass(2)

  await sleep(100); await actionCout(5, ['2'])
  await sleep(100); await actionPass(2)
  await sleep(100); await actionCout(5, ['1'])

  // 闷烧一体
  await sleep(100); await actionCout(3, ['2', '2', '2'])
  await sleep(100); await actionPass(0)

  // 烧牌继续
  await sleep(100); await actionCout(3, ['1', '5', '5', '5'])
  // 解烧带闷
  await sleep(100); await actionCout(0, ['2', '2', '2', '2', 'K', 'K',])
  // alternative 烧成走人
  // await sleep(100); await actionPass(0)
  // await sleep(100); await actionPass(2)
  // await sleep(100); await actionCout(3, ['3'])

  // 解烧带闷打到结束
  await sleep(100); await actionCout(0, ['1', '0',])
  await sleep(100); await actionPass(1)
  await sleep(100); await actionPass(2)
  await sleep(100); await actionPass(4)
  await sleep(100); await actionCout(0, ['3',])

  await sleep(100); await actionCout(1, ['5',])
  await sleep(100); await actionCout(1, ['8',])
  await sleep(100); await actionCout(1, ['K',])
  await sleep(100); await actionCout(1, ['2',])
  await sleep(100); await actionCout(1, ['3',])

  await sleep(100); console.log(cards)


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

  // await actionExec(rk = '4')

  await sleep(100)

  await giveUp4d()

  await sleep(100)

  await actionExecOk()

  await sleep(100)

  await onCardsTestGame()

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
  actionCask,
  actionPass,
  sleep,
  // status
  showCardsOnHand,
  // main
  main,
}




