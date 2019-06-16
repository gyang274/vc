<template>
  <v-layout>
    <div>
      <v-chip
        :height="'100'"
        :color="'rgb(224, 32, 32)'"
        class="white--text"
        label
      >
        <h1>{{ username }}</h1>
      </v-chip>
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


<style scoped>

.v-chip {
  height: 3rem
}

</style>