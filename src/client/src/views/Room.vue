<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout row wrap>
            <v-flex xs12>
              <apps-title title="欢迎来到够级大厅！"></apps-title>
            </v-flex>
            <v-flex xs12><br><br></v-flex>
            <v-flex xs12>
              <apps-room-table></apps-room-table>
            </v-flex>
            <v-flex xs12>
              <br><br>
                <apps-messager
                  :backgroundColor="'rgb(255, 255, 255)'"
                  :height="'12rem'"
                ></apps-messager>
              <br><br>
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
  import Messager from '@/components/Messager.vue'
  import RoomTable from '@/components/Room/RoomTable'

  export default {
    name: 'room',
    components: {
      appsTitle: Title,
      appsMessager: Messager,
      appsRoomTable: RoomTable
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
      // if user.name === '' direct to home page
    }
  }
</script>
