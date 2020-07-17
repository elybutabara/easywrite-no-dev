<template>
<div class="pomodoro-nav"><h4>{{ setPomodoroMinutes(pmdtimer.pmd_min) }}:{{ setPomodoroSeconds(pmdtimer.pmd_sec) }}</h4></div>
<!-- <p>test</p> -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  methods: {
    setPomodoroMinutes: function (minutes) {
      return (minutes < 10) ? '0' + minutes.toString() : minutes.toString()
    },

    setPomodoroSeconds: function (seconds) {
      return (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    }
  },
  computed: {
    ...mapGetters({ pmdtimer: 'getPmdTimer' })
  }

}

</script>
