<template>
  <v-layout row wrap>
    <v-flex xs12 class='text-xs-center'>
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          战局统计 - 系统提示您：素质游戏，自觉进贡！
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="contents"
            class="elevation-1"
            hide-actions
          >
            <template v-slot:items="props">
              <td><h2>{{ props.item.name }}</h2></td>
              <td class="text-xs-center"><h2>{{ props.item.dian }}</h2></td>
              <td class="text-xs-center"><h2>{{ props.item.mens }}</h2></td>
              <td class="text-xs-center"><h2>{{ props.item.shao }}</h2></td>
              <td class="text-xs-center"><h2>{{ props.item.lake }}</h2></td>
              <td class="text-xs-center"><h2>{{ props.item.points }}</h2></td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            block
            class="primary--text text-xs-center"
            flat
            @click.native="actionAckl()"
          >
            <h2>不服？决战到天明！</h2>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
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
            align: 'center',
            sortable: false,
            value: 'name'
          },
          { text: '点', value: 'dian', align: 'center', sortable: false, },
          { text: '闷', value: 'mens', align: 'center', sortable: false, },
          { text: '烧', value: 'shao', align: 'center', sortable: false, },
          { text: '落', value: 'lake', align: 'center', sortable: false, },
          { text: '积分', value: 'points', align: 'center', sortable: false, },
        ])
      },
      contents: {
        type: Array,
        default: () => ([
          {
            name: '',
            dian: '',
            mens: '',
            shao: '',
            lake: '',
            points: 0
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
