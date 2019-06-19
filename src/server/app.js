const _ = require('lodash')
const express = require('express')

const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const core = require('./core')

const port = process.env.PORT || 3000;

app.use(express.static('./dist'))

server.listen(
  port, () => {
    console.log(`server listen at ${port}..`)
  }
)

let route = {
  name: 'room', params: {}
}

let seats =  [
  { id: 0, name: '', status: 'room', title: '平民', coins: 100, }, 
  { id: 1, name: '', status: 'room', title: '平民', coins: 100, },
  { id: 2, name: '', status: 'room', title: '平民', coins: 100, },
  { id: 3, name: '', status: 'room', title: '平民', coins: 100, },
  { id: 4, name: '', status: 'room', title: '平民', coins: 100, },
  { id: 5, name: '', status: 'room', title: '平民', coins: 100, },
]
// seats: status: <'none'> -> 'room' -> 'sitd' ->
//  'wait' -> 'exec' -> 'execOk' -> 'play' ->auto 'ende' ->auto 'wait'

let asksId = -1

let cards = [
  [], [], [], [], [], [], 
]

let notes = core.setNotes()


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

      // TODO: read user info from db and sent back to client
      
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
          if (!_(seats).map('status').every(v => v === 'room' || v === 'wait')) {
            route = {
              name: 'table', params: {}
            }
            socket.emit('srv-hand-init', {})
            socket.emit('srv-hands-next', { id: asksId })
          }
        }
      })
  
      socket.emit('srv-set-route', route)

    }

  })

  // set user seat
  socket.on('set-user-seat-sit-down', (payload) => {

    console.log('set-user-seat-sit-down:', socket.user.name, 'from seat', socket.user.seat, 'to seat', payload)

    // if (socket.user.seat !== -1) {
    //   seats[socket.user.seat].name = ''
    //   seats[socket.user.seat].status = 'room'
    //   socket.broadcast.emit('srv-set-seats-stand-up', {
    //     id: socket.user.seat, name: socket.user.name
    //   })
    // }

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

      // cards = core.setCardsTest()
      cards = core.setCards()
      
      notes = core.setNotes()

      notes.names = _.map(seats, 'name')

      // literal copy of cards
      // notes.cardsInit = cards
      notes.cardsInit = JSON.parse(JSON.stringify(cards))

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

      // 无级自开

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

    // console.log('set-user-hand-pass|init:', notes.status)

    if (notes.status[payload.id] === 'cout') {
      asksId = payload.id
      seats[payload.id].coins -= 1000
      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '故过延时（故意过牌以求得延时），罚币！' ]
        }
      )
    } else {
      notes.status[payload.id] = 'pass'
      asksId = core.setHandNextPass(notes, payload)
    }

    
    io.emit('srv-hands-next', { id: asksId })

    console.log('set-user-hand-pass|ende:', notes.status)

    console.log(`set-user-hand-pass|next: ${asksId}`)

  })

  // set user hand cask
  socket.on('set-user-hand-cask', (payload) => {
    
    // console.log('set-user-hand-cask|init:', notes.status)

    notes.status[payload.id] = 'cask'

    asksId = core.setHandNextCask(notes, payload)

    io.emit('srv-hands-next', { id: asksId })

    console.log('set-user-hand-cask|ende:', notes.status)

    console.log(`set-user-hand-cask|next: ${asksId}`)

  })

  // set-user-hand-cout
  socket.on('set-user-hand-cout', (payload) => {

    // check core.isCardsOutValid on client side
    // check core.isCardsOutBeatenPrevCardsOut on client side

    // console.log('set-user-hand-cout|init: ' + notes.status)

    console.log(payload)

    socket.broadcast.emit(
      'srv-user-hand-cout', payload 
    )

    // track cout in cards
    _.pullAt(cards[payload.id], payload.cardsIndex)
    cards[payload.id] = _.sortBy(cards[payload.id], ['rnum', 'snum'])
    
    // track cout in notes
    if (notes.hands.length >= 1) {
      notes.prevHand = notes.currHand
      if (notes.status[notes.prevHand.id] !== 'ende') {
        notes.status[notes.prevHand.id] = 'play'
      }
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
          if (status !== 'ende' && status !== 'cout') { array[index] = 'play' }
        }
      )
    }

    // 判断 点 闷 烧 落
    // 判断开点
    if (core.isHandDian(notes, payload)) {
      notes.dian[payload.id] = true
      io.emit(
        'srv-user-note', [
          // kb: 开与被开
          { id: payload.id, dmsl: 'dian', kb: 0, kd: true, },
          { id: (payload.id + 3) % 6, dmsl: 'dian', kb: 1, kd: true, },
        ]
      )
      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '开点！' ]
        }
      )
      console.log(':' + payload.name + '开点！' )
    }

    // 判断烧人
    // must determine shaoBkUp before shaoInit
    //  because of reverse shao (反烧/烧烧)
    if (core.isHandShaoEnde(notes, payload)) {

      notes.shao[0].on = false

      io.emit(
        'srv-user-note', [
          { id: notes.shao[0].src, dmsl: 'shao', kb: 0, kd: true, },
          { id: notes.shao[0].dst, dmsl: 'shao', kb: 1, kd: true, },
        ]
      )

      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + notes.names[notes.shao[0].src] + '烧了' + notes.names[notes.shao[0].dst] + '！' ]
        }
      )

      console.log(':' + notes.names[notes.shao[0].src] + '烧了' + notes.names[notes.shao[0].dst] + '！')

    }

    if (core.isHandShaoBkUp(notes, payload)) {

      _.pullAt(notes.shao, 0)

      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '解烧' + notes.prevHand.name + '！' ]
        }
      )
      
      console.log(':' + payload.name + '解烧' + notes.prevHand.name + '！')
      
    }

    if (core.isHandShaoGoOn(notes, payload)) {
      if (!core.isCardsOutTd(payload.cards)) {
        _.pullAt(notes.shao, 0)
        io.emit(
          'srv-messages-addon', {
            messages: [ `:${payload.name}烧牌不带王？扣币！` ]
          }
        )
        console.log(`:${payload.name}烧牌不带王？扣币！`)
        seats[payload.id].coins -= 1000
      }
    }

    if (core.isHandShaoInit(notes, payload)) {

      notes.shao.unshift(
        { src: payload.id, dst: notes.prevHand.id, on: true }
      )

      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '要烧' + notes.prevHand.name + '！' ]
        }
      )

      console.log(':' + payload.name + '要烧' + notes.prevHand.name + '！')
    }

    // 判断闷人
    if (core.isHandMens(notes, payload, cards)) {
      
      notes.mens.push({
        src: payload.id, dst: notes.prevHand.id
      })
      io.emit(
        'srv-user-note', [
          { id: notes.mens[notes.mens.length - 1].src, dmsl: 'mens', kb: 0, kd: true, },
          { id: notes.mens[notes.mens.length - 1].dst, dmsl: 'mens', kb: 1, kd: true, },
        ]
      )
      io.emit(
        'srv-messages-addon', {
          messages: [ ':' + payload.name + '闷了' + notes.prevHand.name ] 
        }
      )
      console.log(':' + payload.name + '闷了' + notes.prevHand.name)
      // io.emit(
      //   'srv-user-hand-cout', {
      //     id: notes.prevHand.id, cards: cards[notes.prevHand.id], cardsIndex: 0, show: true
      //   }
      // )
      cards[notes.prevHand.id] = []
      for (let i = 5; i > -1; i--) {
        if (notes.lake.indexOf(i) === -1) {
          notes.lake[notes.prevHand.id] = i
          break
        }          
      }
      
      isHandEndeProcess(io, socket, {
        id: notes.prevHand.id, name: notes.prevHand.name
      })

    }
    
    // 判断科落 -> 判断牌局结束
    if (core.isHandLake(notes, payload)) {

      if (cards[payload.id].length === 0) {
        for (let i = 0; i < 6; i++) {
          if (notes.lake.indexOf(i) === -1) {
            notes.lake[payload.id] = i
            break
          }
        }
      } else {
        console.log('set-user-hand-cout|core.isHandLake|sth. wrong? 3 must be out at last.')
      }

      isHandEndeProcess(io, socket, payload)
  
    }

    // Go Next with asksId
    if (!core.isGameEnde(notes)) {

      asksId = core.setHandNextCout(notes, payload)
    
      io.emit('srv-hands-next', { id: asksId })

      console.log('set-user-hand-cout|ende: ' + notes.status)

      console.log(`set-user-hand-cout|next: ${asksId}`)

    } else {

      isGameEndeProcess(io, socket, payload)

      console.log('set-user-hand-cout->srv-hands-ende|seats:', seats)

      console.log('set-user-hand-cout->srv-hands-ende|seats:', cards)
      
      console.log('set-user-hand-cout->srv-hands-ende|seats:', notes)

    }
    

  })


  socket.on('set-user-hand-ende', (payload) => {

    console.log('set-user-hand-ende|error: decide from server side, remove decisions from client side.')

  })


  // get-seats
  socket.on('get-users', (payload, fn) => {
    fn({
      names: _.map(
        seats, 'name'
      ),
      infos: _.map(
        seats, (seat) => ({ title: seat.title, coins: seat.coins })
      )
    })
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

    // TODO： check user is playing
    isGameEndeProcess(io, socket, { id: socket.user.seat, name: socket.user.name })

    socket.broadcast.emit(
      'srv-messages-addon', {
        messages: [
          ':' + '玩家' + socket.user.name + '拜拜！'
        ]
      }
    )
  })

})


function setUser (name) {
  // TODO: add user registration and read user from database
  return {
    name: name, 
    status: '', 
    room: '', 
    table: '', 
    seat: -1,
    avatar: '' , 
    title: '', 
    coins: 0,
  }
}

function isHandEndeProcess (io, socket, payload) {

  seats[payload.id].status = 'ende'

  notes.status[payload.id] = 'ende'

  notes.numAck -= 1

  io.emit(
    'srv-user-hand-ende', {
      'id': payload.id, cards: [],
    }
  )

  io.emit(
    'srv-user-note', [
      { id: payload.id, dmsl: 'lake', kb: 0, kd: notes.lake[payload.id] < 4 },
      { id: payload.id, dmsl: 'lake', kb: 1, kd: notes.lake[payload.id] > 2 },
    ]
  )

  io.emit(
    'srv-messages-addon', {
      messages: [ 
        ':' + payload.name + '拿到' + core.lakeStr[notes.lake[payload.id]]
      ]
    }
  )

  console.log(':' + payload.name + '拿到' + core.lakeStr[notes.lake[payload.id]])

  console.log('seats:', seats)

  console.log('notes:', notes)

  console.log('isGameEnde', core.isGameEnde(notes))
  
}


function isGameEndeProcess (io, socket, payload) {

  console.log('isGameEndeProcess|payload:', payload)
  console.log('isGameEndeProcess|notes.dian:', notes.dian)
  console.log('isGameEndeProcess|notes.mens:', notes.mens)
  console.log('isGameEndeProcess|notes.shao:', notes.shao)
  console.log('isGameEndeProcess|notes.lake:', notes.lake)

  if (notes.numAck > 3) {
    console.log(
      'set-user-hand-cout -> srv-user-hand-ende -> srv-hands-ende' + '|' +
      'sth. wrong? server decide the game is ended earlier than it should be!'
    )
  }
  let idx = -1
  for (let i = 0; i < 6; i++) {
    idx = (payload.id + i) % 6 
    if (notes.lake[idx] === -1) {
      for (let j = 0; j < 6; j++) {
        if (notes.lake.indexOf(j) === -1) {
          notes.lake[idx] = j
          break
        }
      }
      cards[idx] = []
      notes.numAck -= 1
    }
  }

  // write into database
  // core.writeNotes(notes)

  // create results and refresh
  let results = {}

  results.news = core.resNotes(notes)

  asksId = notes.lake.indexOf(5)

  cards = [
    [], [], [], [], [], [], 
  ]

  notes = core.setNotes()

  seats.forEach(seat => { seat.status = 'ende' })

  seats.forEach((seat, index) => {
    seats[index].coins = seat.coins + results.news[index].points * 10
  })
  seats.forEach((seat, index) => {
    seats[index].title = seat.coins < 0 ? '贫民' : seat.coins < 200 ? '平民' : '士人'
  })

  results.userinfos = _.map(
    seats, (seat) => ({ title: seat.title, coins: seat.coins })
  )

  io.emit('srv-hands-ende', results)

  console.log('srv-hands-ende|results:', results)

}