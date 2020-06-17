<template>
  <div class="component-report">
    <div class="row" v-for="course in courses" :key="course.uuid">
      <div class="col-12 col-md-3" style="">
          <div style="text-align:center; background:#f5f8fa;border:1px solid #cbd6e2;">
            <div style="padding:40px 40px;">
              <h4>{{ course.course.title }}</h4>
              <span v-html="course.course.short_description"></span>
            </div>
            <b-button style="width:95%;margin-bottom: 1em" class="es-button-white">{{ (course.started_at) ? $tc('CONTINUE_WITH_COURSE') : $tc('START')}}</b-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course-listing',
  methods: {
    numberFormat: function (number) {
      return number.toLocaleString()
    }
  },
  computed: {
    courses: {
      get () {
        let scope = this
        let chapters = scope.$store.getters.getCoursesByUserId(this.$store.getters.getUserID)
        return chapters
      },
      set (value) {
        let scope = this
        if (value) {
          this.$store.commit('sortChapters', {bookUUID: scope.book.uuid, data: value})
        }
      }
    }
  },
  beforeMount () {
    let scope = this
    scope.$store.dispatch('loadCourseByUserId', this.$store.getters.getUserID)
  },
  mounted () {
    // let scope = this
  }
}
</script>

<style scoped>

</style>
