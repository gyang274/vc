<template>
  <v-layout row wrap>
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      color="red"
      class="white--text"
    >
      <h1>点</h1>
    </v-avatar>
    &nbsp;
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      color="red"
      class="white--text"
    >
      <h1>焖</h1>
    </v-avatar>
    &nbsp;
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      color="red"
      class="white--text"
    >
      <h1>🔥</h1>
    </v-avatar>
    &nbsp;
    <v-avatar
      :tile="tile"
      :size="avatarSize"
      color="red"
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
      
    },
    methods: {
      
    },
    created () {

    },
    mounted () {

    }
  }
</script>
