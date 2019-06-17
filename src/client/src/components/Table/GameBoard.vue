<template>
  <v-container fluid
    :style="{
      'background-color': 'rgb(185, 224, 217)'
    }"
  >
    <v-layout row wrap>
      <!-- 对家 -->
      <v-flex xs2></v-flex>
      <v-flex xs8>
        <apps-game-board-seat-o
          :username="usernames[3]"
          :userinfo="userinfos[3]"
          :note="notes[3]"
          :status="status[3]"
          :cardsOut="cardsOut[3]"
          :isOnAction="isOnAction[3]"
        ></apps-game-board-seat-o>
      </v-flex>
      <v-flex xs2></v-flex>
      <!-- 上联 & 上家 -->
      <v-flex xs4>
        <!-- 上联 -->
        <apps-game-board-seat-l
          :username="usernames[4]"
          :userinfo="userinfos[4]"
          :note="notes[4]"
          :status="status[4]"
          :cardsOut="cardsOut[4]"
          :isOnAction="isOnAction[4]"
        ></apps-game-board-seat-l>
        <!-- 上家 -->
        <apps-game-board-seat-l
          :username="usernames[5]"
          :userinfo="userinfos[5]"
          :note="notes[5]"
          :status="status[5]"
          :cardsOut="cardsOut[5]"
          :isOnAction="isOnAction[5]"
        ></apps-game-board-seat-l>
      </v-flex>
      <!-- 信息中心 -->
      <v-flex xs4 
        v-if="!_.isEmpty(news)"
      >
      <!-- <v-flex xs4> -->
        <apps-game-board-news
          :contents="news"
          @action-ackl="news = []"
        ></apps-game-board-news>
      </v-flex>
      <v-flex xs4 v-else><br><br><br><br><br></v-flex>
      <!-- 下联 & 下家 -->
      <v-flex xs4>
        <!-- 下联 -->
        <apps-game-board-seat-r
          :username="usernames[2]"
          :userinfo="userinfos[2]"
          :note="notes[2]"
          :status="status[2]"
          :cardsOut="cardsOut[2]"
          :isOnAction="isOnAction[2]"
        ></apps-game-board-seat-r>
        <!-- 下家 -->
        <apps-game-board-seat-r
          :username="usernames[1]"
          :userinfo="userinfos[1]"
          :note="notes[1]"
          :status="status[1]"
          :cardsOut="cardsOut[1]"
          :isOnAction="isOnAction[1]"
        ></apps-game-board-seat-r>
      </v-flex>
      <!-- 自己 -->
      <v-flex xs2></v-flex>
      <v-flex xs8>  
        <apps-game-board-seat-i
          :username="usernames[0]"
          :userinfo="userinfos[0]"
          :note="notes[0]"
          :status="status[0]"
          :cardsOnHand="cards"
          :cardsOnHandActiveIndex="cardsActiveIndex"
          :cardsOfHand="cardsOut[0]"
          :isOnAction="isOnAction[0]"
          @action-wait-ok="actionWaitOk()"
          @action-exec="actionExec()"
          @action-exec-ok="actionExecOk()"
          @action-pass="actionPass()"
          @action-cask="actionCask()"
          @action-cout="actionCout()"
          @action-card-activate="actionCardActivate($event)"
          @action-time-up="actionTimeUp()"
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
      <v-flex xs2>
        <br><br>
        <apps-messager
          :backgroundColor="'rgb(167, 206, 217)'"
        ></apps-messager>
        <br><br>
      </v-flex>
      <!-- 本地提示信息 -->
      <v-flex xs12>
        <apps-game-board-msgs
          :msgs="msgs"
          :msgsShow="msgsShow"
          @action-ackl="msgsShow = false"
        ></apps-game-board-msgs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import _ from 'lodash'

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  import core from '@/plugins/core'

  import Messager from '@/components/Messager'

  import GameBoardMsgs from './GameBoard/GameBoardMsgs'
  import GameBoardNews from './GameBoard/GameBoardNews'

  import GameBoardSeatI from './GameBoard/GameBoardSeatI'
  import GameBoardSeatL from './GameBoard/GameBoardSeatL'
  import GameBoardSeatO from './GameBoard/GameBoardSeatO'
  import GameBoardSeatR from './GameBoard/GameBoardSeatR'
  
  export default {
    name: 'apps-game-board',
    components: {
      appsMessager: Messager,
      appsGameBoardMsgs: GameBoardMsgs,
      appsGameBoardNews: GameBoardNews,
      appsGameBoardSeatI: GameBoardSeatI,
      appsGameBoardSeatL: GameBoardSeatL,
      appsGameBoardSeatO: GameBoardSeatO,
      appsGameBoardSeatR: GameBoardSeatR,
    },
    props: {

    },
    data: () => ({
      usernames: [
        '', '', '', '', '', ''
      ],
      userinfos: [
        { title: '平民', coins: 0, },
      ],
      status: [
        'wait', 'wait', 'wait', 'wait', 'wait', 'wait',
      ],
      notes: [
        { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
        { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
        { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
        { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
        { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
        { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
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
      // actionTimer
      isOnAction: [
        false, false, false, false, false, false,
      ],
      // GameResults
      news: [],
      // newsShow: false,
      // LocalMessages
      msgs: '',
      msgsShow: false,
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
        this.news = []
        this.$set(this.status, 0, 'waitOk')
        this.socket.emit('set-user-hand-wait-ok', {
          id: this.user.seat, name: this.user.name
        })
      },
      actionExec () {
        if (this.cardsActiveIndex.length > 0) {
          this.socket.emit('set-user-hand-exec', {
            id: this.user.seat, name: this.user.name, 
            jd: (this.player.id + this.user.seat) % this.usernames.length,
            cards: _.pullAt(this.cards, this.cardsActiveIndex),
            cardsIndex: this.cardsActiveIndex
          })
          this.cardsActiveIndex = []
        }
      },
      actionExecOk () {
        // check user must one and only one 3
        if (_.filter(this.cards, {rank: '3'}).length === 1) {
          this.$set(this.status, 0, 'execOk')
          this.socket.emit('set-user-hand-exec-ok', {
            id: this.user.seat, name: this.user.name,
          })
          // reset player
          this.player = {
            name: '对家', id: 3
          }
        } else {
          this.msgs = '-开打?您必须有且只有一张3！'
          this.msgsShow = true
        }
      },
      actionPass () {
        this.cardsActiveIndex = []
        this.socket.emit('set-user-hand-pass', {
          id: this.user.seat, name: this.user.name,
        })
      },
      actionCask () {
        this.cardsActiveIndex = []
        let cardsOutIndex = _.findIndex(
          this.cardsOut, (co) => { return !_.isEmpty(co) }
        )
        if (cardsOutIndex === 3) {
          this.socket.emit('set-user-hand-cask', {
            id: this.user.seat, name: this.user.name,
          })
        } else {
          this.msgs = '-让牌?只能让对家的牌！'
          this.msgsShow = true
        }
      },
      actionCout () {
        if (this.cardsActiveIndex.length > 0) {
          let cardsOfHand = _.pullAt(this.cards, this.cardsActiveIndex)
          // check cardsOfHand is ok
          let isCardsOfHandOk = this.isCardsOutValid(cardsOfHand)
          // if cardsOut is 3, must last hand
          if (cardsOfHand[0].rank === '3') {
            isCardsOfHandOk = isCardsOfHandOk && _.isEmpty(this.cards)
          }
          // if prevCardsOut not from self and is not 3 (接风), must beaten
          // TODO: if prevCardsOut is 3, must everyone pass (need everyone playing status..)
          let prevCardsOutIndex = -1
          for (let i = 0; i < 6; i++) {
            if (!_.isEmpty(this.cardsOut[i])) {
              prevCardsOutIndex = i; break
            }
          }
          if (prevCardsOutIndex > 0 && this.cardsOut[prevCardsOutIndex][0].rank !== '3') {
            isCardsOfHandOk = isCardsOfHandOk && core.isCardsOutBeatenPrevCardsOut(cardsOfHand, this.cardsOut[prevCardsOutIndex])
          }
          // cardsOfHand is ok
          if (isCardsOfHandOk) {
            this.cardsOut = [
              [], [], [], [], [], []
            ]
            this.$set(this.cardsOut, 0, cardsOfHand)
            this.socket.emit('set-user-hand-cout', {
              id: this.user.seat, name: this.user.name, 
              cards: cardsOfHand, cardsIndex: this.cardsActiveIndex,
            })
            this.cardsActiveIndex = []
            // -> srv-user-hand-ende from srv (unified handle with mens)
            // if (this.cards.length === 0) {
            //   this.$set(this.status, 0, 'ende')
            //   this.socket.emit('set-user-hand-ende', {
            //     name: this.user.name, seat: this.user.seat,
            //     id: this.user.seat, cards: [],
            //   })
            // }
          } else {
            this.cards = _.sortBy(
              this.cards.concat(cardsOfHand), ['rnum', 'snum']
            )
            // transient message
            this.msgs = '打不出去的牌请不要愣打好嘛！'
            this.msgsShow = true
          }
        }
      },
      actionTimeUp () {
        // TODO:
        // if user is cout then auto cout smallest set of cards beside 3, 4 else this.actionPass() 
        this.msgs = '-超时了！墨墨唧唧只会让牌友与您渐行渐远！'
        this.msgsShow = true
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
      this.socket.emit('get-users', {}, (response) => {
        // assign to usernames according to user.name and user.seat matches with response
        console.log('get-users:', response)
        this.usernames = response.names.concat(response.names.splice(0, this.user.seat))
        this.userinfos = response.infos.concat(response.names.splice(0, this.user.seat))
        console.log('get-users|usernames:', this.usernames)
        console.log('get-users|userinfos:', this.userinfos)
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
        if (this.user.seat === payload.jd) {
          this.cards = _.sortBy(
            this.cards.concat(payload.cards), ['rnum', 'snum']
          )
        }
      })
      // eslint-disable-next-line
      this.socket.on('srv-hands-play', (payload) => {
        this.status = [
          'play', 'play', 'play', 'play', 'play', 'play'
        ]
      })
      this.socket.on('srv-hands-next', (payload) => {
        console.log('srv-hand-next', payload.id)
        this.isOnAction = [
          false, false, false, false, false, false,
        ]
        let index = (payload.id - this.user.seat + this.usernames.length) % this.isOnAction.length
        this.$set(this.isOnAction, index, true)
      })
      // eslint-disable-next-line
      this.socket.on('srv-user-hand-pass', (payload) => {

      })
      // eslint-disable-next-line
      this.socket.on('srv-user-hand-cask', (payload) => {

      })
      this.socket.on('srv-user-hand-cout', (payload) => {
        // payload.show = true when show mens 3 etc.
        // if (!payload.show) {
        //             this.cardsOut = [
        //     [], [], [], [], [], []
        //   ]
        // }
        this.cardsOut = [
          [], [], [], [], [], []
        ]
        let index = (payload.id - this.user.seat + this.usernames.length) % this.usernames.length
        if (index === 0) {
          // server triggered this user hand cout, e.g., mens, [TODO] time up, [TODO] disconnect
          payload.cards = _.reverse(_.sortBy(payload.cards), ['rnum', 'snum'])
          let cdidx = -1
          for (let cd of payload.cards) {
            cdidx = _.findLastIndex(this.cards, cd)
            if (cdidx === -1) {
              console.log(
                'srv-user-hand-cout|sth. wrong? srv asks user to hand cout card not available.',
                'cards on hand:', this.cards, 'cards srv asks:', payload.cards
              )
            } else {
              _.pullAt(this.cards, cdidx)
            }
          }
        }
        this.$set(this.cardsOut, index, payload.cards)
      })
      this.socket.on('srv-user-note', (payload) => {
        let id = -1
        for (let nt of payload) {
          id = (nt.id - this.user.seat + this.usernames.length) % this.usernames.length
          this.$set(this.notes[id][nt.dmsl], nt.kb, nt.kd)
        }
      })
      this.socket.on('srv-user-hand-ende', (payload) => {
        let index = (payload.id - this.user.seat + this.usernames.length) % this.usernames.length
        this.$set(this.status, index, 'ende')
      })
      this.socket.on('srv-hands-ende', (payload) => {
        console.log('srv-hands-ende', payload)
        this.news = payload.news
        this.cards = []
        this.cardsOut = [
          [], [], [], [], [], [], 
        ],
        this.notes = [  
          { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
          { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
          { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
          { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
          { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
          { dian: [false, false], mens: [false, false], shao: [false, false], lake: [false, false], },
        ]
        this.isOnAction = [
        false, false, false, false, false, false,
        ]
        this.status = [
          'wait', 'wait', 'wait', 'wait', 'wait', 'wait', 
        ]
        this.userinfos = payload.userinfos.concat(payload.userinfos.splice(0, this.user.seat))
      })
    },
    mounted () {

    },
  }
</script>

<style scoped>

</style>
