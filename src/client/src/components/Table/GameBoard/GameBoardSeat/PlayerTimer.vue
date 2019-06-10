<template>
  <div class="text-xs-center">
    <v-progress-circular
      :rotate="-90"
      :size="100"
      :width="23"
      :value="value"
      color="primary"
    >
      {{ secondsLeft }}
    </v-progress-circular>
  </div>    
</template>

<script>
  export default {
    props: {
      seconds: {
        type: Number,
        default: 20,
      },
      isOnAction: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      interval: {},
      value: 0,
      secondsLeft: 0
    }),
    computed: {
      sencondsTick () {
        return 100 / Math.max(1, this.seconds)
      }
    },
    created () {

    },
    mounted () {
      this.interval = setInterval(() => {
        if (this.isOnAction) {
          this.isOnAction = !this.isOnAction
          this.secondsLeft = this.seconds
        } else if (this.secondsLeft > 0) {
          this.secondsLeft -= 1  
        } else {
          this.$emit('action-time-up')
        }
        this.value = this.secondsLeft * this.sencondsTick
      }, 1000)
    },
    beforeDestroy () {
      clearInterval(this.interval)
    },
  }
</script>

<style lang="stylus" scoped>
  .v-progress-circular
    margin: 1rem
</style>