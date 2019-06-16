<template>
  <v-layout row wrap>
    <v-flex xs12 v-show="status === 'wait' || status === 'waitOk'">
      <v-btn 
        block 
        class="primary white--text"
        @click.native="actionWaitOk()"
        :disabled="status === 'waitOk'"
      >
        <h2>Let's Play - 开始</h2>
      </v-btn>
    </v-flex>
    <v-flex xs12 v-show="status === 'exec' || status === 'execOk'">
      <v-layout row wrap>
        <v-flex xs4 px-1>
          <slot name="slot-player-selection"></slot>
        </v-flex>
        <v-flex xs4 px-1>
          <v-btn 
            block 
            class="primary white--text"
            @click.native="actionExec()"
          >
          <!-- :disabled="status === 'execOk'" -->
            <h2>买3/买4/贡牌</h2>
          </v-btn>
        </v-flex>
        <v-flex xs4 px-1>
          <v-btn
            block 
            class="primary white--text"
            @click.native="actionExecOk()"
            :disabled="status === 'execOk'"
          >
            <h2>开打</h2>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 v-show="status === 'play' || status === 'ende'">
      <v-layout row wrap>
        <v-flex xs4 px-2>
          <v-btn 
            block 
            class="primary white--text"
            :disabled="!isOnAction || status === 'ende'"
            @click.native="actionPass()"
          >
            <h2>过牌</h2>
          </v-btn>
        </v-flex>
        <v-flex xs2 px-2>
          <v-btn 
            block 
            class="primary white--text"
            :disabled="!isOnAction || status === 'ende'"
            @click.native="actionCask()"
          >
            <h2>让牌</h2>
          </v-btn>
        </v-flex>
        <v-flex xs2 px-2>
          <v-btn 
            block 
            class="primary white--text"
            :disabled="status === 'ende'"
            @click.native="actionCout()"
          >
            <h2>烧牌</h2>
          </v-btn>
        </v-flex>
        <v-flex xs4 px-2>
          <v-btn 
            block 
            class="primary white--text"
            :disabled="!isOnAction || status === 'ende'"
            @click.native="actionCout()"
          >
            <h2>出牌</h2>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'apps-player-action',
    components: {
      
    },
    props: {
      status: {
        type: String,
        default: 'play',
      },
      isOnAction: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({

    }),
    computed: {

    },
    methods: {
      actionWaitOk () {
        this.$emit('action-wait-ok')
      },
      actionExec () {
        this.$emit('action-exec')
      },
      actionExecOk () {
        this.$emit('action-exec-ok')
      },
      actionPass () {
        this.$emit('action-pass')
      },
      actionCask () {
        this.$emit('action-cask')
      },
      actionCout () {
        this.$emit('action-cout')
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
