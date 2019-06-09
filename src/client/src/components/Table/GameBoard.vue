<template>
  <v-container fluid
    :style="{
      'background-color': 'rgb(63, 192, 63)'
    }"
  >
    <v-layout row wrap>
      <!-- 对家 -->
      <v-flex xs2></v-flex>
      <v-flex xs8>
        <apps-game-board-seat-o
          :username="usernames[3]"
          :cardsOut="cardsOut[3]"
          :status="status[3]"
          :note="notes[3]"
        ></apps-game-board-seat-o>
      </v-flex>
      <v-flex xs2></v-flex>
      <!-- 上联 & 上家 -->
      <v-flex xs4>
        <!-- 上联 -->
        <apps-game-board-seat-l
          :username="usernames[4]"
          :cardsOut="cardsOut[4]"
          :status="status[4]"
          :note="notes[4]"
        ></apps-game-board-seat-l>
        <!-- 上家 -->
        <apps-game-board-seat-l
          :username="usernames[5]"
          :cardsOut="cardsOut[5]"
          :status="status[5]"
          :note="notes[5]"
        ></apps-game-board-seat-l>
      </v-flex>
      <!-- 信息中心 -->
      <v-flex xs4 v-if="status.includes('exec') || _.every(status, s => s === 'ende')">
        
        <!-- // TODO move to a components -->
        <div><p>{{ news }}</p></div>

      </v-flex>
      <v-flex xs4 v-else><br><br><br>
      <!-- //TODO conditional display -->
        <div v-show="msgs !== ''"><p>{{ msgs }}</p></div>
      <br><br><br>
        <app-player-timer
          :seconds="seconds"
        ></app-player-timer>
      </v-flex>
      <!-- 下联 & 下家 -->
      <v-flex xs4>
        <!-- 下联 -->
        <apps-game-board-seat-r
          :username="usernames[2]"
          :cardsOut="cardsOut[2]"
          :status="status[2]"
          :note="notes[2]"
        ></apps-game-board-seat-r>
        <!-- 下家 -->
        <apps-game-board-seat-r
            :username="usernames[1]"
          :cardsOut="cardsOut[1]"
          :status="status[1]"
          :note="notes[1]"
        ></apps-game-board-seat-r>
      </v-flex>
      <!-- 自己 -->
      <v-flex xs2></v-flex>
      <v-flex xs8>  
        <apps-game-board-seat-i
          :username="usernames[0]"
          :cardsOnHand="cards"
          :cardsOnHandActiveIndex="cardsActiveIndex"
          :cardsOfHand="cardsOut[0]"
          :status="status[0]"
          :note="notes[0]"
          @action-wait-ok="actionWaitOk()"
          @action-exec="actionExec()"
          @action-exec-ok="actionExecOk()"
          @action-pass="actionPass()"
          @action-cask="actionCask()"
          @action-cout="actionCout()"
          @action-card-activate="actionCardActivate($event)"
        >
        <template slot="slot-player-selection">
          <v-select
            v-model="player"
            :items="players"
            item-text="name"
            item-value="id"
            label="玩家选择"
            return-object
          ></v-select>
        </template>
        </apps-game-board-seat-i>
      </v-flex>
      <v-flex xs2></v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import _ from 'lodash'

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  import PlayerTimer from './GameBoard/GameBoardSeat/PlayerTimer'
  import GameBoardSeatI from './GameBoard/GameBoardSeatI'
  import GameBoardSeatL from './GameBoard/GameBoardSeatL'
  import GameBoardSeatO from './GameBoard/GameBoardSeatO'
  import GameBoardSeatR from './GameBoard/GameBoardSeatR'

  export default {
    name: 'apps-game-board',
    components: {
      appsGameBoardSeatI: GameBoardSeatI,
      appsGameBoardSeatL: GameBoardSeatL,
      appsGameBoardSeatO: GameBoardSeatO,
      appsGameBoardSeatR: GameBoardSeatR,
      appsPlayerTimer: PlayerTimer,
    },
    props: {

    },
    data: () => ({
      usernames: [
        '', '', '', '', '', ''
      ],
      status: [
        'wait', 'wait', 'wait', 'wait', 'wait', 'wait',
      ],
      notes: [
        [], [], [], [], [], []
      ],
      cards: [

      ],
      cardsActiveIndex: [

      ],
      cardsOut: [
        [], [], [], [], [], []
      ],
      player: {
        name: '对家', id: 3
      },
      players: [
        { name: '对家', id: 3 },
        { name: '上家', id: 5 },
        { name: '下家', id: 1 },
        { name: '上联', id: 4 },
        { name: '下联', id: 2 },
        { name: '弃四', id: 6 },
      ],
      seconds: 20,
      // msgs from client side to this user
      msgs: '',
      // news from server side to all users
      news: '',
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user',
      }),
      // allow lodash to be accessible from template
      _ () {
        return _
      }
    },
    methods: {
      ...mapActions({
        setUserAttr: 'setUserAttr'
      }),
      actionWaitOk () {
        this.$set(this.status, 0, 'waitOk')
        this.socket.emit('set-user-hand-wait-ok', {
          username: this.user.name, seat: this.user.seat
        })
      },
      actionExec () {
        if (this.cardsActiveIndex.length > 0) {
          this.socket.emit('set-user-hand-exec', {
            username: this.user.name, seat: this.user.seat,
            id: (this.player.id + this.user.seat) % this.usernames.length,
            cards: _.pullAt(this.cards, this.cardsActiveIndex)
          })
          this.cardsActiveIndex = []
        }
      },
      actionExecOk () {
        // TODO: send message on board
        // check user must one and only one 3
        if (_.filter(this.cards, {'rank': '3'}).length === 1) {
          this.player = {
            name: '对家', id: 3
          }
          this.$set(this.status, 0, 'execOk')
          this.socket.emit('set-user-hand-exec-ok', {
            username: this.user.name, seat: this.user.seat
          })
        } else {
          this.mgs = '想开打您必须有且只有一张3！'
        }
      },
      actionPass () {
        console.log(
          'user', this.user.name, 
          'at seat', this.user.seat,
          'action-pass', this.cardsActiveIndex,
          'remember to reset activeCards to []'
        )
      },
      actionCask () {
        console.log('action cask')
      },
      actionCout () {
        if (this.cardsActiveIndex.length > 0) {
          let cardsOfHand = _.pullAt(this.cards, this.cardsActiveIndex)
          if (this.isCardsOutValid(cardsOfHand)) {
            this.cardsOut = [
              [], [], [], [], [], []
            ]
            this.$set(this.cardsOut, 0, cardsOfHand)
            this.socket.emit('set-user-hand-cout', {
              username: this.user.name, seat: this.user.seat,
              id: this.user.seat, cards: cardsOfHand,
            })
            this.cardsActiveIndex = []
            if (this.cards.length === 0) {
              this.$set(this.status, 0, 'ende')
              this.socket.emit('set-user-hand-ende', {
                username: this.user.name, seat: this.user.seat,
                id: this.user.seat, cards: [],
              })
            }
            this.restartTimer = true
          } else {
            this.cards = _.sortBy(
              this.cards.concat(cardsOfHand), ['rnum', 'snum']
            )
            // TODO: transient message
            this.msgs = '您这手牌打不出去啊！愣打出去我怕您被揍！'
          }
        }
      },
      actionCardActivate (idx) {
        let index = this.cardsActiveIndex.indexOf(idx);
        if (index !== -1) {
          this.cardsActiveIndex.splice(index, 1);
        } else {
          this.cardsActiveIndex.push(idx)
        }
      },
      // @/server/core.js
      isCardsOutValid (cardsOut) {

        let numCardsByRank = _.countBy(cardsOut, 'rank')

        let ranks = Object.keys(numCardsByRank)

        let numCards = _.sum(Object.values(numCardsByRank))

        if (ranks.includes('3') ) {
          return numCards === 1 && this.cards.length === 0
        } else if (ranks.includes('4')) {
          return numCards === 1 || ranks.length === 1
        } else {
          return _.without(ranks, '0', '1', '2').length <= 1
        }

      },
    },
    created () {
      this.socket.emit('get-names', {}, (response) => {
        // assign to usernames according to user.name and user.seat matches with response
        console.log('get-names:', response)
        this.usernames = response.concat(response.splice(0, this.user.seat))
        console.log('get-names:', this.usernames)
      })
      this.socket.on('srv-user-hand-wait-ok', (payload) => {
        let index = (payload.seat - this.user.seat + this.usernames.length) % this.status.length
        this.$set(this.status, index, 'waitOk')
      })
      // eslint-disable-next-line
      this.socket.on('srv-hands-init', (payload) => {
        this.socket.emit('get-cards', {
          id: this.user.seat
        }, (response) => {
          this.cards = response
        })
        this.status = [
          'exec', 'exec', 'exec', 'exec', 'exec', 'exec'
        ]
      })
      this.socket.on('srv-user-hand-exec', (payload) => {
        console.log('srv-user-hand-exec', payload)
        if (this.user.seat === payload.id) {
          this.cards = _.sortBy(
            this.cards.concat(payload.cards), ['rnum', 'snum']
          )
        }
      })
      // eslint-disable-next-line
      this.socket.on('srv-plays-init', (payload) => {
        this.status = [
          'play', 'play', 'play', 'play', 'play', 'play'
        ]
      })
      this.socket.on('srv-user-hand-cout', (payload) => {
        this.cardsOut = [
          [], [], [], [], [], []
        ]
        let index = (payload.id - this.user.seat + this.usernames.length) % this.usernames.length
        this.$set(this.cardsOut, index, payload.cards)
      })
      this.socket.on('srv-user-hand-ende', (payload) => {
        let index = (payload.id - this.user.seat + this.usernames.length) % this.usernames.length
        console.log('恭喜', this.usernames[index], '拿到x科')
        this.$set(this.status, index, 'ende')
      })
      this.socket.on('srv-hands-ende', (payload) => {
        console.log('srv-hands-ende', payload)
        this.news = payload.news
        this.cards = []
        this.cardsOut = [
          [], [], [], [], [], [], 
        ],
        this.status = [
          'wait', 'wait', 'wait', 'wait', 'wait', 'wait', 
        ]
      })
    },
    mounted () {

    },
  }
</script>

<style scoped>

</style>
