<template>
  <v-layout row wrap>
    <v-flex xs12 class='text-xs-center'>
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          战局统计
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="contents"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-center">{{ props.item.dian }}</td>
              <td class="text-xs-center">{{ props.item.mens }}</td>
              <td class="text-xs-center">{{ props.item.shao }}</td>
              <td class="text-xs-center">{{ props.item.lake }}</td>
              <td class="text-xs-center">{{ props.item.points }}</td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary white--text"
            flat
            @click="actionAckl()"
          >
            不服！再战！
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-layout>
</template>

<script>
  export default {
    name: 'apps-game-board-news',
    props: {
      headers: {
        type: Array,
        default: () => ([
          {
            text: '昵称',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: '点', value: 'dian' },
          { text: '闷', value: 'mens' },
          { text: '烧', value: 'shao' },
          { text: '落', value: 'lake' },
          { text: '积分', value: 'points' },
        ])
      },
      contents: {
        type: Array,
        default: () => ([
          {
            name: 'yg',
            dian: '开点',
            mens: '闷人',
            shao: '烧人',
            lake: '头科',
            points: 8
          },
        ])
      }
    },
    data: () => ({
      
    }),
    computed: {

    },
    methods: {
      actionAckl () {
        this.$emit('action-ackl')
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
