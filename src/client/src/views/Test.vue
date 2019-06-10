<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout row wrap>
            <!-- <v-flex xs12>
              <apps-title title="够级！"></apps-title>
            </v-flex>
            <v-flex xs12><br><br></v-flex>
            <v-flex xs4>
              <apps-player-profile></apps-player-profile>
            </v-flex>  
            <v-flex xs8></v-flex>
            <v-flex xs12>
              <apps-player-hand
                :isFaceDown="false"
                @cards-activate="activateCards"
              ></apps-player-hand>
            </v-flex>
            <v-flex xs12>
              <apps-player-hand-out
                :isFaceDown="false"
                :direction="'down'"
              ></apps-player-hand-out>
            </v-flex>
            <v-flex xs12>
              <apps-player-action
                @action-pass="actionPass()"
                @action-ask="actionAsk()"
                @action-out="actionOut()"
              ></apps-player-action>
            </v-flex> -->
            <!-- <v-flex xs12>
              <apps-game-board></apps-game-board>
            </v-flex> -->
            <!-- <v-flex xs12>
              <apps-player-hand></apps-player-hand>
            </v-flex> -->
            <v-flex xs12>
              <apps-player-timer
                :isOnAction="true"
              ></apps-player-timer>
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
  // import Title from '@/components/Title'
  // import PlayerProfile from '@/components/Table/GameBoard/GameBoardSeat/PlayerProfile'
  // import PlayerHand from '@/components/Table/GameBoard/GameBoardSeat/PlayerHand'
  // import PlayerHandOut from '@/components/Table/GameBoard/GameBoardSeat/PlayerHandOut'
  // import PlayerAction from '@/components/Table/GameBoard/GameBoardSeat/PlayerAction'
  // import GameBoard from '@/components/Table/GameBoard'
  import PlayerTimer from '@/components/Table/GameBoard/GameBoardSeat/PlayerTimer'

  export default {
    name: 'apps-test',
    components: {
      // appsTitle: Title,
      // appsPlayerProfile: PlayerProfile,
      // appsPlayerHand: PlayerHand,
      // appsPlayerHandOut: PlayerHandOut,
      // appsPlayerAction: PlayerAction,
      // appsGameBoard: GameBoard,
      appsPlayerTimer: PlayerTimer,
    },
    data: () => ({
      activeCardsIndex: []
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user',
      }),
    },
    methods: {
      ...mapActions({
        
      }),
      activateCards (payload) {
        console.log('activateCards:', this.activeCardsIndex = payload)
      },
      actionPass () {
        console.log(
          'user', this.user.name, 
          'at seat', this.user.seat,
          'action-pass', this.activeCardsIndex,
          'remember to reset activeCards to []'
        )
      },
      actionAsk () {
        console.log('action ask')
      },
      actionOut () {
        console.log('action out')
      }
    },
    created () {
      
    },
    mounted () {

    }
  }
</script>


<style scoped>

</style>
