<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout row wrap>
            <v-flex xs12><br><br></v-flex>
            <v-flex xs12>
              <apps-title title="有桌够级 - 欢迎来玩！"></apps-title>
            </v-flex>
            <v-flex xs12><br><br></v-flex>
            <!-- user id -->
            <v-flex xs12>
              <v-text-field
                label="玩家ID"
                prepend-icon="videogame_asset"
                v-model="username"
                @keyup.native.enter="setUserName(username)"
              ></v-text-field>
            </v-flex>
            <!-- sit down -->
            <v-flex xs12>
              <v-btn 
                block 
                class="primary white--text"
                @click.native="setUserName(username)"
              >
                <v-icon dark>whatshot</v-icon>&nbsp;&nbsp;
                Enter Game Boardroom！ - 进入有桌够级大厅！
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

  export default {
    name: 'home',
    components: {
      appsTitle: Title
    },
    data: () => ({
      username: ''
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user',
      }),
    },
    methods: {
      ...mapActions({
        setUserAttr: 'setUserAttr'
      }),
      setUserName (username) {
        // set username at client (local)
        console.log('set-user-name:', username)
        this.setUserAttr({name: username})
        // set username at server (remote)
        this.socket.emit('set-user-name', { name: username })
      }
    },
    created () {
      // manual open socket
      // this.socket.open()
      // get status from server, and direct to room/table accordingly
      this.socket.on('srv-set-user-attr', (payload) => {
        this.setUserAttr(payload)
      })
      this.socket.on('srv-set-route', (payload) => {
        this.$router.push(payload)
      })
    }
  }
</script>

<style scoped>

</style>
