<template>
  <v-layout>
    <div>
      <v-chip
        :height="'100'"
        :color="'rgb(224, 32, 32)'"
        class="white--text"
        label
      >
        <h1>{{ noteStatus }}</h1>
      </v-chip>
    </div>
  </v-layout>
</template>

<script>

  // eslint-disable-next-line
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'apps-player-profile',
    props: {
      noteStatus: {
        type: String,
        default: 'play',
      },
    },
    data: () => ({
      noteStatusMap: {
        play: '听牌',
        pass: '过牌',
        cask: '让牌',
        cout: '牌权',
        ende: '跑路',
      }
    }),
    computed: {
      ...mapGetters({
        
      }),
      noteStatusStr () {
        return this.noteStatusMap[this.noteStatus]
      }
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