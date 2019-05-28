<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout row wrap>
            <v-flex xs12>
              <apps-title title="玩呗！"></apps-title>
            </v-flex>
            <v-flex xs12><br><br></v-flex>
            <!-- <v-flex xs12 v-if="status === 'wait'"> -->
            <v-flex xs12>
              <v-btn 
                block 
                class="primary white--text"
                @click.native="setUserHandReady(0)"
                :disabled="waitReady"
              >
                <v-icon dark>whatshot</v-icon>&nbsp;&nbsp; 开
              </v-btn>
            </v-flex>
            <!-- <v-flex xs12 v-else-if="status === 'exec'"> -->
              <v-flex xs12>
                <v-container fluid>
                 <v-layout row wrap>
              <v-flex xs12 cards style="position: relative;">
                    <!-- allow scroll on horitional x [v-vuse-scrollbar:x?]-->
                    <!-- https://codepen.io/jrvaja/pen/qoLXZb -->
                    <!-- https://github.com/vuetifyjs/vuetify/issues/3792 -->
        <apps-playing-card
          v-for="(card, i) in hand.cards"
          :key="i"
          :card="card"
          :isFaceDown="false"
          :style="
            'position: absolute;' + 
            'left:' + (i + 0.5) * 50 + 'px' 
          "
          :class="{abcd: acitveCards.includes(i)}"
          @click.native="abc(i)"
        />

<v-flex xs12><br><br></v-flex>
<v-flex xs12><br><br></v-flex>
<v-flex xs12><br><br></v-flex>
<v-flex xs12><br><br></v-flex>
<v-flex xs12><br><br></v-flex>
<v-flex xs12><br><br></v-flex>
<v-flex xs12><br><br></v-flex>
            </v-flex>
                 </v-layout>
                </v-container>
          </v-flex>
            <!-- <v-flex xs12 v-else> -->
              <v-flex xs12 style="position: relative;">
              
                <v-btn 
                  block 
                  class="primary white--text"
                  @click.native="setUserHandOut()"
                >
                  让我出牌
                </v-btn>
            </v-flex>
            <v-flex xs12>
              <apps-player></apps-player>
            </v-flex>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  // @ is an alias to /src
  import Title from '@/components/Title'
  import PlayingCard from '@/components/Table/Game/PlayingCard'
  import Player from '@/components/Table/Seat/Player'

  export default {
    name: 'apps-table',
    components: {
      appsTitle: Title,
      appsPlayingCard: PlayingCard,
      appsPlayer: Player,
    },
    data: () => ({
      status: 'wait', // 'exec', 'main'
      waitReady: false,
      hand: {
        cards: [
          {suit: 'C', rank: 'A'}
        ]
      },
      acitveCards: []
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user',
      }),
    },
    methods: {
      ...mapActions({
        
      }),
      setUserHandReady () {
        this.waitReady = true
        this.socket.emit(
          'set-user-hand-ready', { 
            seat: this.user.seat, username: this.user.name
          }
        )
      },
      setUserHandExec () {

      },
      setUserHandOut () {

        let outCards = []
        this.acitveCards.sort().reverse()
        console.log('r o:', this.acitveCards)
        for (let j of this.acitveCards) {
          console.log('out j:', j, this.hand.cards[j])
          outCards.push(this.hand.cards.splice(j, 1))
        }

        this.socket.emit('set-hand-out', {
          seat: this.user.seat, 
          cards: []
        })

        this.acitveCards = []
        
      },
      abc (idx) {
        console.log('hi', idx)
        let index = this.acitveCards.indexOf(idx);
        if (index !== -1) {
          this.acitveCards.splice(index, 1);
        } else {
          this.acitveCards.push(idx)
        }
      },

    },
    created () {
      // if user.name === '' direct to home page
      this.socket.on('srv-new-hands', (payload) => {
        console.log('srv-new-hands', payload)
        this.socket.emit('get-hands', {}, (response) => {
          this.hand = response
        })
      })

    }
  }
</script>


<style scoped>

.abcd {
  top: -20px
}

</style>
