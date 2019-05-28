<template>
  <v-container fluid>

    <v-layout row wrap>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :seat="dSeatsIndex[3]" 
          :seatusername="seats[3].username"
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
          :seat="4" 
          :seatusername="seats[4].username"
        ></apps-room-table-seat>
      </v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :seat="2" 
          :seatusername="seats[2].username"
        ></apps-room-table-seat>      
      </v-flex>

      <v-flex xs12><br><br><br></v-flex>

      <v-flex xs4>
        <apps-room-table-seat 
          :seat="5" 
          :seatusername="seats[5].username"
        ></apps-room-table-seat>      
      </v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :seat="1" 
          :seatusername="seats[1].username"
        ></apps-room-table-seat>      
      </v-flex>

      <v-flex xs12><br><br><br></v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12><br></v-flex>
      <v-flex xs4></v-flex>
      <v-flex xs4>
        <apps-room-table-seat 
          :seat="0" 
          :seatusername="seats[0].username"
        ></apps-room-table-seat>
      </v-flex>
      <v-flex xs4></v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  import TableSeat from './TableSeat'

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
      seats: [
        { id: 0, username: '',  }, 
        { id: 1, username: '',  },
        { id: 2, username: '',  },
        { id: 3, username: '',  },
        { id: 4, username: '',  },
        { id: 5, username: '',  },
      ],
      // derived seats index from user/player perpective
      dSeatsIndex: [
        0, 1, 2, 3, 4, 5
      ]
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user'
      }),
      dSeatsIndex () {
        let seatsIndex = [0, 1, 2, 3, 4, 5]
        h = seatsIndex.splice(this.user.seat)
        seatsIndex.concat(h)
        return seatsIndex
      }
    },
    methods: {
      ...mapActions({
        
      }),      
    },
    created () {
      this.socket.emit(
        'get-seats', {}, (response) => {
          this.seats = response
        }
      )
      this.socket.on('srv-seats-set', (payload) => {
        this.seats = payload
      })
      this.socket.on('srv-set-route', (payload) => {
        this.$router.push(payload)
      })
    }
  }
</script>

<style scoped>

</style>
