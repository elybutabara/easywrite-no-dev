<template>
<div class="page-book-lising">
   <syncing v-if="syncing.open" :properties="{ fullscreen: syncing.fullscreen, autostart: syncing.autostart }"></syncing>
   <div class="es-page-head">
        <div class="inner">
            <div class="details">
                <h4>Welcome {{ getAuthorName }}!</h4>
                <!-- <small>Last Login: January 01, 2020</small> -->
            </div>
            <div class="actions">
                <div style="display:none; height:30px; line-height:30px; background:red; padding:0px 10px;">
                    <span style="font-family:'Digital'; font-size:30px;">25:00</span>
                    <span style="font-family:'Digital'; font-size:30px;">START</span>
                    <span style="font-family:'Digital'; font-size:30px;">RESET</span>
                </div>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="es-panel">
            <h4>{{$t('REPORTS')}}</h4>
            <hr/>
            <report />
        </div>

        <div style="margin-top:10px; margin-bottom:20px; max-width: 1320px; display:flex; width:calc(100% - 40px); margin:0px auto; justify-content: space-between;">
            <div style="background:#fff; width:calc(100% - 320px); padding:20px 20px; border: 1px solid #e0e5ee;">
                <h4>Your literary family</h4>
                <p>
                    Do you want specific feedback on your text? Pilot Reader is a unique network where you can meet people who are interested in your project and experience with your genre. The service is free, secure and you can be completely anonymous.
                </p>
                <br/>
                <h4>How does this work?</h4>
                <p>
                Pilot Reader is a unique system where you can share your own texts for review, read and review other people's texts, or both.
                </p>
                <br/>
                <h4>About Pilot Reader</h4>
                <p>
                Pilot reader is under the umbrella of the Writers' School, and thus part of the literary family.
                </p>
            </div>
            <div style="width:300px;">
                <div style="padding:0px; text-align:center; background:#fff;  border: 1px solid #e0e5ee; margin-bottom:20px;">
                    <div style="background:#f5f8fa; font-weight:600; border-bottom:1px solid #e0e5ee; text-align:left; padding:2px 10px;">{{$t('TIME_WORKED')}}</div>
                    <div style="padding:20px;">
                        <span style="font-family:'Digital'; font-size:20px;">
                            <span style="background:#e0e5ee; display:inline-block; padding:0px 5px; width:35px; text-align:center;">{{ setDefaultHours(defaulttimer.hr) }}</span> :
                            <span style="background:#e0e5ee; display:inline-block; padding:0px 5px; width:35px; text-align:center;">{{ setDefaultMinutes(defaulttimer.min) }}</span> :
                            <span style="background:#e0e5ee; display:inline-block; padding:0px 5px; width:35px; text-align:center;">{{ setDefaultSeconds(defaulttimer.sec) }}</span>
                        </span>
                    </div>
                </div>
                <div style="padding:20px 20px; text-align:center; background:#fff;  border: 1px solid #e0e5ee;">
                    <h4 style="margin-top:10px; margin-bottom:0px;">POMODORO TIMER</h4>
                    <h4 style="font-family:'Digital'; font-size:80px;">{{ setPomodoroMinutes(pmdtimer.pmd_min) }}:{{ setPomodoroSeconds(pmdtimer.pmd_sec) }}</h4>
                    <div>
                        <b-form-group label="Set Pomodoro:">
                            <b-form-radio-group v-model="selected" :options="options" name="radio-inline"> </b-form-radio-group>
                        </b-form-group>
                    </div>
                    <div>
                        <button @click="togglePomodoro()" style="background:#293742; color:#fff; border:1px solid #293742; border-radius:3px; width:100px;">{{ pmdtogglestatus.pmd_toggle }}</button>
                        <button @click="resetPomodoro()" style="background:#8a2c3a; color:#fff; border:1px solid #8a2c3a; border-radius:3px; width:100px;">RESET</button>
                    </div>
                </div>
            </div>
        </div>
        <br/>
        <div class="es-panel">
            <h4>Your literary family</h4>
            <p>
                Do you want specific feedback on your text? Pilot Reader is a unique network where you can meet people who are interested in your project and experience with your genre. The service is free, secure and you can be completely anonymous.
            </p>
            <br/>
            <h4>How does this work?</h4>
            <p>
               Pilot Reader is a unique system where you can share your own texts for review, read and review other people's texts, or both.
            </p>
            <br/>
            <h4>About Pilot Reader</h4>
            <p>
               Pilot reader is under the umbrella of the Writers' School, and thus part of the literary family.
            </p>
        </div>

        <div class="es-panel">
            <h4>Your literary family</h4>
            <p>
                Do you want specific feedback on your text? Pilot Reader is a unique network where you can meet people who are interested in your project and experience with your genre. The service is free, secure and you can be completely anonymous.
            </p>
            <br/>
            <h4>How does this work?</h4>
            <p>
               Pilot Reader is a unique system where you can share your own texts for review, read and review other people's texts, or both.
            </p>
            <br/>
            <h4>About Pilot Reader</h4>
            <p>
               Pilot reader is under the umbrella of the Writers' School, and thus part of the literary family.
            </p>
        </div>
    </div>
</div>
</template>

<script>
import Syncing from '@/pages/views/syncing'
import { mapGetters, mapActions } from 'vuex'
import Report from '../../components/Report'

export default {
  name: 'dashboard',
  props: ['properties'],
  computed: {
    ...mapGetters({ defaulttimer: 'getDefaultTimer', pmdtimer: 'getPmdTimer', pmdtogglestatus: 'getToggle' }),
    getAuthorName: function () {
      return this.$store.getters.getAuthorName
    }
  },
  watch: {
    selected: function () {
      this.on_dashboard += 1
      this.$store.commit('setSelectedPmdTimer', this.selected)

      if (this.on_dashboard > 2) {
        this.$store.commit('setPmdTimer', this.selected)
      }
    }

  },
  data: function () {
    return {
      syncing: {
        fullscreen: false,
        autostart: false,
        open: false
      },
      selected: '',
      on_dashboard: '',
      options: [
        { text: '25 min', value: '25' },
        { text: '50 min', value: '50' }
      ]
    }
  },
  components: {
    'report': Report,
    'syncing': Syncing
  },
  methods: {
    ...mapActions({ actionmutateStart: 'mutatePmdTimer' }),
    setDefaultSeconds: function (seconds) {
      return (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    },

    setDefaultMinutes: function (minutes) {
      return (minutes < 10) ? '0' + minutes.toString() : minutes.toString()
    },

    setDefaultHours: function (hours) {
      return (hours < 10) ? '0' + hours.toString() : hours.toString()
    },

    setPomodoroMinutes: function (minutes) {
      return (minutes < 10) ? '0' + minutes.toString() : minutes.toString()
    },

    setPomodoroSeconds: function (seconds) {
      return (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    },

    togglePomodoro: function () {
      var scope = this

      if (scope.pmdtogglestatus.pmd_toggle === 'Start') {
        scope.actionmutateStart('start')
        scope.$store.commit('mutateToggle', 'Pause')
      } else {
        scope.actionmutateStart('pause')
        scope.$store.commit('mutateToggle', 'Start')
      }
    },

    resetPomodoro: function () {
      var scope = this
      scope.actionmutateStart('reset')
      scope.$store.commit('mutateToggle', 'Start')
      scope.$store.commit('setPmdTimer', this.selected)
    },
    checkerPomodoro: function () {
      var scope = this
      if (scope.pmdtimer.pmd_min === 0 && scope.pmdtimer.pmd_sec === 0) {
      }
    },

    closeSyncer: function () {
      var scope = this
      scope.syncing.open = false
    }
  },
  beforeMount () {
    var scope = this
    if (scope.properties !== null && scope.properties.autosync) {
      scope.syncing.fullscreen = true
      scope.syncing.autostart = true
      scope.syncing.open = true
    }
  },
  mounted () {
    this.on_dashboard = 1
    this.selected = this.pmdtimer.pmd_selected
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
