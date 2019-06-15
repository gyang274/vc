<template>
  <v-layout row wrap>
    <v-flex xs12 cards
      :style="{ 'position': 'relative' }"
    >
      <apps-playing-card
        v-for="(card, index) in cards"
          :key="index"
          :card="card"
          :isFaceDown="isFaceDown"
        :class="{active: cardsActiveIndex.includes(index)}"
        :style="{
          'position': 'absolute', 'left': 'calc(50% - 4rem - ' + 3.2 * ((cards.length -  1) / 2 - index) + 'rem)',
        }"
        @click.native="actionCardActivate(index)" 
      />
    </v-flex>
  </v-layout>
</template>

<script>
  import PlayingCard from './PlayerHand/PlayingCard'
  export default {
    name: 'apps-player-hand',
    components: {
      appsPlayingCard: PlayingCard,
    },
    props: {
      cards: {
        type: Array,
        default: () => ([
          {suit: 'C', rank: '3'},
          {suit: 'D', rank: '4'},
          {suit: 'H', rank: '5'},
          {suit: 'S', rank: '6'},
          {suit: 'C', rank: '7'},
          {suit: 'D', rank: '8'},
          {suit: 'H', rank: '9'},
          {suit: 'S', rank: '10'},
          {suit: 'C', rank: 'J'},
          {suit: 'D', rank: 'Q'},
          {suit: 'H', rank: 'K'},
          {suit: 'S', rank: 'A'},
          {suit: 'S', rank: '2'},
          {suit: 'T', rank: '0'},
          {suit: 'T', rank: '1'},
        ])
      },
      isFaceDown: {
        type: Boolean,
        default: false,
      },
      cardsActivatible: {
        type: Boolean,
        default: true,
      },
      cardsActiveIndex: {
        type: Array,
        default: () => ([])
      }
    },
    data: () => ({
      
    }),
    computed: {

    },
    methods: {
      actionCardActivate (index) {
        this.$emit('action-card-activate', index)
      },
    },
    created () {
      
    },
    mounted () {

    }
  }
</script>

<style scoped>
  .cards {
    min-height: 12.4rem;
    min-width: 8.4rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    /* overflow-x: scroll; */
    /* overflow-y: scroll; */
  }

  .cards > .active {
    transform: translateY(-3.2rem);
    -ms-transform: translateY(-3.2rem);
    -webkit-transform: translateY(-3.2rem);
  }
</style>
