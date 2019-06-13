// app-test-msgs.js
const _ = require('lodash')

const io = require('socket.io-client')

socket = io.connect('http://127.0.0.1:3000')

socket.on(
  'srv-message-addon', payload => { console.log(payload) }
)