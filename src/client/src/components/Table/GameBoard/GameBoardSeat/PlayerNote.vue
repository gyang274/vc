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
        // default: () => ({
        //   dian: [false, false],
        //   shao: [false, false],
        //   mens: [false, false],
        //   lake: [false, false],
        // })
        required: true,
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
          return "rgb(224, 32, 224)"
        } else if (dmsl[0] && !dmsl[1]) {
          return "rgb(224, 32, 32)"
        } else if (!dmsl[0] && dmsl[1]) {
          return "rgb(224, 128, 32)"
        } else {
          return "rgb(32, 128, 224)"
        }
      },
    },
    created () {

    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
