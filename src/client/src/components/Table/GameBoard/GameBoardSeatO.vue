<template>
  <v-layout row wrap game-board-seat-o>
    <!-- username & note -->
    <v-flex xs4></v-flex>
    <v-flex xs2>
      <apps-player-profile
        :username="username"
        :userinfo="userinfo"
      ></apps-player-profile>
    </v-flex>
    <v-flex xs3>
      <apps-player-note
        :note="note"
      ></apps-player-note>
    </v-flex>
    <v-flex xs3></v-flex>
    <!-- seat on playing area -->
    <template v-if="status === 'wait' || status === 'waitOk'">
      <v-flex xs3></v-flex>
      <v-flex xs6>
        <v-btn 
          block 
          class="primary white--text"
          :disabled="status === 'waitOk'"
        >
          <h2>开始</h2>
        </v-btn>
      </v-flex>
      <v-flex xs3></v-flex>
      <v-flex xs12>
        <apps-player-hand
          :cards="[]"
          :isFaceDown="true"
          :cardsActivatible="false"
        ></apps-player-hand>
      </v-flex>
    </template>
    <template v-else-if="status === 'exec' || status === 'execOk' || status === 'play' || status === 'ende'">
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-player-hand
          :cards="cardsOnHand"
          :isFaceDown="!isHandEnded"
          :cardsActivatible="false"
        ></apps-player-hand>
      </v-flex>
      <v-flex xs4></v-flex>
      <template v-if="isOnAction">
        <v-flex xs12>
          <apps-player-timer
            :isOnAction="isOnAction"
          ></apps-player-timer>
        </v-flex>
      </template>
      <template v-else>
        <v-flex xs12>
          <apps-player-hand-out
            :cards="cardsOfHand"
            :isFaceDown="false"
            :direction="'down'"
          ></apps-player-hand-out>
        </v-flex>
      </template>
    </template>
    <template v-else>
      GameBoardSeatO.vue: unknown status - {{ status }}
    </template>
  </v-layout>
</template>

<script>

  // import PlayerAction from './GameBoardSeat/PlayerAction'
  import PlayerHand from './GameBoardSeat/PlayerHand'
  import PlayerHandOut from './GameBoardSeat/PlayerHandOut'
  import PlayerNote from './GameBoardSeat/PlayerNote'
  import PlayerProfile from './GameBoardSeat/PlayerProfile'
  import PlayerTimer from './GameBoardSeat/PlayerTimer'

  export default {
    name: 'apps-board-seat-player-o',
    components: {
      // appsPlayerAction: PlayerAction,
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
        type: Object,
        default: () => ({
          dian: [false, false],
          shao: [false, false],
          mens: [false, false],
          lake: [false, false],
        })
      },
      cards: {
        type: Array,
        default: () => ([
          { suit: 'X', rank: '-1' }, 
          { suit: 'X', rank: '-1' },
          { suit: 'X', rank: '-1' },
        ])
      },
      cardsOut: {
        type: Array,
        default: () => ([

        ])
      },
      isOnAction: {
        type: Boolean,
        default: false
      },
    },
    data: () => ({

    }),
    computed: {
      isHandEnded () {
        return this.status === 'ende' || (this.cardsOut.length === 1 && this.cardsOut[0].rank === '3')
      },
      cardsOnHand () {
        if (this.isHandEnded) return this.cardsOut
        return this.cards
      },
      cardsOfHand () {
        if (this.isHandEnded) return []
        return this.cardsOut
      }
    },
    methods: {
    
    },
    created () {

    },
    mounted () {

    },
  }
</script>

<style scoped>

.game-board-seat-o {
  transform: translateY(3.2rem)
}

</style>
