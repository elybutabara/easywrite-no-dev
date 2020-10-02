<template>
  <div>
    <div v-if="page.is_ready" class="es-page-main page-course-details">
      <div class="es-page-head">
        <div class="inner">
          <div class="details">
            <div>
              <h4><strong>{{ $t('COURSES') }}</strong></h4>
            </div>
          </div>
        </div>
      </div>
<!--      <div class="es-chapter-details-tab">-->
<!--        <div v-bind:class="{ 'active' : tab.active == 'content' }" @click="changeTab('content')" class="es-chapter-details-tab-item">{{$t('CONTENT').toUpperCase()}}</div>-->
<!--        <div v-bind:class="{ 'active' : tab.active == 'document' }" @click="changeTab('document')" class="es-chapter-details-tab-item">{{$tc('DOCUMENT', 2).toUpperCase()}}</div>-->
<!--      </div>-->
      <div style="position:relative; padding-bottom:40px;">
        <div v-if="tab.active === 'course-list'"  class="">
          <div class="es-page-content">
<!--            <div class="text-right">-->
<!--              <b-badge href="#" variant="dark" class="p-2">{{ $tc('DATE_STARTED') }}: <i class="fa fa-calendar-check" aria-hidden="true"></i> {{ data.started_at }}</b-badge>-->
<!--              <b-badge href="#" variant="dark" class="p-2">{{ $tc('EXPIRES_ON') }}: <i class="fa fa-calendar-times" aria-hidden="true"></i> {{ data.expired_at }}</b-badge>-->
<!--            </div>-->
            <div class="es-row">
              <div class="es-col fadeIn animated" v-for="course_taken in courses_taken" v-bind:key="course_taken.uuid">
                <div class="es-card">
                  <div class="es-card-content">
                    <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">
                      <div class="default-preview"><i class="fa fa-image"></i></div>
                    </div>
                    <div class="mt-3">
                      <h3 class="title ellipsis-2">{{ DISPLAY_TITLE(course_taken.course.title) }}</h3>
                      <i class="description ellipsis-3"><span v-html="REMOVE_HTML(course_taken.course.short_description)"></span></i>
                    </div>
                  </div>
                  <div class="es-card-footer text-center">
                    <b-button class="es-button-white mb-1" @click="CHANGE_COMPONENT({tabKey: 'course-details-' + course_taken.uuid , tabComponent: 'course-details',  tabData: {course_taken:course_taken}, tabTitle: $t('COURSE'), newTab: true})">{{ (course_taken.started_at) ? $tc('CONTINUE_WITH_COURSE') : $tc('START')}}</b-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab.active === 'content'"  class="es-chapter-details-tab-content scene-listing">
<!--          <div class="row">-->
<!--            <div class="col-md-4">-->
<!--              <div class="uploaded-file-preview" style="height: 150px;background: #d2d2d2">-->
<!--                <div class="default-preview"><i class="fa fa-image"></i></div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="col-4">-->
<!--              <h4>{{ $t('TITLE')}}: {{course_taken.course.title }}</h4>-->
<!--              <div>{{ $tc('DATE_STARTED')}} - {{ data.started_at  }}</div>-->
<!--              <div>{{ $tc('EXPIRES_ON')}} - {{ data.expired_at  }}</div>-->
<!--            </div>-->
<!--          </div>-->

          <div class="row mt-2">
<!--            <div class="col-md-12" v-html="lesson.content"></div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course-listing',
  props: ['properties'],
  data: function () {
    return {
      courses_taken: [],
      lessons: [],
      data: {
        started_at: '',
        expired_at: ''
      },
      page: {
        is_ready: false
      },
      tab: {
        active: 'course-list'
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
  async mounted () {
    const scope = this
    let response
    try {
      response = await scope.axios.get('http://localhost:3000/courses/' + this.$store.getters.getUserID + '/course-listing')
    } finally {
      scope.courses_taken = response.data
      scope.page.is_ready = true
    }
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

  .es-card { color:#293742; background:#fff; border:1px solid #e0e5ee; border-radius:3px; }
  .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
  /*.es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; padding-right:110px; }*/

  .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }
  .es-card .es-card-content .es-card-actions .btn-circle { background:transparent; border:1px solid #e0e5ee; border-radius:50%; width:30px; height:30px; line-height:22px; text-align:center; font-size:15px; }
  .es-card .es-card-footer { background:#f5f8fa; height:40px; line-height:40px; padding:0px 20px; border-top:1px solid #e0e5ee; }
</style>
