<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :username="usernames[3]"
          @action-sit-down="actionSitDown(3)"
          @action-stand-up="actionStandUp(3)"
        ></apps-room-table-seat>
      </v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs12><br></v-flex>
    </v-layout>
    <v-layout row wrap
      :style="{
        'background-image': 'url(' + require('./static/background.jpg') +')',
        'background-position': 'center center',
        'background-size': 'contain'
      }"
    >
      <v-flex xs12><br><br><br></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :username="usernames[4]"
          @action-sit-down="actionSitDown(4)"
          @action-stand-up="actionStandUp(4)"
        ></apps-room-table-seat>
      </v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :username="usernames[2]"
          @action-sit-down="actionSitDown(2)"
          @action-stand-up="actionStandUp(2)"
        ></apps-room-table-seat>      
      </v-flex>
      <v-flex xs12><br><br><br></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :username="usernames[5]"
          @action-sit-down="actionSitDown(5)"
          @action-stand-up="actionStandUp(5)"
        ></apps-room-table-seat>      
      </v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :username="usernames[1]"
          @action-sit-down="actionSitDown(1)"
          @action-stand-up="actionStandUp(1)"
        ></apps-room-table-seat>      
      </v-flex>
      <v-flex xs12><br><br><br></v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12><br></v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :username="usernames[0]"
          @action-sit-down="actionSitDown(0)"
          @action-stand-up="actionStandUp(0)"
        ></apps-room-table-seat>
      </v-flex>
      <v-flex xs4></v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  import RoomTableSeat from './RoomTableSeat'

  export default {
    name: 'apps-room-table',
    components: {
      appsRoomTableSeat: RoomTableSeat
    },
    props: {
      tableId: {
        type: String,
        default: '0x00'
      }
    },
    data: () => ({
      usernames: [
        '', '', '', '', '', '',
      ],
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user'
      })
    },
    methods: {
      ...mapActions({
        setUserAttr: 'setUserAttr'
      }),
      actionSitDown (seatindex) {
        this.setUserAttr({seat: seatindex})
        this.$set(this.usernames, seatindex, this.user.name)
        this.socket.emit('set-user-seat-sit-down', {id: seatindex})
      },
      actionStandUp (seatindex) {
        this.setUserAttr({seat: -1})
        this.$set(this.usernames, seatindex, '')
        this.socket.emit('set-user-seat-stand-up', {id: seatindex})
      }
    },
    created () {
      this.socket.emit(
        'get-names', {}, (response) => {
          this.usernames = response
        }
      )
      this.socket.on('srv-set-seats-sit-down', (payload) => {
        this.$set(this.usernames, payload.id, payload.name)
      })
      this.socket.on('srv-set-seats-stand-up', (payload) => {
        this.$set(this.usernames, payload.id, '')
      })
      this.socket.on('srv-set-route', (payload) => {
        this.$router.push(payload)
      })
    }
  }
</script>

<style scoped>

</style>
