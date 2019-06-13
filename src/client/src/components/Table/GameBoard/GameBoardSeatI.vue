<template>
  <v-layout row wrap game-board-seat-i>
    <template v-if="isOnAction">
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-player-timer
          :isOnAction="isOnAction"
          @action-time-up="actionTimeUp()"
        ></apps-player-timer>
      </v-flex>
      <v-flex xs4></v-flex>
    </template>
    <template v-else>
      <v-flex xs12>
        <apps-player-hand-out
          :cards="cardsOfHand"
          :isFaceDown="false"
          :direction="'up'"
        ></apps-player-hand-out>
      </v-flex>
    </template>
    <v-flex xs12><br></v-flex>
    <v-flex xs12>
      <apps-player-hand
        :cards="cardsOnHand"
        :cardsActiveIndex="cardsOnHandActiveIndex"
        :isFaceDown="false"
        @action-card-activate="actionCardActivate($event)"
      ></apps-player-hand>
    </v-flex>
    <v-flex xs12><br></v-flex>
    <v-flex xs3></v-flex>
    <v-flex xs6>
      <apps-player-action
        :status="status"
        :isOnAction="isOnAction"
        @action-wait-ok="actionWaitOk()"
        @action-exec="actionExec()"
        @action-exec-ok="actionExecOk()"
        @action-pass="actionPass()"
        @action-cask="actionCask()"
        @action-cout="actionCout()"
      >
        <template slot="slot-player-selection">
          <slot name="slot-player-selection"></slot>
        </template>
      </apps-player-action>
    </v-flex>
    <v-flex xs3></v-flex>
    <v-flex xs12><br></v-flex>
    <v-flex xs4></v-flex>
    <v-flex xs2>
      <apps-player-profile
        :username="username"
        :userinfo="userinfo"
      ></apps-player-profile>
    </v-flex>
    <v-flex xs3>
      <apps-player-note
      ></apps-player-note>
    </v-flex>
    <v-flex xs3></v-flex>
  </v-layout>
</template>


<script>

  import PlayerAction from './GameBoardSeat/PlayerAction'
  import PlayerHand from './GameBoardSeat/PlayerHand'
  import PlayerHandOut from './GameBoardSeat/PlayerHandOut'
  import PlayerNote from './GameBoardSeat/PlayerNote'
  import PlayerProfile from './GameBoardSeat/PlayerProfile'
  import PlayerTimer from './GameBoardSeat/PlayerTimer'

  export default {
    name: 'apps-board-seat-player-i',
    components: {
      appsPlayerAction: PlayerAction,
      appsPlayerHand: PlayerHand,
      appsPlayerHandOut: PlayerHandOut,
      appsPlayerNote: PlayerNote,
      appsPlayerProfile: PlayerProfile,
      appsPlayerTimer: PlayerTimer,
    },
    props: {
      username: {
        type: String,
        default: ''
      },
      userinfo: {
        type: Object,
        default: () => ({
          title: '', coins: 0
        })
      },
      status: {
        type: String,
        default: 'wait'
      },
      note: {
        type: Array,
        default: () => ([
          
        ])
      },
      cardsOnHand: {
        type: Array,
        default: () => ([

        ])
      },
      cardsOnHandActiveIndex: {
        type: Array,
        default: () => ([])
      },
      cardsOfHand: {
        type: Array,
        default: () => ([
          { suit: 'S', rank: '2' },
        ])
      },
      isOnAction: {
        type: Boolean,
        default: false
      }      
    },
    data: () => ({

    }),
    computed: {

    },
    methods: {
      actionWaitOk () {
        this.$emit('action-wait-ok')
      },
      actionExec () {
        this.$emit('action-exec')
      },
      actionExecOk () {
        this.$emit('action-exec-ok')
      },
      actionPass () {
        this.$emit('action-pass')
      },
      actionCask () {
        this.$emit('action-cask')
      },
      actionCout () {
        this.$emit('action-cout')
      },
      actionCardActivate (index) {
        this.$emit('action-card-activate', index)
      },
      actionTimeUp () {
        this.$emit('action-time-up')
      },
    },
    created () {

    },
    mounted () {

    },
  }
</script>

<style scoped>

.game-board-seat-i {
  transform: translateY(-3.2rem)
}

</style>
