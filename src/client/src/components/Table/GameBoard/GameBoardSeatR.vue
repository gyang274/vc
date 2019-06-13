<template>
  <v-layout>  
    <template v-if="status === 'wait' || status === 'waitOk'">
      <v-flex xs5></v-flex>
      <v-flex xs5>
        <v-btn 
          block 
          class="primary white--text"
          :disabled="status === 'waitOk'"
        >
          开始
        </v-btn>
      </v-flex>
    </template>
    <template v-else-if="status === 'exec' || status === 'execOk' || status === 'play' || status === 'ende'">
      <template v-if="isOnAction">
        <v-flex xs5>
          <apps-player-timer
            :isOnAction="isOnAction"
          ></apps-player-timer>
        </v-flex>
      </template>
      <template v-else>
        <v-flex xs5>
          <apps-player-hand-out
            :cards="cardsOfHand"
            :isFaceDown="false"
            :direction="'left'"
          ></apps-player-hand-out>
        </v-flex>
      </template>
      <v-flex xs5>
        <apps-player-hand
          :cards="cardsOnHand"
          :isFaceDown="!isHandEnded"
          :cardsActivatible="false"
        ></apps-player-hand>
      </v-flex>
    </template>
    <template v-else>
      GameBoardSeatR.vue: unknown status - {{ status }}
    </template>
    <v-flex xs2>
      <br>
      <apps-player-profile
        :username="username"
        :userinfo="userinfo"
      ></apps-player-profile>
      <br>
      <apps-player-note
      ></apps-player-note>
    </v-flex>
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
    name: 'apps-board-seat-player-r',
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
        type: Array,
        default: () => ([

        ])
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
      },
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

</style>
