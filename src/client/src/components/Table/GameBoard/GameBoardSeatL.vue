<template>
  <v-layout>
    <v-flex xs2 row wrap>
      <br>
      <apps-player-profile
        :username="username"
      ></apps-player-profile>
      <br>
      <apps-player-note
      ></apps-player-note>
    </v-flex>
    <template v-if="status === 'wait' || status === 'waitOk'">
      <v-flex xs5>
        <v-btn 
          block 
          class="primary white--text"
          :disabled="status === 'waitOk'"
        >
          开始
        </v-btn>
      </v-flex>
      <v-flex xs5></v-flex>
    </template>
    <template v-else-if="status === 'exec' || status === 'execOk' || status === 'play' || status === 'ende'">
      <v-flex xs5>
        <apps-player-hand
          :cards="cardsOnHand"
          :isFaceDown="!isHandEnded"
          :cardsActivatible="false"
        ></apps-player-hand>
      </v-flex>
      <v-flex xs5>
        <apps-player-hand-out
          :cards="cardsOfHand"
          :isFaceDown="false"
          :direction="'right'"
        ></apps-player-hand-out>
      </v-flex>
    </template>
    <template v-else>
      GameBoardSeatL.vue: unknown status - {{ status }}
    </template>
  </v-layout>
</template>

<script>

  // import PlayerAction from './GameBoardSeat/PlayerAction'
  import PlayerHand from './GameBoardSeat/PlayerHand'
  import PlayerHandOut from './GameBoardSeat/PlayerHandOut'
  import PlayerNote from './GameBoardSeat/PlayerNote'
  import PlayerProfile from './GameBoardSeat/PlayerProfile'

  export default {
    name: 'apps-board-seat-player-l',
    components: {
      // appsPlayerAction: PlayerAction,
      appsPlayerHand: PlayerHand,
      appsPlayerHandOut: PlayerHandOut,
      appsPlayerNote: PlayerNote,
      appsPlayerProfile: PlayerProfile,
    },
    props: {
      username: {
        type: String,
        default: ''
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
