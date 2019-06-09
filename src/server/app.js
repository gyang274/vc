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

let cardsOut = [
  [], [], [], [], [], [], 
]

// let onHand = [0, 0, 0]
let prevId = 0

let currId = 0

let nextId = 0

// let asksId = [] // for server to send signals


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
  socket.on('set-user-hand-wait-ok', (payload) => {

    console.log('set-user-hand-wait-ok', payload)

    seats[payload.seat].status = 'waitOk'
    // seats[socket.user.seat].status = 'waitOk'

    socket.broadcast.emit('srv-user-hand-wait-ok', payload)

    if (_(seats).map('status').every(v => v === 'waitOk')) {

      cards = core.setCards()

      io.emit('srv-hands-init')

    }

  })

  // set user hand exec
  socket.on('set-user-hand-exec', (payload) => {
    // TODO send news out..
    socket.broadcast.emit(
      'srv-user-hand-exec', payload
    )
  })

  // set user hand exec ok
  socket.on('set-user-hand-exec-ok', (payload) => {

    console.log('set-user-hand-exec-ok', payload)

    seats[socket.user.seat].status = 'execOk'

    socket.broadcast.emit('srv-user-hand-exec-ok', payload)

    if (_(seats).map('status').every(v => v === 'execOk')) {

      io.emit('srv-plays-init')

    }

  })

  // set-user-hand-cout
  socket.on('set-user-hand-cout', (payload) => {

    // check core.isCardsOutValid on client side

    // TODO: check isGoJi, isGoJiZhen
  
    // clean previous cardsOut
    socket.broadcast.emit(
      'srv-user-hand-cout', {
        id: prevId, cards: []
      }
    )

    prevId = payload.id

    socket.broadcast.emit(
      'srv-user-hand-cout', payload 
    )

  })

  socket.on('set-user-hand-ende', (payload) => {

    seats[payload.id].status = 'ende'

    socket.broadcast.emit(
      'srv-user-hand-ende', {
        'id': payload.id, cards: []
      }
    )

    console.log('seats: ', seats)

    if (_(seats).map('status').every(v => v === 'ende')) {

      payload = {}
      
      payload.news = '这把打完，服务器现在比较笨，也不知道谁开没开点，烧没🔥人，自个自觉吧，静待服务器升级！'

      io.emit('srv-hands-ende', payload)

    }

  })

  // TODO

  // server need to decide when game is ende and show stats
  // restart everyone to wait




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
  })


})

