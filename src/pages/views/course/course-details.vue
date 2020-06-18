<template>
  <div>
    <div v-if="page.is_ready" class="page-chapter-details">
      <div class="es-page-head">
        <div class="inner">
          <div class="details">
            <div>
              <h4><strong>{{ course_taken.course.title }}</strong></h4>
            </div>
          </div>
        </div>
      </div>
      <div class="es-chapter-details-tab">
        <div v-bind:class="{ 'active' : tab.active == 'lesson' }" @click="changeTab('lesson')" class="es-chapter-details-tab-item">{{$tc('LESSON').toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'course_plan' }" @click="changeTab('course_plan')" class="es-chapter-details-tab-item">{{$tc('COURSE PLAN', 2).toUpperCase()}}</div>
      </div>
      <div style="position:relative; padding-bottom:40px;">
        <div v-if="tab.active === 'lesson'"  class="es-chapter-details-tab-content">
          Lesson here
        </div>
        <div v-if="tab.active === 'course_plan'"  class="es-chapter-details-tab-content scene-listing">
          <div class="row">
            <div class="col-md-4">
              <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">
                <div class="default-preview"><i class="fa fa-image"></i></div>
              </div>
            </div>
            <div class="col-4">
              <h4>{{ $t('TITLE')}}: {{course_taken.course.title }}</h4>
              <div>{{ $tc('DATE_STARTED')}} - {{ started_at  }}</div>
              <div>{{ $tc('EXPIRES_ON')}} - {{ expired_at  }}</div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-md-12" v-html="course_taken.course.description"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'course-details',
  props: ['properties'],
  data: function () {
    return {
      course_taken: [],
      started_at: '',
      expired_at: '',
      page: {
        is_ready: false
      },
      tab: {
        active: 'course_plan'
      }
    }
  },
  methods: {
    numberFormat: function (number) {
      return number.toLocaleString()
    },
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    }
  },
  computed: {},
  beforeMount () {},
  mounted () {
    const scope = this
    scope.course_taken = scope.properties.course_taken
    scope.started_at = moment(scope.course_taken.started_at).format('MMM D YYYY, h:mm:ss a').toString()
    scope.expired_at = moment(scope.course_taken.end_date).format('MMM D YYYY').toString() + moment(scope.course_taken.started_at).format('h:mm:ss a').toString()
    scope.page.is_ready = true
    console.log(scope.course_taken)
  }
}
</script>

<style scoped>
  .es-chapter-details-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
  .es-chapter-details-tab .es-chapter-details-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
  .es-chapter-details-tab .es-chapter-details-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
  .es-chapter-details-tab .es-chapter-details-tab-item.active:after { background:#922c39;  }

  .es-chapter-details-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 360px); overflow-y:auto; display:block; }
  .es-chapter-details-tab-content.no-padding { padding:0px; }
  .es-chapter-details-tab-content.active { display:block; }

  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 150px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 100px; opacity: 0.8; }
</style>
