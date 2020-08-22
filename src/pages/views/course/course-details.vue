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
      <div class="es-course-webinars-tab">
        <div v-bind:class="{ 'active' : tab.active == 'lesson' }" @click="changeTab('lesson')" class="es-course-webinars-tab-item">{{$t('LESSON').toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'course_plan' }" @click="changeTab('course_plan')" class="es-course-webinars-tab-item">{{$t('COURSE_PLAN').toUpperCase()}}</div>
        <div v-bind:class="{ 'active' : tab.active == 'webinars' }" @click="changeTab('webinars')" class="es-course-webinars-tab-item">{{$t('WEBINARS').toUpperCase()}}</div>
      </div>
      <div style="position:relative; padding-bottom:40px;">
        <div v-if="tab.active === 'lesson'"  class="">
          <div class="es-page-content">
            <div class="es-row">
              <div class="es-col fadeIn animated" v-for="lesson in lessons" v-bind:key="lesson.uuid">
                <div class="es-card" v-bind:style="{ opacity: lesson.is_available ? '100%' : '50%' }">
                  <div class="es-card-content">
                    <div class="es-card-actions" v-if="lesson.is_available">
                      <button class="btn-circle" @click="CHANGE_COMPONENT({tabKey: 'lesson-details-' + lesson.uuid, tabComponent: 'lesson-details',  tabData: { lesson: lesson, course_taken: course_taken ,data: data}, tabTitle: $t('VIEW')+ ' - ' + lesson.title, newTab: true})"><i class="lar la-eye"></i></button>
                    </div>
                    <h3 class="title ellipsis-2">{{ DISPLAY_TITLE(lesson.title) }}</h3>
                    <i class="description ellipsis-3"><span v-html="lesson.content"></span></i>
                  </div>
                  <div class="es-card-footer">
                    <small style="float:right;">{{ lesson.is_available ? $t('AVAILABLE') : $t('AVAILABLE_AT') + ' : ' + lesson.availability_date}}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab.active === 'course_plan'"  class="es-course-webinars-tab-content scene-listing">
          <div class="row">
            <div class="col-md-4">
              <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">
                <div class="default-preview"><i class="fa fa-image"></i></div>
              </div>
            </div>
            <div class="col-4">
              <h4>{{ $t('TITLE')}}: {{course_taken.course.title }}</h4>
              <div>{{ $t('DATE_STARTED') }} - <i class="fa fa-calendar-check" aria-hidden="true"></i> {{ data.started_at  }}</div>
              <div>{{ $t('EXPIRES_ON') }} - <i class="fa fa-calendar-times" aria-hidden="true"></i> {{ data.expired_at  }}</div>
              <div><i class="fa fa-book"></i> {{ lessons.length }} {{ lessons.length > 1 ? $t('LESSONS') : $t('LESSON') }} </div>
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-md-12" v-html="course_taken.course.description"></div>
          </div>
        </div>
        <div v-if="tab.active === 'webinars'"  class="es-course-webinars-tab-content webinars">
          <div class="webinar-list">
            <div class="webinar-single" v-for="webinar in webinars" :key="webinar.id" @click.prevent="openExternalBrowser('https://attendee.gotowebinar.com/register/' + webinar.webinar_id)">
              <img v-bind:src="webinar.image_src">
              <div class="details">
                <strong>{{ webinar.title }}</strong>
                <p class="ellipsis-3" v-html="webinar.description"></p>
                <div>
                  {{ $t('PRESENTER') }}:
                  <span class="webinar-badge" v-for="presenter in webinar.webinar_presenters" :key="presenter.id">
                    {{ presenter.first_name }} {{ presenter.last_name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const { remote } = window.require('electron')

export default {
  name: 'course-details',
  props: ['properties'],
  data: function () {
    return {
      webinars: [],
      lessons: [],
      data: {
        started_at: '',
        expired_at: ''
      },
      page: {
        is_ready: false
      },
      tab: {
        active: 'course_plan'
      }
    }
  },
  methods: {
    openExternalBrowser (url) {
      remote.shell.openExternal(url)
    },
    numberFormat: function (number) {
      return number.toLocaleString()
    },
    changeTab: function (active) {
      var scope = this
      scope.tab.active = active
    },
    async loadLessons () {
      let scope = this
      let response = await scope.axios.get('http://localhost:3000/lessons/' + scope.course_taken.course.uuid)

      if (response) {
        scope.lessons = response.data

        scope.lessons.forEach(function (lesson, index) {
          let availabilityDate = moment(scope.data.started_at).add(lesson.delay, 'days').format('MMM D YYYY, h:mm:ss a').toString()
          if (moment().isAfter(availabilityDate)) {
            scope.lessons[index].is_available = true
          } else {
            scope.lessons[index].is_available = false
            scope.lessons[index].availability_date = availabilityDate
          }
        })
      }
    },
    async loadWebinars () {
      let scope = this
      let response = await scope.axios.get('http://localhost:3000/webinars/' + scope.course_taken.course.uuid)

      if (response) {
        scope.webinars = response.data
        console.log(scope.webinars)
      }
    }
  },
  computed: {
    course_taken: function () {
      return this.properties.course_taken
    }
  },
  beforeMount () {},
  async mounted () {
    let scope = this

    scope.data.started_at = moment(scope.course_taken.started_at).format('MMM D YYYY, h:mm:ss a').toString()
    scope.data.expired_at = moment(scope.course_taken.end_date).format('MMM D YYYY, h:mm:ss a').toString()

    // Load lessons
    await scope.loadLessons()

    // Load webinars
    await scope.loadWebinars()

    scope.page.is_ready = true
  }
}
</script>

<style scoped>
  .es-course-webinars-tab { display:flex; border-bottom:1px solid #ccc; padding:0px 30px; height:70px; background:#fff; }
  .es-course-webinars-tab .es-course-webinars-tab-item { height:30px; line-height:30px; margin-top:40px; margin-right:25px; cursor:pointer; position:relative; }
  .es-course-webinars-tab .es-course-webinars-tab-item:after { content:''; position:absolute; bottom:0px; left:0px; height:3px;  width:100%; background:transparent;}
  .es-course-webinars-tab .es-course-webinars-tab-item.active:after { background:#922c39;  }

  .es-course-webinars-tab-content { position:relative; padding:30px; background:#fff; height:calc(100vh - 360px); overflow-y:auto; display:block; }
  .es-course-webinars-tab-content.no-padding { padding:0px; }
  .es-course-webinars-tab-content.active { display:block; }

  .uploaded-file-preview { width:100%; cursor: pointer; }
  .uploaded-file-preview img { width:100%; }
  .uploaded-file-preview .default-preview { min-height: 150px; background-color: #293742; color: #fff; text-align: center; }
  .uploaded-file-preview .default-preview i { font-size: 105px; line-height: 100px; opacity: 0.8; }

  .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
  .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
  /*.es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }*/

  .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
  .es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
  .es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }

  .webinar-list { cursor:pointer; width:100%; max-width:1300px; padding:10px; margin:0px auto; display:flex; flex-wrap: wrap; justify-content: left; }
  .webinar-list .webinar-single { width:calc(33.33% - 10px); background:#fff; border:1px solid #ccc; margin:0 5px 10px; }
  .webinar-list .webinar-single img { width:100%; height:auto; height:200px; object-fit: cover; border-bottom:1px solid #ccc; }
  .webinar-list .webinar-single .details { padding:10px; }
  .webinar-list .webinar-single .webinar-badge { background:#ae2937; color:#fff; padding:2px 5px; border-radius:3px; margin-right:5px; font-size:12px; display:inline-block; }
</style>
