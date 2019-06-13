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

let asksId = -1


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

      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + '欢迎' + payload.name + '进入够级大厅！']
        }
      )
  
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
    seats[payload.id].status = 'waitOk'

    socket.broadcast.emit('srv-user-hand-wait-ok', payload)

    io.emit(
      'srv-messages-addon', {
        messages: [ ':' + payload.name + '迫不及待要抓牌了！' ] 
      }
    )

    if (_(seats).map('status').every(v => v === 'waitOk')) {

      cards = core.setCards()

      notes = core.setNotes()

      notes.names = _.map(seats, 'name')

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
    _.pullAt(cards[payload.id], payload.cardsIndex)
    
    if (payload.jd === payload.id) {
      // exec cards to deadwood
    } else {
      // exec cards to someones
      cards[payload.jd] = _.sortBy(
        cards[payload.jd].concat(payload.cards), ['rnum', 'snum']
      )
    }
    
    // track the exec nodes
    notes.cardsExec.push(
      { src: payload.id, dst: payload.jd, cards: payload.cards }
    )

    // io.emit the exec message
    let message = ''
    if (payload.id === payload.jd) {
      message = ':' + seats[payload.id].name + '弃了' + core.cardsToString(payload.cards)
    } else {
      message = ':' + seats[payload.id].name + '给了' + seats[payload.jd].name + core.cardsToString(payload.cards)
    }
    io.emit('srv-messages-addon', { messages: [ message ] })
    console.log('set-user-hand-exec', message)

  })

  // set user hand exec ok
  //  broadcast emit srv-user-hand-exec-ok
  //  check all wait-ok and emit srv-hands-play
  socket.on('set-user-hand-exec-ok', (payload) => {

    console.log('set-user-hand-exec-ok', payload)

    seats[socket.user.seat].status = 'execOk'

    socket.broadcast.emit('srv-user-hand-exec-ok', payload)

    let message = ':' + payload.name + '迫不及待要开打了！'
    io.emit(
      'srv-messages-addon', { 
        messages: [ message ] 
      }
    )
    console.log('set-user-hand-exec-ok', message)

    if (_(seats).map('status').every(v => v === 'execOk')) {

      if (asksId === -1) { asksId = _.random(0, 5) }
      
      // console.log('set-user-hand-exec-ok -> srv-hands-play|cards:', cards)

      // seats.forEach((seat) => { seat.status = 'play' })

      io.emit('srv-hands-play')

      io.emit('srv-hands-next', { id: asksId })

      message = [':' + '开打！', ':' + seats[asksId].name + '先出！']
      io.emit(
        'srv-messages-addon', { 
          messages: [ ...message ]
        }
      )
      console.log('set-user-hand-exec-ok', message)

    }

  })

  // set user hand pass
  socket.on('set-user-hand-pass', (payload) => {

    console.log('set-user-hand-pass|init:', notes.status)

    notes.status[payload.id] = 'pass'

    asksId = core.setHandNextPass(notes, payload)

    io.emit('srv-hands-next', { id: asksId })

    console.log('set-user-hand-pass|after:', notes.status)

  })

  // set user hand cask
  socket.on('set-user-hand-cask', (payload) => {
    
    console.log('set-user-hand-cask|init:', notes.status)

    notes.status[payload.id] = 'cask'

    asksId = core.setHandNextCask(notes, payload)

    io.emit('srv-hands-next', { id: asksId })

    console.log('set-user-hand-cask|after:', notes.status)

  })

  // set-user-hand-cout
  socket.on('set-user-hand-cout', (payload) => {

    // check core.isCardsOutValid on client side
    // check core.isCardsOutBeatenPrevCardsOut on client side

    console.log('set-user-hand-cout|init status:', notes.status)

    console.log('set-user-hand-cout', payload)

    socket.broadcast.emit(
      'srv-user-hand-cout', payload 
    )

    // track cout in cards
    cards[payload.id] = _.sortBy(
      _.pullAt(cards[payload.id], payload.cardsIndex), ['rnum', 'snum']
    )

    // track cout in notes
    if (notes.hands.length >= 1) {
      notes.prevHand = notes.currHand
      notes.status[notes.prevHand.id] = 'play'
    }

    notes.currHand = {
      id: payload.id, name: payload.name, cards: payload.cards
    }
    notes.status[notes.currHand.id] = 'cout'

    notes.hands.push(notes.currHand)

    notes.status.forEach((status, index, array) => {
      if (status === 'cask') { array[index] = 'pass' }
    })

    if (notes.prevHand.id === notes.currHand.id) {
      notes.status.forEach(
        (status, index, array) => { 
          if (status !== 'ende') { array[index] = 'play' }
        }
      )
    }

    // 判断 点 闷 烧 落
    // 判断开点
    if (core.isHandDian(notes, payload)) {
      notes.dian[payload.id] = true
      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '开点！' ]
        }
      )
    }

    // 判断烧人
    // must determine shaoBkUp before shaoInit
    //  because of reverse shao (反烧/烧烧)
    if (core.isHandShaoEnde(notes, payload)) {

      notes.shao[0].on = false

      io.emit(
        'srv-message-addon', {
          messages: [ ':' + notes.shao[0].src + '烧了' + notes.shao[0].dst + '！' ]
        }
      )

    }

    if (core.isHandShaoBkUp(notes, payload)) {

      io.emit(
        'srv-message-addon', {
          messages: [ ':' + payload.name + '解烧' + notes.shao[0].src + '！' ]
        }
      )
      
      _.pullAt(notes.shao, 0)


    }

    if (core.isHandShaoGoOn(notes, payload)) {
      if (!_.isEmpty(notes.shao) && notes.shao.on) {
        io.emit(
          'srv-message-addon', {
            messages: [ `:${payload.name}烧牌不带王？扣币！` ]
          }
        )
      }
    }

    if (core.isHandShaoInit(notes, payload)) {

      notes.shao.unshift(
        { src: payload.id, dst: notes.prevHand.id, on: true}
      )

      io.emit(
        'srv-message-addon', {
          messages: [ ':' + notes.shao[0].src + '要烧' + notes.shao[0].dst + '！' ]
        }
      )

    }

    // 判断闷人
    if (core.isHandMens(notes, payload, cards)) {
      notes.mens.push({
        src: payload.id, dst: notes.prevHand.id
      })
      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '闷了' + notes.prevHand.name ] 
        }
      )
      io.emit(
        'srv-user-hand-show', {
          id: notes.prevHand.id, cards: cards[notes.prevHand.id], cardsIndex: 0
        }
      )
      cards[notes.prevHand.id] = []
      for (let i = 5; i > -1; i--) {
        if (_.isUndefined(notes.lake.indexOf(i))) {
          notes.lake[notes.prevHand.id] = i
        }          
      }
      notes.numAck -= 1
      seatsHandsEndeProcess(io, socket, {
        id: notes.prevHand.id, name: notes.prevHand.name
      })  
    }
    
    // 判断科落 -> 判断牌局结束
    if (core.isHandLake(notes, payload)) {

      if (cards[payload.id].length === 0) {
        for (let i = 0; i < 6; i++) {
          if (_.isUndefined(notes.lake.indexOf(i))) {
            notes.lake[payload.id] = i
          }
        }
      } else {
        console.log('set-user-hand-cout|core.isHandLake|sth. wrong? 3 must be out at last.')
      }
      
      notes.status[payload.id] = 'ende'

      notes.numAck -= 1

      seatsHandsEndeProcess(io, socket, payload)
  
    }

    // Go Next with asksId
    asksId = core.setHandNextCout(notes, payload)
    
    io.emit('srv-hands-next', { id: asksId })

    console.log('set-user-hand-cout|ende status:', notes.status)

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

  // get-cards
  socket.on('get-cards', (payload, fn) => {
    if (payload.id === socket.user.seat) {
      fn(cards[socket.user.seat])
    } else {
      console.log('get-cards:', 'mismatch', payload, 'and', socket.user, '?')
      fn([])
    }
  })

  // set-cards
  //  require by app-test.js
  // socket.on('set-cards', (payload) => { cards = payload })

  // disconnect
  socket.on('disconnect', () => {
    socket.broadcast.emit(
      'srv-user-left', {
        name: socket.user.name
      }
    )
    socket.broadcast.emit(
      'srv-messages-addon', {
        messages: [
          ':' + '玩家' + socket.user.name + '拜拜！'
        ]
      }
    )
  })

})


function seatsHandsEndeProcess (io, socket, payload) {

  // notes.status[payload.id] = 'ende'

  seats[payload.id].status = 'ende'

  io.emit(
    'srv-user-hand-ende', {
      'id': payload.id, cards: [],
    }
  )

  io.emit(
    'srv-messages-addon', {
      messages: [ 
        ':' + '恭喜' + payload.name + '拿到' + core.lakeStr[notes.lake[payload.id]]
      ]
    }
  )

  console.log('seats: ', seats)
  
  // _(seats).map('status').every(v => v === 'ende')
  if (core.isGameEnde(notes)) {

    if (notes.numAck > 3) {
      console.log(
        'set-user-hand-cout -> srv-user-hand-ende -> srv-hands-ende' + '|' +
        'sth. wrong? server decide the game is ended earlier than it should be!'
      )
    }
    let idx = -1
    for (let i = 0; i < 6; i++) {
      idx = (payload.id + i) % 6 
      if (!_.isEmpty(cards[idx])) {
        for (let j = 0; j < 6; j++) {
          if (_.isUndefined(notes.lake.indexOf(i))) {
            notes.lake[idx] = j
          }
        }
        cards[idx] = []
        notes.numAck -= 1
      }
    }
    
    cards = [
      [], [], [], [], [], [], 
    ]

    cardsOut = [

    ]

    asksId = notes.lake.indexOf(5)

    // TODO: (in core) stats from notes on dsml
    payload.news = core.resNotes(notes)

    // core.writeNotes(notes)

    io.emit('srv-hands-ende', payload)

  }

}