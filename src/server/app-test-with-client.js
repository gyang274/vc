// app-test-with-client.js

const _ = require('lodash')

const io = require('socket.io-client')

const core = require('./core')

const appTest = require('./app-test')


// open a browser and sign in one or more client(s)

// numNPC = 6 - <numUserFromBrowser>
let numNPC = 5

// main
async function main () {
  
  await appTest.init(numNPC)

  await appTest.setNames()

  await appTest.setSeats()

  await appTest.getNames()

  console.log('快点开始！')
  
  await appTest.sleep(10000)

  console.log('NPC开始！')

  await appTest.actionWaitOk(isCardsTest = true)

}


main()
