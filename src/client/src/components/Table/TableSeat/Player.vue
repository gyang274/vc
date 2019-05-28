<template>
  <v-avatar
          :tile="tile"
          :size="avatarSize"
          color="red"
          class="white--text"
        >
          <h1>点</h1>
        </v-avatar>
</template>


<script>

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'apps-player',
    props: {
      seat: Number,
      seatusername: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      tile: false,
      avatarSize: 50
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
