<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout row wrap>
            <v-flex xs12>
              <apps-game-board
              ></apps-game-board>
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
  import GameBoard from '@/components/Table/GameBoard'

  export default {
    name: 'apps-table',
    components: {
      // appsTitle: Title,
      appsGameBoard: GameBoard,
    },
    data: () => ({

    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user',
      }),
    },
    methods: {
      ...mapActions({
        
      }),

    },
    created () {

    },
    mounted () {

    }
  }
</script>


<style scoped>

</style>
