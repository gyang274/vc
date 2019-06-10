const _ = require('lodash')

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const core = require('./core')

const port = process.env.PORT || 3000;

server.listen(
  port, () => {
    console.log(`server listen at ${port}..`)
  }
)

let route = {
  name: 'room', params: {}
}

let seats =  [
  { id: 0, name: '', status: 'room' }, 
  { id: 1, name: '', status: 'room' },
  { id: 2, name: '', status: 'room' },
  { id: 3, name: '', status: 'room' },
  { id: 4, name: '', status: 'room' },
  { id: 5, name: '', status: 'room' },
]
// seats: status: <'none'> -> 'room' -> 'sitd' ->
//  'wait' -> 'exec' -> 'execOk' -> 'play' ->auto 'ende' ->auto 'wait'

let cards = [
  [], [], [], [], [], [], 
]

let cardsOut = []

let notes = core.setNotes()

let initId = -1


io.on('connection', (socket) => {

  console.log('connection from:', socket.id)

  // set user { name, room, table, seat, .. }
  socket.user = { name: '', room: '', seat: -1 }

  // set user name
  socket.on('set-user-name', (payload) => {

    if (socket.user.name === '') {

      console.log('set-user-name:', payload)

      socket.user.name = payload.name
  
      socket.broadcast.emit('srv-user-join', payload)
  
      // set user seat/hands from server (@reconnection)
      seats.forEach(seat => {
        if (seat.name === payload.name) {
          socket.user.seat = seat.id
          socket.emit('srv-set-user-attr', { seat: seat.id })
        }
      })
  
      socket.emit('srv-set-route', route)

    }

  })

  // set user seat
  socket.on('set-user-seat-sit-down', (payload) => {

    console.log('set-user-seat-sit-down:', socket.user.name, 'from seat', socket.user.seat, 'to seat', payload)

    if (socket.user.seat !== -1) {
      seats[socket.user.seat].name = ''
      seats[socket.user.seat].status = 'room'
    }

    socket.user.seat = payload.id

    if (seats[payload.id].name === '') {

      seats[payload.id].name = socket.user.name
      seats[payload.id].status = 'wait' 

      socket.broadcast.emit('srv-set-seats-sit-down', {
        id: payload.id, name: socket.user.name
      })

    } else {

      socket.emit('srv-set-seats-sit-down', {
        id: payload.id, name: seats[payload.id].name
      })

    }
    
    if (_(seats).map('status').every(v => v === 'wait')) {

      route = {
        name: 'table', params: {}
      }

      io.emit('srv-set-route', route)

    }

  })

  // set user unseat
  socket.on('set-user-seat-stand-up', (payload) => {
    
    console.log('set-user-seat-stand-up:', socket.user.name, 'from seat', payload)

    socket.user.seat = -1

    seats[payload.id].name = ''
    seats[payload.id].status = 'room'

    socket.broadcast.emit('srv-set-seats-stand-up', {
      id: payload.id, name: socket.user.name
    })

  })

  // set user hand wait ok
  //  broadcast emit srv-user-hand-wait-ok
  //  check all wait-ok and emit srv-hands-init
  socket.on('set-user-hand-wait-ok', (payload) => {

    // seats[socket.user.seat].status = 'waitOk'
    seats[payload.seat].status = 'waitOk'

    socket.broadcast.emit('srv-user-hand-wait-ok', payload)

    io.emit(
      'srv-messages-addon', {
        msgs: [ ':' + payload.name + '迫不及待要抓牌了！' ] 
      }
    )

    if (_(seats).map('status').every(v => v === 'waitOk')) {

      cards = core.setCards()

      notes = core.setNotes()

      notes.cardsInit = cards

      io.emit('srv-hands-init')

    }

  })

  // set user hand exec
  socket.on('set-user-hand-exec', (payload) => {

    console.log('set-user-hand-exec', payload)
    
    socket.broadcast.emit(
      'srv-user-hand-exec', payload
    )

    // track the exec in cards
    cards[payload.seat] = _.sortBy(
      _.pullAt(cards[payload.seat], payload.cardsIndex), ['rnum', 'snum']
    )

    cards[payload.id] = _.sortBy(
      cards[payload.id].concat(payload.cards), ['rnum', 'snum']
    )

    // track the exec nodes
    notes.cardsExec.push(
      { src: payload.seat, dst: payload.id, cards: payload.cards }
    )

    // io.emit the exec message
    msg = ''
    if (payload.id < seats.length) {
      msg = ':' + seats[payload.seat].name + '给了' + seats[payload.id].name + core.cardsToString(payload.cards)
    } else {
      msg = ':' + seats[payload.seat].name + '弃了' + core.cardsToString(payload.cards)    
    }

    io.emit('srv-messages-addon', { msgs: [ msg ] })

  })

  // set user hand exec ok
  //  broadcast emit srv-user-hand-exec-ok
  //  check all wait-ok and emit srv-hands-play
  socket.on('set-user-hand-exec-ok', (payload) => {

    console.log('set-user-hand-exec-ok', payload)

    seats[socket.user.seat].status = 'execOk'

    socket.broadcast.emit('srv-user-hand-exec-ok', payload)

    io.emit(
      'srv-messages-addon', { 
        msgs: [ ':' + payload.name + '迫不及待要开打了！' ] 
      }
    )

    if (_(seats).map('status').every(v => v === 'execOk')) {

      notes.prevId = -1

      if (initId === -1) {
        notes.asksId = _.random(0, 5)
      } else {
        notes.asksId = initId
      }
      
      console.log('set-user-hand-exec-ok -> srv-hands-play|cards:', cards)

      io.emit('srv-hands-play')

      io.emit(
        'srv-messages-addon', { 
          msgs: [ ':' + '开打！', ':' + seats[notes.asksId].name + '先出！'] 
        }
      )

      io.emit('srv-hands-next', { id: notes.asksId })

    }

  })

  // set user hand pass
  socket.on('set-user-hand-pass', (payload) => {

    console.log('set-user-hand-pass|before:', notes.status)

    if (notes.status[payload.seat] === 'pass') {
      notes.status[payload.seat] = 'give'
    } else {
      notes.status[payload.seat] = 'pass'
    }

    for (let i = 1; i < 6; i++) {
      notes.asksId = (payload.seat + i) % 6
      if (!['pass', 'give', 'ende'].includes(note.status[notes.asksId])) {
        io.emit('srv-hands-next', { id: notes.asksId })
      }
    }

    console.log('set-user-hand-pass|after:', notes.status)

  })

  // set user hand cask
  socket.on('set-user-hand-cask', (payload) => {
    socket.broadcast.emit(
      'srv-user-hand-cask', payload
    )
  })

  // set-user-hand-cout
  socket.on('set-user-hand-cout', (payload) => {

    // check core.isCardsOutValid on client side
    // check core.isCardsOutBeatenPrevCardsOut on client side

    socket.broadcast.emit(
      'srv-user-hand-cout', payload 
    )

    // track cout in cards
    cards[payload.seat] = _.sortBy(
      _.pullAt(cards[payload.seat], payload.cardsIndex), ['rnum', 'snum']
    )

    // track cout in notes
    if (notes.hands.length >= 1) {
      notes.prevHand = notes.currHand
      notes.status[prevHand.seat] = 'play'
    }

    notes.currHand = {
      name: payload.name, seat: payload.seat, cards: payload.cards
    }
    notes.status[currHand.seat] = 'cout'

    notes.hands.push(notes.currHand)

    // 判断 点 闷 烧 落
    // 4 -> 判断开点
    if (notes.numAck === 6 && core.isCardsOut4d(payload.cards)) {

      // corner case: user play 4 directly on 1st action
      if (!_.isEmpty(notes.prevHand) 
        && notes.prevHand.seat === payload.seat 
        && core.isCardsOutGoJi4Kd(notes.prevHand.cards)
      ) {
        notes.dian.push(payload.seat)
        io.emit(
          'srv-messages-addon', {
            msgs: [ ':' + '恭喜' + payload.name + '开点' ] 
          }
        )
      }

    }
    
    // 判断闷人
    if (!_.isEmpty(notes.prevHand)) {
      if (cards[notes.prevHand.seat].length === 1
       && notes.prevHand.seat !== (payload.seat + 3) % 6
       && notes.prevHand.seat !== payload.seat
      ) {
        notes.mens.push({
          src: payload.seat, dst: notes.prevHand.seat
        })
        io.emit(
          'srv-messages-addon', {
            msgs: [ ':' + payload.name + '闷了' + notes.prevHand.name ] 
          }
        )
        io.emit('srv-user-hand-cout', {
          id: notes.prevHand.seat, cards: cards[notes.prevHand.seat], cardsIndex: 0
        })
        cards[notes.prevHand.seat] = []
        for (let i = 5; i > -1; i--) {
          if (_.isUndefined(notes.lake.indexOf(i))) {
            notes.lake[notes.prevHand.seat] = i
          }          
        }
        notes.numAck -= 1
        seatsHandsEndeProcess(io, socket)  
      }
    }

    // 够级 -> 判断烧人 TODO

    // 3 -> 判断科落 判断牌局结束
    if (core.isCardsOut3d(payload.cards)) {

      notes.lake[payload.seat] = 6 - notes.numAck

      notes.numAck -= 1

      seatsHandsEndeProcess(io, socket)
  
    }

    // Go Next AsksId
    if (notes.numAck > 4) {

      if (notes.prevHand.seat === payload.seat) {
        notes.status.forEach(
          (s, i, a) => { if (s !== 'ende') { a[i] = 'play' } }
        )
      }
      
      if (core.isCardsOutGoJi(payload.cards)) {

        // 5-6人 && 够级 -> 对家 || 无头 (下家, 上家)
        notes.asksId = (payload.seat + 3) % 6

        if (notes.status[notes.asksId] === 'ende') {
          notes.asksId = (payload.seat + 1) % 6
          if (notes.status[notes.asksId] === 'give') {
            notes.asksId = (payload.seat + 5) % 6
            if (notes.status[notes.asksId] === 'give') {
              notes.asksId = payload.seat
            }
          }
        } else if (notes.status[notes.asksId] === 'give') {
          notes.asksId = payload.seat
        }

      } else {

        // 5-6人 不打够级 -> 跳过pass/ende 顺位依次 对家双重give确认
        let doubleAsksSeatO = true
        for (let i = 1; i < 6; i++) {
          notes.asksId = (payload.seat + i) % 6
          if (!['pass', 'give', 'ende'].includes(notes.status[notes.asksId])) {
            doubleAsksSeatO = false
            break
          }
        }
        if (doubleAsksSeatO) {
          notes.asksId = (payload.seat + 3) % 6
          if (notes.status[notes.asksId] === 'give'
           || notes.status[notes.asksId] === 'ende'
          ) {
            notes.asksId = payload.seat
          }
        }

      }

    } else {

      // 2-4人 || 不打够级 -> 顺位依次
      notes.asksId = (payload.seat + 1) % 6

    }

    io.emit('srv-hands-next', { id: notes.asksId })

  })




  socket.on('set-user-hand-ende', (payload) => {

    console.log('set-user-hand-ende|error: decide from server side, remove decisions from client side.')

  })


  // get-seats
  socket.on('get-names', (payload, fn) => {
    fn(_.map(seats, 'name'))
  })

  // get-route
  socket.on('get-route', (payload, fn) => {
    fn(route)
  })

  // get-hands
  socket.on('get-cards', (payload, fn) => {
    if (payload.id === socket.user.seat) {
      fn(cards[socket.user.seat])
    } else {
      console.log('get-cards:', 'mismatch', payload, 'and', socket.user, '?')
      fn([])
    }
  })

  // disconnect
  socket.on('disconnect', () => {
    socket.broadcast.emit(
      'srv-user-left', {
        name: socket.user.name
      }
    )
    socket.broadcast.emit(
      'srv-messages-addon', {
        msgs: [
          ':' + socket.user.name + '掉线啦！'
        ]
      }
    )
  })

})


function seatsHandsEndeProcess (io, socket) {

  seats[payload.seat].status = 'ende'

  io.emit(
    'srv-user-hand-ende', {
      'id': payload.seat, cards: [],
    }
  )

  io.emit(
    'srv-messages-addon', {
      msgs: [ 
        ':' + '恭喜' + payload.name + '拿到' + [
          '头科', '二科', '三科', '四科', '二落', '大落'
        ][notes.lake[payload.seat]]
      ]
    }
  )

  console.log('seats: ', seats)
  
  // _(seats).map('status').every(v => v === 'ende')
  if (core.isGameEnde(cards)) {

    if (notes.numAck > 3) {
      console.log(
        'set-user-hand-cout -> srv-user-hand-ende -> srv-hands-ende' + '|' +
        'sth. wrong? server decide the game is ended earlier than it should be!'
      )
    }
    let idx = -1
    for (let i = 0; i < 6; i++) {
      idx = (payload.seat + i) % 6 
      if (!_.isEmpty(cards[idx])) {
        for (let j = 0; j < 6; j++) {
          if (_.isUndefined(notes.lake.indexOf(i))) {
            notes.lake[idx] = j
          }
        }
        notes.numAck -= 1
        cards[idx] = []
      }
    }
    
    cards = [
      [], [], [], [], [], [], 
    ]

    cardsOut = [

    ]

    initId = notes.lake.indexOf(5)

    // TODO: (in core) stats from notes on dsml
    payload.news = core.resNotes(notes)

    io.emit('srv-hands-ende', payload)

  }

}