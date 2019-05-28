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
  { id: 0, username: '', status: 'room' }, 
  { id: 1, username: 'fyy', status: 'exec' },
  { id: 2, username: 'def', status: 'exec' },
  { id: 3, username: 'zzz', status: 'exec' },
  { id: 4, username: 'hij', status: 'exec' },
  { id: 5, username: 'lmn', status: 'exec' },
]

// seats: status: 'room' -> 'wait' -> 'exec' -> 'play' -> 'wait'

let hands = [
  {}, {}, {}, {}, {}, {}
]

io.on('connection', (socket) => {

  console.log('connection from:', socket.id)

  // set user { name, room, seat, .. }
  socket.user = { name: '', room: '', seat: 0 }

  // set user name
  socket.on('set-user-name', (payload) => {

    if (socket.user.name === '') {

      console.log('set-user-name:', payload)

      socket.user.name = payload.name
  
      socket.broadcast.emit('srv-user-join', payload)
  
      // set user seat/hands from server
      seats.forEach(seat => {
        if (seat.username === payload.username) {
          socket.user.seat = seat.id
          socket.emit('srv-set-user-attr', { seat: seat.id })
        }
      })
  
      socket.emit('srv-set-route', route)

    }

  })

  // set user seat
  socket.on('set-user-seat', (payload) => {

    console.log('set-user-seat:', socket.user.name, 'from seat', socket.user.seat, 'to seat', payload)

    if (socket.user.seat !== -1) {
      seats[socket.user.seat].username = ''
      seats[socket.user.seat].status = 'room'
    }

    socket.user.seat = payload.seat

    seats[payload.seat].username = socket.user.name
    seats[payload.seat].status = 'wait' 

    io.emit('srv-seats-set', seats)

    if (_(seats).map('status').every(v => v === 'wait')) {

      route = {
        name: 'table', params: {}
      }

      io.emit('srv-set-route', route)

    }

  })

  // set user unseat
  socket.on('set-user-unseat', (payload) => {
    
    console.log('set-user-unseat:', socket.user.name, 'from seat', payload)

    socket.user.seat = -1

    seats[payload.seat].username = ''
    seats[payload.seat].status = 'room'

    io.emit('srv-seats-set', seats)

  })

  // set user hand ready
  socket.on('set-user-hand-ready', (payload) => {

    console.log('payload', payload)

    seats[socket.user.seat].status = 'exec'

    if (_(seats).map('status').every(v => v === 'exec')) {

      hands = core.setHands()

      io.emit('srv-new-hands')

    }

  })




  // get-seats
  socket.on('get-seats', (payload, fn) => {
    fn(seats)
  })

  // get-route
  socket.on('get-route', (payload, fn) => {
    fn(route)
  })

  // get-hands
  socket.on('get-hands', (payload, fn) => {
    // payload: { seat: [0-6], username: '' }
    fn(hands[socket.user.seat])
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit(
      'srv-user-left', {
        username: socket.user.name
      } 
    )
  })


})



function initHands (io, socket) {

  let hands = core.setHands()

  console.log('initHands:', hands[0].cards[0])

  socket.emit('srv-new-hands', hands[socket.user.seat])


}


function exHands (io, socket) {

}

function onHands (io, socket) {

}