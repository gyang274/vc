<template>
  <v-layout row wrap>
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      :color="noteColor.dian"
      class="white--text"
    >
      <h1>点</h1>
    </v-avatar>
    &nbsp;
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      :color="noteColor.mens"
      class="white--text"
    >
      <h1>闷</h1>
    </v-avatar>
    &nbsp;
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      :color="noteColor.shao"
      class="white--text"
    >
      <h1>🔥</h1>
    </v-avatar>
    &nbsp;
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      :color="noteColor.lake"
      class="white--text"
    >
      <h1>落</h1>
    </v-avatar>
  </v-layout>
</template>

<script>
  export default {
    name: 'apps-player-note',
    props: {
      note: {
        type: Object,
        default: () => ({
          dian: [false, false],
          shao: [false, false],
          mens: [false, false],
          lake: [false, false],
        })
      },
      tile: {
        type: Boolean,
        default: true,
      },
      avatarSize: {
        type: Number,
        default: 40,
      }
    },
    data: () => ({
      
    }),
    computed: {
      noteColor () {
        return {
          dian: this.dmslColor(this.note.dian),
          mens: this.dmslColor(this.note.mens),
          shao: this.dmslColor(this.note.shao),
          lake: this.dmslColor(this.note.lake),
        }
      }
    },
    methods: {
      dmslColor (dmsl) {
        if (dmsl[0] && dmsl[1]) {
          return "rgb(255, 191, 127)"
        } else if (dmsl[0] && !dmsl[1]) {
          return "rgb(255, 127, 127)"
        } else if (!dmsl[0] && dmsl[1]) {
          return "rgb(127, 191, 255)"
        } else {
          return "rgb(63, 223, 63)"
        }
      },
      lakeColor (lake) {
        if (lake === -1) {
          return "rgb(248, 248, 248)"
        } else if (lake === 0 || lake === 1) {
          return "rgb(255, 127, 127)"
        } else if (lake === 2 || lake === 3) {
          return "rgb(255, 191, 127)"
        } else if (lake === 4 || lake === 5) {
          return "rgb(127, 191, 255)"
        } else {
          return "rgb(63, 223, 63)"
        }
      }
    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
