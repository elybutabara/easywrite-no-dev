<template>
  <div>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold">Message Center</h6>
      </div>
      <div style="padding: 0 20px;">
        <a href="#" v-on:click.prevent="type = 'All'">All ({{itemsCounts['All']}})</a> |
        <a href="#" v-on:click.prevent="type = 'Message'">Messages ({{itemsCounts['Message']}})</a> |
        <a href="#" v-on:click.prevent="type = 'Notification'">Notifications ({{itemsCounts['Notification']}})</a>
        <div style="float: right;">
          <button v-on:click="openMessage(null, $event)" class="btn btn-default" style="height: 24px; line-height: 24px; text-transform: none;">New Message</button>
        </div>
      </div>
      <div class="card-body" style="padding: 0;">
        <div style="overflow-y: auto; max-height: calc(100vh - 266px);">
          <div v-if="rows.length < 1" style="text-align: center; padding: 30px 0; opacity: 0.5;">
            Empty
          </div>
          <div v-for="(row, i) in rows" v-bind:key="'mcp-key-'+i" style="padding: 10px; border-top: 1px solid #e3e6f0; clear: both;">
            <div v-bind:style="{'background-image': 'url(@/assets/img/blank-profile-picture.png)'}" style="width: 50px; height: 50px; border-radius: 50%; background-color: #c0c0c0; float: left;"></div>
            <div style="float: left; margin-left: 10px;">
              <div style="font-size: 12px; font-weight: bold; line-height: 100%;">{{row.data.user_name || 'Null'}}</div>
              <div v-if="row.type=='Message'" style="cursor: pointer;">
                <div v-html="row.data.message" v-on:click="openMessage(3)"></div>
              </div>
              <div v-if="row.type=='ChapterComment'">
                Commented on chapter <a v-bind:href="'#'" @click.prevent="CHANGE_COMPONENT({tabKey: 'chapter-details-' + row.data.chapter_id, tabComponent: 'chapter-details',  tabData: { }, tabTitle: $t('VIEW')+ ' - ' + row.data.chapter_title})">{{row.data.chapter_title}}</a>
              </div>
              <div style="font-size: 80%; line-height: 100%; opacity: 0.5;">{{displayTime(row.created_at)}}</div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'MessageCenterPopup',
  props: ['params'],
  data: function () {
    var scope = this
    var data = {
      items: [
        /*
        {type: 'Message', data: {name: 'John Doe', message: 'Test Message...'}, created_at: '2020-06-22T13:00+08'},
        {type: 'Comment', data: {name: 'John Doe', message: 'Commented on scene <a href="#">Test Scene</a>'}, created_at: '2020-06-22T14:00+08'},
        {type: 'Message', data: {name: 'John Doe', message: 'Test Message...'}, created_at: '2020-06-20T00:00+00'},
        {type: 'Comment', data: {name: 'John Doe', message: 'Commented on scene <a href="#">Test Scene</a>'}, created_at: '2020-06-22T14:00+08'},
        {type: 'Message', data: {name: 'John Doe', message: 'Test Message...'}, created_at: '2020-06-22T13:00+08'},
        {type: 'Comment', data: {name: 'John Doe', message: 'Commented on scene <a href="#">Test Scene</a>'}, created_at: '2020-06-22T14:00+08'},
        {type: 'Message', data: {name: 'John Doe', message: 'Test Message...'}, created_at: '2020-06-20T00:00+00'},
        {type: 'Comment', data: {name: 'John Doe', message: 'Commented on scene <a href="#">Test Scene</a>'}, created_at: '2020-06-22T14:00+08'},
        {type: 'Message', data: {name: 'John Doe', message: 'Test Message...'}, created_at: '2020-06-22T13:00+08'},
        {type: 'Comment', data: {name: 'John Doe', message: 'Commented on scene <a href="#">Test Scene</a>'}, created_at: '2020-06-22T14:00+08'},
        {type: 'Message', data: {name: 'John Doe', message: 'Test Message...'}, created_at: '2020-06-20T00:00+00'},
        {type: 'Comment', data: {name: 'John Doe', message: 'Commented on scene <a href="#">Test Scene</a>'}, created_at: '2020-06-22T14:00+08'}
        */
      ],
      type: 'All',
      itemsCounts: {
        'All': 0,
        'Message': 0,
        'Notification': 0
      },
      params_: {}
    }
    if (scope.params) {
      Vue.nextTick(() => {

      })
    }
    return data
  },
  computed: {
    rows: function () {
      var scope = this
      var rows = []
      if (scope.type === 'All') {
        rows = scope.items
      } else {
        for (var i = 0; i < scope.items.length; i++) {
          var item = scope.items[i]

          if (scope.type === 'Notification') {
            if (item.type !== 'Message') {
              rows.push(item)
            }
          } else if (item.type === scope.type) {
            rows.push(item)
          }
        }
      }
      return rows
    }
  },
  methods: {
    openMessage: function (v) {
      window.AppMessaging.open(v)
      window.AppMain.showMessageCenter = false
    },
    updateItemsCounts: function () {
      var scope = this
      for (var x in scope.itemsCounts) {
        scope.itemsCounts[x] = 0
      }
      for (var i = 0; i < scope.items.length; i++) {
        var item = scope.items[i]
        scope.itemsCounts[item.type]++
        scope.itemsCounts['All']++
        if (item.type !== 'Message') {
          scope.itemsCounts['Notification']++
        }
      }
    },
    fetch: function () {
      var scope = this
      scope.axios
        .get('http://localhost:3000/notifications/')
        .then(async function (response) {
          if (response.data) {
            try {
              //

              for (var i = 0; i < response.data.rows.length; i++) {
                try {
                  if (typeof response.data.rows[i].data === 'string') {
                    response.data.rows[i].data = JSON.parse(response.data.rows[i].data)
                  }
                } catch (ex2) {
                  response.data.rows[i].data = {}
                }
                if (!response.data.rows[i].data) {
                  response.data.rows[i].data = {}
                }
                console.log(JSON.stringify(response.data.rows[i]))
              }

              scope.items = response.data.rows
              scope.items.push({
                type: 'Message',
                name: 'testmessage',
                data: {
                  user_name: 'John Doe',
                  message: 'Sent you a message. "Dummy reply test..."'
                },
                user_id: 1,
                created_at: new Date()
              })

              Vue.nextTick(function () {
                scope.updateItemsCounts()
              })
            } catch (ex) {
              console.log('Failed to load data')
            } finally {
              //
            }
          }
        })
    },
    displayTime: function (t) {
      var txt = moment(t).fromNow()
      txt = txt.replace('a few seconds ago', 'just now')
      return txt
    }
  },
  mounted: function () {
    var scope = this
    window.AppMessageCenterPopup = scope
    scope.updateItemsCounts()
    scope.fetch()
  },
  beforeDestroy: function () {

  }
}
</script>

<style scoped>

</style>
