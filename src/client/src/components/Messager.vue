<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card
        :style="{
          'background-color': 'rgb(63, 192, 63)'
        }"
        height="26rem"
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
  export default {
    name: "Messager",
    props: {
      messages: {
        type: Array,
        default: () => ([
          
        ])
      },
    },
    data: () => ({

    }),
    computed: {
      
    },
    created () {

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
