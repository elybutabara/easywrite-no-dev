<template>
  <div class="component-course-listing-dashboard" v-if="page.is_ready">
    <div class="row">
      <div class="col-md-6">
        <h4 style="margin-bottom: 0">{{$tc('COURSES')}}</h4>
      </div>
      <div class="col-md-6 text-right" v-if="courses_taken.length">
        <b-button style="" class="es-button-white" @click="CHANGE_COMPONENT({tabKey: 'course-list', tabComponent: 'course-listing',  tabData: {}, tabTitle: $t('COURSES'), newTab: true})">{{ $tc('VIEW_ALL') }}</b-button>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-md-4" v-for="course_taken in courses_taken" :key="course_taken.uuid">
        <div class="col-md-12">
          <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">
            <div class="default-preview"><i class="fa fa-image"></i></div>
          </div>
          <div class="mt-3">
            <h4 class="ellipsis-2">{{ course_taken.course.title }}</h4>
            <span class="ellipsis-2" v-html="REMOVE_HTML(course_taken.course.short_description)"></span>
          </div>
          <div class="mt-3 text-center">
            <b-button @click="CHANGE_COMPONENT({tabKey: 'course-details-' + course_taken.uuid , tabComponent: 'course-details',  tabData: {course_taken:course_taken}, tabTitle: $t('COURSE'), newTab: true})" class="es-button-white">{{ (course_taken.started_at) ? $tc('CONTINUE_WITH_COURSE') : $tc('START')}}</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course-listing-dashboard',
  data: function () {
    return {
      courses_taken: [],
      page: {
        is_ready: false
      }
    }
  },
  async mounted () {
    let scope = this
    let response
    try {
      response = await scope.axios.get('http://localhost:3000/courses/' + this.$store.getters.getUserID + '/course-list-dashboard')
    } finally {
      scope.courses_taken = response.data
      scope.page.is_ready = true
    }
  }
}
</script>

<style scoped>
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 150px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 100px; opacity: 0.8; }
</style>
