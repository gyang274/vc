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
                    
        <apps-playing-card
          v-for="(card, i) in hand.cards"
          :key="i"
          :card="card"
          :isFaceDown="false"
          :style="
            'position: absolute;' + 
            'left:' + (i + 2) * 40 + 'px' 
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
                  @click.native="setUserHandReady(0)"
                  :disabled="waitReady"
                >
                  让我出牌
                </v-btn>
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
  import PlayingCard from '@/components/Table/Game/PlayingCard.vue'

  export default {
    name: 'apps-table',
    components: {
      appsTitle: Title,
      appsPlayingCard: PlayingCard
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
