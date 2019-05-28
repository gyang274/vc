<template>
  <v-layout row wrap>
    <!-- seat is open to sitdown -->
    <template v-if="seatusername === ''">
      <v-flex xs12>
        <v-btn 
          block 
          class="primary white--text"
          @click.native="setUserSeat(seat)"
        >
          <v-icon dark>whatshot</v-icon>&nbsp;&nbsp; SIT DOWN
        </v-btn>
      </v-flex>
    </template>
    <!-- seat is taken by user in this view -->
    <template v-else-if="seatusername === user.name">
      <v-flex xs6>
        <v-btn block outline class="primary primary--text">
          <v-icon>videogame_asset</v-icon>&nbsp;&nbsp; {{ seatusername }}
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn 
          block 
          class="primary white--text"
          @click.native="setUserUnseat(seat)"
        >
          <v-icon dark>whatshot</v-icon>&nbsp;&nbsp; STAND UP
        </v-btn>
      </v-flex>
    </template>
    <!-- seat is taken by someone -->
    <template v-else>
      <v-flex xs12>
        <v-btn block outline class="primary primary--text">
          <v-icon>videogame_asset</v-icon>&nbsp;&nbsp; {{ seatusername }}
        </v-btn>
      </v-flex>
    </template>
  </v-layout>  
</template>

<script>

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'apps-room-table-seat',
    props: {
      seat: Number,
      seatusername: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user'
      }),
    },
    methods: {
      ...mapActions({
        setUserAttr: 'setUserAttr'
      }),
      setUserSeat (seat) {
        console.log('set-user-seat:', this.user.name, 'to seat', seat)
        this.setUserAttr({seat: seat})
        this.socket.emit('set-user-seat', {seat: seat})
      },
      setUserUnseat (seat) {
        console.log('set-user-unseat:', this.user.name, 'from seat', seat)
        this.setUserAttr({seat: -1})
        this.socket.emit('set-user-unseat', {seat: seat})
      }
    },
    mounted () {

    }
  }
</script>
