<template>
<div class="es-page-main page-location-form">
    <div class="es-page-head">
        <div class="row-head">
            <div>
              <h4 class="main-title special">{{ page_title }}</h4>
            </div>
            <div>
              <div class="btn-tabs">
                <a class="btn-tab open-free-webinar" href="javascript:void(0);" @click="open(freeWebinars, 'free')"><i class="las la-comment"></i> <span>{{ $t('FREE_WEBINARS') }}</span></a>
                <a class="btn-tab open-paid-webinar" href="javascript:void(0);" @click="open(webinars, 'paid')"><i class="las la-comment-dollar"></i> <span>{{ $t('PAID_WEBINARS') }}</span></a>
              </div>
            </div>
        </div>
    </div>
    <div class="es-page-content">
        <div class="webinar-list">
            <div class="webinar-single" @click.prevent="openExternalBrowser('https://attendee.gotowebinar.com/register/' + (webinar.gtwebinar_id ? webinar.gtwebinar_id : webinar.link))"  v-for="webinar in selected" :key="webinar.id">
                <img :src="imgSrc(webinar.image)">
                <div class="details">
                    <strong>{{ webinar.title }}</strong>
                    <p class="ellipsis-3" v-html="webinar.description"></p>
                    <div>
                        {{ $t('PRESENTER') }}:
                        <span class="webinar-badge" v-for="presenter in webinar.presenters" :key="presenter.id">
                            {{ presenter.first_name }} {{ presenter.last_name }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const { remote } = window.require('electron')
export default {
  name: 'webinar-listing',
  props: ['properties'],
  data: function () {
    return {
      freeWebinars: [],
      webinars: [],
      selected: null,
      api_token: '',
      page_title: ''
    }
  },
  components: {
  },
  computed: {

  },
  methods: {
    imgSrc: function (image) {
      return window.APP.API.UPLOAD_URL + '/' + image.replace('/uploads', '')
    },
    open: function (webinar, type = 'free') {
      var scope = this
      scope.selected = webinar

      window.$('.btn-tabs .btn-tab').removeClass('active')

      let currButtonText = window.$('.open-' + type + '-webinar span')
      scope.page_title = currButtonText.html()

      let currButton = window.$('.btn-tab.open-' + type + '-webinar')
      currButton.addClass('active')
    },
    close: function () {
      var scope = this
      scope.selected = null
    },
    openExternalBrowser (url) {
      remote.shell.openExternal(url)
    },
    loadFreeWebinars: function () {
      var scope = this
      scope.axios.get(window.APP.API.URL + '/free-webinars',
        {
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + scope.api_token
          }
        })
        .then(function (response) {
          scope.freeWebinars = response.data.rows
          scope.open(scope.freeWebinars, 'free')
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
        // always executed
        })
    },
    loadWebinars: function () {
      var scope = this
      scope.axios.get(window.APP.API.URL + '/webinars',
        {
          'headers': {
            'X-Requested-With': 'XMLHttpRequest',
            'Authorization': 'Bearer ' + scope.api_token
          }
        })
        .then(function (response) {
          scope.webinars = response.data.rows
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(function () {
          // always executed
        })
    }
  },
  mounted () {
    var scope = this
    scope.api_token = scope.$store.getters.getUserToken
    scope.loadFreeWebinars()
    scope.loadWebinars()
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .es-card { color:#293742; background:#fae199; border:1px solid #e0e5ee; border-radius:3px; }
    .es-card .es-card-content { position:relative; padding:20px; min-height:150px; }
    .es-card .es-card-content .title { font-size:18px; font-weight:900; margin:0px; }
    .es-card .es-card-content .description { display:inline-block; padding-top:15px; color:#4b6273; }

    .es-card .es-card-content .es-card-actions { position:absolute; top:20px; right:20px; text-align:right; }

    .es-card .es-card-footer { position:relative; background:#f5f8fa; height:40px; line-height:40px; padding:0px 0px; border-top:1px solid #e0e5ee; }
    .es-card .es-card-footer button { font-weight:600; background:transparent; border:none; height:40px; line-height:32px; text-align:center; font-size:14px; padding:0px 8px; }
    .es-card .es-card-footer button:hover { background:#e0e5ee; }
    .es-card .es-card-footer button i { font-size:18px; }
    .es-card .es-card-footer button.btn-delete { font-weight:600; color:#8f2c39; border-left:1px solid #e0e5ee; position:absolute; top:0px; right:0px; }

    .webinar-list { cursor:pointer; width:100%; max-width:1300px; padding:10px; margin:0px auto; display:flex; flex-wrap: wrap; justify-content: left; }
    .webinar-list .webinar-single { width:calc(33.33% - 10px); background:#fff; border:1px solid #ccc; margin:0 5px 10px; }
    .webinar-list .webinar-single img { width:100%; height:auto; height:200px; object-fit: cover; border-bottom:1px solid #ccc; }
    .webinar-list .webinar-single .details { padding:10px; }
    .webinar-list .webinar-single .webinar-badge { background:#ae2937; color:#fff; padding:2px 5px; border-radius:3px; margin-right:5px; font-size:12px; display:inline-block; }
</style>
