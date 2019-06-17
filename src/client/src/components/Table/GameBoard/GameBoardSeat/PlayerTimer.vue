<template>
  <div class="text-xs-center">
    <v-progress-circular
      :rotate="-90"
      :size="100"
      :width="17"
      :value="value"
      color="primary"
    >
      <h1 style="font-size: 260%"><strong>{{ secondsLeft }}</strong></h1>
    </v-progress-circular>
  </div>    
</template>

<script>
  export default {
    props: {
      seconds: {
        type: Number,
        default: 30,
      },
      isOnAction: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        interval: {},
        value: 0,
        secondsLeft: 0,
        startCountdown: this.isOnAction
      }
    },
    computed: {
      sencondsTick () {
        return 100 / Math.max(1, this.seconds)
      }
    },
    created () {

    },
    mounted () {
      this.interval = setInterval(() => {
        if (this.startCountdown) {
          this.secondsLeft = this.seconds + 1
          this.startCountdown = !this.startCountdown
        } else if (this.secondsLeft > 1)  {
          this.secondsLeft -= 1
          this.value = this.secondsLeft * this.sencondsTick
        } else if (this.secondsLeft === 1) {
          this.secondsLeft -= 1
          this.$emit('action-time-up')
        }
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
