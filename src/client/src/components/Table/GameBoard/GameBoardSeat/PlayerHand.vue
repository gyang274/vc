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
