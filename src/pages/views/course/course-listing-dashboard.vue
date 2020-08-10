<template>
  <div class="component-course-listing-dashboard" v-if="page.is_ready">
    <div class="row">
      <div class="col-md-6">
        <h4 style="margin-bottom: 0">{{$t('COURSES')}}</h4>
      </div>
      <div class="col-md-6 text-right" v-if="courses_taken.length">
        <a href="javascript:void(0)" class="es-button" @click="CHANGE_COMPONENT({tabKey: 'course-list', tabComponent: 'course-listing',  tabData: {}, tabTitle: $t('COURSES'), newTab: true})">
          {{ $t('VIEW_ALL') }} <i class="fas fa-chevron-right"></i>
        </a>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-md-4" v-for="course_taken in courses_taken" :key="course_taken.uuid" v-if="isNotExpired(course_taken) && course_taken.started_at!=null">
          <div class="uploaded-file-preview mb-3" style="height: 150px;background: #d2d2d2">
            <div class="default-preview"><i class="fa fa-image"></i></div>
          </div>
          <h5 class="ellipsis-2 mb-3">{{ course_taken.course.title }}</h5>
          <span class="ellipsis-2 mb-2" v-html="REMOVE_HTML(course_taken.course.short_description)"></span>
          <a href="javascript:void(0)" @click="CHANGE_COMPONENT({tabKey: 'course-details-' + course_taken.uuid , tabComponent: 'course-details',  tabData: {course_taken:course_taken}, tabTitle: $t('COURSE'), newTab: true})" class="es-button">
            {{ (course_taken.started_at) ? $t('CONTINUE_WITH_COURSE') : $t('START')}} <i class="fas fa-chevron-right"></i>
          </a>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
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
  methods: {
    isNotExpired (courseTaken) {
      return moment(courseTaken.end_date).isAfter(moment())
    },
    async loadCourses () {
      const scope = this
      let response
      try {
        response = await scope.axios.get('http://localhost:3000/courses/' + this.$store.getters.getUserID + '/course-list-dashboard')
      } finally {
        scope.courses_taken = response.data
        scope.page.is_ready = true
      }
    }
  },
  mounted () {
    let scope = this
    scope.loadCourses()

    scope.$root.$on('loadCourses', () => {
      scope.loadCourses()
    })
  }
}
</script>

<style scoped>
  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    background-color: #293742;
    color: #fff;
    border-radius: 3px;
  }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 100px; opacity: 0.8; }
</style>
