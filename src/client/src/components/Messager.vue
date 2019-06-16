<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card
        :style="{
          'background-color': backgroundColor
        }"
        :height="height"
        class="scrollable"
      >
        <v-card-text>
          <ul class="messages" 
            v-for="(message, index) in messages"
            :key="index"
          >
            <li class="message">
              {{ message }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  
</template>

<script>

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: "Messager",
    props: {
      backgroundColor: {
        type: String,
        default: 'rgb(255, 255, 232)',
      },
      height: {
        type: String,
        default: '34rem',
      }
    },
    data: () => ({
      messages: []
    }),
    computed: {
      ...mapGetters({
        socket: 'socket', user: 'user',
      }),
    },
    created () {
      this.socket.on('srv-messages-addon', (payload) => {
        this.messages = this.messages.concat(payload.messages)
      })
      // eslint-disable-next-line
      this.socket.on('srv-messages-clean', (payload) => {
        this.messages = []
      })
    },
    mounted () {

    },
  }
</script>

<style scoped>
  .scrollable {
    overflow-y: auto;
    overflow-x: auto;
  }
</style>
