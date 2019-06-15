<template>
  <v-layout>
    <div>
      <v-avatar
        :tile="tile"
        :size="avatarSize"
        :color="'rgb(224, 32, 32)'"
        class="white--text"
      >
        <h1>{{ username.slice(0, 2).toUpperCase() }}</h1>
      </v-avatar>
    </div>
    <div>&nbsp;&nbsp;</div>
    <div>
      <v-layout row wrap>
        <v-flex xs12>&nbsp;称号: {{ userinfo.title }}</v-flex>
        <v-flex xs12>&nbsp;金币: {{ userinfo.coins }}</v-flex>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'apps-player-profile',
    props: {
      username: {
        type: String,
        default: '',
      },
      userinfo: {
        type: Object,
        default: () => ({
          title: '', coins: 0
        })
      },
      tile: {
        type: Boolean,
        default: true,
      },
      avatarSize: {
        type: Number,
        default: 40
      }
    },
    data: () => ({
      
    }),
    computed: {
      ...mapGetters({
        
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
