<template>
  <v-layout row wrap>
    <v-flex xs12 cards id="idHandOut"
      :style="{ 'position': 'relative' }"
    >
      <apps-playing-card
        v-for="(card, index) in cards"
          :key="index"
          :card="card"
          :isFaceDown="isFaceDown"
          :style="{
            'position': 'absolute', 'left': 'calc(50% - 4rem - ' + 3.2 * ((cards.length -  1) / 2 - index) + 'rem)',
          }"
        :class="['hand-out', 'hand-out-'+direction]"
      />
    </v-flex>
  </v-layout>
</template>

<script>
  import PlayingCard from './PlayerHand/PlayingCard'
  export default {
    name: 'apps-player-hand-out',
    components: {
      appsPlayingCard: PlayingCard,
    },
    props: {
      cards: {
        type: Array,
        default: () => ([
          {suit: 'C', rank: 'K'},
          {suit: 'D', rank: 'K'},
          {suit: 'H', rank: 'K'},
          {suit: 'S', rank: 'K'},
          {suit: 'C', rank: 'A'},
          {suit: 'D', rank: 'A'},
          {suit: 'H', rank: 'A'},
          {suit: 'S', rank: 'A'},
          {suit: 'C', rank: '2'},
          {suit: 'D', rank: '2'},
          {suit: 'H', rank: '2'},
          {suit: 'S', rank: '2'},
          {suit: 'T', rank: '0'},
          {suit: 'T', rank: '1'},
        ])
      },
      isFaceDown: {
        type: Boolean,
        default: false,
      },
      direction: {
        type: String,
        default: 'up' // up, down, left, right, etc.
      }
    },
    data: () => ({
      
    }),
    computed: {

    },
    methods: {
      getElementWidth () {
        return this.$refs.idHandOut
      }

    },
    created () {
      
    },
    mounted () {
      console.log(this.getElementWidth())
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
  }

  .hand-out {
    --an-hand-out-distance-up:  12.4rem;
    --an-hand-out-distance-down: -12.4rem;
    --an-hand-out-distance-left: 8.4rem;
    --an-hand-out-distance-right: -8.4rem;
    --an-hand-out-duration: 0.5s;
  }

  .hand-out-up {
    animation-name: an-hand-out-up;
    animation-duration: var(--an-hand-out-duration);
  }

  @keyframes an-hand-out-up {
    from {
      transform: translateY(var(--an-hand-out-distance-up)); 
    } to {
      transform: translateY(0.00rem);
    }
  }

  .hand-out-down {
    animation-name: an-hand-out-down;
    animation-duration: var(--an-hand-out-duration);
  }

  @keyframes an-hand-out-down {
    from {
      transform: translateY(var(--an-hand-out-distance-down)); 
    } to {
      transform: translateY(0.00rem);
    }
  }

  .hand-out-left {
    animation-name: an-hand-out-left;
    animation-duration: var(--an-hand-out-duration);
  }

  @keyframes an-hand-out-left {
    from {
      transform: translateX(var(--an-hand-out-distance-left)); 
    } to {
      transform: translateX(0.00rem);
    }
  }

  .hand-out-right {
    animation-name: an-hand-out-right;
    animation-duration: var(--an-hand-out-duration);
  }

  @keyframes an-hand-out-right {
    from {
      transform: translateX(var(--an-hand-out-distance-right)); 
    } to {
      transform: translateX(0.00rem);
    }
  }
</style>
