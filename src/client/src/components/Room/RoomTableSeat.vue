<template>
  <v-layout row wrap>
    <!-- seat is open to sitdown -->
    <template v-if="username === ''">
      <v-flex xs12>
        <v-btn 
          block 
          class="primary white--text"
          @click.native="actionSitDown()"
          :disabled="isSeated"
        >
          <v-icon dark>whatshot</v-icon>&nbsp;&nbsp; SIT DOWN
        </v-btn>
      </v-flex>
    </template>
    <!-- seat is taken by user in this view -->
    <template v-else-if="username === user.name">
      <v-flex xs6>
        <v-btn block outline class="primary primary--text">
          <v-icon>videogame_asset</v-icon>&nbsp;&nbsp; {{ username }}
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn 
          block 
          class="primary white--text"
          @click.native="actionStandUp()"
        >
          <v-icon dark>whatshot</v-icon>&nbsp;&nbsp; STAND UP
        </v-btn>
      </v-flex>
    </template>
    <!-- seat is taken by someone -->
    <template v-else>
      <v-flex xs12>
        <v-btn block outline class="primary primary--text">
          <v-icon>videogame_asset</v-icon>&nbsp;&nbsp; {{ username }}
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
      username: {
        type: String,
        default: '',
      },
      isSeated: {
        type: Boolean,
        default: false,
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
      actionSitDown () {
        this.$emit('action-sit-down')
      },
      actionStandUp () {
        this.$emit('action-stand-up')
      }
    },
    mounted () {

    }
  }
</script>
