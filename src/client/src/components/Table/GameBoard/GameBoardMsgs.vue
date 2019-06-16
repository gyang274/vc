<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="text-xs-center">
        <v-dialog
          v-model="msgsShow"
          width="1024"
        >
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              <h2>友情提示</h2>
            </v-card-title>
            <v-card-text>
              {{ msgs }}
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary white--text"
                flat
                @click.native="actionAckl()"
              >
                <h2>受教了！</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-flex>
  </v-layout>

</template>

<script>
  export default {
    name: 'apps-game-board-msgs',
    props: {
      msgs: {
        type: String,
        default: '',
      },
      msgsShow: {
        type: Boolean,
        default: false,
      },
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
