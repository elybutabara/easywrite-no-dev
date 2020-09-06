<template>
<div class="es-page-main page-book-lising">
    <syncing v-if="syncing.open" :properties="{ fullscreen: syncing.fullscreen, autostart: syncing.autostart }"></syncing>
    <div class="es-page-head">
      <div class="row-head">
          <h4 class="main-title">{{$t('WELCOME')}} {{ getAuthorName }}!</h4>
          <!-- <small>Last Login: January 01, 2020</small> -->
          <div class="d-flex">
            <a class="btn-icon small" href="#hashtagCourses"><span><i class="las la-atom"></i></span>Courses</a>
            <a class="btn-icon small" href="#hashtagAssignments"><span><i class="las la-laptop"></i></span>Assignments</a>
            <a class="btn-icon small" href="#hashtagPromodoro"><span><i class="las la-user-clock"></i></span>Pomodoro</a>
            <a class="btn-icon small" href="#hashtagAbout"><span><i class="las la-feather-alt"></i></span>About</a>
          </div>
      </div>
    </div>
    <div class="es-page-content" id="custom-scrollbar">
        <div class="container-fluid">
          <div class="row mb-4">
            <div class="col-12">
              <report />
            </div>
          </div>
          <div class="row mb-4">
            <div class="col-8" id="hashtagCourses">
              <course-listing-dashboard />
            </div>
            <div class="col-4" id="hashtagPromodoro">
              <div class="es-panel-sm mb-4">
                    <div class="es-panel-head"><i class="las la-stopwatch"></i> {{$t('TIME_WORKED')}}</div>
                    <div class="es-panel-body">
                        <span class="time-worked">
                            <span>{{ setDefaultHours(defaulttimer.hr) }}</span> :
                            <span>{{ setDefaultMinutes(defaulttimer.min) }}</span> :
                            <span>{{ setDefaultSeconds(defaulttimer.sec) }}</span>
                        </span>
                    </div>
                </div>
                <div class="es-wrapper es-panel promodoro-timer">
                    <h4>POMODORO TIMER</h4>
                    <span class="time">{{ setPomodoroMinutes(pmdtimer.pmd_min) }}:{{ setPomodoroSeconds(pmdtimer.pmd_sec) }}</span>
                    <div>
                        <b-form-group label="Set Pomodoro:">
                            <b-form-radio-group v-model="selected" :options="options" name="radio-inline"> </b-form-radio-group>
                        </b-form-group>
                    </div>
                    <div>
                        <button @click="togglePomodoro()" class="btn-pomodoro">{{ pmdtogglestatus.pmd_toggle }}</button>
                        <button @click="resetPomodoro()" class="btn-pomodoro red">Reset</button>
                    </div>
                </div>
            </div>
          </div>
          <div class="row no-gutters">
            <div class="col-12" id="hashtagAssignments">
              <assignment-listing></assignment-listing>
            </div>
          </div>
          <div class="row es-wrapper es-panel p-0">
            <div class="col-7" id="hashtagAbout">
              <div class="pt-4 pr-2 pb-4 pl-2">
                <div class="blurb-left family">
                  <div class="icon">
                    <i class="las la-hands-helping"></i>
                  </div>
                  <div class="ml-20px">
                    <h4>Your literary family</h4>
                    <p class="mb-0">Do you want specific feedback on your text? Pilot Reader is a unique network where you can meet people who are interested in your project and experience with your genre. The service is free, secure and you can be completely anonymous.</p>
                  </div>
                </div>
                <div class="blurb-left work">
                  <div class="icon">
                    <i class="las la-chess-knight"></i>
                  </div>
                  <div class="ml-20px">
                    <h4>How does this work?</h4>
                    <p class="mb-0">Pilot Reader is a unique system where you can share your own texts for review, read and review other people's texts, or both.</p>
                  </div>
                </div>
                <div class="blurb-left pilot mb-0">
                  <div class="icon">
                      <i class="las la-book-reader"></i>
                  </div>
                  <div class="ml-20px">
                    <h4>About Pilot Reader</h4>
                    <p class="mb-0">Pilot reader is under the umbrella of the Writers' School, and thus part of the literary family.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-5 bg-girl"></div>
          </div>
        </div>
    </div>
</div>
</template>

<script>
import Syncing from '@/pages/views/syncing'
import AssignmentListing from './assignment/assignment-listing'
import { mapGetters, mapActions } from 'vuex'
import Report from '../../components/Report'
import CourseListingDashboard from './course/course-listing-dashboard'

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
    'syncing': Syncing,
    'course-listing-dashboard': CourseListingDashboard,
    'assignment-listing': AssignmentListing

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
